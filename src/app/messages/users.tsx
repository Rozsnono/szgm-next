"use client";

import UserContext from "@/context/user.context";
import { Avatar } from "primereact/avatar";
import { useContext, useState } from "react";
import { useQuery } from "react-query";
import { Chip } from 'primereact/chip';


export default function Users({ except }: { except: any[] }) {

    const { user } = useContext<any>(UserContext);

    async function getUsers() {
        const res = await fetch("https://szgm-next-server-production.up.railway.app/api/users");
        const data = await res.json();
        return data.filter((user: any) => { return user.user == search });
    }
    const users = useQuery<any[]>('users', getUsers);

    async function newConversation() {
        if (groupChat.length > 0) {
            const res = await fetch("https://szgm-next-server-production.up.railway.app/api/message", { method: 'POST', body: JSON.stringify({ participants: [...groupChat.map((value) => { return { _id: value._id, name: value.user } }), { _id: user._id, name: user.user }], lastMessage: [] }), headers: { "Content-Type": "application/json" } })
            const data = await res.json();
            window.location.href = "/messages/" + data._id;
        }
    }

    const [search, setSearch] = useState('');
    const [groupChat, setGroupChat] = useState<any[]>([]);

    function template(item: any) {
        return (
            <div className="bg-white flex items-center border rounded-full gap-2 px-2 my-1">
                <span className="font-medium">{item.label}</span>
                <button onClick={() => { setGroupChat(groupChat.filter((user) => { return user.user !== item.label })) }} className="rounded-full text-sm"><i className="pi pi-times" style={{ fontSize: "0.6rem" }}></i></button>
            </div>
        )
    }



    return (
        <main className="flex flex-col gap-2 mt-2 overflow-y-auto h-[53rem]">
            <div className="flex">
                <input type="text" className="w-full rounded-l-full mx-auto px-3" value={search} onChange={(e) => setSearch(e.target.value)} />
                <button onClick={() => { users.refetch() }} className="rounded-r-full bg-blue-600 hover:bg-blue-800 duration-100 text-white px-2 pe-3"><i className="pi pi-search"></i></button>
            </div>
            <div className="flex">
                <div className="w-full rounded-l-full mx-auto px-1 bg-white">
                    {
                        groupChat.map((user: any, index: number) => {
                            return (
                                <Chip className="bg-white" key={index} label={user.user} removable template={template} />
                            )
                        })
                    }
                </div>
                <button onClick={newConversation} className="rounded-r-full bg-blue-600 hover:bg-blue-800 duration-100 text-white px-2 pe-3"><i className="pi pi-users"></i></button>
            </div>
            {
                !users.isLoading &&
                users.data?.map((user: any, index: number) => {
                    return (
                        <div onClick={() => { setGroupChat([...groupChat, user]) }} key={index} className="w-full p-4 border-2 rounded-full border-blue-700 group hover:bg-blue-700 hover:text-white cursor-pointer duration-100">
                            <Avatar label={
                                (user.user).slice(0, 1).toUpperCase()
                            } className="mr-2 bg-blue-700 text-white group-hover:bg-white group-hover:text-blue-700 duration-100" size={"normal"} shape="circle" />
                            {
                                user.user
                            }
                        </div>
                    )
                })

            }
        </main>
    )
}