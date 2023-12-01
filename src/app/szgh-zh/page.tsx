"use client"
import { useQuery } from "react-query";
import { InputText } from "primereact/inputtext";
import SZGHZH from "../../txts/szgh-zh.json"
import { Dropdown } from 'primereact/dropdown';
import { useState } from "react";
import { Divider } from "primereact/divider";

export default function Home() {

    function getData() {
        try {
            const prevData = SZGHZH.data.split('fejezet');

            prevData.shift();

            setTMPszgh(prevData);

            return prevData;
        } catch (error: Error | any) {      //muszáj így megadni, mert különben hibát dob
            console.error(error);
            return error;
        }

    }

    const [value, setValue] = useState('' as string | any);

    const [tmpSZGH, setTMPszgh] = useState([] as string[] | any);

    const szgh: any = useQuery('szgh', getData);

    function search(value: string) {
        return szgh.data.filter((item: string) => item.toLocaleLowerCase().includes(value.toLocaleLowerCase()));
    }


    return (
        <main className="flex flex-col min-h-screen gap-4 lg:p-12 p-6 lg:pt-24 pt-24 text-lg">
            <div className="flex gap-3 lg:w-1/3 w-full">
                <span className="p-float-label w-full">
                    <InputText className={"w-full " + (tmpSZGH.length === 0 && value != null ? "p-invalid" : "")} id="search" value={value} onChange={(e) => { setValue(e.target.value); setTMPszgh(search(e.target.value)) }} />
                    <label htmlFor="search">Keresés</label>
                </span>
            </div>
            {
                !szgh.isLoading ?
                    tmpSZGH.map((item: string, index: number) => {
                        return (
                            <div key={index}
                                className={"flex flex-col gap-4 text-justify border-2 border-gray-300 p-3 rounded-lg"}
                            >
                                <h1 className="font-bold text-xl text-center pt-3">{index+1}. fejezet</h1>
                                <Divider></Divider>
                                <p>
                                    {
                                    item.split("\r\n").slice(0,item.split("\r\n").length-1).map((item: string) => {
                                        return (
                                            <span key={item} className={value != "" && item.toLocaleLowerCase().includes(value.toLocaleLowerCase()) ? "text-orange-600" : ""}>
                                            
                                            {
                                                item.includes("?") ?
                                                    <p className="font-bold lg:text-md text-sm">
                                                        <br/>
                                                        {item}
                                                    </p>
                                                    :
                                                    <p className="lg:text-md text-sm">
                                                        {item}
                                                    </p>
                                            }

                                            
                                            </span>
                                        )
                                    })
                                    }
                                </p>
                            </div>
                        )
                    })
                    :
                    <></>
            }
        </main>
    );
}