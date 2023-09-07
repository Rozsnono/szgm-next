"use client"
import { useQuery } from "react-query";
import { InputText } from "primereact/inputtext";
import Fizika from "../../txts/fizika.json"
import { Dropdown } from 'primereact/dropdown';
import { useState } from "react";

export default function Home() {

    function getData() {
        try {
            const prevData = Fizika.data.split('-----');

            const index = prevData.indexOf(prevData.filter(item => item.includes("Normál kérdések!"))[0]);

            const data = {
                "short": prevData.slice(1, index),
                "long": prevData.slice(index + 2),
            };
            return data;
        } catch (error: Error | any) {      //muszáj így megadni, mert különben hibát dob
            console.error(error);
            return error;
        }

    }

    const [value, setValue] = useState('' as string | any);
    const [select, setSelect] = useState({ name: 'Összes kérdés', code: 'all' });
    const types = [
        { name: 'Rövid kérdés', code: 'short' },
        { name: 'Normál kérdés', code: 'long' },
        { name: 'Összes kérdés', code: 'all' },
    ];

    const [tmpFizika, setTMPFizika] = useState([] as string[] | any);

    const fizika: any = useQuery('fizika', getData);

    function search(value: string) {
        if (select.code === 'all') {
            return fizika.data.short.filter((item: string) => item.includes(value));
        }
        else if (select.code === 'short') {
            return fizika.data.short.filter((item: string) => item.includes(value));
        }
        else if (select.code === 'long') {
            return fizika.data.long.filter((item: string) => item.includes(value));
        }
    }


    return (
        <main className="flex flex-col min-h-screen gap-4 p-12 pt-24 text-lg">
            <div className="flex gap-3 w-1/3">
                <span className="p-float-label w-full">
                    <InputText className={"w-full " + (tmpFizika.length === 0 && value != null ? "p-invalid" : "")} id="search" value={value} onChange={(e) => { setValue(e.target.value); setTMPFizika(search(e.target.value)) }} />
                    <label htmlFor="search">Keresés</label>
                </span>
                <span className="p-float-label ">
                    <Dropdown inputId="dd-city" value={select} onChange={(e) => {setSelect(e.value); setTMPFizika("")}} options={types} optionLabel="name" className="w-full md:w-14rem" />
                    <label htmlFor="dd-city">Típus</label>
                </span>
            </div>
            {
                tmpFizika.length > 0 ?
                    tmpFizika.map((item: string, index: number) => {
                        return (
                            <div key={index} 
                            className={"flex flex-col gap-4 text-justify border-2 border-gray-300 p-3 rounded-lg" + 
                                (fizika.data.long.includes(item) ? " bg-yellow-100" : "")
                            }
                            >
                                <p className="font-bold">{item.slice(0, (
                                    item.indexOf("?") === -1 ? item.indexOf('!') : item.indexOf("?")
                                ) + 1)}</p>
                                <p>{item.slice((
                                    item.indexOf("?") === -1 ? item.indexOf('!') : item.indexOf("?")
                                ) + 1)}</p>
                            </div>
                        )
                    })
                    :
                <></>
            }

            {
                !fizika.isLoading && (select.code === "all" || select.code === "short") ? 
                fizika.data.short.map((item: string, index: number) => {
                    return (
                        <div key={index} className="flex flex-col gap-4 text-justify border-2 border-gray-300 p-3 rounded-lg">
                            <p className="font-bold">{item.slice(0, (
                                item.indexOf("?") === -1 ? item.indexOf('!') : item.indexOf("?")
                            ) + 1)}</p>
                            <p>{item.slice((
                                item.indexOf("?") === -1 ? item.indexOf('!') : item.indexOf("?")
                            ) + 1)}</p>
                        </div>
                    )
                }) : <></>
            }

{
                !fizika.isLoading && (select.code === "all" || select.code === "long") ? 
                fizika.data.long.map((item: string, index: number) => {
                    return (
                        <div key={index} className="flex flex-col gap-4 text-justify border-2 border-gray-300 p-3 rounded-lg bg-yellow-100">
                            <p className="font-bold">{item.slice(0, (
                                item.indexOf("?") === -1 ? item.indexOf('!') : item.indexOf("?")
                            ) + 1)}</p>
                            <p>{item.slice((
                                item.indexOf("?") === -1 ? item.indexOf('!') : item.indexOf("?")
                            ) + 1)}</p>
                        </div>
                    )
                }) : <></>
            }

        </main>
    );
}