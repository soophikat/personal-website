'use client';
import { useState } from "react";
import { toast } from "sonner";

async function login(password:string) {
    const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password})
    });

    if (!res.ok) {
        toast('wrong password');
    } else {
        window.location.replace('/')
    }
}

export default function Page() {
    const [password, setPassword] = useState('');


    return (
        <div className="flex flex-col justify-center items-center gap-2">
            <h1 className="text-xl font-bold mb-4">Hello Kat !!</h1>
            <input id='password-field' type="password" className="rounded-lg bg-neutral-900 focus:outline-none focues:ring-0 px-2 "/>
            <button onClick={() => login((document.querySelector('#password-field') as HTMLInputElement)?.value)} className="bg-neutral-800 rounded-lg px-2 hover:cursor-pointer hover:bg-neutral-600">login</button>
        </div>
    );
}