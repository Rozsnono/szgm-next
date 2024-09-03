"use client"

import { useRef, useState } from "react";
import Image from "next/image";

export default function Home() {

    const isMobile = useRef(false);

    if (typeof window !== 'undefined' && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        isMobile.current = true;
    }

    const numbers = [1, 2, 3]

    return (
        <main className={"flex flex-col h-screen lg:pt-14 pt-12 text-lg bg-gray-100" + (isMobile ? "" : "overflow-hidden")}>
            {
                isMobile.current ?
                    <>
                        {
                            numbers.map((number) => {
                                return (
                                    <div key={number} className="flex flex-col items-center justify-center h-screen">
                                        <Image src={`/database/ab_${number}.jpg`} alt="adatbazis" className="w-screen" width={1200} height={100}></Image>
                                    </div>
                                )
                            })

                        }
                    </>
                    :
                    <iframe src="/ab.pdf" className="h-screen" width="auto" height="auto"></iframe>
            }
        </main>
    );
}