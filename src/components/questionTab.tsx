import { Button } from "primereact/button";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { RadioButton } from "primereact/radiobutton";
import { Checkbox } from "primereact/checkbox";
import { InputText } from "primereact/inputtext";
import { Messages } from 'primereact/messages';
import Loading from "@/app/loading";

export default function Tab({ question, answers, number, type, img, icon, result, correct, next, finished, max, checking }: { question: string, answers: any, number: number, img?: string | null, icon: string, type: string, result?: any, correct?: any, next: (e: any) => void, finished: (e: any) => void, max: number, checking?: boolean}) {

    const [choosed, setChoosed] = useState<any>(result ? (type === "text" ? answers : result) : []);
    const [finish, setFinish] = useState<boolean>(false);
    const isCorrect = useRef<boolean>(true);

    function toBase64(arr: any) {
        return arr.replace("PIC:", "data:image/png;base64,");
    }

    function checkCorrect(a: any) {
        if (correct.includes(a) && result.includes(a)) {
            return <i className="pi pi-check text-green-600"></i>
        } else if (correct.includes(a) && !result.includes(a)) {
            isCorrect.current = (false)
            next(false);
            return <i className="pi pi-info-circle text-red-400"></i>
        } else if (!correct.includes(a) && result.includes(a)) {
            isCorrect.current = (false)
            next(false);
            return <i className="pi pi-times text-red-700"></i>
        }

    }


    function TextTemplate(row: string) {

        const rows = row.split("#");


        return (
            <div className="flex flex-col space-y-1 text-center relative">
                {rows.map((r: string, i: number) => (

                    <div key={i}>
                        {
                            r.includes("*") ?
                                <InputText className={"w-full "} id="search" value={r} readOnly /> :
                                <p>{r}</p>
                        }
                    </div>
                ))}
            </div>
        )
    }

    function Checking(e: any) {
        if (type === "radio") {
            setChoosed([e.value])
        } else {

            if (choosed.includes(e.value)) {
                setChoosed(choosed.filter((item: any) => item !== e.value))
            } else {
                setChoosed([...choosed, e.value])
            }
        }
    }

    function finishing(){
        setFinish(true);
        finished(choosed); 
        setChoosed([]);
    }

    if(finish){
        return <Loading></Loading>
    }

    return (
        <main>
            <div className={"flex items-center lg:p-4 py-4 lg:justify-center text-gray-900 " + (!result ? " min-h-screen" : "")}>
                <div
                    className="flex flex-col overflow-hidden  bg-white rounded-md shadow-lg max flex-row flex-1 lg:max-w-screen-md"
                >
                    <div
                        className={"p-4 py-6 overflow-hidden text-white w-full flex-shrink-0 flex flex-col items-center justify-evenly transition-all duration-200  bg-red-800 relative"}
                    >
                        <div className="my-3 text-2xl font-bold tracking-wider text-center z-50">
                            <p>{question}</p>
                        </div>

                        <div className="flex p-3 overflow-hidden absolute text-blue-900 text-red-900 top-0 left-0">
                            <i className={"pi pi-" + icon} style={{ fontSize: "10rem" }}></i>
                        </div>
                    </div>
                    <div className="p-5  bg-white md:flex-1 ">

                        <div className="flex flex-col space-y-5">
                            <div className="flex flex-col space-y-1 text-center relative">
                                <div className="text-lg text-end "> <span className="text-gray-900  font-bold">{number}</span> <span className="text-gray-400">of</span> <span className="text-gray-600">{max}</span> </div>
                            </div>
                            {
                                img === null || img === "" || img === undefined ?
                                    <></> :
                                    <div className="flex flex-col space-y-1 text-center relative items-center jusitfy-center">
                                        <Image src={img ? toBase64(img) : ""} width={300} height={100} alt=""></Image>
                                    </div>
                            }
                            <div className='grid gap-5 px-6 pb-6'>
                                {
                                    type === "checkbox" ?
                                        answers.map((a: any, i: number) => (
                                            <div key={i} className="flex items-center justify-start text-left">
                                                <Checkbox disabled={result} inputId={a} value={a} onChange={(e) => Checking(e)} checked={choosed.includes(a)} />
                                                <label htmlFor={a} className="mx-2">{a}</label>
                                                {
                                                    correct ?
                                                        checkCorrect(a)
                                                        : <></>
                                                }
                                            </div>
                                        ))
                                        :
                                        type === "radio" ?
                                            answers.map((a: any, i: number) => (
                                                <div key={i} className="flex items-center justify-start">
                                                    <RadioButton disabled={result} inputId={a} name="category" value={a} onChange={(e) => Checking(e)} checked={choosed.includes(a)} />
                                                    <label htmlFor={a} className="ml-2">{a}
                                                        <span className="font-bold ms-2">

                                                            {
                                                                correct ?
                                                                    checkCorrect(a)
                                                                    : <></>
                                                            }
                                                        </span>
                                                    </label>
                                                </div>
                                            ))
                                            :
                                            <>
                                                <span className="p-float-label w-full">
                                                    {
                                                        TextTemplate(answers)
                                                    }
                                                </span>
                                            </>
                                }
                            </div>
                            <div className="flex justify-between">
                                {
                                    !result || checking ?
                                        <>
                                            {
                                                max !== number ?
                                                <button type="button" onClick={() => { next(choosed); setChoosed([]) }} className="flex items-center gap-2 text-white bg-blue-700 bg-red-700 hover: hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-md px-5 py-2.5 text-center me-2 mb-2">Tovább <i className="pi pi-send"></i> </button> :
                                                    // <Button color="warn" onClick={() => { next(choosed); setChoosed([]) }} rounded label="Tovább" icon="pi pi-send" /> :
                                                    // <Button onClick={() => { finished(choosed); setChoosed([]) }} rounded label="Befejezés" icon="pi pi-send" />
                                                <button type="button" onClick={finishing} className="flex items-center gap-2 text-white bg-orange-700 hover:bg-orange-800 focus:outline-none focus:ring-4 focus:ring-orange-300 font-medium rounded-full text-md px-5 py-2.5 text-center me-2 mb-2">Befejezés <i className="pi pi-send"></i> </button>

                                            }
                                        </>
                                        :
                                        isCorrect.current ? <></> :
                                            <div className="w-full border-l-4 border-orange-500 bg-orange-100 text-orange-500 p-3 rounded-lg"> <i className="pi pi-exclamation-triangle"></i> <span className="font-bold ">A helyes válasz:</span> {correct.join("; ")}</div>
                                }
                            </div>


                        </div>
                    </div>


                </div>
            </div>
        </main>
    )
}