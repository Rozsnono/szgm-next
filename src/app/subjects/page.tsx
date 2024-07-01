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
        let url = "2021-09-01/IVIN_BMI/IVIN_BMI/IVIN_BMI_4";
        if (selectedSub && selectedDir && selectedY && selectedYear) {
            url = selectedYear + "/" + selectedSub.code + "/" + selectedDir.code + "/" + selectedY.code + "/";
        } else if (user && user.savedTematiks) {

            setSelectedYear(user.savedTematiks.year);
            setSelectedSub(user.savedTematiks.sub);
            setSelectedDir(user.savedTematiks.dir);
            setSelectedY(user.savedTematiks.y);
            url = user.savedTematiks.year + "/" + user.savedTematiks.sub.code + "/" + user.savedTematiks.dir.code + "/" + user.savedTematiks.y.code;
        }
        const res = await fetch("https://szgm-next-server.onrender.com/api/subjects?url=" + url);
        const data: any = await res.json();
        let semesters = Object.values(data.courses[0].data).map((item: any) => item.semester)
        semesters = semesters.filter((item: any, index: number) => { return semesters.indexOf(item) == index });
        setSemesters(semesters);

        let subjectsName = data.courses.map((item: any) => Object.keys(item.data));
        subjectsName = subjectsName.flat();

        let subjects = data.courses.map((item: any) => Object.values(item.data));
        subjects = subjects.flat();
        subjects = subjects.map((item: any, index: number) => { return { ...item, code: subjectsName[index] } })
        setSubjects(subjects);

        if (user && subjects) {
            setDone(user.savedSubjects.map((item: any) => subjects.filter((items: any) => { return items.code == item })).flat());
            doneRef.current = user.savedSubjects;
        }
        if (user && subjects) {
            setMaybe(user.planedSubjects);
        }
        if(user && subjects && user.savedPlannedSubjects) {
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
    const subjectsData = useQuery<any>('sub', getSub, { refetchOnWindowFocus: false });

    const [subjects, setSubjects] = useState<any[]>([]);

    function getKeyByValue(object: any, value: any) {
        const search = Object.keys(object).find(key => object[key] === value);
        return search
    }

    function onHover(item: any) {
        setNexts(item.nexts);
        setPrevs(item.prevs);
    }
    function onTematikaHover(item: any) {
        setTematik(item);
    }
    function onHoverOut() {
        setNexts([]);
        setPrevs([]);
    }
    function onClick(item: any, nexts: any) {

        if (maybe.includes(item)) {

            setMaybe(maybe => maybe.filter((items: any) => { return items != item }));
        }
        else if (doneRef.current.includes(item)) {
            setMaybe([...maybe, item]);

            setDone(done => done.filter((items: any) => { return items.code != subjects.filter((items: any) => { return items.code == item.toString() })[0].code }));

            doneRef.current = doneRef.current.filter((items: any) => { return items != item });
            setCan(can => can.filter((canItem: any) => {
                return nexts.filter(
                    (next: any) => {
                        if (subjects.filter((code: any) => { return code.code == next.toString() }).length == 0) return false;
                        const tmp = subjects.filter((code: any) => { return code.code == next.toString() })[0].prevs.filter(
                            (prev: any) => {
                                return doneRef.current.includes(prev);
                            }
                        );
                        return tmp.length == 0;
                    }
                ).includes(canItem)
            }))



        } else {
            const tmpDoneLength = subjects.filter((code: any) => { return code.code == item.toString() })[0].prevs.length;
            const tmp = subjects.filter((code: any) => { return code.code == item.toString() })[0].prevs.filter(
                (prev: any) => {
                    return doneRef.current.includes(prev);
                }
            );
            if (tmp.length != tmpDoneLength) {
                setMaybe([...maybe, item]);

                return
            };
            setDone([...done, subjects.filter((items: any) => { return items.code == item.toString() })[0]])
            doneRef.current = ([...doneRef.current, item]);
            let tmpCan = [...can, ...nexts.filter(
                (next: any) => {
                    if (subjects.filter((code: any) => { return code.code == next.toString() }).length == 0) return false;
                    const tmpPrev = subjects.filter((code: any) => { return code.code == next.toString() })[0].prevs.length;
                    const tmp = subjects.filter((code: any) => { return code.code == next.toString() })[0].prevs.filter(
                        (prev: any) => {
                            return doneRef.current.includes(prev);
                        }
                    );
                    return tmp.length == tmpPrev;
                }
            )];
            tmpCan = tmpCan.filter((items: any, index: number) => { return item != items });
            setCan(tmpCan);
        }
    }

    const [semesters, setSemesters] = useState<number[]>([]);
    const [nexts, setNexts] = useState<any[]>([]);
    const [maybe, setMaybe] = useState<any[]>([]);
    const [can, setCan] = useState<any[]>([]);
    const [prevs, setPrevs] = useState<any[]>([]);
    const [done, setDone] = useState<any[]>([]);
    const [inPlanner, setInPlanner] = useState<any[]>([]);
    const [tematik, setTematik] = useState<string>();

    const doneRef = useRef<any[]>([]);

    function getCount(type: any) {
        let tmp = 0;
        done.forEach((item: any) => {
            if (Object.keys(type.data).includes(item.code)) {
                tmp += parseInt(item.credit);
            }
        })

        return tmp;
    }

    function getCountByMaybe(type: any) {
        let tmp = 0;
        maybe.forEach((item: any) => {
            if (Object.keys(type.data).includes(item)) {
                tmp += parseInt(type.data[item].credit);
            }
        })
        return tmp;
    }

    function getCountInPlanner(type: any) {
        let tmp = 0;
        if(!inPlanner) return <></>;

        Object.values(inPlanner).forEach((item: any) => {
            item.forEach((i: any) => {
                if (Object.values(type.data).find((e: any) =>{ return e.name == i.name })) {
                    tmp += parseInt(i.credit);
                }
            });
        });

        return <><i className="pi pi-calendar"></i>{tmp}</>;
    }

    function getColorCode(include: any) {
        if ( inPlanner && Object.values(inPlanner).find((i: any) => { return i.find((k: any)=>{ return k.name === (subjects.find((j: any)=>{ return j.code == include })).name }) })) return "bg-indigo-600 text-black";
        if (nexts.includes(include)) return "bg-yellow-200 text-black";
        if (prevs.includes(include)) return "bg-red-200 text-black";
        if (can.includes(include)) return "bg-blue-200 text-black";
        if (doneRef.current.includes(include)) return "bg-green-700";
        if (maybe.includes(include)) return "bg-blue-400 text-black";
        return "hover:bg-gray-400 hover:bg-gray-700";
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
            savedSubjects: doneRef.current,
            savedTematiks: { year: selectedYear, sub: selectedSub, dir: selectedDir, y: selectedY },
            planedSubjects: maybe
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
                !data.isLoading && data.data ?
                <div className="flex w-full flex-col gap-3">
                    <div className="flex justify-between lg:flex-row flex-col justify-center items-center gap-6">
                        {
                            user &&
                            <div onClick={!save ? saving : () => { }} className={"border w-full text-center border-green-800 bg-green-800 text-white hover:bg-green-900 p-2 rounded-lg w-fit cursor-pointer duration-200"}> {save ? <i className="pi pi-spinner pi-spin"></i> : <></>} Mentés</div>
                        }

                        {
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

                        }

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


                    <div className="text-center text-lg">{data.data.courses[0].name}</div>
                    <div className={"text-center text-sm" + (data.data.courses[0].required_credits > getCount(data.data.courses[0]) ? "" : " text-green-600")}>{data.data.courses[0].required_credits} / {getCount(data.data.courses[0])} ({getCountByMaybe(data.data.courses[0])}) ({getCountInPlanner(data.data.courses[0])})</div>
                    <div className="flex lg:flex-row flex-col gap-5 justify-center">

                        {
                            semesters.map((sem: number, semIndex: number) => {
                                return (
                                    <div key={semIndex} className="flex flex-col gap-2">
                                        <div className="text-center">{sem}.</div>

                                        <hr />

                                        {
                                            Object.values(data.data.courses[0].data).filter((item: any) => { return item.semester == sem }).map((item: any, index: number) => {
                                                return (
                                                    <div key={index} onClick={() => { onClick(getKeyByValue(data.data.courses[0].data, item), item.nexts) }} onMouseEnter={() => { onHover(item); onTematikaHover(getKeyByValue(data.data.courses[0].data, item)) }} onMouseLeave={onHoverOut} className={"border justify-between flex rounded-md border-gray-600 p-1 cursor-pointer duration-100 " + getColorCode(getKeyByValue(data.data.courses[0].data, item))}> <div>{item.name}</div> <div className="ms-1">{item.credit}</div></div>
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
                            data.data.courses.slice(1).map((courses: any, c_i: number) => {
                                return (
                                    <div key={c_i} className="flex flex-col gap-2">
                                        <div className="text-center">{courses.name}</div>
                                        <div className={"text-sm text-center " + (!courses.required_credits && " opacity-0") + (getCount(courses) < courses.required_credits ? "" : " text-green-600 font-bold")}>{courses.required_credits ? courses.required_credits : 0} / {getCount(courses)} ({getCountByMaybe(courses)}) ({getCountInPlanner(courses)})</div>

                                        <hr />

                                        {
                                            Object.values(courses.data).map((item: any, index: number) => {
                                                return (
                                                    <div key={index} onClick={() => { onClick(getKeyByValue(courses.data, item), item.nexts) }} onMouseEnter={() => { onHover(item); onTematikaHover(getKeyByValue(courses.data, item)) }} onMouseLeave={onHoverOut} className={"border flex justify-between rounded-md border-gray-600 p-1 cursor-pointer duration-100 " + getColorCode(getKeyByValue(courses.data, item))}><div>{item.name}</div> <div className="ms-1">{item.credit}</div></div>
                                                )
                                            })
                                        }
                                    </div>
                                )
                            })
                        }



                        {/* <div className="flex flex-col gap-2">
                            <div className="text-center"></div>

                            <hr />

                            {
                                Object.values(data.data.courses[2].data).map((item: any, index: number) => {
                                    return (
                                        <div key={index} onClick={() => { onClick(getKeyByValue(data.data.courses[2].data, item), item.nexts) }} onMouseEnter={() => { onHover(item) }} onMouseLeave={onHoverOut} className={"border rounded-md border-gray-600 p-1 cursor-pointer duration-100" + (doneRef.current.includes(getKeyByValue(data.data.courses[2].data, item)) ? " bg-green-600" : " hover:bg-green-200 ") + (can.includes(getKeyByValue(data.data.courses[2].data, item)) ? " bg-blue-200" : prevs.includes(getKeyByValue(data.data.courses[2].data, item)) ? " bg-blue-200" : nexts.includes(getKeyByValue(data.data.courses[2].data, item)) ? " bg-yellow-200" : "")}>{item.name}</div>
                                    )
                                })
                            }
                        </div>

                        <div className="flex flex-col gap-2">
                            <div className="text-center"></div>

                            <hr />

                            {
                                Object.values(data.data.courses[3].data).map((item: any, index: number) => {
                                    return (
                                        <div key={index} onClick={() => { onClick(getKeyByValue(data.data.courses[3].data, item), item.nexts) }} onMouseEnter={() => { onHover(item) }} onMouseLeave={onHoverOut} className={"border rounded-md border-gray-600 p-1 cursor-pointer duration-100" + (doneRef.current.includes(getKeyByValue(data.data.courses[3].data, item)) ? " bg-green-600" : " hover:bg-green-200 ") + (can.includes(getKeyByValue(data.data.courses[3].data, item)) ? " bg-blue-200" : prevs.includes(getKeyByValue(data.data.courses[3].data, item)) ? " bg-blue-200" : nexts.includes(getKeyByValue(data.data.courses[3].data, item)) ? " bg-yellow-200" : "")}>{item.name}</div>
                                    )
                                })
                            }
                        </div>

                        <div className="flex flex-col gap-2">
                            <div className="text-center"></div>

                            <hr />

                            {
                                Object.values(data.data.courses[4].data).map((item: any, index: number) => {
                                    return (
                                        <div key={index} onClick={() => { onClick(getKeyByValue(data.data.courses[4].data, item), item.nexts) }} onMouseEnter={() => { onHover(item) }} onMouseLeave={onHoverOut} className={"border rounded-md border-gray-600 p-1 cursor-pointer duration-100" + (doneRef.current.includes(getKeyByValue(data.data.courses[4].data, item)) ? " bg-green-600" : " hover:bg-green-200 ") + (can.includes(getKeyByValue(data.data.courses[4].data, item)) ? " bg-blue-200" : prevs.includes(getKeyByValue(data.data.courses[4].data, item)) ? " bg-blue-200" : nexts.includes(getKeyByValue(data.data.courses[4].data, item)) ? " bg-yellow-200" : "")}>{item.name}</div>
                                    )
                                })
                            }
                        </div>

                        <div className="flex flex-col gap-2">
                            <div className="text-center"></div>

                            <hr />

                            {
                                Object.values(data.data.courses[5].data).map((item: any, index: number) => {
                                    return (
                                        <div key={index} onClick={() => { onClick(getKeyByValue(data.data.courses[5].data, item), item.nexts) }} onMouseEnter={() => { onHover(item) }} onMouseLeave={onHoverOut} className={"border rounded-md border-gray-600 p-1 cursor-pointer duration-100" + (doneRef.current.includes(getKeyByValue(data.data.courses[5].data, item)) ? " bg-green-600" : " hover:bg-green-200 ") + (can.includes(getKeyByValue(data.data.courses[5].data, item)) ? " bg-blue-200" : prevs.includes(getKeyByValue(data.data.courses[5].data, item)) ? " bg-blue-200" : nexts.includes(getKeyByValue(data.data.courses[5].data, item)) ? " bg-yellow-200" : "")}>{item.name}</div>
                                    )
                                })
                            }
                        </div> */}
                    </div>

                </div>
                :
                <Loading></Loading>
            }
        </main>
    );
}