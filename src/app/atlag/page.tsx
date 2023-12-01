"use client";
import { AutoComplete, AutoCompleteCompleteEvent } from "primereact/autocomplete";
import { Key, useRef, useState } from "react";
import { useQuery } from "react-query";
import Subject from "../../txts/subjects.json"
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { Dropdown } from "primereact/dropdown";


export default function Home() {
    const [value, setValue] = useState<any>();
    const [number, setNumber] = useState<number | null>(null);
    const [items, setItems] = useState<string[]>([]);

    const [avg, setAvg] = useState<number | null>(null);
    const [price, setPrice] = useState<number | null>(null);
    const [credit, setCredit] = useState<number | null>(null);

    function getSubjects() {
        try {
            const data = Subject.data.split('\r\n').sort().map(item => { return { subject: item.split('\t')[0], cred: item.split('\t')[1] } });
            return data;
        } catch (error: Error | any) {      //muszáj így megadni, mert különben hibát dob
            console.error(error);
            return error;
        }

    }

    const subjects: any = useQuery('subjects', getSubjects);

    const search = (event: AutoCompleteCompleteEvent) => {
        if (event.query) {
            const filtered = subjects.data.filter((item: any) => { return item.subject.toLowerCase().startsWith(event.query.toLocaleLowerCase()) });
            setItems(filtered.map((item: { subject: any; }) => item.subject));
        } else {
            setItems(subjects.data.slice(10).map((item: { subject: any; }) => item.subject));
        }
    }

    const subjectsData = useRef<any>([]);

    function addSubject() {
        if (value) {
            let tmpV = value;
            if(typeof value == "string"){
                tmpV = subjects.data.filter((item: { subject: any; }) => item.subject == value)[0];
            }
            subjectsData.current.push({ subject: tmpV.subject, mark: number ? number : 0, cred: tmpV.cred });
            setValue('');
            setNumber(null);

            setAvg(Average());
            setPrice(PriceIndex());
            setCredit(sumCred());
        }
    }

    function removeSubject(index: number) {
        subjectsData.current = subjectsData.current.filter((_: any, i: number) => i !== index);
        setAvg(Average());
        setCredit(sumCred());
    }

    function Average(): number {

        let sum = 0;
        let credSum: number = 0;

        for (const i of subjectsData.current) {
            if(i.mark > 0){
                sum += i.mark * i.cred;
                credSum += parseInt(i.cred);
            }
        }
        if (sum == 0 || credSum == 0) return 0;
        return parseFloat((sum / credSum).toFixed(2));
    }

    function PriceIndex(): number {

        let sum = 0;
        let credSum: number = 0;

        for (const i of subjectsData.current) {
            if(i.mark != 1){
                sum += i.mark * i.cred;
                credSum += parseInt(i.cred);
            }
        }
        if (sum == 0 || credSum == 0) return 0;
        return parseFloat((sum / (credSum > 20 ? credSum : 20)).toFixed(2));
    }

    function sumCred() {
        let sum = 0;
        for (const i of subjectsData.current) {
            sum += parseInt(i.cred);
        }
        if (sum == 0) return 0;
        return sum;
    }

    function changeMark(mark: number | null, subject: string) {
        if (mark && mark > 0 && mark < 6) {
            mark = mark > 6 ? 5 : mark < 0 ? 0 : mark;
            subjectsData.current = subjectsData.current.map((item: any) => {
                if (item.subject == subject) {
                    item.mark = mark;
                }
                return item;
            })
            setPrice(PriceIndex());
            setAvg(Average());
            setCredit(sumCred());

        }

    }

    return (
        <main className="lg:flex grid-col-reverse min-h-screen gap-10 items-center justify-center lg:p-24 p-6 pt-24">
            <div className="grid gap-5">
                <div className="grid grid-cols-1 lg:grid-cols-3 min-w-full border-2 border-blue-700 rounded-lg p-6 gap-4">
                    <span className="p-float-label mx-auto">
                        {/* <Dropdown value={value} onChange={(e: any) => setValue(e.value)} options={subjects.data} optionLabel={"subject"}
                            filter className="w-full" /> */}
                        <AutoComplete value={value} suggestions={items} completeMethod={search} onChange={(e: any) => setValue(e.value)} className="w-full"/>
                        <label htmlFor="number-input">Tárgy</label>
                    </span>
                    <span className="p-float-label mx-auto">
                        <InputNumber id="number-input" min={0} max={5} value={number} onValueChange={(e) => setNumber(e.value ? e.value : null)} />
                        <label htmlFor="number-input">Érdemjegy</label>
                    </span>
                    <button onClick={addSubject} className='px-4 py-2 border-2 rounded-xl border-blue-800 bg-blue-800 hover:border-blue-900 hover:bg-blue-900 text-white'><i className='pi pi-plus'></i> Új tárgy</button>
                </div>

                <div className="grid p-10 gap-10">

                    {
                        subjectsData.current.map((item: { subject: any; mark: string; }, index: number | null | undefined) => {
                            return (
                                <div key={index} className="grid grid-cols-1 lg:grid-cols-3 min-w-full gap-7 ">
                                    <span className="p-float-label mx-auto">
                                        <AutoComplete value={item.subject} readOnly suggestions={items} completeMethod={search} onChange={(e: any) => setValue(e.value)} />
                                        <label htmlFor="number-input">Tárgy</label>
                                    </span>
                                    <span className="p-float-label mx-auto">
                                        <InputNumber id="number-input" min={0} max={5} value={parseInt(item.mark)} onChange={(e) => { changeMark(e.value, item.subject) }} />
                                        <label htmlFor="number-input">Érdemjegy</label>
                                    </span>

                                    <Button icon="pi pi-trash" rounded severity="danger" label="Törlés" onClick={() => { removeSubject(index ? index : 0) }} />
                                </div>
                            )
                        })
                    }


                </div>


            </div>

            <div className="flex flex-col border-2 border-blue-700 rounded-lg p-8 gap-8">
                <span className="p-float-label mx-auto">
                    <InputNumber id="number-input" value={avg && avg > 0 ? avg : null} readOnly />
                    <label htmlFor="number-input">Átlag</label>
                </span>

                <span className="p-float-label mx-auto">
                    <InputNumber id="number-input" value={price && price > 0 ? price : null} readOnly />
                    <label htmlFor="number-input">ÖsztöndíjIndex</label>
                </span>
                <span className="p-float-label mx-auto">
                    <InputNumber id="number-input" value={credit && credit > 0 ? credit : null} readOnly />

                    <label htmlFor="number-input">Felvett kredit</label>
                </span>
                <span className="p-float-label mx-auto">
                    <InputNumber id="number-input" value={subjectsData.current.length > 0 ? subjectsData.current.length : null} readOnly />
                    <label htmlFor="number-input">Felvett tárgyak</label>
                </span>
                
            </div>



        </main>
    );
}