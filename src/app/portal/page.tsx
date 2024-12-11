"use client";
import QuestionTab from "@/components/questionTab";
import PORTAL from "../../txts/portal.json";
import { useQuery } from "react-query";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {

    function getData() {
        try {
            const data = PORTAL;
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
        for (let index = 0; index < 20; index++) {
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

    const portal: any = useQuery('portal', getData);

    const [number, setNumber] = useState(0);

    const router = useRouter();
    function Next(item: any) {
        setNumber(number + 1);
        sessionStorage.setItem("number", (number + 1).toString());
        let result = sessionStorage.getItem("portal-result") ? JSON.parse(sessionStorage.getItem("portal-result") || "") : [];
        result.push({ question: portal.data[queue[number]].question, answer: item, options: portal.data[queue[number]].options, correct: getCorrect(), type: portal.data[queue[number]].answers.length > 2 ? "checkbox" : "radio" });
        sessionStorage.setItem("portal-result", JSON.stringify(result));

        if (number + 1 > 29) {
            sessionStorage.removeItem("number");
            sessionStorage.removeItem("queue");
            router.push("/results?exam=portal");
            setNumber(0);
        }
    }

    function finished(item: any) {

        let result = sessionStorage.getItem("portal-result") ? JSON.parse(sessionStorage.getItem("portal-result") || "") : [];
        result.push({ question: portal.data[queue[number]].question, answer: item, options: portal.data[queue[number]].options, correct: getCorrect(), type: portal.data[queue[number]].answers.length > 2 ? "checkbox" : "radio" });
        sessionStorage.setItem("portal-result", JSON.stringify(result));
        sessionStorage.removeItem("number");
        sessionStorage.removeItem("queue");
        router.push("/results?exam=portal");
        setNumber(0);
    }

    function getCorrect(){
        return portal.data[queue[number]].answers;
    }

    return (
        <main className="lg:pt-0 pt-12">
            {
                !portal.isLoading && queue.length > 0 ?
                    <QuestionTab max={20} icon="save" question={portal.data[queue[number]].question} number={number + 1} answers={portal.data[queue[number]].options} next={(e) => { Next(e); }} finished={(e) => { finished(e) }} type={"radio"}></QuestionTab>
                    : <></>
            }
        </main>
    );
}