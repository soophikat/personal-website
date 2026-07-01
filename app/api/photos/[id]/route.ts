import { verifyToken } from "@/app/lib/auth";
import db from "@/app/lib/db";
import { unlink } from "fs/promises";
import { NextResponse } from "next/server";
import path from "path";

export async function DELETE(req: Request, { params }: { params: Promise<{id: string}> } ) {
    if (!await verifyToken(req)) {
        return NextResponse.json({error: 'Unauthorized!'}, {status: 401});
    }
    try {
        const { id } = await params;
        const photo = db.prepare('SELECT * FROM photos WHERE id = ?').get(id) as { filename: string } || undefined;
        if (!photo) {
            return Response.json({message: "dont exist"}, {status: 404});
        }
      
        const filepath = path.join(process.cwd(), "public/uploads", photo.filename);

        await unlink(filepath);
        
        db.prepare('DELETE FROM photos WHERE id = ?').run(id);
        return Response.json({status: 200});
    } catch (e) {
        console.error(e);
        return Response.json({error: "delete error!"}, {status: 500});
    }
}