import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function verifyToken(req: Request): Promise<boolean> {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) { return false; }

    try {
        jwt.verify(token, process.env.JWT_SECRET!)
        return true;
    } catch {
        return false;
    }
}