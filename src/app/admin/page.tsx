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
        console.log(data);
        return data;
    }

    const data = useQuery<any[]>('database', getData);

    return (
        <main className="flex flex-col min-h-screen gap-2 lg:p-12 lg:pt-24 p-6 pt-32 text-sm">

            <div className="border border-black rounded-lg w-full h-full flex flex-col gap-1 bg-gray-200">
                {!data.isLoading && data.data
                    ? data.data.map((item: any, index: number) => {
                        return (
                            <div key={index}
                                className={"flex"}
                            >
                                <p className="border-r border-gray-400 w-[2rem] text-end px-1 me-1 text-sm text-gray-400">{index}</p>
                                <p className="flex-none w-[4.2rem]">
                                    {
                                        new Date(item.date).toLocaleTimeString("hu-HU", { hour: '2-digit', minute: '2-digit', second: '2-digit' })
                                    }:
                                </p>
                                <p className={"font-bold flex-1" + (item.log.includes("tried") ? " text-red-900" : "")}>{item.log}</p>
                            </div>
                        );
                    })
                    : null}
            </div>


        </main>
    );
}