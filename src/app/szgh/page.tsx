"use client";
import QuestionTab from "@/components/questionTab";
import SZGH from "../../txts/szgh.json";
import { useQuery } from "react-query";
import { useState } from "react";

export default function Home() {

    function getData() {
        try {
            const data = SZGH.data;
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

    const szgh: any = useQuery('subjects', getData);

    const [number, setNumber] = useState(0);

    function Next(item: any) {
        
        setNumber(number + 1);
        sessionStorage.setItem("number", (number + 1).toString());
        let result = sessionStorage.getItem("szgh-result") ? JSON.parse(sessionStorage.getItem("szgh-result") || "") : [];
        result.push({ question: szgh.data[queue[number]].question, answer: item, options: ["Igaz", "Hamis"], correct: [szgh.data[queue[number]].answer?"Igaz":"Hamis"], type: "radio" });
        sessionStorage.setItem("szgh-result", JSON.stringify(result));
        if(number + 1 > 23){
            sessionStorage.removeItem("number");
            sessionStorage.removeItem("queue");
            window.location.href = "/results/rdsz";
            setNumber(0);
        }
    }


    return (
        <main>
            {
                !szgh.isLoading && queue.length > 0 ?
                    <QuestionTab icon="sitemap" question={szgh.data[queue[number]].question} number={number + 1} answers={["Igaz", "Hamis"]} next={(e) => { Next(e); }} type="radio"></QuestionTab>
                    : <></>
            }
        </main>
    );
}