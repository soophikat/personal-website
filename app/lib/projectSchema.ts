import z from "zod";

export const projectSchema = z.object({
    title: z.string().trim().min(1).max(150),
    description: z.string().trim().min(1).max(20000),
    url: z.union([z.string().trim().url(), z.literal("")]).optional(),
    status: z.enum(["planned", "in-progress", "completed"]),
    tags: z.array(z.string().trim().min(1).max(50)).max(20),
});

export function normalizeProjectTags(tags: string[]) {
    return [...new Set(tags.map((tag) => tag.trim()).filter(Boolean))];
}
