"use client";
import QuestionTab from "@/components/questionTab";
import mezgj from "../../txts/mezg.json";
import { useQuery } from "react-query";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {

    function getData() {
        try {
            const data = mezgj;
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
        for (let index = 0; index < 10; index++) {
            let random = getRandomInt(data.length)
            if (!array.includes(random)) {
                array.push(random);
            } else {
                index--;
            }
        }
        sessionStorage.setItem("queue", JSON.stringify(array));
        return array;
    }

    function getRandomInt(max: any) {
        return Math.floor(Math.random() * max);
    }

    const [queue, setQueue] = useState([]);

    const mezg: any = useQuery('mezg', getData);

    const [number, setNumber] = useState(0);

    const router = useRouter();
    function Next(item: any) {
        setNumber(number + 1);
        sessionStorage.setItem("number", (number + 1).toString());
        let result = sessionStorage.getItem("mezg-result") ? JSON.parse(sessionStorage.getItem("mezg-result") || "") : [];
        result.push({ question: mezg.data[queue[number]].question, answer: item, options: mezg.data[queue[number]].options, correct: mezg.data[queue[number]].answers, type: mezg.data[queue[number]].answers.length > 1 ? "checkbox" : "radio" });
        sessionStorage.setItem("mezg-result", JSON.stringify(result));
        if (number + 1 > 29) {
            sessionStorage.removeItem("number");
            sessionStorage.removeItem("queue");
            router.push("/results?exam=mezg");
            setNumber(0);
        }
    }

    function finished(item: any) {

        let result = sessionStorage.getItem("mezg-result") ? JSON.parse(sessionStorage.getItem("mezg-result") || "") : [];
        result.push({ question: mezg.data[queue[number]].question, answer: item, options: mezg.data[queue[number]].options, correct: mezg.data[queue[number]].answers, type: mezg.data[queue[number]].answers.length > 1 ? "checkbox" : "radio" });
        sessionStorage.setItem("mezg-result", JSON.stringify(result));
        sessionStorage.removeItem("number");
        sessionStorage.removeItem("queue");
        router.push("/results?exam=mezg");
        setNumber(0);
    }


    return (
        <main className="lg:pt-0 pt-12">
            {
                !mezg.isLoading && queue.length > 0 ?
                    <QuestionTab max={10} icon="globe" img={mezg.data[queue[number]].pic} question={mezg.data[queue[number]].question} number={number + 1} answers={mezg.data[queue[number]].options} next={(e) => { Next(e); }} finished={(e) => { finished(e) }} type={mezg.data[queue[number]].answers.length > 1 ? "checkbox" : "radio"}></QuestionTab>
                    : <></>
            }
        </main>
    );
}