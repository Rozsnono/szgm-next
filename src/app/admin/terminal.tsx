import { useEffect, useRef, useState } from "react";
import "./admin.css"
import { ScrollPanel } from 'primereact/scrollpanel';

export default function Terminal({ commandHandler, response, users }: { commandHandler: (text: string) => void, response: string[], users: any[] }) {

    // const [response, setResponse] = useState<string[]>([]);

    const [command, setCommand] = useState<string>("");

    const [commandHistory, setCommandHistory] = useState<string[]>([]);

    const commander = useRef<HTMLDivElement | any>()

    const [historyIndex, setHI] = useState<number>(0);

    useEffect(() => {
        commander.current?.scrollIntoView({ behavior: 'smooth' });
    })

    function handler(e: any) {
        if (e.key === "Enter") { console.log(command); commandHandler(command); setCommand(""); setCommandHistory([...commandHistory, command]) }
        if (e.key === "ArrowUp") {
            if (command.includes("unban ")) {
                setCommand(c => command.slice(0, 6) + users[historyIndex].user);
                setHI(h => users.length - 1 > h ? h + 1 : 0);
            }
            else if (command.includes("log ") || command.includes("ban ")) {
                setCommand(c => command.slice(0, 4) + users[historyIndex].user);
                setHI(h => users.length - 1 > h ? h + 1 : 0);
            }
            else {
                setCommand("" + commandHistory[commandHistory.length - 1]);

            }
        }
    }

    return (
        <label className="w-full h-full border border-gray-600 bg-gray-100 rounded-md p-1" htmlFor="command"  >
            <ScrollPanel style={{ width: '100%', height: '100%' }} className="">
                {response.map((item, index) => { return (<p key={index}> {item} </p>) })}
                <div ref={commander} className="flex">
                    {">"}
                    <input type="text" id="command" onChange={(e) => { setCommand(e.target.value) }} value={command} autoFocus className="border-0 ms-1 admin-terminal-input bg-gray-100 w-full" onKeyDown={(e) => { handler(e) }} />
                </div>
            </ScrollPanel>
        </label>
    )
}