import { Button } from "primereact/button";
import Image from "next/image";
import { useEffect, useState } from "react";
import { RadioButton } from "primereact/radiobutton";
import { Checkbox } from "primereact/checkbox";
import { InputText } from "primereact/inputtext";

export default function Tab({ question, answers, number, type, img, icon, next }: { question: string, answers: any, number: number, img?: string | null, icon: string, type: string, next: (e: any) => void }) {
    const colors: Array<any> = ['success', 'info', 'warning', 'danger'];

    const [choosed, setChoosed] = useState<any>([]);

    function toBase64(arr: any) {
        return arr.replace("PIC:", "data:image/png;base64,");
    }

    function TextTemplate(row: string) {

        const rows = row.split("#");


        return (
            <div className="flex flex-col space-y-1 text-center relative">
                {rows.map((r: string, i: number) => (

                    <>
                        {
                            r.includes("*") ?
                            <InputText className={"w-full "} id="search" value={r} readOnly />:
                            <p>{r}</p>
                        }
                    </>
                ))}
            </div>
        )
    }

    return (
        <main>
            <div className="flex items-center bg-gray-100 min-h-screen p-4 lg:justify-center">
                <div
                    className="flex flex-col overflow-hidden bg-white rounded-md shadow-lg max flex-row flex-1 lg:max-w-screen-md"
                >
                    <div
                        className={"p-4 py-6 overflow-hidden text-white w-full flex-shrink-0 flex flex-col items-center justify-evenly transition-all duration-200 bg-blue-800 relative"}
                    >
                        <div className="my-3 text-2xl font-bold tracking-wider text-center z-50">
                            <p>{question}</p>
                        </div>

                        <div className="flex p-3 overflow-hidden absolute text-blue-900 top-0 left-0">
                            <i className={"pi pi-" + icon} style={{ fontSize: "10rem" }}></i>
                        </div>
                    </div>
                    <div className="p-5 bg-white md:flex-1 ">

                        <div className="flex flex-col space-y-5">
                            <div className="flex flex-col space-y-1 text-center relative">
                                <div className="text-lg text-end "> <span className="text-gray-800 font-bold">{number}</span> <span className="text-gray-400">of</span> <span className="text-gray-600">24</span> </div>
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
                                            <div key={i} className="flex align-items-center">
                                                <Checkbox inputId={a} value={a} onChange={(e) => setChoosed([...choosed, e.value])} checked={choosed.includes(a)} />
                                                <label htmlFor={a} className="ml-2">{a}</label>
                                            </div>
                                        ))
                                        :
                                        type === "radio" ?
                                            answers.map((a: any, i: number) => (
                                                <div key={i} className="flex align-items-center">
                                                    <RadioButton inputId={a} name="category" value={a} onChange={(e) => setChoosed(e.value)} checked={choosed === a} />
                                                    <label htmlFor={a} className="ml-2">{a}</label>
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

                                <Button onClick={() => { next(choosed); setChoosed([]) }} rounded label="Tovább" icon="pi pi-send" />
                            </div>


                        </div>
                    </div>


                </div>
            </div>
        </main>
    )
}