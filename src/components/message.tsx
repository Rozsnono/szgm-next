import Talk from 'talkjs';
import { useEffect, useState, useRef, useContext } from 'react';
import UserContext from '@/context/user.context';
import { useQuery } from 'react-query';

const ws = new WebSocket('ws://teal-frail-ostrich.cyclic.app:8000');


export default function Message() {

  const { user } = useContext<any>(UserContext);

  async function getUsers() {
    const res = await fetch("https://teal-frail-ostrich.cyclic.app/api/users");
    const data = await res.json();
    return data;
  }
  const users = useQuery<any[]>('users', getUsers);

  async function createMessage() {
    const res = await fetch("https://teal-frail-ostrich.cyclic.app/api/message/655889877599d49c8afbba37", { method: 'PUT', body: JSON.stringify({ participants: [{ id: user._id, name: user.user }], messages: [{ by: user._id, message: 'Hello' }] }), headers: { "Content-Type": "application/json" } });
    const data = await res.json();
  }

  useEffect(() => {
    ws.onmessage = (event: MessageEvent) => {
      const updatedData = JSON.parse(event.data);
      console.log(updatedData);
      // Update state with updatedData
    };
  }, []);

  return (
    <div className='h-full flex'>
      <button onClick={createMessage}>asd</button>
    </div>
  );
}

