import db from "@/app/lib/db";
import { ResponseCookies } from "next/dist/compiled/@edge-runtime/cookies";
import { writeFile } from "fs/promises";
import path from "path";
import { verifyToken } from "@/app/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const photos = db.prepare(`
            SELECT photos.*, GROUP_CONCAT(tags.name) as  tags from photos
            LEFT JOIN photo_tags ON photos.id = photo_tags.photo_id
            LEFT JOIN tags ON photo_tags.tag_id = tags.id
            GROUP BY photos.id
            `).all();
        return Response.json({
            photos: photos.map((photo: any) => ({
                ...photo,
                tags: photo.tags ? photo.tags.split(',') : [],
            }))
        }, {status: 200});
        
    } catch (error) {
        console.error(error);
        return Response.json({error: 'internal error!'}, {status: 500});
    }
};

const insertPhoto = db.transaction((filename: string, caption: string, tags: string[]) => {
    const photo = db.prepare("INSERT INTO photos (filename, caption) VALUES (?, ?)").run(filename, caption);
    const photoId = photo.lastInsertRowid;

    for (const tag of tags) {
        db.prepare("INSERT OR IGNORE INTO tags (name) VALUES (?)").run(tag);
        const { id: tagId } = db.prepare("SELECT id FROM tags WHERE name = ?").get(tag) as {id: number};
        db.prepare("INSERT INTO photo_tags (photo_id, tag_id) VALUES (? ,?)").run(photoId, tagId);

    }

    const newPhoto = db.prepare("SELECT * FROM photos WHERE id = ?").get(photoId);
    return newPhoto;
})

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