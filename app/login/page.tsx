'use client';
import { useState, type FormEvent } from "react";
import { toast } from "sonner";

export default function Page() {
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);

        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            });

            if (!res.ok) {
                toast.error('Wrong password');
                return;
            }

            window.location.replace('/');
        } catch {
            toast.error('Unable to log in. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <main className="flex min-h-full items-center justify-center px-4 py-12">
            <section className="w-full max-w-sm rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-950 sm:p-8">
                <div className="mb-6 flex size-11 items-center justify-center rounded-lg border border-neutral-200 bg-neutral-50 text-neutral-700 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200">
                    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="size-5" stroke="currentColor" strokeWidth="1.7">
                        <rect x="5" y="10" width="14" height="11" rx="2" />
                        <path d="M8 10V7a4 4 0 1 1 8 0v3" />
                    </svg>
                </div>

                <div className="mb-6 space-y-1.5">
                    <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Admin access</p>
                    <h1 className="text-2xl font-semibold tracking-tight text-neutral-950 dark:text-neutral-50">Hello Kat !!</h1>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">Enter your password to continue.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="password-field" className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                            Password
                        </label>
                        <input
                            id="password-field"
                            type="password"
                            autoComplete="current-password"
                            required
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            placeholder="Enter your password"
                            className="flex h-10 w-full rounded-md border border-neutral-200 bg-transparent px-3 py-2 text-sm text-neutral-950 shadow-sm outline-none transition-colors placeholder:text-neutral-400 focus-visible:border-neutral-400 focus-visible:ring-2 focus-visible:ring-neutral-200 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:text-neutral-50 dark:focus-visible:border-neutral-600 dark:focus-visible:ring-neutral-800"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading || !password}
                        className="inline-flex h-10 w-full items-center justify-center rounded-md bg-neutral-900 px-4 text-sm font-medium text-neutral-50 shadow transition-colors hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-200 dark:focus-visible:ring-neutral-600 dark:focus-visible:ring-offset-neutral-950"
                    >
                        {isLoading ? 'Signing in...' : 'Sign in'}
                    </button>
                </form>

                <p className="mt-6 text-center text-xs text-neutral-500 dark:text-neutral-400">
                    This area is restricted to authorized users.
                </p>
            </section>
        </main>
    );
}