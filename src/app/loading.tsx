"use client";
import { useEffect, useState } from "react";


export default function Loading() {


    const [time, setTime] = useState(1);

    useEffect(() => {
        const interval = setInterval(() => {
            setTime((prev) => prev + 1);
        }, 1000);
    }, []);

    return (
        <main className="min-h-screen w-screen  bg-white absolute top-0 left-0">
            <div className="flex items-center min-h-screen p-4  bg-white justify-center">
                <i className="pi pi-spinner pi-spin text-gray-500 absolute " style={{ fontSize: "10rem" }}></i>
                <div className="text-gray-500 text-3xl">
                    {time}s
                </div>
            </div>
        </main>
    );
}