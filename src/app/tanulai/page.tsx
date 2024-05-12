"use client";
import { Icons } from "@/context/icons.enum";
import UserContext from "@/context/user.context";
import { useContext, useState } from "react";
import { useQuery } from "react-query";
import "./dots.css";
import { Tooltip } from "primereact/tooltip";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Page() {

    const { user } = useContext(UserContext);

    const [message, setMessage] = useState<string>("");
    const [isLoading, setIsloading] = useState<boolean>(false);
    const [response, setResponse] = useState<any[]>([]);
    const [ai, setAi] = useState<any>({});

    const params = useSearchParams();
    const router = useRouter();

    async function getAI() {

        const res = await fetch("https://troubled-underwear-frog.cyclic.appapi/ai-all?user_id=" + user?._id, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
        });
        const data = await res.json();

        if (params.get("id")) {
            setAi(data.filter((item: any) => item._id === params.get("id"))[0]);
            setResponse(data.filter((item: any) => item._id === params.get("id"))[0].messages);
        } else {
            setAi(data[0]);
            setResponse(data[0].messages);
        }

        return data;
    }

    const ais = useQuery<any[]>('ai', getAI);


    function handler(e: any) {
        if (e.key === "Enter") { send(); }
    }


    function dots() {
        return (
            <div className="flex gap-2 items-center justify-center relative rings">
                <div className="ring-1"></div>
                <div className="ring-2"></div>
                <div className="ring-3"></div>
            </div>
        )
    }

    const [copy, setCopy] = useState<boolean>(false);

    function codeDisplay(code: string) {
        return (
            <pre className="relative">
                <Tooltip target=".copy" autoHide={false} position={"left"}>
                    <div>{copy ? "Másolva!" : "Másolás"}</div>
                </Tooltip>
                <div onMouseLeave={() => { setCopy(false) }} className="absolute top-1 right-1  bg-red-800 text-gray-900  p-1 rounded-lg text-xs copy cursor-pointer" onClick={() => { navigator.clipboard.writeText(code.replaceAll(/`{3}/g, '') as string); setCopy(true) }}><i className="pi pi-copy"></i></div>
                {code.replaceAll(/`{3}/g, '')}
            </pre>
        )
    }


    async function send() {
        if (isLoading) return;

        setResponse([...response, { role: "user", message: message }, { role: "ai", message: dots() }]);
        const tmpMessage = message;
        setIsloading(true);
        setMessage("");
        const res = await fetch("https://troubled-underwear-frog.cyclic.appapi/ai", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ message: tmpMessage, id: ai._id, user_id: user?._id })
        });
        const data = await res.json();
        setIsloading(false);
        setResponse([...response, { role: "user", message: tmpMessage }, { role: "ai", message: data.message }]);
    }

    async function create() {
        const res = await fetch("https://troubled-underwear-frog.cyclic.appapi/ai-new", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ message: message, user_id: user?._id })
        });
        const data = await res.json();
        router.replace("/tanulai?id=" + data.id);
    }


    return (
        <main className="lg:pt-24 pt-32 lg:p-8 p-4 text-md flex lg:flex-row flex-col justify-center gap-4">
            <div className="lg:flex hidden lg:w-1/4 w-full flex-col relative">
                <div className="lg:fixed flex lg:flex-col flex-row gap-4 overflow-auto">
                    <div onClick={create} className=" border border-blue-800 border-red-800 flex items-center gap-1 rounded-lg p-2 w-fit text-blue-800 text-red-800 font-bold cursor-pointer hover: hover:bg-red-800 hover:text-white duration-200">
                        Új chat
                        <i className="pi pi-comment"></i>
                    </div>
                    <div className="flex flex-col gap-2">
                        {!ais.isLoading && ais.data && ais.data.map((item, index) => {
                            return (
                                <>
                                {(index == 0 || (index > 0 && new Date(ais.data[index - 1].date).getDate() !== new Date(item.date).getDate())) ? <div className="text-center text-gray-500">{new Date(item.date).toLocaleDateString()}</div> : <></>}
                                <Link href={"/tanulai?id=" + item._id} onClick={()=>{ais.refetch()}} className="border p-2 rounded-lg cursor-pointer label w-32" key={index}>{item.messages.length > 0 ? item.messages[item.messages.length - 2].message : "Új chat"}</Link>
                                </>
                            )
                        })}
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-4 w-full items-center">
                <div className="flex flex-col gap-2 w-full">
                    {
                        response.map((item, index) => {
                            if (item.role === "ai") {
                                return (
                                    <div key={index} className="flex flex-row gap-2 items-center max-w-full">
                                        <i className="pi pi-user"></i>
                                        <div className="bg-blue-700 bg-red-700 text-white rounded-lg p-2 flex flex-col gap-1">{typeof item.message == typeof "" ? item.message.split("\n\n").map((row: any) => {
                                            return <div key={row} className="">{row.includes("```") ? codeDisplay(row) : row}</div>
                                        }) : item.message}</div>
                                    </div>
                                )
                            } else {
                                return (
                                    <div key={index} className="flex flex-row gap-2 items-center justify-end">
                                        <p className="bg-gray-600 text-blue-800 text-red-800 border border-blue-800 border-red-800 rounded-lg p-2">{item.message}</p>
                                    </div>
                                )
                            }
                        })
                    }
                </div>
                <div className="border border-red-700 rounded-full overflow-hidden lg:w-1/2 flex items-center">
                    <input type="text" style={{ outline: "none" }} className="w-full px-4 p-2" placeholder="Üzenet" onChange={(e) => { setMessage(e.target.value) }} value={message} onKeyDown={handler} />
                    <button className="text-blue-800 text-red-800 px-4" onClick={send} >
                        {isLoading ? <i className="pi pi-spin pi-spinner"></i> :
                            <i className="pi pi-send"></i>
                        }
                    </button>
                </div>
            </div>
            <div className="w-1/4"></div>


        </main>
    )
}