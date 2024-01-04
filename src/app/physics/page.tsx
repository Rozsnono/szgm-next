"use client"
import { useQuery } from "react-query";
import { InputText } from "primereact/inputtext";
import Fizika from "../../txts/fizika.json"
import { Dropdown } from 'primereact/dropdown';
import { useState } from "react";

export default function Home() {

    const [tmpFizika, setTMPFizika] = useState<any>([]);

    function getData() {
        try {
            const prevData = Fizika.data.split('-----');

            const index = prevData.indexOf(prevData.filter(item => item.includes("Normál kérdések!"))[0]);
            setTMPFizika(prevData)
            return prevData;
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


    const fizika: any = useQuery('fizika', getData);

    function search(value: string) {
        return fizika.data.filter((item: string) => item.includes(value));
    }



    return (
        <main className="flex flex-col min-h-screen gap-4 lg:p-12 lg:pt-24 p-6 pt-32 text-lg">
            <div className="flex gap-3 lg:w-1/3 w-full">
                <span className="p-float-label w-full">
                    <InputText className={"w-full " + (tmpFizika.length === 0 && value != null && value != "" ? "p-invalid" : "")} id="search" value={value} onChange={(e) => { setValue(e.target.value); setTMPFizika(search(e.target.value)) }} />
                    <label htmlFor="search">Keresés</label>
                </span>
            </div>

            {
                !fizika.isLoading ?
                    tmpFizika.map((item: string, index: number) => {
                        return (
                            <div key={index}
                                className={"flex flex-col gap-4 text-justify border-2 border-gray-300 p-3 rounded-lg" +
                                    (index >= fizika.data.indexOf(fizika.data.filter((item: any) => item.includes("Normál kérdések!"))[0]) ? " bg-yellow-100" : "")
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
                    }) : 
                    <>Töltés...</>


            }


        </main>
    );
}