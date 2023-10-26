"use client"
import { useQuery } from "react-query";
import { InputText } from "primereact/inputtext";
import { Dropdown } from 'primereact/dropdown';
import { useContext, useState } from "react";
import UserContext from "@/context/user.context";

export default function Home() {

    const { user } = useContext(UserContext)


    if (typeof window !== "undefined") {
        if (!user?.user || user.role === 3) {
            window.location.href = "/"
        }
    }

    async function getData() {
        const res = await fetch("https://teal-frail-ostrich.cyclic.app/api/logs");
        const data = await res.json();
        return data;
    }

    async function getUsers() {
        const res = await fetch("https://teal-frail-ostrich.cyclic.app/api/users");
        const data = await res.json();
        return data;
    }

    function banUser() {
        fetch("https://teal-frail-ostrich.cyclic.app/api/user/"+choosen._id+"/"+!choosen.isDeleted ,{ method: "DELETE" })
    }

    const data = useQuery<any[]>('database', getData);
    const users = useQuery<any[]>('users', getUsers);
    const [choosen, setChoosen] = useState<any>(null);

    return (
        <main className="flex flex-col min-h-screen gap-2 lg:p-12 lg:pt-24 p-6 pt-32 text-sm">
            {
                !users.isLoading && users.data ?
                    <div className="flex gap-2">
                        <Dropdown value={choosen} onChange={(e) => setChoosen(e.value)} options={users.data} optionLabel="user"
                            placeholder="Users" className="w-fit" />
                        <div onClick={banUser} className="border border-blue-800 bg-blue-800 text-white flex items-center justify-center p-2 rounded-md cursor-pointer hover:bg-white hover:text-blue-800 duration-100">{choosen && choosen.isDeleted ? "Unban" : "Ban"}</div>
                    </div> : <></>
            }
            <div className="border border-black rounded-lg w-full h-full flex flex-col gap-1 bg-gray-200">
                {!data.isLoading && data.data
                    ? data.data.map((item: any, index: number) => {
                        return (
                            <div key={index}
                                className={"flex justify-between px-2"}
                            >
                                <div className="flex">

                                    <p className="border-r border-gray-400 w-[2rem] text-end pe-1 me-1 text-sm text-gray-400">{index}</p>
                                    <p className="flex-none w-[4.2rem]">
                                        {
                                            new Date(item.date).toLocaleTimeString("hu-HU", { hour: '2-digit', minute: '2-digit', second: '2-digit' })
                                        }:
                                    </p>

                                    <p className={"font-bold flex-1" + (item.log.includes("tried") ? " text-red-900" : "")}>{item.log}</p>
                                </div>

                                <div>
                                    <p className="text-gray-500">{item.ip}</p>
                                </div>

                            </div>
                        );
                    })
                    : null}
            </div>


        </main>
    );
}