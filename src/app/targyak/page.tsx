"use client";
import { useRef, useState } from "react";
import { useQuery } from "react-query";

export default function Home() {
    async function getData() {
        const res = await fetch("https://teal-frail-ostrich.cyclic.app/api/subjects?url=2021-09-01/IVIN_BMI/IVIN_BMI/IVIN_BMI_4");
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


        return data
    }

    function getKeyByValue(object: any, value: any) {
        const search = Object.keys(object).find(key => object[key] === value);
        return search
    }

    function onHover(item: any) {
        setNexts(item.nexts);
        setPrevs(item.prevs);
    }
    function onHoverOut() {
        setNexts([]);
        setPrevs([]);
    }
    function onClick(item: any, nexts: any) {
        

        if (doneRef.current.includes(item)) {
            setDone(done => done.filter((items: any) => { return items.code != subjects.filter((items: any) => {return items.code == item.toString()})[0].code }));

            doneRef.current = doneRef.current.filter((items: any) => { return items != item });
            setCan(can => can.filter((canItem: any) => {
                return !nexts.filter(
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
            if (tmp.length != tmpDoneLength) return;
            setDone([...done, subjects.filter((items: any) => {return items.code == item.toString()})[0]])
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
    const [subjects, setSubjects] = useState<any[]>([]);
    const [nexts, setNexts] = useState<any[]>([]);
    const [can, setCan] = useState<any[]>([]);
    const [prevs, setPrevs] = useState<any[]>([]);
    const [done, setDone] = useState<any[]>([]);

    const doneRef = useRef<any[]>([]);


    const data = useQuery<any>('database', getData);

    return (
        <main className="pt-24 p-8 text-sm">
            {
                !data.isLoading && data.data &&
                <div className="flex w-full flex-col gap-3">
                    <div className="text-center text-lg">{data.data.courses[0].name}</div>
                    <div className="text-center text-sm">{data.data.courses[0].required_credits} / 0</div>
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
                                                    <div key={index} onClick={() => { onClick(getKeyByValue(data.data.courses[0].data, item), item.nexts) }} onMouseEnter={() => { onHover(item) }} onMouseLeave={onHoverOut} className={"border justify-between flex rounded-md border-gray-800 p-1 cursor-pointer duration-100" + (doneRef.current.includes(getKeyByValue(data.data.courses[0].data, item)) ? " bg-green-600" : " hover:bg-green-200 ") + (can.includes(getKeyByValue(data.data.courses[0].data, item)) ? " bg-blue-200" : prevs.includes(getKeyByValue(data.data.courses[0].data, item)) ? " bg-red-200" : nexts.includes(getKeyByValue(data.data.courses[0].data, item)) ? " bg-yellow-200" : "")}> <div>{item.name}</div> <div className="ms-1">{item.credit}</div></div>
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
                                        <div className={"text-sm text-center " + (!courses.required_credits && " opacity-0")}>{courses.required_credits ? courses.required_credits : 0} / 0</div>

                                        <hr />

                                        {
                                            Object.values(courses.data).map((item: any, index: number) => {
                                                return (
                                                    <div key={index} onClick={() => { onClick(getKeyByValue(courses.data, item), item.nexts) }} onMouseEnter={() => { onHover(item) }} onMouseLeave={onHoverOut} className={"border flex justify-between rounded-md border-gray-800 p-1 cursor-pointer duration-100" + (doneRef.current.includes(getKeyByValue(courses.data, item)) ? " bg-green-600" : " hover:bg-green-200 ") + (can.includes(getKeyByValue(courses.data, item)) ? " bg-blue-200" : prevs.includes(getKeyByValue(courses.data, item)) ? " bg-red-200" : nexts.includes(getKeyByValue(courses.data, item)) ? " bg-yellow-200" : "")}><div>{item.name}</div> <div className="ms-1">{item.credit}</div></div>
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
                                        <div key={index} onClick={() => { onClick(getKeyByValue(data.data.courses[2].data, item), item.nexts) }} onMouseEnter={() => { onHover(item) }} onMouseLeave={onHoverOut} className={"border rounded-md border-gray-800 p-1 cursor-pointer duration-100" + (doneRef.current.includes(getKeyByValue(data.data.courses[2].data, item)) ? " bg-green-600" : " hover:bg-green-200 ") + (can.includes(getKeyByValue(data.data.courses[2].data, item)) ? " bg-blue-200" : prevs.includes(getKeyByValue(data.data.courses[2].data, item)) ? " bg-red-200" : nexts.includes(getKeyByValue(data.data.courses[2].data, item)) ? " bg-yellow-200" : "")}>{item.name}</div>
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
                                        <div key={index} onClick={() => { onClick(getKeyByValue(data.data.courses[3].data, item), item.nexts) }} onMouseEnter={() => { onHover(item) }} onMouseLeave={onHoverOut} className={"border rounded-md border-gray-800 p-1 cursor-pointer duration-100" + (doneRef.current.includes(getKeyByValue(data.data.courses[3].data, item)) ? " bg-green-600" : " hover:bg-green-200 ") + (can.includes(getKeyByValue(data.data.courses[3].data, item)) ? " bg-blue-200" : prevs.includes(getKeyByValue(data.data.courses[3].data, item)) ? " bg-red-200" : nexts.includes(getKeyByValue(data.data.courses[3].data, item)) ? " bg-yellow-200" : "")}>{item.name}</div>
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
                                        <div key={index} onClick={() => { onClick(getKeyByValue(data.data.courses[4].data, item), item.nexts) }} onMouseEnter={() => { onHover(item) }} onMouseLeave={onHoverOut} className={"border rounded-md border-gray-800 p-1 cursor-pointer duration-100" + (doneRef.current.includes(getKeyByValue(data.data.courses[4].data, item)) ? " bg-green-600" : " hover:bg-green-200 ") + (can.includes(getKeyByValue(data.data.courses[4].data, item)) ? " bg-blue-200" : prevs.includes(getKeyByValue(data.data.courses[4].data, item)) ? " bg-red-200" : nexts.includes(getKeyByValue(data.data.courses[4].data, item)) ? " bg-yellow-200" : "")}>{item.name}</div>
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
                                        <div key={index} onClick={() => { onClick(getKeyByValue(data.data.courses[5].data, item), item.nexts) }} onMouseEnter={() => { onHover(item) }} onMouseLeave={onHoverOut} className={"border rounded-md border-gray-800 p-1 cursor-pointer duration-100" + (doneRef.current.includes(getKeyByValue(data.data.courses[5].data, item)) ? " bg-green-600" : " hover:bg-green-200 ") + (can.includes(getKeyByValue(data.data.courses[5].data, item)) ? " bg-blue-200" : prevs.includes(getKeyByValue(data.data.courses[5].data, item)) ? " bg-red-200" : nexts.includes(getKeyByValue(data.data.courses[5].data, item)) ? " bg-yellow-200" : "")}>{item.name}</div>
                                    )
                                })
                            }
                        </div> */}
                    </div>

                </div>
            }
        </main>
    );
}