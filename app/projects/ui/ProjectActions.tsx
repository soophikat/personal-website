"use client";

import { useState } from "react";
import { toast } from "sonner";
import type { Project } from "@/app/lib/getProjects";
import ProjectForm from "./ProjectForm";

export default function ProjectActions({ project }: { project: Project }) {
    const [isDeleting, setIsDeleting] = useState(false);

    async function deleteProject() {
        if (!window.confirm(`Delete "${project.title}"? This cannot be undone.`)) return;

        setIsDeleting(true);
        try {
            const response = await fetch(`/api/projects/${project.id}`, {
                method: "DELETE",
                credentials: "include",
            });
            const data = await response.json();

            if (!response.ok) {
                toast.error(data.error ?? "Could not delete project");
                return;
            }

            toast.success("Project deleted");
            window.location.reload();
        } catch {
            toast.error("Unable to delete the project. Please try again.");
        } finally {
            setIsDeleting(false);
        }
    }

    return (
        <div className="flex flex-col gap-3 border-t border-neutral-200 pt-4 dark:border-neutral-800">
            <ProjectForm project={project} />
            <button
                type="button"
                onClick={deleteProject}
                disabled={isDeleting}
                aria-label={`Delete ${project.title}`}
                className="self-start border border-pink-300 px-4 py-2 text-sm font-medium text-pink-700 transition-colors hover:bg-pink-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 disabled:cursor-not-allowed disabled:opacity-60 dark:border-pink-900 dark:text-pink-300 dark:hover:bg-pink-950/40"
            >
                {isDeleting ? "Deleting..." : "Delete"}
            </button>
        </div>
    );
}
