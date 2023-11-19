"use client";

import Message from "@/components/message";
import UserContext from "@/context/user.context";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar } from "primereact/avatar";
import { useContext } from "react";
import { useQuery } from "react-query";
import Users from "./users";
import { AvatarGroup } from 'primereact/avatargroup';

export default function Messages() {

    const { user } = useContext<any>(UserContext);

    async function getMessages() {
        const res = await fetch("https://szgm-next-server-production.up.railway.app/api/messages?user=" + user._id);
        const data = await res.json();
        return data;
    }
    const allMessages = useQuery<any>('messagess', getMessages);
    const path = usePathname();


    return (
        <div className="lg:p-16 p-4 lg:gap-16 gap-4 pt-32 text-lg flex w-screen h-screen lg:justify-start justify-center">
            <div className="flex flex-col items-center border rounded-xl gap-2 bg-gray-200 overflow-hidden relative lg:w-[35rem] w-[90vw]">
                <div className="text-4xl font-bold bg-blue-500 w-full p-4 text-center">Messages</div>
                {allMessages.isLoading && <div className="text-2xl">Loading...</div>}
                <div className="flex flex-col px-3 w-full gap-2">

                    {
                        !allMessages.isLoading &&
                        allMessages.data?.map((message: any, index: number) => {
                            return (
                                <Link href={"/messages/" + message._id} key={index} className="w-full p-4 border flex justify-between rounded-full border-gray-300 group hover:bg-blue-600 hover:text-white cursor-pointer duration-100">
                                    <div className="flex items-center">
                                        <AvatarGroup>

                                            {
                                                message.participants.filter((p: any) => { return p._id !== user._id }).map((p: any, index: number) => {
                                                    return (
                                                        <Avatar key={index} label={p.name.slice(0, 1).toUpperCase()} className="mr-2 bg-blue-700 text-white group-hover:bg-white group-hover:text-blue-700 duration-100" size={"normal"} shape="circle" />
                                                    )
                                                })
                                            }
                                        </AvatarGroup>
                                        {
                                            message.participants.length <= 2 &&
                                            (message.participants[0]._id === user._id ?
                                                message.participants[1].name :
                                                message.participants[0].name)
                                        }
                                    </div>
                                    <div className="flex items-center">
                                        <i className="pi pi-envelope me-2"></i>
                                        <i>{
                                            message.participants.length <= 2 &&
                                            message.lastMessage.message
                                        }</i>
                                        <div>
                                            {
                                                message.participants.length > 2 &&
                                                "Group chat"
                                            }
                                        </div>
                                    </div>
                                </Link>
                            )
                        })
                    }
                    {
                        !allMessages.isLoading &&
                        <Users except={allMessages.data}></Users>
                    }
                </div>
            </div>
        </div>
    )
}