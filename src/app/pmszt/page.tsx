"use client";
import QuestionTab from "@/components/questionTab";
import PMSZT from "../../txts/pmszt.json";
import { useQuery } from "react-query";
import { useState } from "react";

export default function Home() {

    function getData() {
        try {
            const data = PMSZT.data;
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

    const pmszt: any = useQuery('pmszt', getData);

    const [number, setNumber] = useState(0);

    function Next(item: any) {
        setNumber(number + 1);
        sessionStorage.setItem("number", (number + 1).toString());
        if(number + 1 > 23){
            sessionStorage.removeItem("number");
            sessionStorage.removeItem("queue");
            // window.location.href = "/pmszt/result";
            setNumber(0);setQueue(queuing(pmszt.data));
        }
    }


    return (
        <main>
            {
                !pmszt.isLoading && queue.length > 0 ?
                    <QuestionTab icon="database" img={pmszt.data[queue[number]].pic} question={pmszt.data[queue[number]].question} number={number + 1} answers={pmszt.data[queue[number]].options} next={(e) => { Next(e); }} type={pmszt.data[queue[number]].answers.length > 1 ? "checkbox" : "radio"}></QuestionTab>
                    : <></>
            }
        </main>
    );
}