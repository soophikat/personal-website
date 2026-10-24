import { verifyToken } from "@/app/lib/auth";
import { getProjects, type Project, type ProjectStatus } from "@/app/lib/getProjects";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import ProjectForm from "./ui/ProjectForm";
import ProjectActions from "./ui/ProjectActions";

const statusLabels: Record<ProjectStatus, string> = {
    planned: "Planned",
    "in-progress": "In progress",
    completed: "Completed",
};

const statusStyles: Record<ProjectStatus, string> = {
    planned: "border-neutral-300 text-neutral-600 dark:border-neutral-700 dark:text-neutral-400",
    "in-progress": "border-purple-300 text-purple-700 dark:border-purple-900 dark:text-purple-300",
    completed: "border-pink-300 text-pink-700 dark:border-pink-900 dark:text-pink-300",
};

function ProjectCard({ project, logged }: { project: Project; logged: boolean }) {
    return (
        <article className="flex flex-col gap-5 border border-neutral-200 p-5 dark:border-neutral-800 sm:p-7">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <span className={`border px-2.5 py-1 font-mono text-xs ${statusStyles[project.status]}`}>
                    {statusLabels[project.status]}
                </span>
                <time dateTime={new Date(project.created_at).toISOString()} className="text-xs text-neutral-500">
                    {new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(project.created_at))}
                </time>
            </div>

            <div>
                <h3 className="text-2xl font-semibold text-neutral-800 dark:text-white">{project.title}</h3>
                <div className="mt-4 space-y-4 leading-7 [&_a]:text-purple-700 [&_a]:underline [&_a]:decoration-purple-300 [&_a]:underline-offset-4 [&_a:hover]:text-pink-600 [&_blockquote]:border-l-2 [&_blockquote]:border-purple-300 [&_blockquote]:pl-4 [&_blockquote]:text-neutral-600 [&_code]:rounded-sm [&_code]:bg-neutral-100 [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-sm [&_h1]:text-2xl [&_h1]:font-semibold [&_h2]:text-xl [&_h2]:font-semibold [&_h3]:text-lg [&_h3]:font-semibold [&_li]:ml-5 [&_ol]:list-decimal [&_pre]:overflow-x-auto [&_pre]:rounded-sm [&_pre]:bg-neutral-100 [&_pre]:p-4 [&_pre]:dark:bg-neutral-900 [&_ul]:list-disc dark:[&_a]:text-purple-300 dark:[&_a]:decoration-purple-900 dark:[&_a:hover]:text-pink-300 dark:[&_blockquote]:border-purple-900 dark:[&_blockquote]:text-neutral-400 dark:[&_code]:bg-neutral-900 dark:[&_code]:text-neutral-100">
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                            table: ({ children }) => (
                                <div className="overflow-x-auto">
                                    <table className="w-full border-collapse text-left">{children}</table>
                                </div>
                            ),
                            th: ({ children }) => (
                                <th className="border border-neutral-300 px-3 py-2 dark:border-neutral-700">
                                    {children}
                                </th>
                            ),
                            td: ({ children }) => (
                                <td className="border border-neutral-300 px-3 py-2 dark:border-neutral-700">
                                    {children}
                                </td>
                            ),
                        }}
                    >
                        {project.description}
                    </ReactMarkdown>
                </div>
            </div>

            {(project.tags.length > 0 || project.url) && (
                <div className="flex flex-wrap items-center gap-2 border-t border-neutral-200 pt-4 dark:border-neutral-800">
                    {project.tags.map((tag) => (
                        <span
                            key={tag}
                            className="border border-neutral-200 px-2 py-1 font-mono text-xs text-neutral-600 dark:border-neutral-800 dark:text-neutral-400"
                        >
                            {tag}
                        </span>
                    ))}
                    {project.url && (
                        <a
                            href={project.url}
                            target="_blank"
                            rel="noreferrer"
                            className="ml-auto text-sm text-purple-700 underline decoration-purple-300 underline-offset-4 hover:text-pink-600 dark:text-purple-300 dark:decoration-purple-900 dark:hover:text-pink-300"
                        >
                            Visit project ↗
                        </a>
                    )}
                </div>
            )}
            {logged && <ProjectActions project={project} />}
        </article>
    );
}

