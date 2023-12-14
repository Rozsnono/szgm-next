"use client"

import { useRef, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import MEMR from "../../txts/memr-v.json";
import { useQuery } from "react-query";
import { InputText } from "primereact/inputtext"; import { Chips } from "primereact/chips";


export default function Home() {

    const isMobile = useRef(false);

    const param = useParams();

    const [label, setLabel] = useState("");
    const [text, setText] = useState("");

    const [json, setJson] = useState<Array<any>>(MEMR);

    function getData() {
        try {
            const prevData = MEMR;

            setJson(prevData);

            return prevData;
        } catch (error: Error | any) {      //muszáj így megadni, mert különben hibát dob
            console.error(error);
            return error;
        }

    }

    const [value, setValue] = useState('' as string | any);

    const memr: any = useQuery('memrv', getData);

    function search(value: string) {
        let tmp: any = [];
        if(value.length == 0 ){return memr.data};
        for (const i of value) {
            const m = memr.data.filter((item: any) => item.text.filter((t: any) => t.toLowerCase().includes(i.toLowerCase())).length > 0 || item.label.toLowerCase().includes(i.toLowerCase()));
            tmp = [...tmp, ...m];
        }
        return tmp.filter((item: any, index: number) => tmp.indexOf(item) === index);
    }

    function addJson() {
        const data = {
            label: label,
            text: text.replaceAll("●", "").replaceAll("● ", "").trim().split("\n")
        };
        setJson([...json, data]);
        setText("");
        setLabel("");
    }

    function getSearch(e: any) {
        setJson(search(value));
    }

    const downloadFile = () => {
        // Convert the array to a JSON string
        const jsonString = JSON.stringify(json);

        // Create a Blob containing the JSON data
        const blob = new Blob([jsonString], { type: 'application/json' });

        // Create a download link
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = "memr-fos.json" || 'download.json';

        // Append the link to the document
        document.body.appendChild(link);

        // Trigger the download
        link.click();

        // Remove the link from the document
        document.body.removeChild(link);

        // Revoke the Blob URL to free up resources
        URL.revokeObjectURL(url);
    };

    const handleFileChange = (event: any) => {
        const file = event.target.files[0];

        if (file) {
            const reader = new FileReader();

            reader.onload = (e: any) => {
                try {
                    // Parse the JSON data from the file
                    const parsedData = JSON.parse(e.target.result);
                    setJson(parsedData);
                } catch (error) {
                    console.error('Error parsing JSON:', error);
                    setJson([]);
                }
            };

            // Read the contents of the file as text
            reader.readAsText(file);
        }
    };


    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        isMobile.current = true;
    }

    return (
        <main className={"flex flex-col lg:pt-14 py-12 text-lg bg-gray-100 gap-4"}>
            {/* <div className="flex lg:flex-row flex-col gap-2 mt-1 p-2 border rounded-lg justify-center items-center fixed w-screen bg-gray-200">
                <input type="text" className="w-1/2 my-2 rounded-md p-1" value={label} onChange={(e) => { setLabel(e.target.value) }} />
                <textarea name="" id="" className="w-full rounded-md p-1" value={text} onChange={(e) => { setText(e.target.value) }}></textarea>
                <div className="flex gap-2">
                    <button onClick={addJson} className="border border-green-400 rounded-lg bg-green-400 text-white font-bold p-2">Add</button>
                    <button onClick={downloadFile} className="border border-blue-400 rounded-lg bg-blue-400 text-white font-bold p-2">Download</button>
                    <input type="file" accept=".json" onChange={handleFileChange} />
                </div>
            </div> */}
            <div className="flex gap-3 lg:w-1/3 w-full mt-8 px-3">
                <span className="p-float-label w-full ">
                    <Chips className={"w-full " + (!memr.isLoading && memr.data.length === 0 && value != null ? "p-invalid" : "")} id="search" value={value} onChange={(e) => { setValue(e.target.value); }} />
                    <label htmlFor="search">Keresés</label>
                </span>
                <button onClick={getSearch} className="border border-blue-400 rounded-lg bg-blue-400 text-white font-bold p-2">Search</button>

            </div>
            <div className="lg:px-16 px-2 gap-2 flex flex-col lg:mt-12 mt-6">
                {
                    json.map((item: any, index: number) => {
                        return (
                            <div key={index} className="flex flex-col gap-1 border border-gray-500 rounded-lg p-2">
                                <div className="font-bold">{item.label}</div>
                                {item.text.map((text: any, index: number) => {
                                    return (
                                        <div key={index}>{text}</div>
                                    )
                                })}
                            </div>
                        )
                    })
                }
            </div>
        </main>
    );
}