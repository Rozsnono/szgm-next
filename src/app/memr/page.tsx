"use client";
import QuestionTab from "@/components/questionTab";
import MEMR from "../../txts/memr.json";
import { useQuery } from "react-query";
import { useState } from "react";

export default function Home() {

    function getData() {
        try {
            const data = MEMR;
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
        for (let index = 0; index < 24; index++) {
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

    const memr: any = useQuery('subjects', getData);

    const [number, setNumber] = useState(0);

    function Next(item: any) {
        
        setNumber(number + 1);
        sessionStorage.setItem("number", (number + 1).toString());
        let result = sessionStorage.getItem("memr-result") ? JSON.parse(sessionStorage.getItem("memr-result") || "") : [];
        result.push({ question: memr.data[queue[number]].question, answer: item, options: ["Igaz", "Hamis"], correct: [memr.data[queue[number]].answer?"Igaz":"Hamis"], type: "radio" });
        sessionStorage.setItem("memr-result", JSON.stringify(result));
        if(number > 22){
            sessionStorage.removeItem("number");
            sessionStorage.removeItem("queue");
            window.location.href = "/results/all";
            setNumber(0);
        }
    }


    return (
        <main>
            {
                !memr.isLoading && queue.length > 0 ?
                    <QuestionTab icon="calculator" question={memr.data[queue[number]].question} number={number + 1} answers={["Igaz", "Hamis"]} next={(e) => { Next(e); }} type="radio"></QuestionTab>
                    : <></>
            }
        </main>
    );
}