import { verifyToken } from "@/app/lib/auth";
import pool from "@/app/lib/db";
import { getProjects } from "@/app/lib/getProjects";
import { NextResponse } from "next/server";
import z from "zod";

const projectSchema = z.object({
    title: z.string().trim().min(1).max(150),
    description: z.string().trim().min(1).max(20000),
    url: z.union([z.string().trim().url(), z.literal("")]).optional(),
    status: z.enum(["planned", "in-progress", "completed"]),
    tags: z.array(z.string().trim().min(1).max(50)).max(20),
});

export async function GET() {
    try {
        return NextResponse.json({ projects: await getProjects() });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Could not load projects" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    if (!await verifyToken()) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let body: unknown;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const result = projectSchema.safeParse(body);
    if (!result.success) {
        return NextResponse.json({ error: "Please check the project details" }, { status: 400 });
    }

    const { title, description, url, status, tags } = result.data;
    const uniqueTags = [...new Set(tags.map((tag) => tag.trim()).filter(Boolean))];
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const { rows } = await client.query(
            `INSERT INTO projects (title, description, url, status)
             VALUES ($1, $2, $3, $4)
             RETURNING id`,
            [title, description, url || null, status]
        );
        const projectId: number = rows[0].id;

        for (const tag of uniqueTags) {
            const { rows: tagRows } = await client.query(
                `INSERT INTO tags (name) VALUES ($1)
                 ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
                 RETURNING id`,
                [tag]
            );
            await client.query(
                "INSERT INTO project_tags (project_id, tag_id) VALUES ($1, $2)",
                [projectId, tagRows[0].id]
            );
        }

        await client.query("COMMIT");
        return NextResponse.json({ message: "Project created" }, { status: 201 });
    } catch (error) {
        console.error(error);
        try {
            await client.query("ROLLBACK");
        } catch (rollbackError) {
            console.error(rollbackError);
        }
        return NextResponse.json({ error: "Could not create project" }, { status: 500 });
    } finally {
        client.release();
    }
}
