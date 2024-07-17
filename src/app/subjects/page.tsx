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
            setInPlanner(user.savedPlannedSubjects[0]);
        }
        setLoading(false);
        return data
    }

    async function getSub() {
        const res = await fetch("https://szgm-next-server.onrender.com/api/subjectData");
        const data: any = await res.json();
        const tmpSub = Object.values(data.targyadatok).map((item: any, index: number) => {
            return {
                code: Object.keys(data.targyadatok)[index], name: item.name,
                szakirany: Object.values(item.szakirany).map((szaki: any, index: number) => {
                    return {
                        code: Object.keys(item.szakirany)[index], name: szaki.name,
                        tanterv: Object.values(szaki.tanterv).map((tan: any, index: number) => { return { code: Object.keys(szaki.tanterv)[index], name: tan.name } })
                    }
                })
            }
        });
        const tmpData = {
            evek: data.evek,
            targyadatok: tmpSub
        }
        return tmpData
    }


    const data = useQuery<any>('subss', getData);
    // const subjectsData = useQuery<any>('sub', getSub, { refetchOnWindowFocus: false });

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
    function onClick(item: any) {

        if (plan.includes(item.code)) {
            setPlan(plan.filter((items: any) => { return items != item.code }));
            setDone(done.concat(item.code));
        } else if (done.includes(item.code)) {
            setDone(done.filter((items: any) => { return items != item.code }));
        } else {
            setPlan(plan.concat(item.code));
        }
    }

    const [semesters, setSemesters] = useState<number[]>([]);

    const [mandatory, setMandatory] = useState<any>([]);

    const [nexts, setNexts] = useState<any[]>([]);
    const [maybe, setMaybe] = useState<any[]>([]);
    const [can, setCan] = useState<any[]>([]);
    const [prevs, setPrevs] = useState<any[]>([]);
    const [inPlanner, setInPlanner] = useState<any[]>([]);
    const [tematik, setTematik] = useState<string>();

    const [reload, setReload] = useState<number>(0);

    const [done, setDone] = useState<any[]>([]);
    const [plan, setPlan] = useState<any[]>([]);
    const [next, setNext] = useState<any[]>([]);
    const [pre, setPre] = useState<any[]>([]);

    function getCount(type: any) {
        let tmp = 0;
        done.forEach((item: any) => {
            if (data.data[type].data.find((i: any) => { return i.code == item })) {
                tmp += parseInt(data.data[type].data.find((i: any) => { return i.code == item }).credit);
            }
        })

        return tmp;
    }

    function getCountByMaybe(type: any) {
        let tmp = 0;
        plan.forEach((item: any) => {
            if (data.data[type].data.find((i: any) => { return i.code == item })) {
                tmp += parseInt(data.data[type].data.find((i: any) => { return i.code == item }).credit);
            }
        })
        return tmp;
    }

    function getCountInPlanner(type: any) {
        let tmp = 0;
        if (!inPlanner) return <></>;

        Object.values(inPlanner).forEach((item: any) => {
            item.forEach((is: any) => {
                if (data.data[type].data.find((i: any) => { return i.code == is.code })) {
                    tmp += parseInt(data.data[type].data.find((i: any) => { return i.code == is.code }).credit);
                }
            });
        });

        return <><i className="pi pi-calendar"></i>{tmp}</>;
    }

    function getColorCode(include: any) {
        if (inPlanner && Object.values(inPlanner).find((i: any) => { return i.find((k: any) => { return k.name === (subjects.find((j: any) => { return j.code == include })).name }) })) return "bg-indigo-600 text-black";
        if (done.includes(include)) return "bg-green-700";
        if (next.includes(include)) return "bg-yellow-200 text-black";
        if (pre.includes(include)) return "bg-red-200 text-black";
        if (plan.includes(include)) return "bg-blue-400 text-black";
        // if (maybe.includes(include)) return "bg-blue-400 text-black";
        return "hover:bg-gray-400 ";
    }

    function getAllCount() {
        let tmp = 0;
        data.data.courses.forEach((item: any) => {
            tmp += parseInt(item.required_credits ? item.required_credits : 0);
        })

        let tmpD = 0;
        done.forEach((item: any) => {
            tmpD += parseInt(item.credit);
        })

        return <>{tmp} / {tmpD}</>;
    }

    const [save, setSave] = useState<boolean>(false);
    function saving() {
        setSave(true);
        const body =
        {
            ...user,
            savedSubjects: done,
            planedSubjects: plan
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


    const [selectedYear, setSelectedYear] = useState<any>();
    const [selectedSub, setSelectedSub] = useState<any>();
    const [selectedDir, setSelectedDir] = useState<any>();
    const [selectedY, setSelectedY] = useState<any>();

    const toast = useRef<Toast>(null);

    const show = () => {
        toast.current?.show({ severity: 'info', summary: 'Info', detail: 'Copied to clipboard!', life: 1000 });
    };

    return (
        <main className="lg:pt-24 pt-32 lg:p-8 p-4 text-sm text-gray-900 ">
            {
                !data.isLoading ?
                    <div className="flex w-full flex-col gap-3">
                        <div className="flex justify-between lg:flex-row flex-col justify-center items-center gap-6">
                            {
                                user &&
                                <div onClick={!save ? saving : () => { }} className={"border w-full text-center border-green-800 bg-green-800 text-white hover:bg-green-900 p-2 rounded-lg w-fit cursor-pointer duration-200"}> {save ? <i className="pi pi-spinner pi-spin"></i> : <></>} Mentés</div>
                            }

                            {/* {
                            !subjectsData.isLoading && subjectsData.data &&
                            <>
                                <span className="p-float-label">
                                    <Dropdown value={selectedYear} onChange={(e) => setSelectedYear(e.value)} options={subjectsData.data.evek} optionLabel="name" className="w-64" />
                                    <label htmlFor="username">Beiratkozás éve</label>
                                </span>
                                <span className="p-float-label">
                                    <Dropdown value={selectedSub} onChange={(e) => setSelectedSub(e.value)} options={subjectsData.data.targyadatok} optionLabel="name" filter className="w-64 " />
                                    <label htmlFor="username">Szak</label>

                                </span>
                                <span className="p-float-label">
                                    <Dropdown value={selectedDir} onChange={(e) => setSelectedDir(e.value)} options={selectedSub ? selectedSub.szakirany : []} optionLabel="name" className="w-64" />
                                    <label htmlFor="username">Szakirány</label>
                                </span>
                                <span className="p-float-label">
                                    <Dropdown value={selectedY} onChange={(e) => setSelectedY(e.value)} options={selectedDir ? selectedDir.tanterv : []} optionLabel="name" className="w-64" />
                                    <label htmlFor="username">Tanterv</label>
                                </span>

                                <div onClick={() => { data.refetch(); }} className={"border w-full text-center border-blue-800  text-white hover:bg-blue-900 bg-blue-800 p-2 rounded-lg w-fit cursor-pointer duration-200"}> {loading ? <i className="pi pi-spinner pi-spin"></i> : <></>} Keresés</div>


                            </>

                        } */}

                            <div className={"text-lg text-center"}>{data.data.courses ? getAllCount() : 0}</div>

                        </div>
                        <Toast ref={toast} />

                        <Tooltip target=".cursor-pointer.duration-100" autoHide={false} position={"top"}>
                            <div className="flex items-center gap-3">
                                <a className="underline " href={"https://neptun.sze.hu/coursethematics/details/tid/" + tematik + "/m/5246"}>Tárgytematika</a>
                                <div className="border border-white text-white rounded-md px-3 py-1 cursor-pointer active:bg-gray-400" onClick={() => { navigator.clipboard.writeText(tematik as string); show() }}> Másolás</div>
                            </div>
                        </Tooltip>

                        <div className="flex lg:flex-row flex-col w-full gap-5 text-center justify-center">
                            <div className="w-full border text-center justify-center flex rounded-md border-gray-600 p-1 bg-green-700">Teljesített</div>
                            <div className="w-full border text-center justify-center flex rounded-md border-gray-600 p-1 bg-gray-400">Kijelölt</div>
                            <div className="w-full border text-center justify-center flex rounded-md border-gray-600 p-1 bg-yellow-200 text-black">Ráépülés</div>
                            <div className="w-full border text-center justify-center flex rounded-md border-gray-600 p-1 bg-red-200 text-black">Előkövetelmény</div>
                            <div className="w-full border text-center justify-center flex rounded-md border-gray-600 p-1 bg-blue-200 text-black">Felvehető</div>
                            <div className="w-full border text-center justify-center flex rounded-md border-gray-600 p-1 bg-blue-400 text-black">Tervezett</div>
                            <div className="w-full border text-center justify-center flex rounded-md border-gray-600 p-1 bg-indigo-700 text-black">Tervezőben</div>
                        </div>


                        <div className="text-center text-lg">Kötelező törzsanyag</div>
                        <div className={"text-center text-sm" + (mandatory.total > getCount('mandatory') ? "" : " text-green-600")}>{mandatory.total} / {getCount('mandatory')} ({getCountByMaybe('mandatory')}) ({getCountInPlanner('mandatory')})</div>
                        <div className="flex lg:flex-row flex-col gap-5 justify-center select-none" key={reload}>

                            {
                                semesters.map((sem: number, semIndex: number) => {
                                    return (
                                        <div key={semIndex} className="flex flex-col gap-2">
                                            <div className="text-center">{sem}.</div>

                                            <hr />

                                            {
                                                mandatory.data.filter((item: any) => { return item.semester == sem }).map((item: any, index: number) => {
                                                    return (
                                                        <div key={index} onMouseEnter={() => { onHover(item); setTematik(item.code) }} onMouseLeave={onHoverOut} onClick={() => { onClick(item) }} className={"border justify-between flex rounded-md border-gray-600 p-1 cursor-pointer duration-100 " + getColorCode(item.code)}> <div>{item.name}</div> <div className="ms-1">{item.credit}</div></div>
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
                                Object.values(data.data).slice(1).map((courses: any, c_i: number) => {
                                    return (
                                        <div key={c_i} className="flex flex-col gap-2">
                                            {/* <div className="text-center">{courses.name}</div> */}
                                            {/* <div className={"text-sm text-center " + (!courses.required_credits && " opacity-0") + (getCount(courses) < courses.required_credits ? "" : " text-green-600 font-bold")}>{courses.required_credits ? courses.required_credits : 0} / {getCount(courses)} ({getCountByMaybe(courses)}) ({getCountInPlanner(courses)})</div> */}
                                            <div className={"text-center text-sm" + (courses.total > getCount(Object.keys(data.data)[c_i+1]) ? "" : " text-green-600")}>{courses.total} / {getCount(Object.keys(data.data)[c_i+1])} ({getCountByMaybe(Object.keys(data.data)[c_i+1])}) ({getCountInPlanner(Object.keys(data.data)[c_i+1])})</div>

                                            <hr />

                                            {
                                                Object.values(courses.data).map((item: any, index: number) => {
                                                    return (
                                                        <div key={index} onMouseEnter={() => { onHover(item); setTematik(item.code) }} onMouseLeave={onHoverOut} onClick={() => { onClick(item) }} className={"border justify-between flex rounded-md border-gray-600 p-1 cursor-pointer duration-100 " + getColorCode(item.code)}> <div>{item.name}</div> <div className="ms-1">{item.credit}</div></div>
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