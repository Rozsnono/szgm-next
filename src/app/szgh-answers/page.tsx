"use client";
import QuestionTab from "@/components/questionTab";
import SZGH from "../../txts/szgh.json";
import { useQuery } from "react-query";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {

    function getData() {
        try {
            let data = SZGH.data;
            return data;
        } catch (error: Error | any) {      //muszáj így megadni, mert különben hibát dob
            console.error(error);
            return error;
        }

    }

    const [queue, setQueue] = useState<number>(0);

    const szgh: any = useQuery('subjects', getData);

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
                !szgh.isLoading && szgh.data.length > queue ?
                    <QuestionTab key={queue} finished={(e) => { }}
                        max={szgh.data.length} icon="sitemap" type="radio"
                        question={szgh.data[queue].question} number={queue + 1} answers={["Igaz", "Hamis"]}
                        result={showAnswer ? (szgh.data[queue].answer === true ? ["Igaz"] : ["Hamis"]) : []}
                        correct={showAnswer ? (szgh.data[queue].answer === true ? ["Igaz"] : ["Hamis"]) : []}
                        next={Next} checking={true} ></QuestionTab>
                    : <></>
            }
        </main>
    );
}