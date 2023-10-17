"use client";
import QuestionTab from "@/components/questionTab";
import RDSZ from "../../txts/rendszer.json";
import { useQuery } from "react-query";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {

    function getData() {
        try {
            const data = RDSZ.data;
            if (sessionStorage.getItem("queue-rdsz") != "undefined" && sessionStorage.getItem("queue-rdsz") != null) {
                const qu: string | any = sessionStorage.getItem("queue-rdsz");
                setQueue(JSON.parse(qu) as any)
            } else {
                setQueue(queuing(data));
            }
            if (!Number.isNaN(parseFloat(sessionStorage.getItem("number-rdsz") as string))) {
                const n: number | any = sessionStorage.getItem("number-rdsz");
                setNumber(parseFloat(n))
            }
            console.log(data, queue, number)
            return data;
        } catch (error: Error | any) {      //muszáj így megadni, mert különben hibát dob
            console.error(error);
            return error;
        }

    }

    function queuing(data: any) {
        let array: any = [];
        for (let index = 0; index < 24; index++) {
            let random = getRandomInt(data.length)
            if (!array.includes(random)) {
                array.push(random);
            } else {
                index--;
            }
        }
        sessionStorage.setItem("queue-rdsz", JSON.stringify(array))
        return array;
    }

    function getRandomInt(max: any) {
        return Math.floor(Math.random() * max);
    }

    const [queue, setQueue] = useState([]);

    const rdsz: any = useQuery('rdsz', getData);

    const [number, setNumber] = useState(0);
    const router = useRouter();

    function Next(item: any) {
        setNumber(number + 1);
        sessionStorage.setItem("number-rdsz", (number + 1).toString());
        let result = sessionStorage.getItem("rdsz-result") ? JSON.parse(sessionStorage.getItem("rdsz-result") || "") : [];
        result.push({ question: rdsz.data[queue[number]].question, answer: item, options: rdsz.data[queue[number]].options, correct: rdsz.data[queue[number]].answers, type: rdsz.data[queue[number]].type });
        sessionStorage.setItem("rdsz-result", JSON.stringify(result));
        if(number + 1 > 23){
            sessionStorage.removeItem("number-rdsz");
            sessionStorage.removeItem("queue-rdsz");
            setNumber(0);
            router.push("/results/rdsz");
        }
    }


    return (
        <main>
            {
                !rdsz.isLoading && queue.length > 0 ?
                    <QuestionTab icon="cog" question={rdsz.data[queue[number]].question} number={number + 1} answers={rdsz.data[queue[number]].options} next={(e) => { Next(e); }} type={rdsz.data[queue[number]].type}></QuestionTab>
                    : <></>
            }
        </main>
    );
}