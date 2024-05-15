"use client";
import QuestionTab from "@/components/questionTab";
import SZGH from "../../txts/szgh.json";
import { useQuery } from "react-query";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { InputText } from "primereact/inputtext";

export default function Home() {

    function getData() {
        try {
            let data = SZGH.data;
            setQs(data);
            return data;
        } catch (error: Error | any) {      //muszáj így megadni, mert különben hibát dob
            console.error(error);
            return error;
        }

    }

    const [queue, setQueue] = useState<number>(0);
    const [qs, setQs] = useState<any>();

    const szgh: any = useQuery('subjects', getData);

    const [number, setNumber] = useState(0);
    const router = useRouter();

    function Next(item: any) {

        setQueue(queue => queue + 1);
    }

    function setShow() {
        setShowAnswer(!showAnswer);
        setQueue(queue => queue);
    }

    const [showAnswer, setShowAnswer] = useState<boolean>(true);

    const [value, setValue] = useState('' as string | any);

    function search(value: string) {
        setQs(szgh.data.filter((item: any) => replaceAll(item.question).includes(replaceAll(value))));
    }

    function replaceAll(string: string): string{
        return string.toLocaleLowerCase().replaceAll("á","a").replaceAll("é","e").replaceAll("í","i").replaceAll("ó","o").replaceAll("ö","o").replaceAll("ő","o").replaceAll("ú","u").replaceAll("ü","u").replaceAll("ű","u");
    }

    return (
        <main className="w-screen h-screen flex flex-col items-center mt-24 gap-3 p-4">
            <div className="flex gap-3 lg:w-1/3 w-full">
                <span className="p-float-label w-full">
                    <InputText className={"w-full "} id="search" value={value} onChange={(e)=>{setValue(e.target.value); search(e.target.value)}}/>
                    <label htmlFor="search">Keresés</label>
                </span>
            </div>

            {
                    !szgh.isLoading &&
                    qs.map((item: any, index: number) => {
                        return (
                            <div key={index}
                                className={`flex gap-4 text-justify items-center border-4 border-gray-300 p-3 rounded-lg w-full ${item.answer && "border-green-300"} ${!item.answer&& "border-red-300"}`}
                            >
                                <h1 className="font-bold text-xl text-center">{item.question}</h1>
                                <p className={`text-black`}>
                                    {
                                        item.answer ? "Igaz" : "Hamis"
                                    }
                                </p>
                            </div>
                        )
                    })

                }
        </main>
    );
}