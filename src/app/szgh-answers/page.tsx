"use client";
import QuestionTab from "@/components/questionTab";
import SZGH from "../../txts/szgh.json";
import { useQuery } from "react-query";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {

    function getData() {
        try {
            let data = SZGH.data;
            data = data.sort(function (a, b) {
                return 0.5 - Math.random();
            });
            return data;
        } catch (error: Error | any) {      //muszáj így megadni, mert különben hibát dob
            console.error(error);
            return error;
        }

    }

    const [queue, setQueue] = useState<number>(0);

    const szgh: any = useQuery('subjects', getData);

    const [number, setNumber] = useState(0);
    const router = useRouter();

    function Next(item: any) {

        setQueue(queue=> queue + 1);
    }

    return (
        <main className="w-screen h-screen flex items-center justify-center">
            {
                !szgh.isLoading && szgh.data.length > queue ?
                    <QuestionTab key={queue} finished={(e) => { }} max={szgh.data.length} icon="sitemap" type="radio" question={szgh.data[queue].question} number={queue + 1} answers={["Igaz", "Hamis"]} result={szgh.data[queue].answer===true?["Igaz"]:["Hamis"]} correct={szgh.data[queue].answer===true?["Igaz"]:["Hamis"]} next={Next} checking={true} ></QuestionTab>
                    : <></>
            }
        </main>
    );
}