export default async function Page() {
    const [projects, logged] = await Promise.all([getProjects(), verifyToken()]);

    return (
        <main className="w-full px-4 py-8 sm:px-8 sm:py-12">
            <div className="mx-auto flex max-w-5xl flex-col gap-12">
                <header className="flex flex-col gap-5 border-b border-neutral-200 pb-10 dark:border-neutral-800">
                    <p className="font-mono text-xs uppercase tracking-[0.2em] text-purple-600 dark:text-purple-400">
                        projects &amp; process
                    </p>
                    <h1 className="text-4xl font-bold italic text-neutral-800 dark:text-white sm:text-6xl">
                        Things I&apos;m{" "}
                        <span className="bg-linear-65 from-purple-500 to-pink-500 bg-clip-text text-transparent">
                            making
                        </span>
                        .
                    </h1>
                    <p className="max-w-2xl text-base leading-7 sm:text-lg">
                        A home for my projects and the stories behind them: the ideas, the process, what worked,
                        and what I&apos;m still figuring out.
                    </p>
                </header>

                {logged && <ProjectForm />}

                <section aria-labelledby="projects-heading" className="flex flex-col gap-5">
                    <div>
                        <p className="font-mono text-xs uppercase tracking-[0.16em] text-neutral-500">the archive</p>
                        <h2 id="projects-heading" className="mt-2 text-2xl font-semibold text-neutral-800 dark:text-white">
                            Projects
                        </h2>
                    </div>

                    {projects.length > 0 ? (
                        <div className="grid gap-4">
                            {projects.map((project) => (
                                <ProjectCard key={project.id} project={project} logged={logged} />
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-sm border border-dashed border-neutral-300 bg-white/50 p-6 dark:border-neutral-700 dark:bg-neutral-900/40 sm:p-8">
                            <p className="font-mono text-sm text-purple-600 dark:text-purple-400">
                                {logged ? "Ready for the first entry?" : "Still gathering my thoughts..."}
                            </p>
                            <p className="mt-3 max-w-2xl leading-7">
                                {logged
                                    ? "Use the form above to add a project and write its story."
                                    : "Projects and their stories will find their way here soon."}
                            </p>
                        </div>
                    )}
                </section>

                <section aria-labelledby="format-heading" className="flex flex-col gap-5">
                    <div>
                        <p className="font-mono text-xs uppercase tracking-[0.16em] text-neutral-500">a loose format</p>
                        <h2 id="format-heading" className="mt-2 text-2xl font-semibold text-neutral-800 dark:text-white">
                            More than a list of links
                        </h2>
                        <p className="mt-2 max-w-2xl leading-7">
                            Each project can be a small article, without needing to follow a strict formula.
                        </p>
                    </div>

                    <ol className="grid gap-3 sm:grid-cols-3">
                        <li className="border border-neutral-200 p-5 dark:border-neutral-800">
                            <span className="font-mono text-xs text-purple-600 dark:text-purple-400">01</span>
                            <h3 className="mt-4 font-semibold text-neutral-800 dark:text-white">Context</h3>
                            <p className="mt-2 text-sm leading-6">What it is, why I started, and the idea that caught my attention.</p>
                        </li>
                        <li className="border border-neutral-200 p-5 dark:border-neutral-800">
                            <span className="font-mono text-xs text-purple-600 dark:text-purple-400">02</span>
                            <h3 className="mt-4 font-semibold text-neutral-800 dark:text-white">Process</h3>
                            <p className="mt-2 text-sm leading-6">The choices, tools, experiments, and discoveries along the way.</p>
                        </li>
                        <li className="border border-neutral-200 p-5 dark:border-neutral-800">
                            <span className="font-mono text-xs text-purple-600 dark:text-purple-400">03</span>
                            <h3 className="mt-4 font-semibold text-neutral-800 dark:text-white">What I learned</h3>
                            <p className="mt-2 text-sm leading-6">What is finished, what I learned, and what I might improve next.</p>
                        </li>
                    </ol>
                </section>
            </div>
        </main>
    );
}
