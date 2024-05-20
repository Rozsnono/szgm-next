import { Button } from "primereact/button";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { RadioButton } from "primereact/radiobutton";
import { Checkbox } from "primereact/checkbox";
import { InputText } from "primereact/inputtext";
import { Messages } from 'primereact/messages';
import Loading from "@/app/loading";

export default function Card({ question, answers, number, icon, next, finished, max }: { question: string, answers: any, number: number, icon: string, next: (e: any) => void, finished: (e: any) => void, max: number }) {

    const [finish, setFinish] = useState<boolean>(false);

    function finishing() {
        finished(true);
        setFinish(true);
    }

    if (finish) {
        return <Loading></Loading>
    }

    return (
        <main>
            <div className={"flex items-center lg:p-4 py-4 lg:justify-center text-gray-900 min-h-screen"}>
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
                            <div className='grid gap-5 px-6 pb-6'>
                                {
                                    answers.map((row: any, i: number) => (
                                        <div key={i} className="flex flex-col space-y-1 text-center relative">
                                            <p>{row}</p>
                                        </div>
                                    ))
                                }

                            </div>
                            <div className="flex justify-between">
                                {
                                    max !== number ?
                                        <button type="button" onClick={next} className="flex items-center gap-2 text-white bg-blue-700 bg-red-700 hover: hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-md px-5 py-2.5 text-center me-2 mb-2">Tovább <i className="pi pi-send"></i> </button> :
                                        // <Button color="warn" onClick={() => { next(choosed); setChoosed([]) }} rounded label="Tovább" icon="pi pi-send" /> :
                                        // <Button onClick={() => { finished(choosed); setChoosed([]) }} rounded label="Befejezés" icon="pi pi-send" />
                                        <button type="button" onClick={finishing} className="flex items-center gap-2 text-white bg-orange-700 hover:bg-orange-800 focus:outline-none focus:ring-4 focus:ring-orange-300 font-medium rounded-full text-md px-5 py-2.5 text-center me-2 mb-2">Befejezés <i className="pi pi-send"></i> </button>

                                }
                            </div>


                        </div>
                    </div>


                </div>
            </div>
        </main>
    )
}