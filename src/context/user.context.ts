"use client"
import User from "../txts/users.json";

import React, { createContext, useContext } from 'react'

const UserContext = createContext({ user: {} as { _id: string, user: string, password: string, role: number, savedSubjects: any, savedTematiks: any, planedSubjects: any } | null, setUser: (user: { user: string, password: string, role: number } | null) => { } });

export default UserContext;

export async function login(user: string, password: string) {
    await fetch("https://sze-szerver.cyclic.app//api/user?user=" + user + "&password=" + Coder(password)).then(res => res.json()).then(data => {
        if (data.length !== 0 && data.user) {
            localStorage.setItem("6429FC567AB4618A", JSON.stringify(data[0]));
            window.location.reload();
            return { message: "User logged in", user: data[0] };

        }
        return { error: "User not found" };
    }
    );
}

export async function register(user: string, password: string, role: number) {
    User.push({ user: user, password: Coder(password), role: role });

    await fetch("https://sze-szerver.cyclic.app//api/user", { method: "POST", body: JSON.stringify({ user: user, password: Coder(password), role: role }), headers: { "Content-Type": "application/json" } })
}

export function logout() {
    localStorage.removeItem("6429FC567AB4618A");
}

export function Coder(string: string) {
    let returnString = "";
    for (let i = 0; i < string.length; i++) {
        returnString += String.fromCharCode(string.charCodeAt(i) + i);
    }
    returnString = returnString.split("").reverse().join("");
    returnString = btoa(returnString);
    let newString = "";
    for (let i = 0; i < string.length; i++) {
        newString += returnString.charCodeAt(i).toString(16)
    }
    return newString;
}