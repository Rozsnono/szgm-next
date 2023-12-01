"use client";
import Form from "@/components/form";
import UserContext from "@/context/user.context";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";

export default function Home() {    

    const { user } = useContext<any>(UserContext);

    const router = useRouter();

    useEffect(() => { if(user){router.replace("/")} }, [user, router])

    return (
        <Form>
            
        </Form>
    )
}