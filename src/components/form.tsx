import React, { useContext, useEffect, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Password } from 'primereact/password';
import "./loading.css";
import UserContext, { Coder, register } from "@/context/user.context";

export default function Form({
    children,
}: {
    children: React.ReactNode
}) {


    const [TMPuser, setTMPUser] = useState('');
    const [pass, setPass] = useState('');
    const path = usePathname();
    const [isLoading, setIsloading] = useState(false);

    const { user, setUser } = useContext<any>(UserContext);
    const [checkUser, setCheckUser] = useState<any | null>(undefined);

    const [message, setMessage] = useState<any>();

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

    const urls = ["/subjects-planner", "/subjects"]

    return (
        <main className="fixed top-0 p-2 flex justify-center items-center w-screen h-screen bg-white overflow-hidden" style={{ zIndex: 1001 }}>
            {/* <div className="mx-auto flex flex-col bg-white border-2 border-red-500 gap-6 p-6 rounded-lg h-fit" style={{ zIndex: 102 }}>
                <span className="p-float-label">
                    <InputText id="username" value={TMPuser} onChange={(e) => setTMPUser(e.target.value)} />
                    <label htmlFor="username">Username</label>
                </span>
                <span className="p-float-label">
                    <Password id="password" value={pass} onChange={(e) => setPass(e.target.value)} feedback={false} tabIndex={1} />
                    <label htmlFor="password">Password</label>
                </span>
                <div className="text-red-500">{message}</div>

                <div className={"w-full rounded-full border-red-500 bg-white border-2 text-red-500 duration-100 text-center " + (isLoading ? "" : "hover:bg-red-500 hover:text-white cursor-pointer")} onClick={logining}>{isLoading ? "Logging in..." : "Login"}</div>
            </div> */}
        </main>

    )
}


import { SelectButton } from 'primereact/selectbutton';
import { usePathname } from "next/navigation";
import { set } from "mongoose";

export function Register() {


    const [user, setUser] = useState('');
    const [pass, setPass] = useState('');
    const [role, setRole] = useState(0);

    const options = [
        { icon: 'pi pi-user-plus', name: "Owner", value: 1 },
        { icon: 'pi pi-user-edit', name: "Admin", value: 2 },
        { icon: 'pi pi-user', name: "User", value: 3 },
    ];

    const template = (option: any) => {
        return <div className="flex gap-1 items-center"><i className={option.icon}></i> {option.name}</div>;
    }


    const [message, setMessage] = useState<any>();

    function logining() {
        register(user, pass, role);
    }


    return (
        <main className="fixed top-0 p-2 flex justify-center items-center w-screen" style={{ zIndex: 1001 }}>
            <div className="mx-auto flex flex-col bg-gray-600 border-2 border-rose-800 border-red-800 gap-6 p-6 rounded-lg justify-center" >
                <span className="p-float-label w-full">
                    <InputText id="username" value={user} onChange={(e) => setUser(e.target.value)} className="w-full" />
                    <label htmlFor="username">Username</label>
                </span>
                <span className="p-float-label w-full">
                    <Password id="password" value={pass} onChange={(e) => setPass(e.target.value)} feedback={false} tabIndex={1} className="w-full" toggleMask />
                    <label htmlFor="password">Password</label>
                </span>

                <SelectButton value={role} onChange={(e) => setRole(e.value)} itemTemplate={template} optionLabel="value" options={options} />

                <div className="w-full rounded-full border-rose-800 border-red-800 bg-gray-600 border-2 text-rose-800 text-red-800 hover: hover:bg-red-800 hover:text-white duration-100 text-center cursor-pointer" onClick={logining}>Register</div>
            </div>
        </main>
    )
}