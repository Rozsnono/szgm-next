"use client";
import QuestionTab from "@/components/questionTab";
import VIR from "../../txts/vir.json";
import { useQuery } from "react-query";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {

    function getData() {
        try {
            const data = VIR;
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

    const vir: any = useQuery('vir', getData);

    const [number, setNumber] = useState(0);

    const router = useRouter();
    function Next(item: any) {
        setNumber(number + 1);
        sessionStorage.setItem("number", (number + 1).toString());
        let result = sessionStorage.getItem("vir-result") ? JSON.parse(sessionStorage.getItem("vir-result") || "") : [];
        result.push({ question: vir.data[queue[number]].question, answer: item, options: vir.data[queue[number]].options, correct: getCorrect(), type: vir.data[queue[number]].type });
        sessionStorage.setItem("vir-result", JSON.stringify(result));

        if (number + 1 > 29) {
            sessionStorage.removeItem("number");
            sessionStorage.removeItem("queue");
            router.push("/results?exam=vir");
            setNumber(0);
        }
    }

    function finished(item: any) {

        let result = sessionStorage.getItem("vir-result") ? JSON.parse(sessionStorage.getItem("vir-result") || "") : [];
        result.push({ question: vir.data[queue[number]].question, answer: item, options: vir.data[queue[number]].options, correct: getCorrect(), type: vir.data[queue[number]].type });
        sessionStorage.setItem("vir-result", JSON.stringify(result));
        sessionStorage.removeItem("number");
        sessionStorage.removeItem("queue");
        router.push("/results?exam=vir");
        setNumber(0);
    }

    function getCorrect(){
        return vir.data[queue[number]].answer.includes(true) ? ["Igaz"] : vir.data[queue[number]].answer.includes(false) ? ["Hamis"] : vir.data[queue[number]].answer;
    }

    return (
        <main className="lg:pt-0 pt-12">
            {
                !vir.isLoading && queue.length > 0 ?
                    <QuestionTab max={30} icon="briefcase" question={vir.data[queue[number]].question} number={number + 1} answers={vir.data[queue[number]].options} next={(e) => { Next(e); }} finished={(e) => { finished(e) }} type={vir.data[queue[number]].type}></QuestionTab>
                    : <></>
            }
        </main>
    );
}