"use client";
import QuestionTab from '@/components/questionTab';
import { useParams, useRouter } from 'next/navigation';
import { Dropdown } from 'primereact/dropdown';
import { JSXElementConstructor, PromiseLikeOfReactNode, ReactElement, ReactNode, ReactPortal, useRef, useState } from 'react';
import { useQuery } from 'react-query';

export default function Home() {

    const router = useRouter();
    const param = useParams();

    const point = useRef(0);

    const exams = [
        {
            title: "PMSZT",
            icon: "pi pi-database",
        },
        {
            title: "SZGH",
            icon: "pi pi-sitemap",
        },
        {
            title: "RDSZ",
            icon: "pi pi-cog",
        },
        {
            title: "MEMR",
            icon: "pi pi-calculator",
        },
    ];
    const [selectedExam, setSelectedExam] = useState<any>(param.type ? exams.filter((item) => item.title == (param.type as string).toUpperCase())[0] : exams[0]);

    function getResults() {
        if(!selectedExam) return [];
        if (sessionStorage.getItem(selectedExam.title.toLowerCase() + "-result")) {
            const data = JSON.parse(sessionStorage.getItem(selectedExam.title.toLowerCase() + "-result") || "");
            getPoint(data);
            return data;
        } else {
            return []
        }
    }

    function getPoint(data: any){
        let checkI = 0;
        for (const i of data) {
            if(i.correct.length === i.answer.length){
                const check = i.answer.filter((item: any) => !i.correct.includes(item));
                checkI += (check.length > 0 ? 0 : 1);
            }
        }
        point.current = checkI;
        return 
    }

    const results: any = useQuery(param.type + "-result", getResults);



    const Template = (option: { title: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | PromiseLikeOfReactNode | null | undefined, icon: string },) => {
        if (option) {
            return (
                <div className="flex align-items-center">
                    <p>
                        <i className={option.icon + " me-1"}></i>
                        {option.title}
                    </p>
                </div>
            );
        }
        return "";
    };

    return (
        <main className="flex flex-col min-h-screen gap-4 lg:p-12 p-6 lg:pt-24 pt-24 text-lg">
            <div className="flex gap-3 w-full">
                <span className="p-float-label w-full">
                    <Dropdown value={selectedExam} onChange={(e) => { setSelectedExam(e.value); router.push(e.value.title.toLocaleLowerCase()) }} options={exams}
                        className="w-full " itemTemplate={Template} optionLabel='title' />
                    <label htmlFor="search">Vizsga</label>
                </span>
                <span className="p-float-label w-full">
                    <label htmlFor="search">{point.current} / 24</label>
                </span>
                <span onClick={()=>{router.push("/"+selectedExam.title.toLocaleLowerCase())}} className="p-float-label w-full border border-gray-300 text-gray-500 cursor-pointer hover:bg-blue-800 hover:text-white duration-200 rounded-lg text-center flex items-center justify-center">
                    Újra
                </span>
            </div>

            <div className='text-center grid'>
                {
                    results.isLoading ?
                        <h3>Töltés...</h3> :
                        results.data.length > 0 ?

                            results.data.map((item: any, index: number) => {
                                return (
                                    <QuestionTab key={index} icon="sitemap" type={item.type} question={item.question} number={index+ 1} answers={item.options} result={item.answer} correct={item.correct} next={(e) => { }} ></QuestionTab>

                                )
                            })
                            :
                            <h3>
                                Nincs mentett válasz!
                            </h3>
                }
            </div>

        </main>
    );
}