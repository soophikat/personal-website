"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import type { Project } from "@/app/lib/getProjects";

const fieldClassName = "w-full border border-neutral-200 bg-transparent px-3 py-2 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus-visible:border-purple-400 focus-visible:ring-2 focus-visible:ring-purple-200 dark:border-neutral-800 dark:text-neutral-100 dark:focus-visible:border-purple-700 dark:focus-visible:ring-purple-950";

export default function ProjectForm({ project }: { project?: Project }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const formId = project ? `edit-project-${project.id}` : "add-project-form";

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const tags = String(formData.get("tags") ?? "")
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean);

        setIsSaving(true);
        try {
            const response = await fetch(project ? `/api/projects/${project.id}` : "/api/projects", {
                method: project ? "PATCH" : "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    title: formData.get("title"),
                    description: formData.get("description"),
                    url: formData.get("url"),
                    status: formData.get("status"),
                    tags,
                }),
            });
            const data = await response.json();

            if (!response.ok) {
                toast.error(data.error ?? "Could not save project");
                return;
            }

            toast.success(project ? "Project updated" : "Project added");
            window.location.reload();
        } catch {
            toast.error("Unable to save the project. Please try again.");
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <section aria-label={project ? "Edit project" : "Add a project"} className="flex flex-col gap-4">
            <button
                type="button"
                onClick={() => setIsOpen((open) => !open)}
                aria-expanded={isOpen}
                aria-controls={formId}
                className="self-start border border-purple-300 px-4 py-2 text-sm font-medium text-purple-700 transition-colors hover:bg-purple-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 dark:border-purple-900 dark:text-purple-300 dark:hover:bg-purple-950/40"
            >
                {isOpen ? "Cancel" : project ? "Edit" : "+ Add a project"}
            </button>

            {isOpen && (
                <form
                    id={formId}
                    onSubmit={handleSubmit}
                    className="grid gap-5 border border-neutral-200 p-5 dark:border-neutral-800 sm:p-6"
                >
                    <div>
                        <p className="font-mono text-xs uppercase tracking-[0.16em] text-purple-600 dark:text-purple-400">
                            {project ? "edit entry" : "new entry"}
                        </p>
                        <h2 id={`${formId}-heading`} className="mt-2 text-xl font-semibold text-neutral-800 dark:text-white">
                            {project ? "Edit project" : "Add a project"}
                        </h2>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <label htmlFor={`${formId}-title`} className="text-sm font-medium">Title</label>
                            <input
                                id={`${formId}-title`}
                                name="title"
                                required
                                maxLength={150}
                                defaultValue={project?.title}
                                className={fieldClassName}
                                placeholder="A little project name"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor={`${formId}-status`} className="text-sm font-medium">Status</label>
                            <select
                                id={`${formId}-status`}
                                name="status"
                                defaultValue={project?.status ?? "in-progress"}
                                className={fieldClassName}
                            >
                                <option value="planned">Planned</option>
                                <option value="in-progress">In progress</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label                         htmlFor={`${formId}-description`} className="text-sm font-medium">Story / description</label>
                        <textarea
                            id={`${formId}-description`}
                            name="description"
                            required
                            maxLength={20000}
                            rows={8}
                            defaultValue={project?.description}
                            className={fieldClassName}
                            placeholder="What is it about? How did it come together? What did you learn?"
                        />
                        <p className="text-xs text-neutral-500">
                            Write as much or as little as you like. Line breaks will be preserved.
                        </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <label htmlFor={`${formId}-url`} className="text-sm font-medium">Project link <span className="text-neutral-500">(optional)</span></label>
                            <input
                                id={`${formId}-url`}
                                name="url"
                                type="url"
                                defaultValue={project?.url ?? ""}
                                className={fieldClassName}
                                placeholder="https://..."
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor={`${formId}-tags`} className="text-sm font-medium">Tags</label>
                            <input
                                id={`${formId}-tags`}
                                name="tags"
                                defaultValue={project?.tags.join(", ")}
                                className={fieldClassName}
                                placeholder="web, learning, art"
                            />
                            <p className="text-xs text-neutral-500">Separate tags with commas.</p>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSaving}
                        className="inline-flex min-h-10 items-center justify-center bg-neutral-900 px-4 py-2 text-sm font-medium text-neutral-50 transition-colors hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-200"
                    >
                        {isSaving ? "Saving..." : project ? "Save changes" : "Save project"}
                    </button>
                </form>
            )}
        </section>
    );
}
