"use client";
import { useContext, useEffect, useRef, useState } from "react";
import { Tooltip } from 'primereact/tooltip';
import { useQuery } from "react-query";
import UserContext from "@/context/user.context";
import { Dropdown } from "primereact/dropdown";

import { Toast } from 'primereact/toast';
import Loading from "../loading";
export default function Home() {

    const { user } = useContext(UserContext);
    const [loading, setLoading] = useState<boolean>(true);

    async function getData() {
        setLoading(true);

        const res = await fetch("https://szgm-next-server.onrender.com/api/subjects", { method: "POST", body: JSON.stringify({ "id": "IVIN_BMI_4" }) });
        const data: any = await res.json();

        let semesters = data.mandatory.data.map((item: any) => item.semester);
        semesters = semesters.filter((item: any, index: number) => { return semesters.indexOf(item) == index });
        setSemesters(semesters);
        setMandatory(data.mandatory);
        let subjectsName = Object.values(data).map((item: any) => item.data.map((items: any) => { return items }));
        subjectsName = subjectsName.flat();
        setSubjects(subjectsName);

        if (user && subjects) {
            setDone(user.savedSubjects);
        }
        if (user && subjects) {
            setPlan(user.planedSubjects);
        }
        if (user && subjects && user.savedPlannedSubjects) {
            setPlanedSubjects(user.savedPlannedSubjects[0]);
        }
        setLoading(false);
        return data
    }


    const data = useQuery<any>('subss', getData);

    const [subjects, setSubjects] = useState<any[]>([]);

    function getKeyByValue(object: any, value: any) {
        const search = Object.keys(object).find(key => object[key] === value);
        return search
    }

    function onHover(item: any) {
        setNext(subjects.filter((items: any) => { return items.pre.includes(item.code) }).map((itemss: any) => itemss.code));
        setPre(subjects.filter((items: any) => { return item.pre.includes(items.code) }).map((itemss: any) => itemss.code));
    }
    function onTematikaHover(item: any) {
        setTematik(item);
    }
    function onHoverOut() {
        setNext([]);
        setPre([]);
    }
    function onClick(item: any, sem: any) {

        if (possibleValues.find((i: any) => i.name === item.name)) {
            setPossibleValues(possibleValues.filter((i: any) => i.name !== item.name));
        } else {
            setPossibleValues([...possibleValues, { ...item, sem: sem }]);
        }
    }

    const [semesters, setSemesters] = useState<number[]>([]);
    const [mandatory, setMandatory] = useState<any>([]);
    const [nexts, setNexts] = useState<any[]>([]);
    const [possibleValues, setPossibleValues] = useState<any[]>([]);
    const [can, setCan] = useState<any[]>([]);
    const [prevs, setPrevs] = useState<any[]>([]);
    const [tematik, setTematik] = useState<string>();


    
    const [done, setDone] = useState<any[]>([]);
    const [plan, setPlan] = useState<any[]>([]);
    const [next, setNext] = useState<any[]>([]);
    const [pre, setPre] = useState<any[]>([]);

    
    const doneRef = useRef<any[]>([]);


    function getColorCode(include: any) {
        if (possibleValues.find((i: any) => i.code === include)) return "border-2 border-blue-400 bg-blue-300 ";
        return "hover:bg-gray-400 ";
    }

    function getAllCount() {
        let tmp = 0;
        data.data.courses.forEach((item: any) => {
            tmp += parseInt(item.required_credits ? item.required_credits : 0);
        })

        let tmpD = 0;
        if (planedSubjects == undefined) return <>{tmp} / {tmpD}</>;


        Object.values(planedSubjects).forEach((item: any) => {
            item.forEach((i: any) => {
                tmpD += parseInt(i.credit);
            })
        })
        return <>{tmp} / {tmpD}</>;
    }

    const [save, setSave] = useState<boolean>(false);
    function saving() {
        setSave(true);
        const body =
        {
            ...user,
            savedPlannedSubjects: planedSubjects,
        };
        fetch("https://szgm-next-server.onrender.com/api/user/" + body._id, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        }).then(res => res.json()).then(data => {
            setSave(false);
        })
    }


    const [planedSubjects, setPlanedSubjects] = useState<any>();
    function addToSemester(sem: number) {
        let tmp = { ...planedSubjects };
        if (tmp[sem] == undefined) tmp[sem] = [];
        possibleValues.forEach((element: any) => {
            tmp[sem].push(element);
        });
        setPlanedSubjects(tmp);
        setPossibleValues([]);
    }
    function removeFromSemester(sem: number, index: number) {
        let tmp = { ...planedSubjects };
        tmp[sem].splice(index, 1);
        setPlanedSubjects(tmp);
    }
    const toast = useRef<Toast>(null);

    const show = () => {
        toast.current?.show({ severity: 'info', summary: 'Info', detail: 'Copied to clipboard!', life: 1000 });
    };

    function ArrayCorrection(array: any, sem: number) {

        let tmp: any = array;
        if (!planedSubjects) return tmp;


        tmp = array.filter((i: any) => {
            return Object.values(planedSubjects).find((j: any) => j.find((k: any) => k.name === i.name)) === undefined;
        })



        return tmp;
    }

    function getCountInPlanner(type: any) {
        let tmp = 0;
        if (!planedSubjects) return tmp;
        Object.values(planedSubjects).forEach((item: any) => {
            item.forEach((i: any) => {
                if (Object.values(type.data).find((e: any) => { return e.name == i.name })) {
                    tmp += parseInt(i.credit);
                }
            });
        });

        return <><i className="pi pi-calendar"></i>{tmp}</>;
    }

    return (
        <main className="lg:pt-24 pt-32 lg:p-8 p-4 text-sm text-gray-900 select-none">
            {
                !data.isLoading ?
                    <div className="flex w-full flex-col gap-3">
                        <div className="flex justify-between lg:flex-row flex-col justify-center items-center gap-6">
                            {
                                user &&
                                <div onClick={!save ? saving : () => { }} className={"border w-full text-center border-green-800 bg-green-800 text-white hover:bg-green-900 p-2 rounded-lg w-fit cursor-pointer duration-200"}> {save ? <i className="pi pi-spinner pi-spin"></i> : <></>} Mentés</div>
                            }

                            <div className={"text-lg text-center"}>{data.data.courses ? getAllCount() : 0}</div>

                        </div>
                        <Toast ref={toast} />

                        <div className="flex lg:flex-row flex-col w-full gap-5 text-center justify-center">
                            <div className="w-full border text-center justify-center flex rounded-md border-gray-600 p-1 bg-green-700">Teljesített</div>
                            <div className="w-full border text-center justify-center flex rounded-md border-gray-600 p-1 bg-gray-400 bg-gray-700">Kijelölt</div>
                            <div className="w-full border text-center justify-center flex rounded-md border-gray-600 p-1 bg-yellow-200 text-black">Ráépülés</div>
                            <div className="w-full border text-center justify-center flex rounded-md border-gray-600 p-1 bg-red-200 text-black">Előkövetelmény</div>
                            <div className="w-full border text-center justify-center flex rounded-md border-gray-600 p-1 bg-blue-200 text-black">Felvehető</div>
                            <div className="w-full border text-center justify-center flex rounded-md border-gray-600 p-1 bg-blue-400 text-black">Tervezett</div>
                        </div>

                        <div className="flex lg:flex-row flex-col gap-5 justify-center">

                            {
                                semesters.map((sem: number, semIndex: number) => {
                                    return (
                                        <div key={semIndex} className="flex flex-col gap-2 w-full">
                                            <div className="text-center">{sem}.</div>

                                            <hr />
                                            {
                                                possibleValues.length > 0 &&
                                                <div onClick={() => { addToSemester(semIndex) }} className={"border border-gray-200 hover:bg-gray-300 select-none justify-center flex rounded-md border-gray-600 p-1"} style={{ "cursor": "pointer" }}> <div>+</div> </div>
                                            }

                                            {
                                                planedSubjects && planedSubjects[semIndex] &&
                                                planedSubjects[semIndex].map((item: any, index: number) => {
                                                    return (
                                                        <div key={index} onClick={() => { removeFromSemester(semIndex, index) }} className={"border justify-between flex rounded-md border-gray-600 p-1 cursor-pointer duration-100 "}> <div>{item.name}</div> <div className="ms-1">{item.credit}</div></div>
                                                    )
                                                })
                                            }
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <hr />


                        <div className="text-center text-lg">Kötelező törzsanyag</div>
                        {/* <div className={"text-center text-sm" + (mandatory.total > getCount('mandatory') ? "" : " text-green-600")}>{mandatory.total} / {getCount('mandatory')} ({getCountByMaybe('mandatory')}) ({getCountInPlanner('mandatory')})</div> */}
                        <div className="flex lg:flex-row flex-col gap-5 justify-center select-none">

                            {
                                semesters.map((sem: number, semIndex: number) => {
                                    return (
                                        <div key={semIndex} className="flex flex-col gap-2">
                                            <div className="text-center">{sem}.</div>

                                            <hr />

                                            {
                                                ArrayCorrection(mandatory.data,1).filter((item: any) => { return item.semester == sem }).map((item: any, index: number) => {
                                                    return (
                                                        <div key={index} onClick={() => { onClick(item, item.semester) }} className={"border justify-between flex rounded-md border-gray-600 p-1 cursor-pointer duration-100 " + getColorCode(item.code)}> <div>{item.name}</div> <div className="ms-1">{item.credit}</div></div>
                                                    )
                                                })
                                            }
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <hr />
                        <div className="flex lg:flex-row flex-col gap-5 justify-center pt-5">

                            {
                                ArrayCorrection(Object.values(data.data).slice(1),1).map((courses: any, c_i: number) => {
                                    return (
                                        <div key={c_i} className="flex flex-col gap-2">
                                            {/* <div className="text-center">{courses.name}</div> */}
                                            {/* <div className={"text-sm text-center " + (!courses.required_credits && " opacity-0") + (getCount(courses) < courses.required_credits ? "" : " text-green-600 font-bold")}>{courses.required_credits ? courses.required_credits : 0} / {getCount(courses)} ({getCountByMaybe(courses)}) ({getCountInPlanner(courses)})</div> */}
                                            {/* <div className={"text-center text-sm" + (courses.total > getCount(Object.keys(data.data)[c_i + 1]) ? "" : " text-green-600")}>{courses.total} / {getCount(Object.keys(data.data)[c_i + 1])} ({getCountByMaybe(Object.keys(data.data)[c_i + 1])}) ({getCountInPlanner(Object.keys(data.data)[c_i + 1])})</div> */}

                                            <hr />

                                            {
                                                Object.values(courses.data).map((item: any, index: number) => {
                                                    return (
                                                        <div key={index} onClick={() => {  onClick(item, item.semester) }} className={"border justify-between flex rounded-md border-gray-600 p-1 cursor-pointer duration-100 " + getColorCode(item.code)}> <div>{item.name}</div> <div className="ms-1">{item.credit}</div></div>
                                                    )
                                                })
                                            }
                                        </div>
                                    )
                                })
                            }

                        </div>

                    </div>
                    :
                    <Loading></Loading>
            }
        </main>
    );
}