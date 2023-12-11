"use client"

import { useRef, useState } from "react";
import Image from "next/image";
import { useParams, usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

import { SpeedDial } from 'primereact/speeddial';

export default function Home() {

    const isMobile = useRef(false);

    const param = useParams();
    const route = usePathname();
    const router = useRouter();

    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        isMobile.current = true;
    }

    const numbers = [1, 2, 3, 4, 5];

    const routes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    const items = [
        // {
        //     label: '1',
        //     icon: route.includes("1") ? 'pi pi-pencil' : 'pi pi-plus',
        //     command: ()=>{
        //         router.push("/memr-zh/1");
        //     }
        // },
        // {
        //     label: '2',
        //     icon: route.includes("2") ? 'pi pi-pencil' : 'pi pi-plus',
        //     command: ()=>{
        //         router.push("/memr-zh/2");
        //     }
        // },
        // {
        //     label: '3',
        //     icon: route.includes("3") ? 'pi pi-pencil' : 'pi pi-plus',
        //     command: ()=>{
        //         router.push("/memr-zh/3");
        //     }
        // },
        // {
        //     label: '4',
        //     icon: route.includes("4") ? 'pi pi-pencil' : 'pi pi-plus',
        //     command: ()=>{
        //         router.push("/memr-zh/4");
        //     }
        // },
        {
            label: '5',
            icon: route.includes("5") ? 'pi pi-pencil' : 'pi pi-plus',
            command: ()=>{
                router.push("/memr-zh/5");
            }
        },
        {
            label: '6',
            icon: route.includes("6") ? 'pi pi-pencil' : 'pi pi-plus',
            command: ()=>{
                router.push("/memr-zh/6");
            }
        },
        {
            label: '7',
            icon: route.includes("7") ? 'pi pi-pencil' : 'pi pi-plus',
            command: ()=>{
                router.push("/memr-zh/7");
            }
        },
        {
            label: '8',
            icon: route.includes("8") ? 'pi pi-pencil' : 'pi pi-plus',
            command: ()=>{
                router.push("/memr-zh/8");
            }
        },
        {
            label: '9',
            icon: route.includes("9") ? 'pi pi-pencil' : 'pi pi-plus',
            command: ()=>{
                router.push("/memr-zh/9");
            }
        },
        {
            label: '10',
            icon: route.includes("10") ? 'pi pi-pencil' : 'pi pi-plus',
            command: ()=>{
                router.push("/memr-zh/10");
            }
        },
    ];

    return (
        <main className={"flex flex-col h-screen lg:pt-14 pt-12 text-lg bg-gray-100 relative" + (isMobile ? "" : "overflow-hidden")}>
            <div className="fixed bottom-0 left-0 w-screen flex justify-center ">
                <SpeedDial model={items} direction="up" style={{ right: -2, bottom: 6 }} />
            </div>

            {
                isMobile.current ?
                    <>
                        {
                            numbers.map((number) => {
                                return (
                                    <div key={number} className="flex flex-col items-center justify-center h-screen">
                                        <Image src={`/mikro/mikro5/MEMR-5.-lecke-vázlat-${number}.jpg`} alt="matek2" className="w-screen" width={1200} height={100}></Image>
                                    </div>
                                )
                            })

                        }
                    </>
                    :
                    <iframe src={"/memr5.pdf"} className="h-screen" width="auto" height="auto"></iframe>
            }
        </main>
    );
}