"use client";
import { useState } from "react";

export default function Home() {

    const [fileContent, setFileContent] = useState('');
    const [splitter, setSplitter] = useState('');
    const [questionS, setQS] = useState('');
    const [answerS, setAS] = useState('');

    const handleFileChange = async (e: any) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = async (event: any) => {
            const content = event.target.result;
            setFileContent(content);
        };

        reader.readAsText(file);
    };

    function Download() {
        const file = fileContent.split(splitter == "rn" ? "\r\n" : splitter == "n" ? "\n" : splitter);
        let jsonData: any = [];
        let json: any = { question: "", answers: [] };
        file.forEach((item) => {
            if (item.trim() != "") {
                if (/\d+\./.test(item)) {
                    if (json.question != "" && json.answers.length != 0) { jsonData.push(json); json = { question: "", answers: [] }; }

                    json.question = item.replace(/\d+\.\t/, "").trim();
                }
                if (item.includes(answerS)) { json.answers.push(item.replace(answerS, "").trim()) }
            }
        })

    }

    return (
        <main className="mt-16 flex justify-center items-center flex-col gap-4">
            <h1>JSON Converter</h1>
            <input onChange={handleFileChange} accept=".txt" className="block w-fit text-sm text-gray-900 border border-gray-300 cursor-pointer bg-gray-50 focus:outline-none" id="file_input" type="file" />
            <button onClick={Download} className="border border-blue-800 border-red-800  bg-red-800 text-white flex items-center justify-center p-1 rounded-md cursor-pointer hover:bg-gray-600 hover:text-blue-800 text-red-800 duration-100">
                Download
            </button>
            <input type="text" id="" onChange={(e) => { setSplitter(e.target.value) }} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-fit p-2.5" placeholder="Splitter" required />
            <input type="text" id="" onChange={(e) => { setQS(e.target.value) }} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-fit p-2.5" placeholder="Question start" required />
            <input type="text" id="" onChange={(e) => { setAS(e.target.value) }} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-fit p-2.5" placeholder="Answer start" required />
        </main>
    )
}