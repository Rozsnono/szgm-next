"use client";
import Form from "@/components/form";
import UserContext, { Coder } from "@/context/user.context";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";

export default function Home() {


    const router = useRouter();


    const [TMPuser, setTMPUser] = useState('');
    const [pass, setPass] = useState('');
    const [isLoading, setIsloading] = useState(false);

    const { user, setUser } = useContext<any>(UserContext);
    const [checkUser, setCheckUser] = useState<any | null>(undefined);

    const [message, setMessage] = useState<any>();
    useEffect(() => { if (user) { router.replace("/") } }, [user, router])

    useEffect(() => {
        if (user !== undefined) {
            setCheckUser(user);
        }
    }, [user])


    async function logining() {
        if (isLoading) return;
        login(TMPuser, pass);
    }

    async function login(user: string, password: string) {
        setIsloading(true);
        let data = { ip: "1.1.1.1" };
        try {
            const res = await fetch("https://api.ipify.org/?format=json");
            data = await res.json();
        } catch (error) {
            data = { ip: "0.0.0.0" };
        }

        const res2 = await fetch("https://szgm-next-server.onrender.com/api/user?user=" + user + "&password=" + Coder(password) + "&ip=" + data.ip);
        const data2 = await res2.json();
        try {
            if (data2.length !== 0 && data2[0].user) {
                localStorage.setItem("6429FC567AB4618A", JSON.stringify(data2[0]));
                window.location.reload();
                setIsloading(false);
            }
        } catch (error) {
            setMessage("User not found");
            setIsloading(false);

        }

    }


    return (
        <main className="flex flex-col min-h-screen gap-6 lg:p-12 lg:pt-24 p-6 pt-32">
            <div className="flex flex-col gap-4 mx-auto bg-white p-6 rounded-lg shadow-lg">
                <div className="flex flex-col gap-4">
                    <input value={TMPuser} onChange={(e) => setTMPUser(e.target.value)} type="text" placeholder="Username" className="p-2 border-2 rounded-lg border-gray-300" />
                    <input value={pass} onChange={(e) => setPass(e.target.value)} type="password" placeholder="Password" className="p-2 border-2 rounded-lg border-gray-300" />
                    <button className="p-2 bg-red-500 text-white rounded-lg" onClick={logining}>Login</button>
                </div>
            </div>
        </main>
    )
}