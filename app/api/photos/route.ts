import db from "@/app/lib/db";
import { ResponseCookies } from "next/dist/compiled/@edge-runtime/cookies";
import { writeFile } from "fs/promises";
import path from "path";
import { verifyToken } from "@/app/lib/auth";
import { NextResponse } from "next/server";
import pool from "@/app/lib/db";
import { error } from "next/dist/build/output/log";

export async function GET() {
    try {
        const { rows: photos } = await pool.query(`
            SELECT photos.*, array_agg(tags.name) FILTER (WHERE tags.name IS NOT NULL) as tags from photos
            LEFT JOIN photo_tags ON photos.id = photo_tags.photo_id
            LEFT JOIN tags ON photo_tags.tag_id = tags.id
            GROUP BY photos.id
            `)

        console.log(photos);
        return Response.json({photos}, {status: 200});

        
    } catch (error) {
        console.error(error);
        return Response.json({error: 'internal error!', log: error}, {status: 500});
    }
};

export async function insertPhoto(filename: string, caption: string, tags: string[]) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const { rows: photoRows } = await client.query(
            "INSERT INTO photos (filename, caption) VALUES ($1, $2) RETURNING id", [filename, caption]
        );
        const photoId = photoRows[0].id;

        for (const tag of tags) {
            await client.query(
                "INSERT INTO tags (name) VALUES ($1) ON CONFLICT (name) DO NOTHING", 
                [tag]
            );
            const { rows: tagRows } = await client.query(
                "SELECT id FROM tags WHERE name = $1", 
                [tag]
            );
            const tagId = tagRows[0].id;

            await client.query(
                "INSERT INTO photo_tags (photo_id, tag_id) VALUES ($1, $2)",
                [photoId, tagId]
            )
        }
        const { rows: newPhotoRows } = await client.query(
            'SELECT * FROM photos WHERE id = $1',
            [photoId]
        );

        console.log(newPhotoRows);

        await client.query('COMMIT');
        return newPhotoRows[0];

    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
}

export async function POST(req: Request) {

    if (! await verifyToken(req)) {
        return NextResponse.json({ error: 'Unauthorized'}, { status: 401});
    }

    try {
        const formData = await req.formData();
    
        const file = formData.get("image") as File;
        const caption = formData.get("caption") as string;
        const tagsRaw = formData.get("tags") as string;
        const tags = tagsRaw ? tagsRaw.split(',').map(t => t.trim()) : [];
    
    
        const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
        
        if (!file || !allowedTypes.includes(file.type)) {
            return Response.json({error: "invalid format!"}, {status: 400});
        }
    
        const filename = `${Date.now()}-${file.name}`;
        const buffer = Buffer.from(await file.arrayBuffer());
    
        await writeFile(path.join(process.cwd(), "public/uploads", filename), buffer);
    
        const photo = insertPhoto(filename, caption, tags);
     
        return Response.json({photo: photo, message: "created!"}, {status: 201})
    } catch (e) {
        console.error(e);
        return Response.json({error: "wooops!"}, {status: 500});
    }
};