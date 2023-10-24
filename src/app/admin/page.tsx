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
            {!data.isLoading && data.data
                ? data.data.map((item: any, index: number) => {
                    return (
                        <div key={index}
                            className={"flex gap-4 justify-between border-b border-gray-300 p-3 rounded-lg"}
                        >
                            <p className="font-bold">{item.log}</p>
                            <p>
                                {(new Date(new Date(item.date).setHours(new Date(item.date).getHours() + 2))).toLocaleString()}
                            </p>
                        </div>
                    );
                })
                : null}
        </main>
    );
}