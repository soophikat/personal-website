import { verifyToken } from "@/app/lib/auth";
import pool from "@/app/lib/db";
import { deleteImage } from "@/app/lib/storage";
import { unlink } from "fs/promises";
import { NextResponse } from "next/server";
import path from "path";

export async function DELETE(req: Request, { params }: { params: Promise<{id: string}> } ) {
    if (!await verifyToken(req)) {
        return NextResponse.json({error: 'Unauthorized!'}, {status: 401});
    }
    try {
        const { id } = await params;

        //const photo = db.prepare('SELECT * FROM photos WHERE id = ?').get(id) as { filename: string } || undefined;
        const { rows: photos } = await pool.query('SELECT * FROM photos WHERE id = $1', [id]);
        const photo = (photos[0] as {key: string} | undefined);

        if (!photo) {
            return Response.json({message: "dont exist"}, {status: 404});
        }
      
        await deleteImage(photo.key);

        await pool.query('DELETE FROM photos WHERE id = $1', [id]);


        return Response.json({status: 200});
    } catch (e) {
        console.error(e);
        return Response.json({error: "delete error!"}, {status: 500});
    }
}