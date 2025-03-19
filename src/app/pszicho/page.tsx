"use client";
import QuestionTab from "@/components/questionTab";
import PSZICHO from "../../txts/pszicho.json";
import { useQuery } from "react-query";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {

    function getData() {
        try {
            const data = PSZICHO;
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
        for (let index = 0; index < 30; index++) {
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

    const pszicho: any = useQuery('pszicho', getData);

    const [number, setNumber] = useState(0);

    const router = useRouter();
    function Next(item: any) {
        setNumber(number + 1);
        sessionStorage.setItem("number", (number + 1).toString());
        let result = sessionStorage.getItem("pszicho-result") ? JSON.parse(sessionStorage.getItem("pszicho-result") || "") : [];
        result.push({ question: pszicho.data[queue[number]].question, answer: item, options: pszicho.data[queue[number]].options, correct: pszicho.data[queue[number]].answers, type: pszicho.data[queue[number]].answers.length > 1 ? "checkbox" : "radio" });
        sessionStorage.setItem("pszicho-result", JSON.stringify(result));
        if (number + 1 > 29) {
            sessionStorage.removeItem("number");
            sessionStorage.removeItem("queue");
            router.push("/results?exam=pszicho");
            setNumber(0);
        }
    }

    function finished(item: any) {

        let result = sessionStorage.getItem("pszicho-result") ? JSON.parse(sessionStorage.getItem("pszicho-result") || "") : [];
        result.push({ question: pszicho.data[queue[number]].question, answer: item, options: pszicho.data[queue[number]].options, correct: pszicho.data[queue[number]].answers, type: pszicho.data[queue[number]].answers.length > 1 ? "checkbox" : "radio" });
        sessionStorage.setItem("pszicho-result", JSON.stringify(result));
        sessionStorage.removeItem("number");
        sessionStorage.removeItem("queue");
        router.push("/results?exam=pszicho");
        setNumber(0);
    }


    return (
        <main className="lg:pt-0 pt-12">
            {!pszicho.isLoading && <>{console.log(pszicho.data, queue)}</>}
            {
                !pszicho.isLoading && queue.length > 0 ?
                    <QuestionTab max={30} icon="table" question={pszicho.data[queue[number]].question} number={number + 1} answers={pszicho.data[queue[number]].options} next={(e) => { Next(e); }} finished={(e) => { finished(e) }} type={pszicho.data[queue[number]].answers.length > 1 ? "checkbox" : "radio"}></QuestionTab>
                    : <></>
            }
        </main>
    );
}