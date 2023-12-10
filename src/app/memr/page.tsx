"use client";
import QuestionTab from "@/components/questionTab";
import MEMR from "../../txts/memr.json";
import { useQuery } from "react-query";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {

    const router = useRouter();

    function getData() {
        try {
            const data = MEMR;
            if (sessionStorage.getItem("memr-queue") != "undefined" && sessionStorage.getItem("memr-queue") != null) {
                const qu: string | any = sessionStorage.getItem("memr-queue");
                setQueue(JSON.parse(qu) as any)
            } else {
                setQueue(queuing(data));
            }
            if (!Number.isNaN(parseFloat(sessionStorage.getItem("number") as string))) {
                const n: number | any = sessionStorage.getItem("number");
                setNumber(parseFloat(n))
            }
            return data;
        } catch (error: Error | any) {      //muszáj így megadni, mert különben hibát dob
            console.error(error);
            return error;
        }

    }

    function queuing(data: any) {
        let array: any = [];
        for (let index = 0; index < 30; index++) {
            let random = getRandomInt(data.length)
            if (!array.includes(random)) {
                array.push(random);
            } else {
                index--;
            }
        }
        sessionStorage.setItem("memr-queue", JSON.stringify(array))
        return array;
    }

    function getRandomInt(max: any) {
        return Math.floor(Math.random() * max);
    }

    const [queue, setQueue] = useState([]);

    const memr: any = useQuery('memr', getData);

    const [number, setNumber] = useState(0);

    function Next(item: any) {

        setNumber(number + 1);
        sessionStorage.setItem("number", (number + 1).toString());
        let result = sessionStorage.getItem("memr-result") ? JSON.parse(sessionStorage.getItem("memr-result") || "") : [];
        result.push({ question: memr.data[queue[number]].question, answer: item, options: memr.data[queue[number]].option, correct: memr.data[queue[number]].answer, type: memr.data[queue[number]].type });
        sessionStorage.setItem("memr-result", JSON.stringify(result));
        if (number > 28) {
            sessionStorage.removeItem("number");
            sessionStorage.removeItem("memr-queue");
            router.push("/results");
            setNumber(0);
        }
    }

    function finished(item: any) {

        let result = sessionStorage.getItem("memr-result") ? JSON.parse(sessionStorage.getItem("memr-result") || "") : [];
        result.push({ question: memr.data[queue[number]].question, answer: item, options: memr.data[queue[number]].option, correct: memr.data[queue[number]].answer, type: memr.data[queue[number]].type });
        sessionStorage.setItem("memr-result", JSON.stringify(result));
        sessionStorage.removeItem("number");
        sessionStorage.removeItem("memr-queue");
        router.push("/results");
        setNumber(0);
    }

    return (
        <main className="lg:pt-0">
            {!memr.isLoading ? <>{console.log(memr.data, queue, number, memr.data[queue[number]])}</> : <></>}
            {
                !memr.isLoading && queue.length > 0 ?
                    <QuestionTab icon="calculator" question={memr.data[queue[number]].question} number={number + 1} answers={memr.data[queue[number]].option} next={(e) => { Next(e); }} finished={(e) => { finished(e) }} type={memr.data[queue[number]].type} max={30}></QuestionTab>
                    : <></>
            }
        </main>
    );
}