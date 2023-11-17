import Talk from 'talkjs';
import { useEffect, useState, useRef, useContext } from 'react';
import UserContext from '@/context/user.context';
import { useQuery } from 'react-query';


export default function Message() {
    const [talkLoaded, markTalkLoaded] = useState(false);
    Talk.ready.then(() => markTalkLoaded(true));

    const { user } = useContext<any>(UserContext);

    async function getUsers() {
        const res = await fetch("https://teal-frail-ostrich.cyclic.app/api/users");
        const data = await res.json();
        return data;
    }
    const users = useQuery<any[]>('users', getUsers);



    const chatboxEl = useRef<any>();

    const isChatBoxRef = useRef(false);
    const currentUser = useRef<Talk.User>({} as Talk.User);
    const session = useRef<Talk.Session>({} as Talk.Session);

    function createConversation(user: any) {

        const otherUser = new Talk.User({
            id: user._id,
            name: user.user,
            role: 'default',
        });


        const conversation = session.current.getOrCreateConversation(
            Talk.oneOnOneId(currentUser.current, otherUser)
        );
        conversation.setParticipant(currentUser.current);
        conversation.setParticipant(otherUser);

        const inbox = session.current.createInbox({ selected: conversation });


        inbox.mount(chatboxEl.current);
    }



    useEffect(() => {
        if (talkLoaded) {
            currentUser.current = new Talk.User({
                id: user._id,
                name: user.user,
                role: 'default',
            });


            session.current = new Talk.Session({
                appId: 'tbA1VPOP',
                me: currentUser.current,
            });

            const chatbox = session.current.createInbox();
            chatbox.mount(chatboxEl.current);

            return () => session.current.destroy();
        }
    }, [talkLoaded]);

    return (
        <div className='h-full flex'>
            {
                user.role < 3 &&
                <div className='lg:flex hidden border border-gray-300 rounded-xl overflow-hidden flex-col gap-3'>
                    <div className='header bg-gray-200 px-6 py-6 text-center text-sm'>Emberek</div>
                    {
                        !users.isLoading && users.data?.map((user, index) => {
                            return (
                                <div key={index} onClick={()=>{createConversation(user)}} className='border rounded-full px-4 py-2 text-sm text-center mx-2 cursor-pointer'>{user.user}</div>
                            )
                        })
                    }
                </div>

            }
            <div className={'h-full w-full'} ref={chatboxEl} />
        </div>
    );
}

