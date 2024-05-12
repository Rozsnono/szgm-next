import Talk from 'talkjs';
import { useEffect, useState, useRef, useContext } from 'react';
import UserContext from '@/context/user.context';
import { useQuery } from 'react-query';
import { Tooltip } from 'primereact/tooltip';
import { Avatar } from 'primereact/avatar';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { AvatarGroup } from 'primereact/avatargroup';

const ws = new WebSocket('wss://websocket-server.up.railway.app');


export default function Message({ _id }: { _id: string }) {

  const { user } = useContext<any>(UserContext);



  async function getMessage() {
    const res = await fetch("https://troubled-underwear-frog.cyclic.app/api/message/" + _id);
    const data = await res.json();
    return data;
  }
  const messages = useQuery<any>('messages', getMessage);

  async function createMessage() {
    if (message === '') return;
    const res = await fetch("https://troubled-underwear-frog.cyclic.app/api/message/" + _id, { method: 'PUT', body: JSON.stringify({ by: user.user, message: message }), headers: { "Content-Type": "application/json" } });
    const data = await res.json();
    setMessage('');

  }

  const isMobile = useRef<boolean>(false);

  if (typeof navigator !== "undefined") {

    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      isMobile.current = true;
    }

  }


  const [message, setMessage] = useState('');
  const commander = useRef<HTMLDivElement | any>()


  useEffect(() => {
    ws.onopen = () => {
      console.log('connected');
    };
    ws.onerror = (error) => {
      console.log('WebSocket error:', error);
    };

    ws.onmessage = (event: MessageEvent) => {
      messages.refetch();
    };

    commander.current?.scrollIntoView({ behavior: 'smooth' });

  });

  function getShape(index: number, dir: string, message: any) {
    const odir = (dir === 'l' ? 'r' : 'l');
    let first = false;
    let className = 'border p-2 w-fit lg:max-w-[25rem] max-w-[50vw] px-4 relative ' + (user.user === message.by ? "border-gray-400" : "bg-red-500") + " ";
    if (index === 0 && messages.data?.messages.length === 1) return (<div className={className + "rounded-full"}>{message.message}</div>)
    if (index > 0 && index < messages.data.messages.length - 1) {
      if (messages.data?.messages[index - 1].by === messages.data?.messages[index].by && messages.data?.messages[index + 1].by === messages.data?.messages[index].by) {
        className = className + ' rounded-' + dir + '-full rounded-' + odir + '-sm ';
        first = false;
      } else if (messages.data?.messages[index - 1].by !== messages.data?.messages[index].by && messages.data?.messages[index + 1].by === messages.data?.messages[index].by) {
        className = className + ' rounded-' + dir + '-full rounded-t' + odir + '-full rounded-b' + odir + '-sm ';
        first = false;
      } else if (messages.data?.messages[index - 1].by === messages.data?.messages[index].by && messages.data?.messages[index + 1].by !== messages.data?.messages[index].by) {
        className = className + ' rounded-' + dir + '-full rounded-b' + odir + '-full rounded-t' + odir + '-sm ';
        first = true;
      } else {
        className = className + ' rounded-full ';
        first = true;
      }

    } else {
      if (index === 0) {
        if (messages.data?.messages[index + 1].by === messages.data?.messages[index].by) {
          className = className + ' rounded-' + dir + '-full rounded-t' + odir + '-full rounded-b' + odir + '-sm ';
          first = false;
        } else {
          className = className + ' rounded-full ';
          first = true;

        }
      } else {
        if (messages.data?.messages[index - 1].by === messages.data?.messages[index].by) {
          className = className + ' rounded-' + dir + '-full rounded-b' + odir + '-full rounded-t' + odir + '-sm ';
          first = true;

        } else {
          className = className + ' rounded-full ';
          first = true;
        }
      }
    }



    return (
      <div className={'message group flex items-center'}>

        {
          user.user === message.by &&
          <div className='group-hover:flex hidden text-[0.7rem] me-2 items-center gap-2 select-none'>
            {
              new Date().getDate() !== new Date(message.date).getDate() ?
                new Date(message.date).toLocaleString("hu-HU", {
                  minute: "numeric",
                  hour: "numeric",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
                :
                new Date(message.date).toLocaleTimeString("hu-HU", { hour: "numeric", minute: "numeric" })}
            <i className='pi pi-times cursor-pointer' style={{ fontSize: "0.7rem" }}></i>
            <i onClick={() => { setShowEmoji(message) }} className='pi pi-user cursor-pointer' style={{ fontSize: "0.7rem" }}></i>

          </div>
        }
        {
          dir === "r" &&
          <Avatar key={index} label={message.by.slice(0, 1).toUpperCase()} className={"mr-2 bg-blue-700 bg-red-700 text-white " + (!first && " opacity-0")} size={"normal"} shape="circle" />
        }

        <div className={className + (message.reaction.length > 0 && " mb-4")}>

          {message.message}
          <div className={'absolute bottom--2 flex ' + (dir == "l" ? "right-0" : "left-0")}>{message.reaction && message.reaction.map((item: any, index: number) => { return (<div key={index}>{item}</div>) })}</div>
        </div>


        {
          user.user !== message.by &&
          <div className='group-hover:flex hidden text-[0.7rem] ms-2 items-center gap-2 relative select-none'>

            <i onClick={() => { setShowEmoji(message) }} className='pi pi-user cursor-pointer' style={{ fontSize: "0.7rem" }}></i>
            {
              new Date().getDate() !== new Date(message.date).getDate() ?
                new Date(message.date).toLocaleString("hu-HU", {
                  minute: "numeric",
                  hour: "numeric",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
                :
                new Date(message.date).toLocaleTimeString("hu-HU", { hour: "numeric", minute: "numeric" })}
          </div>
        }
      </div>


    )
  }

  function handler(e: any) {
    if (e.key === "Enter") { createMessage() }
  }

  async function reactToChat(reaction: string, selected: any) {
    const res = await fetch("https://troubled-underwear-frog.cyclic.app/api/message/reaction/"+_id, { method: 'PUT', body: JSON.stringify({ _id: selected._id, reaction: reaction }), headers: { "Content-Type": "application/json" } });
    setShowEmoji(null);
    const data = await res.json();
  }

  const [showEmoji, setShowEmoji] = useState<any>();
  const [showEmoji2, setShowEmoji2] = useState<any>();

  function onEmojiClick(emojiData: EmojiClickData, event: MouseEvent) {
    setMessage(message + emojiData.emoji);
  }

  return (
    <div className='h-full flex justify-center'>
      <div className="flex flex-col border rounded-xl bg-gray-200 justify-between overflow-hidden relative lg:w-[35rem] w-[90vw] mx-auto">
        <div className='w-full border-b flex justify-between items-center text-xl p-2 font-bold bg-red-500 absolute top-0'>
          {isMobile && <div className='flex items-center gap-2'>
            <i onClick={() => { window.location.href = "/messages" }} className='pi pi-arrow-left cursor-pointer'></i>
          </div>}
          {
            !messages.isLoading &&
            <div className="flex items-center">
              <AvatarGroup>
                {
                  messages.data?.participants.filter((p: any) => { return p._id !== user._id }).map((p: any, index: number) => {
                    return (
                      <Avatar key={index} label={p.name.slice(0, 1).toUpperCase()} className="mr-2 bg-blue-700 bg-red-700 text-white group-hover:bg-gray-600 group-hover:text-red-700 duration-100" size={"normal"} shape="circle" />
                    )
                  })
                }
              </AvatarGroup>
              {
                messages.data?.participants.length <= 2 &&
                (messages.data?.participants[0]._id === user._id ?
                  messages.data?.participants[1].name :
                  messages.data?.participants[0].name)
              }
            </div>

          }
          <i className='pi pi-ellipsis-h'></i>
        </div>
        <div className='h-full'>
          <div className='p-2 h-full py-[4rem]'>

            <div style={{ width: '100%', height: '100%' }} className='overflow-y-auto overflow-x-hidden flex flex-col gap-1'>
              {
                !messages.isLoading &&
                messages.data?.messages.map((message: any, index: number) => {
                  return (
                    <div key={index} className={'w-full flex ' + (user.user === message.by ? "justify-end" : "")}>
                      {getShape(index, user.user === message.by ? 'l' : 'r', message)}
                      <Tooltip target=".message" />
                    </div>
                  )
                })
              }
              <div ref={commander}></div>
            </div>
          </div>

          {showEmoji && <div className='absolute bottom-16'> <i onClick={() => { setShowEmoji(null) }} className='pi pi-times absolute top-2 right-2 z-10'></i> <EmojiPicker onEmojiClick={(emojiData: EmojiClickData, event: any) => { reactToChat(emojiData.emoji, showEmoji) }} /></div>}
          {showEmoji2 && <div className='absolute bottom-16'><i onClick={() => { setShowEmoji2(false) }} className='pi pi-times absolute top-2 right-2 z-10'></i><EmojiPicker onEmojiClick={onEmojiClick} /></div>}

          <div className='flex p-2 gap-3 absolute bottom-0 lg:w-[35rem] w-[90vw]'>
            <div className='flex w-full items-center'>
              <input type="text" className='rounded-full lg:rounded-r-none px-2 py-1 w-full' value={message} onChange={(e) => { setMessage(e.target.value); }} onKeyDown={handler} />
              <div onClick={() => { setShowEmoji2(!showEmoji2) }} className='rounded-r-full bg-gray-600 py-1 px-3 lg:block hidden cursor-pointer '><i className='pi pi-user'></i></div>
            </div>
            <button onClick={createMessage} className='flex items-center justify-center p-3 rounded-full bg-red-500 text-white'><i className='pi pi-send'></i></button>
          </div>
        </div>
      </div>

    </div>
  );
}


