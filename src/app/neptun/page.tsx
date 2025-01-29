"use client";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";

export default function Neptun() {

    const url = "https://szgm-next-server.onrender.com";

    async function getLogin(): Promise<any> {
        if (localStorage.getItem("tanulas.netlify.neptun")) {

            const access = localStorage.getItem("tanulas.netlify.neptun") as string;
            setAccessToken(localStorage.getItem("tanulas.netlify.neptun") as string);
            getFilterDatas(access);
        }
        if (localStorage.getItem("tanulas.netlify.selectedSubject")) {
            setSelectedSubject(JSON.parse(localStorage.getItem("tanulas.netlify.selectedSubject") as string));
        }
        if (localStorage.getItem("tanulas.netlify.selectedSubjectTime")) {
            setSelectedSubjectTime(JSON.parse(localStorage.getItem("tanulas.netlify.selectedSubjectTime") as string));
        }
        if (localStorage.getItem("tanulas.netlify.selectedSubjectByName")) {
            setSelectedSubjectByName(JSON.parse(localStorage.getItem("tanulas.netlify.selectedSubjectByName") as string));
        }
        return {}
    }

    const neptunAPI = useQuery<any[]>('neptun-api', getLogin);

    const [loading, setLoading] = useState<boolean>(false);

    const [accesToken, setAccessToken] = useState<string>("");

    const [neptun, setNeptun] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [code, setCode] = useState<string>("");

    const [terms, setTerms] = useState<any[]>([]);
    const [subjectTypes, setSubjectTypes] = useState<any[]>([]);
    const [curriculums, setCurriculums] = useState<any[]>([]);
    const [groups, setGroups] = useState<any[]>([]);

    const [selectedTerm, setSelectedTerm] = useState<string>("");
    const [selectedSubjectType, setSelectedSubjectType] = useState<string>("");
    const [selectedCurriculum, setSelectedCurriculum] = useState<string>("");
    const [selectedGroup, setSelectedGroup] = useState<string>("");

    const [subjects, setSubjects] = useState<any[]>([]);

    const [subjectDetail, setSubjectDetail] = useState<any>({});

    const [selectedSubject, setSelectedSubject] = useState<any[]>([]);
    const [selectedSubjectTime, setSelectedSubjectTime] = useState<any[]>([]);

    const [passwordEye, setPasswordEye] = useState<boolean>(false);

    const [selectedSubjectByName, setSelectedSubjectByName] = useState<any[]>([]);

    const [time, setTime] = useState(1);

    const [isSigningIn, setIsSigningIn] = useState<boolean>(false);

    const [signInCodes, setSignInCodes] = useState<any[]>([]);

    const selectedSubjectByNameRef = useRef(selectedSubjectByName);

    function chooseSubject(subject: any, course: any) {

        let tmpSelectedSubject = selectedSubject;
        let tmpSelectedSubjectTime = selectedSubjectTime;

        if (selectedSubject.find(e => e.subjectId == subject.id)) {
            if (selectedSubject.find(e => e.subjectId == subject.id).courseIds.find((c: any) => c == course.id)) {
                if (selectedSubject.find(e => e.subjectId == subject.id).courseIds.length == 1) {
                    tmpSelectedSubject = selectedSubject.filter(e => e.subjectId != subject.id);
                    tmpSelectedSubjectTime = selectedSubjectTime.filter(e => e.id != course.id);
                } else {
                    const tmp = selectedSubject.find(e => e.subjectId == subject.id);
                    tmp.courseIds = tmp.courseIds.filter((c: any) => c != course.id);
                    tmpSelectedSubject = [...selectedSubject.filter(e => e.subjectId != subject.id), tmp];
                    tmpSelectedSubjectTime = selectedSubjectTime.filter(e => e.id != course.id);
                }
            } else {
                const tmp = selectedSubject.find(e => e.subjectId == subject.id);
                tmp.courseIds.push(course.id);
                tmpSelectedSubject = [...selectedSubject.filter(e => e.subjectId != subject.id), tmp];
                if (course.classInstanceInfos.length > 0) {
                    tmpSelectedSubjectTime = [...selectedSubjectTime, { id: course.id, startTime: course.classInstanceInfos[0].startTime, endTime: course.classInstanceInfos[0].endTime, dayOfWeek: course.classInstanceInfos[0].dayOfWeek }];
                } else {
                    tmpSelectedSubjectTime = [...selectedSubjectTime, { id: course.id, startTime: "00:00", endTime: "00:00", dayOfWeek: "" }];
                }

            }
        } else {
            const tmp = {
                courseIds: [course.id],
                curriculumTemplateId: subject.curriculumTemplateId,
                curriculumTemplateLineId: subject.curriculumTemplateLineId,
                scheduledSubjectId: course.scheduledSubjectId,
                subjectId: subject.id,
                termId: subject.termId
            }
            if (course.classInstanceInfos.length > 0) {
                tmpSelectedSubjectTime = [...selectedSubjectTime, { id: course.id, startTime: course.classInstanceInfos[0].startTime, endTime: course.classInstanceInfos[0].endTime, dayOfWeek: course.classInstanceInfos[0].dayOfWeek }];
            } else {
                tmpSelectedSubjectTime = [...selectedSubjectTime, { id: course.id, startTime: "00:00", endTime: "00:00", dayOfWeek: "" }];
            }
            tmpSelectedSubject = [...selectedSubject, tmp];
        }

        localStorage.setItem("tanulas.netlify.selectedSubject", JSON.stringify(tmpSelectedSubject));
        localStorage.setItem("tanulas.netlify.selectedSubjectTime", JSON.stringify(tmpSelectedSubjectTime));

        setSelectedSubject(tmpSelectedSubject);
        setSelectedSubjectTime(tmpSelectedSubjectTime);
    }

    function checkIfSelectedSubject(subject: any) {
        if (selectedSubject.find(e => e.subjectId == subject.id)) {
            return true;
        }
        return false;
    }

    function checkIfSelectedSubjectCourse(subject: any, course: any) {
        if (selectedSubject.find(e => e.subjectId == subject.id)) {
            if (selectedSubject.find(e => e.subjectId == subject.id).courseIds.find((c: any) => c == course.id)) {
                return true;
            }
        }
        return false;
    }

    function checkIfSelectedSubjectTime(course: any) {
        const tmp = course;
        let bool = false;
        selectedSubjectTime.forEach((e: any) => {

            if (e.dayOfWeek === tmp.dayOfWeek) {
                if (convertToTime(e.startTime) >= convertToTime(tmp.startTime) && convertToTime(e.startTime) <= convertToTime(tmp.endTime)) {
                    bool = true;
                }
                if (convertToTime(e.endTime) >= convertToTime(tmp.startTime) && convertToTime(e.endTime) <= convertToTime(tmp.endTime)) {
                    bool = true;
                }
            }


        });
        return bool;
    }

    function convertToTime(time: string) {
        const tmp = time.split(":");
        return parseInt(tmp[0]) * 60 + parseInt(tmp[1]);
    }

    async function login() {
        setLoading(true);
        const res = await fetch(url + "/api/neptun/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                neptun: neptun,
                password: password,
                code: code
            })
        });
        res.json().then((data) => {
            if (data.data && data.data.accessToken) {
                setAccessToken(data.data.accessToken);
                localStorage.setItem("tanulas.netlify.neptun", data.data.accessToken);
                localStorage.setItem("tanulas.netlify.neptun.login", JSON.stringify(new Date().getTime()));
                neptunAPI.refetch();
            } else {

                alert(data.modelStateErrors[0].errors[0]);
            }
            setLoading(false);
        }).catch((e) => {
            console.error(e);
            alert("Hibás adatok");
            setLoading(false);
        });
    }

    function copyCode() {
        navigator.clipboard.writeText(accesToken);
    }

    async function getFilterDatas(access: string) {

        let { term, subjectType, curriculum, group } = { term: "", subjectType: "", curriculum: "", group: "" };

        const resTerms = await fetch(url + "/api/neptun/terms", {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access}`
            }
        });
        await resTerms.json().then((data) => {
            if (data.message) {
                localStorage.removeItem("tanulas.netlify.neptun");
                logOut();
            } else {
                setTerms(data.data);
                setSelectedTerm(data.data[0].value);
                term = data.data[0].value;
            }
        });
        const resType = await fetch(url + "/api/neptun/subjectTypes", {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access}`
            }
        });
        await resType.json().then((data) => {
            if (data.message) {
                localStorage.removeItem("tanulas.netlify.neptun");
                setAccessToken("");
                logOut();

            } else {
                setSubjectTypes(data.data);
                setSelectedSubjectType(data.data[0].value);
                subjectType = data.data[0].value;
            }
        });
        const resCurr = await fetch(url + "/api/neptun/curriculum?" + `termId=${term}&subjectType=${subjectType}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access}`
            }
        });
        await resCurr.json().then((data) => {
            if (data.message) {
                localStorage.removeItem("tanulas.netlify.neptun");
                setAccessToken("");
                logOut();

            } else {
                setCurriculums(data.data);
                setSelectedCurriculum(data.data[0].value);
                curriculum = data.data[0].value;
            }
        });
        const resGroup = await fetch(url + "/api/neptun/subjectGroup?" + `termId=${term}&subjectType=${subjectType}&curriculumId=${curriculum}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access}`
            }
        });
        await resGroup.json().then((data) => {
            if (data.message) {
                localStorage.removeItem("tanulas.netlify.neptun");
                setAccessToken("");
                logOut();

            } else {
                setGroups(data.data);
                setSelectedGroup(data.data[0].value);
                group = data.data[0].value;
            }
        });
    }

    async function getSubjects() {
        const res = await fetch(url + "/api/neptun/subjects?" + `termId=${selectedTerm}&subjectType=${selectedSubjectType}&curriculumTemplateId=${selectedCurriculum}&subjectGroupId=${selectedGroup}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accesToken}`
            }
        });
        res.json().then((data) => {
            if (data.message) {
                localStorage.removeItem("tanulas.netlify.neptun");
                setAccessToken("");
                logOut();

            }
            setSubjects(data.data.gridData);
            return data.data.gridData;
        });
    }

    async function signInToSelectedSubjects() {
        indexingSignInToSelectedSubjects(0);
    }

    function indexingSignInToSelectedSubjects(index: number) {
        console.log(index);
        signingInToSubject(selectedSubject[index]).then((res) => res.json().then((data) => {
            if (!(index > selectedSubject.length - 1)) {
                indexingSignInToSelectedSubjects(index + 1);
                // alert(data.notification[0].description);
                setSignInCodes(signInCodes => [...signInCodes, { subject: selectedSubject[index], data: data }]);
                console.log(data);
            }
        }));
    }

    async function signingInToSubject(subject: any) {
        return await fetch(url + "/api/neptun/signin", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accesToken}`
            },
            body: JSON.stringify(subject)
        });
    }

    async function getSubjectDetail(subject: any) {
        setSubjectDetail({});
        const res = await fetch(url + "/api/neptun/subjectCourses" + `?subjectId=${subject.id}&curriculumTemplateId=${subject.curriculumTemplateId}&curriculumTemplateLineId=${subject.curriculumTemplateLineId}&termId=${subject.termId}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accesToken}`
            }
        });
        res.json().then((data) => {
            if (data.message) {
                localStorage.removeItem("tanulas.netlify.neptun");
                setAccessToken("");
                logOut();

            }
            let tmp: any = {};
            for (const e of data.data) {
                let temp = tmp[e.type] ? tmp[e.type] : [];
                temp.push({ id: e.id, classInstanceInfos: e.classInstanceInfos, teacher: e.tutorName, maxLimit: e.maxLimit, registeredStudentsCount: e.registeredStudentsCount, scheduledSubjectId: e.scheduledSubjectId });
                tmp[e.type] = temp;
                tmp.id = subject.id;
            }
            setSubjectDetail(tmp);
        });
    }

    function logOut() {
        fetch(url + "/api/neptun/logout", {
            method: "POST", headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accesToken}`
            }
        }).then(() => {
            setAccessToken("");
            setSubjects([]);
            setTerms([]);
            setSubjectTypes([]);
            setCurriculums([]);
            setGroups([]);
            setSelectedTerm("");
            setSelectedSubjectType("");
            setSelectedCurriculum("");
            setSelectedGroup("");
            setSubjectDetail({});
            setSelectedSubject([]);

            localStorage.removeItem("tanulas.netlify.neptun");
            localStorage.removeItem("tanulas.netlify.selectedSubject");
            localStorage.removeItem("tanulas.netlify.selectedSubjectTime");
            localStorage.removeItem("tanulas.netlify.neptun.login");

            window.location.reload();
        });
    }

    async function saveSubjectByName() {
        const res = await fetch(url + "/api/neptun/subjects?" + `termId=${selectedTerm}&subjectType=${selectedSubjectType}&curriculumTemplateId=${selectedCurriculum}&subjectGroupId=${selectedGroup}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accesToken}`
            }
        });
        res.json().then((data) => {
            if (data.message) {
                localStorage.removeItem("tanulas.netlify.neptun");
                setAccessToken("");
                logOut();
            }
            indexingSaveSubjectByName(0, subjects);
        });
    }


    async function indexingSaveSubjectByName(index: number, subjects: any[]) {
        const subject = selectedSubject[index];
        const res = await fetch(url + "/api/neptun/subjectCourses" + `?subjectId=${subject.subjectId}&curriculumTemplateId=${subject.curriculumTemplateId}&curriculumTemplateLineId=${subject.curriculumTemplateLineId}&termId=${subject.termId}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accesToken}`
            }
        });
        res.json().then((data) => {
            if (data.message) {
                localStorage.removeItem("tanulas.netlify.neptun");
                setAccessToken("");
                logOut();

            }

            const courses = data.data.filter((e: any) => subject.courseIds.find((c: any) => c == e.id)).map((e: any) => { return { code: e.code } });
            const choosedSubject = subjects.find((e: any) => e.id == subject.subjectId);
            // setSelectedSubjectByName(selectedSubjectByName => [...selectedSubjectByName, { code: choosedSubject.code, name: choosedSubject.title, courses: courses }]);
            selectedSubjectByNameRef.current.push({ code: choosedSubject.code, name: choosedSubject.title, courses: courses });

            if (selectedSubject.length - 1 > index) {
                indexingSaveSubjectByName(index + 1, subjects);
            } else {
                SaveIntoLocalStorage();
            }
        });
    }

    async function SaveIntoLocalStorage() {
        setSelectedSubjectByName(selectedSubjectByNameRef.current);
        setTimeout(() => { localStorage.setItem("tanulas.netlify.selectedSubjectByName", JSON.stringify(selectedSubjectByNameRef.current)); console.log(selectedSubjectByName) }, 10);
        alert("Everything is saved successfully!");
    }

    async function getSavedSubjects() {
        if (!localStorage.getItem("tanulas.netlify.selectedSubjectByName")) {
            return [];
        }
        setSelectedSubject([]);
        let subjs = [];
        let savedSubjs = JSON.parse(localStorage.getItem("tanulas.netlify.selectedSubjectByName") as string);
        const res = await fetch(url + "/api/neptun/subjects?" + `termId=${selectedTerm}&subjectType=${selectedSubjectType}&curriculumTemplateId=${selectedCurriculum}&subjectGroupId=${selectedGroup}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accesToken}`
            }
        });
        await res.json().then((data) => {
            if (data.message) {
                localStorage.removeItem("tanulas.netlify.neptun");
                setAccessToken("");
                logOut();
            }
            subjs = data.data.gridData;

            const tmp = subjs.filter((e: any) => savedSubjs.find((s: any) => s.code == e.code));
            indexingPasteSubjectByName(0, tmp, savedSubjs);
        });

    }

    async function indexingPasteSubjectByName(index: number, subjects: any[], savedSubjs: any[]) {
        const subject = subjects[index];
        const res = await fetch(url + "/api/neptun/subjectCourses" + `?subjectId=${subject.id}&curriculumTemplateId=${subject.curriculumTemplateId}&curriculumTemplateLineId=${subject.curriculumTemplateLineId}&termId=${subject.termId}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accesToken}`
            }
        });
        res.json().then((data) => {
            if (data.message) {
                localStorage.removeItem("tanulas.netlify.neptun");
                setAccessToken("");
                logOut();
            }

            if (subjects.length - 1 > index) {
                indexingPasteSubjectByName(index + 1, subjects, savedSubjs);
            }
            const courses = data.data.filter((e: any) => savedSubjs[index].courses.find((c: any) => c.code == e.code)).map((e: any) => { return e.id });
            const scheduledSubjectId = data.data[0].scheduledSubjectId;

            setSelectedSubject(selectedSubject => [...selectedSubject, { courseIds: courses, curriculumTemplateId: subjects[index].curriculumTemplateId, curriculumTemplateLineId: subjects[index].curriculumTemplateLineId, scheduledSubjectId: scheduledSubjectId, subjectId: subjects[index].id, termId: subjects[index].termId }]);
        });
    }

    function clearSaved() {
        setSelectedSubject([]);
        setSelectedSubjectTime([]);
        localStorage.removeItem("tanulas.netlify.selectedSubject");
        localStorage.removeItem("tanulas.netlify.selectedSubjectTime");
    }

    function clearSavedAll() {
        setSelectedSubject([]);
        setSelectedSubjectTime([]);
        setSelectedSubjectByName([]);
        localStorage.removeItem("tanulas.netlify.selectedSubject");
        localStorage.removeItem("tanulas.netlify.selectedSubjectTime");
        localStorage.removeItem("tanulas.netlify.selectedSubjectByName");
    }

    function calculateCredit() {
        let credit = 0;
        subjects.filter((e: any) => selectedSubject.find((s: any) => s.subjectId == e.id)).forEach((e: any) => {
            credit += e.credit;
        });
        return credit;
    }

    function calculateCreditRegistered() {
        let credit = 0;
        subjects.filter((e: any) => e.isRegistered).forEach((e: any) => {
            credit += e.credit;
        });
        return credit;
    }

    function calculateTime() {
        const logTime = localStorage.getItem("tanulas.netlify.neptun.login");
        if (!logTime) {
            return 0;
        }
        const now = new Date().getTime();
        const diff = now - parseInt(logTime);
        const time = 10 * 60 - Math.floor(diff / 1000);
        setTime(time);
    }

    useEffect(() => {
        setInterval(() => {
            if (localStorage.getItem("tanulas.netlify.neptun.login")) {
                calculateTime();
            }
        }, 1000);
    }, []);

    function correctTimeDisplayer() {
        return `${Math.floor(time / 60)}:${time % 60 < 10 ? '0' : ''}${time % 60}`;
    }

    return (
        <main className="flex flex-col min-h-screen gap-6 lg:p-12 lg:pt-24 p-6 pt-32 text-sm">
            <div className="flex w-full lg:justify-between lg:flex-row flex-col gap-6">
                <div>Neptun</div>

                {
                    !accesToken ?
                        <form className="flex lg:flex-row flex-col gap-2">
                            <input type="text" name="neptun" id="neptun" className="border rounded-md p-2" placeholder="Neptun" value={neptun} onChange={(e) => { setNeptun(e.target.value as any) }} />
                            <div className="border rounded-md flex gap-1 items-center pe-2">
                                <input type={passwordEye ? 'text' : 'password'} name="password" id="password" className="p-2 rounded" placeholder="Password" value={password} onChange={(e) => { setPassword(e.target.value as any) }} />
                                {
                                    !passwordEye ?
                                        <i className="pi pi-eye cursor-pointer" onClick={() => { setPasswordEye(true) }}></i>
                                        :
                                        <i className="pi pi-eye-slash cursor-pointer" onClick={() => { setPasswordEye(false) }}></i>
                                }
                            </div>
                            <input type="text" inputMode="numeric" pattern="[0-9\s]" name="code" id="code" className="border rounded-md p-2" placeholder="Code" value={code} onChange={(e) => { setCode(e.target.value as any) }} />
                            <button type="submit" disabled={loading} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center gap-1" onClick={login}>
                                {loading ? <i className="pi pi-spin pi-spinner"></i> : <></>}
                                Login
                            </button>
                        </form>
                        :
                        <div className="flex gap-2">
                            <div className="border p-2 rounded px-4 flex items-center gap-2">
                                {correctTimeDisplayer()}
                                <div className="text-gray-600 cursor-pointer flex" onClick={copyCode}>
                                    <div>Authorized</div>
                                    <i className="pi pi-copy text-sm"></i>
                                </div>
                            </div>
                            <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" onClick={logOut}>Log out</button>
                        </div>
                }


            </div>

            <div className="flex w-full gap-2 ">
                <main className={"flex flex-col gap-6 w-full " + (!isSigningIn ? "lg:w-3/4" : "lg:w-2/4")}>
                    {
                        accesToken &&
                        <>
                            <div className="flex lg:justify-between lg:flex-row flex-col w-full gap-2">
                                <Select options={terms} onChange={(e) => { setSelectedTerm(e.target.value) }} value={selectedTerm}></Select>
                                <Select options={subjectTypes} onChange={(e) => { setSelectedSubjectType(e.target.value) }} value={selectedSubjectType}></Select>
                                <Select options={curriculums} onChange={(e) => { setSelectedCurriculum(e.target.value) }} value={selectedCurriculum}></Select>
                                <Select options={groups} onChange={(e) => { setSelectedGroup(e.target.value) }} value={selectedGroup}></Select>
                                <button onClick={getSubjects} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded flex items-center gap-2"> <i className="pi pi-search"></i> Search</button>
                            </div>

                            <div className="flex lg:justify-between lg:flex-row flex-col w-full gap-2">
                                <div className="flex gap-2">
                                    <button onClick={clearSaved} className="bg-red-800 hover:bg-red-900 text-white font-bold py-2 px-4 rounded flex items-center gap-2"> <i className="pi pi-trash"></i>Clear</button>
                                    <button onClick={clearSavedAll} className="bg-red-800 hover:bg-red-900 text-white font-bold py-2 px-4 rounded flex items-center gap-2"> <i className="pi pi-trash"></i>Clear All</button>
                                    <a href="https://ttr.sze.hu/#/tantargy_lista/hu/IVIN_BMI_4" className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded flex items-center gap-2"> <i className="pi pi-book"></i> Tematika</a>
                                </div>
                                <div className="border-2 border-green-500 font-bold py-2 px-4 rounded flex items-center gap-2">
                                    {calculateCreditRegistered()} credit
                                </div>
                                <div className="border-2 border-orange-500 font-bold py-2 px-4 rounded flex items-center gap-2">
                                    {calculateCredit()} credit
                                </div>

                                <div className="flex gap-2">
                                    <button onClick={signInToSelectedSubjects} className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded flex items-center gap-2"> <i className="pi pi-sign-in"></i>Sign in</button>
                                    <button disabled={subjects.length == 0} onClick={saveSubjectByName} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center gap-2 disabled:bg-emerald-900 disabled:text-gray-400"> <i className="pi pi-save"></i>Save</button>
                                    <button onClick={getSavedSubjects} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center gap-2"> <i className="pi pi-history"></i>Paste</button>
                                </div>
                            </div>
                        </>
                    }

                    <div className="flex flex-col gap-2 justify-center w-full lg:text-md text-[0.8rem]">

                        {
                            subjects.map((row: any, i: number) => (
                                <div key={i} className={`flex flex-col w-full items-center p-3 border rounded-md hover:bg-gray-100 cursor-pointer ${checkIfSelectedSubject(row) ? "border-orange-400" : (row.isRegistered ? "border-green-400" : "")}`}>
                                    <div className="grid grid-cols-5 w-full items-center ">
                                        <div className="flex justify-start">
                                            {row.title}
                                        </div>
                                        <div className="flex justify-center col-span-3">
                                            <span className="lg:flex hidden">{row.subjectGroup}</span> - {row.credit} kredit -  <span className="lg:flex hidden">{row.requirementType} - {row.code}</span>
                                        </div>
                                        <div className="flex justify-end items-center text-gray-500">
                                            {row.isRegistered && <div className="bg-green-400 text-gray-100 flex items-center p-2 px-1 rounded"><i className="pi pi-check"></i></div>}
                                            {checkIfSelectedSubject(row) && <div className="bg-orange-500 text-gray-100 px-2 p-1 rounded">!</div>}
                                            <i className="pi pi-ellipsis-v cursor-pointer text-[0.4rem]" onClick={() => { getSubjectDetail(row) }}></i>
                                        </div>
                                    </div>
                                    {
                                        subjectDetail.id == row.id &&
                                        <div className="w-full">
                                            {
                                                Object.keys(subjectDetail).filter(key => key != 'id').map((key: any, i: number) => (
                                                    <div key={i} className="flex flex-col gap-2 w-full pt-2">
                                                        <div className="flex justify-between w-full items-center bg-gray-100 p-2 rounded-md">
                                                            <div>{key}</div>
                                                        </div>
                                                        {
                                                            subjectDetail[key].map((e: any, i: number) => (
                                                                <div key={i} className="grid grid-cols-4 justify-between w-full items-center p-2 border rounded-md">
                                                                    <div className="flex gap-2 justify-start">
                                                                        {
                                                                            e.classInstanceInfos.map((c: any, i: number) => (
                                                                                <div key={i} className="flex gap-1">
                                                                                    <div className={`font-bold ${checkIfSelectedSubjectTime(c) ? "text-red-400" : ""}`}>{c.startTime} - {c.endTime}</div>
                                                                                    <div>{c.dayOfWeekText}</div>
                                                                                    <div className="text-[0.6rem]">{c.rooms}</div>
                                                                                </div>
                                                                            ))
                                                                        }
                                                                    </div>

                                                                    <div className="flex justify-center">
                                                                        {e.registeredStudentsCount}/{e.maxLimit}
                                                                    </div>

                                                                    <div className="flex justify-center">
                                                                        {e.teacher}
                                                                    </div>

                                                                    <div className="flex justify-end">
                                                                        {
                                                                            checkIfSelectedSubjectCourse(row, e) ?
                                                                                <button className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded flex items-center gap-2" onClick={() => { chooseSubject(row, e) }}> <i className="pi pi-check-circle"></i> Selected</button>
                                                                                :
                                                                                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center gap-2" onClick={() => { chooseSubject(row, e) }}><i className="pi pi-circle"></i> Select</button>
                                                                        }
                                                                    </div>
                                                                </div>
                                                            ))
                                                        }
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    }
                                </div>

                            ))
                        }

                    </div>
                </main>

                <main className={"flex flex-col gap-6 w-full " + (!isSigningIn ? "lg:w-1/4" : "lg:w-1/2")}>

                    <button className="border w-fit p-2 flex items-center rounded-md" onClick={() => { setIsSigningIn(!isSigningIn) }}>
                        {
                            isSigningIn ?
                                <i className="pi pi-server"></i> : <i className="pi pi-code"></i>
                        }
                    </button>

                    {
                        isSigningIn ?
                            <pre className="w-full p-4 bg-stone-600 text-gray-100 rounded-md overflow-x-auto">
                                <code>{JSON.stringify(signInCodes, null, 2)}</code>
                            </pre>
                            :
                            <>
                                <pre className="w-full p-4 bg-stone-600 text-gray-100 rounded-md overflow-x-auto">
                                    <code>{JSON.stringify(selectedSubject, null, 2)}</code>
                                </pre>

                                <pre className="w-full p-4 bg-stone-600 text-gray-100 rounded-md overflow-x-auto">
                                    <code>{JSON.stringify(selectedSubjectByName, null, 2)}</code>
                                </pre>
                            </>
                    }
                </main>
            </div>
        </main>
    )
}


function Select({ options, value, onChange }: { options: any, value: any, onChange: (e: any) => void }) {
    return (
        <select name="" id="" value={value} onChange={onChange} className="border rounded-md p-2 w-full">
            {
                options.map((row: any, i: number) => (
                    <option key={i} value={row.value}>{row.text}</option>
                ))
            }
        </select>
    )
}