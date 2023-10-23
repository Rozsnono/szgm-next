"use client"
import User from "../txts/users.json";

import React, { createContext, useContext } from 'react'

const UserContext = createContext({ user: {} as {user: string, password: string, role: number} | null, setUser: (user: {user: string, password: string, role: number} | null) => { }});

export default UserContext;

export function login(user: string, password: string){

    const checkUser = User.filter((u) => u.user === user && u.password === Coder(password));
    if(checkUser.length !== 0){
        localStorage.setItem("user", JSON.stringify(checkUser[0]));
        return {message: "User logged in", user: checkUser[0]};
    }
    return {error: "User not found"};
}

export function register(user: string, password: string, role: number){
    User.push({user: user, password: Coder(password), role: role});
    console.log(JSON.stringify({user: user, password: Coder(password), role: role}))
}

export function logout(){
    localStorage.removeItem("user");

}

function Coder(string: string){
    let returnString = "";
    for(let i = 0; i < string.length; i++){
        returnString += String.fromCharCode(string.charCodeAt(i) + i);
    }
    returnString = returnString.split("").reverse().join("");
    returnString = btoa(returnString);
    let newString = "";
    for(let i = 0; i < string.length; i++){
        newString += returnString.charCodeAt(i).toString(16)
    }
    return newString;
}