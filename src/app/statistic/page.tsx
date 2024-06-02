"use client";
import QuestionTab from "@/components/questionTab";
import STAT from "../../txts/stat.json";
import { useQuery } from "react-query";
import { useState } from "react";
import { useRouter } from "next/navigation";
import QuestionCard from "@/components/questionCard";

export default function Home() {

    function getData() {
        try {
            let data = STAT;
            return data;
        } catch (error: Error | any) {      //muszáj így megadni, mert különben hibát dob
            console.error(error);
            return error;
        }

    }

    const [queue, setQueue] = useState<number>(0);

    const phycs: any = useQuery('subjects', getData);

    const [number, setNumber] = useState(0);
    const router = useRouter();

    function Next(item: any) {

        setQueue(queue => queue + 1);
    }

    function setShow(){
        setShowAnswer(!showAnswer);
        setQueue(queue => queue);
    }

    const [showAnswer, setShowAnswer] = useState<boolean>(true);

    return (
        <main className="w-screen h-screen flex items-center justify-center">

            <button type="button" onClick={setShow} className={`flex fixed top-20 left-5 items-center gap-2 text-white focus:outline-none focus:ring-4 font-medium rounded-full text-md px-5 py-2.5 text-center me-2 mb-2 duration-200 ${!showAnswer&&"bg-red-700 hover:bg-red-800 focus:ring-red-300"} ${showAnswer&&"bg-blue-700 hover:bg-blue-800 focus:ring-blue-300"}`}>{!showAnswer?"Mutasd":"Rejtsd el"} a választ! <i className="pi pi-search"></i> </button>

            {
                !phycs.isLoading && phycs.data.length > queue ?
                    <QuestionCard key={queue} finished={(e) => {setQueue(0) }}
                        max={phycs.data.length} icon="chart-line"
                        question={phycs.data[queue].label} number={queue + 1} answers={showAnswer?phycs.data[queue].text:[]}
                        next={Next}></QuestionCard>
                    : <></>
            }
        </main>
    );
}