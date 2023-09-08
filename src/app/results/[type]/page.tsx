"use client";
import QuestionTab from '@/components/questionTab';
import { useParams, useRouter } from 'next/navigation';
import { Dropdown } from 'primereact/dropdown';
import { JSXElementConstructor, PromiseLikeOfReactNode, ReactElement, ReactNode, ReactPortal, useState } from 'react';
import { useQuery } from 'react-query';

export default function Home() {

    const router = useRouter();
    const param = useParams();

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
    ];
    const [selectedExam, setSelectedExam] = useState<any>(param.type ? exams.filter((item) => item.title == (param.type as string).toUpperCase())[0] : exams[0]);

    function getResults() {
        if (sessionStorage.getItem(selectedExam.title.toLowerCase() + "-result")) {
            const data = JSON.parse(sessionStorage.getItem(selectedExam.title.toLowerCase() + "-result") || "");
            return data;
        } else {
            return []
        }
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
        <main className="flex flex-col min-h-screen gap-4 p-12 pt-24 text-lg">
            <div className="flex gap-3 w-1/3">
                <span className="p-float-label w-full">
                    <Dropdown value={selectedExam} onChange={(e) => { setSelectedExam(e.value); router.push(e.value.title.toLocaleLowerCase()) }} options={exams}
                        className="w-full md:w-14rem" itemTemplate={Template} optionLabel='title' />
                    <label htmlFor="search">Vizsga</label>
                </span>
            </div>
            <div className='text-center grid'>
                {
                    results.isLoading ?
                        <h3>Töltés...</h3> :
                        results.data.length > 0 ?

                            results.data.map((item: any, index: number) => {
                                return (
                                    <QuestionTab key={index} icon="sitemap" question={item.question} number={index+ 1} answers={item.options} result={item.answer} next={(e) => { }} type="radio"></QuestionTab>

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