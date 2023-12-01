"use client"
import { useQuery } from "react-query";
import { InputText } from "primereact/inputtext";
import { Dropdown } from 'primereact/dropdown';
import { useContext, useEffect, useState } from "react";
import UserContext from "@/context/user.context";


// import { Terminal } from 'primereact/terminal';
import { TerminalService } from 'primereact/terminalservice';
import Terminal from "./terminal";

export default function Home() {

    const { user } = useContext(UserContext)


    if (typeof window !== "undefined") {
        if (!user?.user || user.role === 3) {
            window.location.href = "/"
        }
    }

    async function getData() {
        const res = await fetch("https://szgm-next-server-production.up.railway.app/api/logs");
        const data = await res.json();
        return data;
    }

    async function getUsers() {
        const res = await fetch("https://szgm-next-server-production.up.railway.app/api/users");
        const data = await res.json();
        return data;
    }

    function banUser() {
        fetch("https://szgm-next-server-production.up.railway.app/api/user/" + choosen._id + "/" + !choosen.isDeleted, { method: "DELETE" })
    }

    const data = useQuery<any[]>('database', getData);
    const users = useQuery<any[]>('users', getUsers);
    const [choosen, setChoosen] = useState<any>(null);

    const [response, setResponse] = useState<string[]>([""]);

    const commandHandler = (text: string) => {
        let tmpResponse: null | string[] = [];
        let argsIndex = text.indexOf(' ');
        let command = argsIndex !== -1 ? text.substring(0, argsIndex) : text;

        switch (command.toLocaleLowerCase()) {

            case "logs":
                tmpResponse = (data.data?.map((item: any, index: number) => { return "|   " + new Date(item.date).toLocaleDateString("hu-HU", {month: 'long',day: 'numeric', hour:"2-digit", minute:"2-digit"}) + " - " + item.log }) as string[]).reverse();
                break;

            case "log":
                tmpResponse = (data.data?.filter((item) => { return item.log.includes(text.substring(argsIndex + 1)) }).map((item: any, index: number) => { return "|      " + new Date(item.date).toLocaleDateString("hu-HU", {month: 'long',day: 'numeric', hour:"2-digit", minute:"2-digit"}) + " - " + item.log }) as string[]).reverse();
                break;

            case "list":
                tmpResponse = (users.data?.map((item: any, index: number) => { return "|   " + item.user }) as string[]).reverse();
                break;

            case "ban":
                setChoosen(users.data?.filter((item) => { return item.user === text.substring(argsIndex + 1) })[0]);
                const banUser = users.data?.filter((item) => { return item.user === text.substring(argsIndex + 1) })[0];
                tmpResponse = ["|    User banned: " + banUser.user];
                fetch("https://szgm-next-server-production.up.railway.app/api/user/" + banUser._id + "/" + true, { method: "DELETE" })
                break;

            case "unban":
                setChoosen(users.data?.filter((item) => { return item.user === text.substring(argsIndex + 1) })[0]);
                const banUser2 = users.data?.filter((item) => { return item.user === text.substring(argsIndex + 1) })[0];
                tmpResponse = ["|    User unbanned: " + banUser2.user];
                fetch("https://szgm-next-server-production.up.railway.app/api/user/" + banUser2._id + "/" + false, { method: "DELETE" })
                break;

            case 'clear':
                tmpResponse = null;
                break;

            case 'help':
                tmpResponse = [
                    "Available commands:",
                    "- logs",
                    "- log <username>",
                    "- ban <username>",
                    "- unban <username>",
                    "- clear",
                    "- help",
                    "- list users",
                ]
                break;
            default:
                tmpResponse = ['Unknown command: ' + command];
                break;
        }

        if (tmpResponse) {
            tmpResponse.unshift("> " + text);
            setResponse([...response, ...tmpResponse]);
        } else {
            setResponse([]);
        }
    };

    useEffect(() => {
        TerminalService.on('command', commandHandler);

        return () => {
            TerminalService.off('command', commandHandler);
        };
    }, []);

    return (
        <main className="flex flex-col min-h-screen gap-2 lg:p-12 lg:pt-24 p-6 pt-32 text-sm">
            {
                !users.isLoading && users.data ?
                    <div className="flex gap-2">
                        <Dropdown value={choosen} onChange={(e) => setChoosen(e.value)} options={users.data} optionLabel="user"
                            placeholder="Users" className="w-fit" />
                        <div onClick={banUser} className="border border-blue-800 bg-blue-800 text-white flex items-center justify-center p-2 rounded-md cursor-pointer hover:bg-white hover:text-blue-800 duration-100">{choosen && choosen.isDeleted ? "Unban" : "Ban"}</div>
                    </div> : <></>
            }
            <div className="w-full h-[80vh] flex flex-col">
                {/* <Terminal
                    welcomeMessage={`Welcome ${user?.user} on the admin site, what should I do for you?`}
                    prompt="sze$" className="h-full"

                    pt={{
                        root: { className: 'bg-gray-100 text-gray-800' },
                        welcomeMessage: { className: 'text-gray-800 font-bold' },
                        command: { className: 'text-black font-thin' },
                        prompt: { className: 'text-black font-thin' },
                        response: { className: 'text-gray-600 font-thin' }
                    }}
                /> */}
                {!users.isLoading && users.data &&
                    <Terminal commandHandler={commandHandler} response={response} users={users.data}></Terminal>
                }

                {/* {!data.isLoading && data.data
                    ? data.data.map((item: any, index: number) => {
                        return (
                            <div key={index}
                                className={"flex justify-between px-2"}
                            >
                                <div className="flex">

                                    <p className="border-r border-gray-400 w-[2rem] text-end pe-1 me-1 text-sm text-gray-400">{index}</p>
                                    <p className="flex-none w-[4.2rem]">
                                        {
                                            new Date(item.date).toLocaleTimeString("hu-HU", { hour: '2-digit', minute: '2-digit', second: '2-digit' })
                                        }:
                                    </p>

                                    <p className={"font-bold flex-1" + (item.log.includes("tried") ? " text-red-900" : "")}>{item.log}</p>
                                </div>

                                <div>
                                    <p className="text-gray-500">{item.ip}</p>
                                </div>

                            </div>
                        );
                    })
                    : null} */}
            </div>


        </main>
    );
}
