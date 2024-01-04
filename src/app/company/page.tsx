"use client";
import QuestionTab from "@/components/questionTab";
import VALLALAT from "../../txts/vallalat.json";
import { useQuery } from "react-query";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {

    const router = useRouter();

    function getData() {
        try {
            const data = VALLALAT;

            if (sessionStorage.getItem("queue") != "undefined" && sessionStorage.getItem("queue") != null) {
                const qu: string | any = sessionStorage.getItem("queue");
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
        for (let index = 0; index < 9; index++) {
            let random = getRandomInt(data.length)
            if (!array.includes(random)) {
                array.push(random);
            } else {
                index--;
            }
        }
        sessionStorage.setItem("queue", JSON.stringify(array))
        return array;
    }

    function getRandomInt(max: any) {
        return Math.floor(Math.random() * max);
    }

    const [queue, setQueue] = useState([]);

    const vallalat: any = useQuery('subjects', getData);

    const [number, setNumber] = useState(0);

    function Next(item: any) {

        setNumber(number + 1);
        sessionStorage.setItem("number", (number + 1).toString());
        let result = sessionStorage.getItem("vallalat-result") ? JSON.parse(sessionStorage.getItem("vallalat-result") || "") : [];
        result.push({ question: vallalat.data[queue[number]].question, answer: item, options: vallalat.data[queue[number]].option, correct: vallalat.data[queue[number]].answer, type: vallalat.data[queue[number]].type });
        sessionStorage.setItem("vallalat-result", JSON.stringify(result));
        if (number > 7) {
            sessionStorage.removeItem("number");
            sessionStorage.removeItem("queue");
            router.push("/results?exam=vallalat");
            setNumber(0);
        }
    }

    function finished(item: any) {

        let result = sessionStorage.getItem("vallalat-result") ? JSON.parse(sessionStorage.getItem("vallalat-result") || "") : [];
        result.push({ question: vallalat.data[queue[number]].question, answer: item, options: vallalat.data[queue[number]].option, correct: vallalat.data[queue[number]].answer, type: vallalat.data[queue[number]].type });
        sessionStorage.setItem("vallalat-result", JSON.stringify(result));
        sessionStorage.removeItem("number");
        sessionStorage.removeItem("queue");
        router.push("/results?exam=vallalat");
        setNumber(0);
    }


    return (
        <main>
            {
                !vallalat.isLoading && queue.length > 0 ?
                    <QuestionTab max={9} icon="chart-line" question={vallalat.data[queue[number]].question} number={number + 1} answers={vallalat.data[queue[number]].option} next={(e) => { Next(e); }} finished={(e)=>{finished(e)}} type={vallalat.data[queue[number]].type}></QuestionTab>
                    : <></>
            }
        </main>
    );
}