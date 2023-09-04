"use client"
import { useQuery } from "react-query";
import Fizika from "../../txts/fizika.json"

export default function Home() {

    function getData() {
        try {
            const prevData = Fizika.data.split('-----');

            const index = prevData.indexOf(prevData.filter(item => item.includes("Normál kérdések!"))[0]);

            const data = {
                "short": prevData.slice(1, index),
                "long": prevData.slice(index+2),
            };

            console.log(data);
            return data;
        } catch (error: Error | any) {      //muszáj így megadni, mert különben hibát dob
            console.error(error);
            return error;
        }

    }

    const fizika: any = useQuery('fizika', getData);


    return(
        <main className="flex flex-col min-h-screen gap-10 items-center justify-center p-12 pt-24">
            {
                !fizika.isLoading ?
                fizika.data.short.map((item: string, index: number) => {
                    return (
                        <div key={index} className="flex flex-col gap-4">
                            <p>{item}</p>
                        </div>
                    )
                })
                : <></>
            }

        </main>
    );
}