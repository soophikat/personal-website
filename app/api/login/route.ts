import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken';

export async function POST(req: Request) {
    const { password } = await req.json();

    if (password !== process.env.ADMIN_PASSWORD) {
        return NextResponse.json({error: 'invalid password'}, {status: 401});
    }

    const token = jwt.sign(
        { role: 'admin' },
        process.env.JWT_SECRET!,
        { expiresIn: '7d' }
    )
    
    const res = NextResponse.json({ok: true});

    res.cookies.set('token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7
    });

    return res;
}