"use client";
import { Icons } from "@/context/icons.enum";
import UserContext from "@/context/user.context";
import { useContext, useState } from "react";
import { useQuery } from "react-query";

export default function Page() {

    const { user } = useContext(UserContext);

    const [message, setMessage] = useState<string>("");
    const [isLoading, setIsloading] = useState<boolean>(false);
    const [response, setResponse] = useState<any[]>([]);

    async function getAI() {
        const res = await fetch("https://sze-szerver.cyclic.app//api/ai?user_id="+user?._id, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
        });
        const data = await res.json();
        setResponse(data[0].messages);
        return data;
    }

    const users = useQuery<any[]>('ai', getAI);
    

    function handler(e: any) {
        if (e.key === "Enter") { send(); }
    }




    async function send() {
        if (isLoading) return;
        setResponse([...response, { role: "user", message: message }, { role: "ai", message: "..." }]);
        const tmpMessage = message;
        setIsloading(true);
        setMessage("");
        const res = await fetch("https://sze-szerver.cyclic.app//api/ai", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ message: tmpMessage, user_id: user?._id })
        });
        const data = await res.json();
        setIsloading(false);
        setResponse([...response, {role: "user", message: tmpMessage},{ role: "ai", message: data.message }]);
    }


    return (
        <main className="lg:pt-24 pt-32 lg:p-8 p-4 text-md flex flex-col items-center gap-4">
            <div className="flex flex-col gap-2 lg:w-1/2 w-full">
                {
                    response.map((item, index) => {
                        if (item.role === "ai") {
                            return (
                                <div key={index} className="flex flex-row gap-2 items-center">
                                    <i className="pi pi-user"></i>
                                    <p className="bg-blue-700 text-white rounded-lg p-2">{item.message}</p>
                                </div>
                            )
                        } else {
                            return (
                                <div key={index} className="flex flex-row gap-2 items-center justify-end">
                                    <p className="bg-white text-blue-800 border border-blue-800 rounded-lg p-2">{item.message}</p>
                                </div>
                            )
                        }
                    })
                }
            </div>
            <div className="border border-blue-700 rounded-full overflow-hidden lg:w-1/2 flex items-center">
                <input type="text" style={{ outline: "none" }} className="w-full px-4 p-2" placeholder="Üzenet" onChange={(e) => { setMessage(e.target.value) }} value={message} onKeyDown={handler} />
                <button className="text-blue-800 px-4" onClick={send} >
                    {isLoading ? <i className="pi pi-spin pi-spinner"></i> :
                        <i className="pi pi-send"></i>
                    }
                </button>
            </div>

        </main>
    )
}