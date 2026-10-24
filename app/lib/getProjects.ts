import pool from "@/app/lib/db";

export type ProjectStatus = "planned" | "in-progress" | "completed";

export type Project = {
    id: number;
    title: string;
    description: string;
    url: string | null;
    status: ProjectStatus;
    created_at: Date;
    tags: string[];
};

export async function getProjects(): Promise<Project[]> {
    const { rows } = await pool.query<Project>(`
        SELECT
            projects.id,
            projects.title,
            projects.description,
            projects.url,
            projects.status,
            projects.created_at,
            COALESCE(
                array_agg(tags.name) FILTER (WHERE tags.name IS NOT NULL),
                ARRAY[]::text[]
            ) AS tags
        FROM projects
        LEFT JOIN project_tags ON projects.id = project_tags.project_id
        LEFT JOIN tags ON project_tags.tag_id = tags.id
        GROUP BY projects.id
        ORDER BY projects.created_at DESC, projects.id DESC
    `);

    return rows;
}
