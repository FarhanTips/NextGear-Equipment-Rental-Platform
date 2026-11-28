

'use server';

import { headers } from "next/headers";
import { auth } from "../auth";
import { notFound, redirect } from "next/navigation";

export const getSession = async () => {
    const session = await auth.api.getSession({
        headers: await headers()
    })
    return session;
}


export const requireRole = async (role: string) => {
    const session = await getSession();
    if (!session || session?.user.userRole !== role) {
        redirect("/unauthorized");
    }
    return session;
}

export const authMutate = async (api: string, method: string, data?: unknown) => {
    const res = await fetch(api, {
        method: method,
        headers: {
            "Content-Type": "application/json",
            // authorization: `Bearer ${token}`
        },
        body: data ? JSON.stringify(data) : null,
    });
    // if (res.status === 401 || res.status === 403) {
    //     redirect("/unauthorized");
    // }
    return res.json();
}


export const authFetch = async (api: string) => {
    const res = await fetch(api, {
        // headers: {
        //     authorization: `Bearer ${token}`
        // }
    });
    // if (res.status === 401 || res.status === 403) {
    //     redirect("/unauthorized");
    // }
    console.log("res authFetch", res)
    if (res.status === 404) {
        notFound();
    }
    if (!res.ok) {
        notFound();
    }
    return res.json();
}
