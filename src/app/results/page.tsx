"use client";
import QuestionTab from '@/components/questionTab';
import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Dropdown } from 'primereact/dropdown';
import { JSXElementConstructor, PromiseLikeOfReactNode, ReactElement, ReactNode, ReactPortal, useRef, useState } from 'react';
import { useQuery } from 'react-query';

export default function Home() {

    const router = useRouter();
    const param = useSearchParams();

    const point = useRef(0);

    const exams = [
        {
            title: "PMSZT",
            icon: "pi pi-file",
            link: "pmszt",
            max: 30
        },
        {
            title: "SZGH",
            icon: "pi pi-sitemap",
            link: "szgh",
            max: 24
        },
        {
            title: "RDSZ",
            icon: "pi pi-cog",
            link:"rdsz",
            max: 24
        },
        {
            title: "MEMR",
            icon: "pi pi-calculator",
            link:"memr",
            max: 30
        },
        {
            title: "VALLALAT",
            icon: "pi pi-chart-line",
            link:"company",
            max: 9
        },
    ];
    const [selectedExam, setSelectedExam] = useState<any>(param.get("exam") ? exams.filter((item) => item.title == (param.get("exam") as string).toUpperCase())[0] : exams[0]);
    const exam = useRef<any>(selectedExam);

    function getResults() {
        if (!exam.current) return [];
        if (sessionStorage.getItem(exam.current.title.toLowerCase() + "-result")) {
            const data = JSON.parse(sessionStorage.getItem(exam.current.title.toLowerCase() + "-result") as string);
            getPoint(data);
            return data;
        } else {
            return []
        }
    }

    function getPoint(data: any) {
        let checkI = 0;

        for (const i of data) {
            if (i.correct && i.correct.length === i.answer.length) {
                const check = i.answer.filter((item: any) => !i.correct.includes(item));
                checkI += (check.length > 0 ? 0 : 1);
            }
        }
        point.current = checkI;
        return checkI;
    }

    const results: any = useQuery(param.get("exam")+ "-result", getResults);



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
        <main className="flex flex-col min-h-screen gap-4 lg:p-12 p-6 lg:pt-24 pt-32 text-lg">
            <div className="flex gap-3 w-full justify-center">
                {exams.map((item) => {
                    return (
                        <Link href={("/results?exam="+item.title)} onClick={() => { setSelectedExam(item); results.refetch(); exam.current = item; }} key={item.title} className={'flex items-center gap-1 border font-bold p-2 rounded-lg cursor-pointer duration-200 ' + (item.title === param.get("exam") ? "border-red-700 text-gray-900 bg-red-700" : "border-red-700 text-red-700 hover:text-white hover:bg-red-700 ")}><i className={item.icon}></i><div className='lg:flex hidden'>{item.title}</div></Link>
                    )
                })}
            </div>
            <div className="flex gap-3 w-full">
                <span className="p-float-label w-full">
                    <label htmlFor="search">{point.current} / {selectedExam.max}</label>
                </span>
                <span onClick={() => { router.push("/" + selectedExam.link.toLocaleLowerCase()); sessionStorage.removeItem(selectedExam.title.toLowerCase() + "-result") }} className="p-float-label w-full border border-gray-300 text-gray-500 cursor-pointer hover: hover:bg-red-800 hover:text-white duration-200 rounded-lg text-center flex items-center justify-center">
                    Újra
                </span>
            </div>
            <div className='text-center grid'>
                {
                    results.isLoading ?
                        <h3>Töltés...</h3> :
                        results.data && results.data !== undefined && results.data.length > 0 ?

                            results.data.map((item: any, index: number) => {
                                return (
                                    <QuestionTab finished={(e) => { }} max={selectedExam.max} key={index} icon={selectedExam.icon.replace("pi pi-", "")} type={item.type} question={item.question} number={index + 1} answers={item.options} result={item.answer} correct={item.correct} next={(e) => { }} ></QuestionTab>

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