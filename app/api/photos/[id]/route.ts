import { verifyToken } from "@/app/lib/auth";
import pool from "@/app/lib/db";
import { deleteImage } from "@/app/lib/storage";
import { NextResponse } from "next/server";
import z from "zod";

const updatePhotoSchema = z.object({
    caption: z.string().max(500),
    tags: z.array(z.string().trim().min(1).max(50)),
});

export async function PATCH(req: Request, { params }: { params: Promise<{id: string}> }) {
    if (!await verifyToken()) {
        return NextResponse.json({error: 'Unauthorized!'}, {status: 401});
    }

    const { id } = await params;
    if (!/^\d+$/.test(id) || !Number.isSafeInteger(Number(id))) {
        return NextResponse.json({error: 'Invalid photo id'}, {status: 400});
    }

    let body: unknown;
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({error: 'Invalid request body'}, {status: 400});
    }

    const result = updatePhotoSchema.safeParse(body);
    if (!result.success) {
        return NextResponse.json({error: 'Invalid caption or tags'}, {status: 400});
    }

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const { rows: photos } = await client.query(
            'UPDATE photos SET caption = $1 WHERE id = $2 RETURNING id',
            [result.data.caption, id]
        );

        if (!photos.length) {
            await client.query('ROLLBACK');
            return NextResponse.json({error: 'Photo not found'}, {status: 404});
        }

        await client.query('DELETE FROM photo_tags WHERE photo_id = $1', [id]);
        const tags = [...new Set(result.data.tags.map((tag) => tag.trim()))];

        for (const tag of tags) {
            const { rows: tagRows } = await client.query(
                'INSERT INTO tags (name) VALUES ($1) ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name RETURNING id',
                [tag]
            );
            await client.query(
                'INSERT INTO photo_tags (photo_id, tag_id) VALUES ($1, $2)',
                [id, tagRows[0].id]
            );
        }

        const { rows: updatedPhotos } = await client.query(
            `SELECT photos.*, COALESCE(array_agg(tags.name) FILTER (WHERE tags.name IS NOT NULL), ARRAY[]::text[]) AS tags
             FROM photos
             LEFT JOIN photo_tags ON photos.id = photo_tags.photo_id
             LEFT JOIN tags ON photo_tags.tag_id = tags.id
             WHERE photos.id = $1
             GROUP BY photos.id`,
            [id]
        );

        await client.query('COMMIT');
        return NextResponse.json({photo: updatedPhotos[0]});
    } catch (error) {
        console.error(error);
        try {
            await client.query('ROLLBACK');
        } catch (rollbackError) {
            console.error(rollbackError);
        }
        return NextResponse.json({error: 'Could not update photo'}, {status: 500});
    } finally {
        client.release();
    }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{id: string}> } ) {
    if (!await verifyToken()) {
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