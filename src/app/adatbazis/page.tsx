"use client"
import { useQuery } from "react-query";
import { InputText } from "primereact/inputtext";
import Adat from "../../txts/adat.json"
import { Dropdown } from 'primereact/dropdown';
import { useState } from "react";

export default function Home() {

    const [data, setData] = useState<any>([]);

    function getData() {
        try {
            const prevData = Adat.data;
            setData(prevData)
            return prevData;
        } catch (error: Error | any) {      //muszáj így megadni, mert különben hibát dob
            console.error(error);
            return error;
        }

    }

    const [value, setValue] = useState('' as string | any);


    const database: any = useQuery('database', getData);

    function search(value: string) {
        return database.data.filter((item: string) => item.includes(value));
    }



    return (
        <main className="flex flex-col min-h-screen gap-4 lg:p-12 lg:pt-24 p-6 pt-24 text-lg">
            <div className="flex gap-3 lg:w-1/3 w-full">
                <span className="p-float-label w-full">
                    <InputText className={"w-full " + (data.length === 0 && value != null && value != "" ? "p-invalid" : "")} id="search" value={value} onChange={(e) => { setValue(e.target.value); setData(search(e.target.value)) }} />
                    <label htmlFor="search">Keresés</label>
                </span>
            </div>

            {
                !database.isLoading ?
                    data.map((item: string, index: number) => {
                        return (
                            <div key={index}
                                className={"flex flex-col gap-4 text-justify border-2 border-gray-300 p-3 rounded-lg"}
                            >
                                <p className="font-bold">{item.slice(0, (item.indexOf("\r\n")) + 1)}</p>
                                <p>
                                    {
                                        item.slice((item.indexOf("\r\n")) + 2).split("\n").map((item2: string, index2: number) => {
                                            return (<>{item2.replace("\t"," - ")} <br/></>)
                                        })
                                    }
                                </p>
                            </div>
                        )
                    }) :
                    <>Töltés...</>


            }


        </main>
    );
}