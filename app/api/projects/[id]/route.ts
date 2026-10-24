import { verifyToken } from "@/app/lib/auth";
import pool from "@/app/lib/db";
import { normalizeProjectTags, projectSchema } from "@/app/lib/projectSchema";
import { NextResponse } from "next/server";

type RouteContext = { params: Promise<{ id: string }> };

function parseProjectId(id: string): number | null {
    if (!/^\d+$/.test(id)) return null;
    const projectId = Number(id);
    return Number.isSafeInteger(projectId) && projectId > 0 ? projectId : null;
}

export async function PATCH(request: Request, { params }: RouteContext) {
    if (!await verifyToken()) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const projectId = parseProjectId((await params).id);
    if (projectId === null) {
        return NextResponse.json({ error: "Invalid project id" }, { status: 400 });
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
    const client = await pool.connect();

    try {
        await client.query("BEGIN");
        const { rows } = await client.query(
            `UPDATE projects
             SET title = $1, description = $2, url = $3, status = $4
             WHERE id = $5
             RETURNING id`,
            [title, description, url || null, status, projectId]
        );

        if (!rows.length) {
            await client.query("ROLLBACK");
            return NextResponse.json({ error: "Project not found" }, { status: 404 });
        }

        await client.query("DELETE FROM project_tags WHERE project_id = $1", [projectId]);
        for (const tag of normalizeProjectTags(tags)) {
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
        return NextResponse.json({ message: "Project updated" });
    } catch (error) {
        console.error(error);
        try {
            await client.query("ROLLBACK");
        } catch (rollbackError) {
            console.error(rollbackError);
        }
        return NextResponse.json({ error: "Could not update project" }, { status: 500 });
    } finally {
        client.release();
    }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
    if (!await verifyToken()) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const projectId = parseProjectId((await params).id);
    if (projectId === null) {
        return NextResponse.json({ error: "Invalid project id" }, { status: 400 });
    }

    const client = await pool.connect();
    try {
        await client.query("BEGIN");
        const { rowCount } = await client.query("DELETE FROM projects WHERE id = $1", [projectId]);

        if (!rowCount) {
            await client.query("ROLLBACK");
            return NextResponse.json({ error: "Project not found" }, { status: 404 });
        }

        await client.query("COMMIT");
        return NextResponse.json({ message: "Project deleted" });
    } catch (error) {
        console.error(error);
        try {
            await client.query("ROLLBACK");
        } catch (rollbackError) {
            console.error(rollbackError);
        }
        return NextResponse.json({ error: "Could not delete project" }, { status: 500 });
    } finally {
        client.release();
    }
}
