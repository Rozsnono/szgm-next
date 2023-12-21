"use client";
import QuestionTab from "@/components/questionTab";
import PMSZT from "../../txts/pmszt.json";
import { useQuery } from "react-query";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {

    function getData() {
        try {
            const data = PMSZT.data;

            return data;
        } catch (error: Error | any) {      //muszáj így megadni, mert különben hibát dob
            console.error(error);
            return error;
        }

    }

    const pmszt: any = useQuery('pmszt', getData);


    return (
        <main className="lg:pt-12 pt-12">

            {
                !pmszt.isLoading &&
                pmszt.data.map((item: any, index: number) => {
                    return (
                        // <QuestionTab finished={(e) => { }} key={index} icon={selectedExam.icon.replace("pi pi-", "")} type={item.type} question={item.question} number={index + 1} answers={item.options} result={item.answer} correct={item.correct} next={(e) => { }} ></QuestionTab>
                        <QuestionTab key={index} max={30} icon="database" img={item.pic} result={item.answers} correct={item.answers} question={item.question} number={index+1} answers={item.options} next={(e) => { }} finished={(e) => { }} type={item.answers.length > 1 ? "checkbox" : "radio"}></QuestionTab>

                    )
                })

            }
        </main>
    );
}