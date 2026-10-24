'use client'

import { useEffect, useState, type FormEvent, type KeyboardEvent } from "react";
import { IoIosClose } from "react-icons/io";
import { toast } from "sonner";

type Photo = {
    id: string;
    caption: string;
    tags: string[];
};

export default function EditPhotoDialog({
    photo,
    onClose,
    onSave,
}: {
    photo: Photo;
    onClose: () => void;
    onSave: (caption: string, tags: string[]) => void;
}) {
    const [caption, setCaption] = useState(photo.caption ?? '');
    const [tags, setTags] = useState(photo.tags ?? []);
    const [tagInput, setTagInput] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const handleEscape = (event: globalThis.KeyboardEvent) => {
            if (event.key === 'Escape' && !isSaving) onClose();
        };

        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [isSaving, onClose]);

    const addTag = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key !== 'Enter') return;

        event.preventDefault();
        const tag = tagInput.trim();
        if (!tag || tags.includes(tag)) return;

        setTags((currentTags) => [...currentTags, tag]);
        setTagInput('');
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSaving(true);

        try {
            const response = await fetch(`/api/photos/${photo.id}`, {
                method: 'PATCH',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ caption, tags }),
            });
            const data = await response.json();

            if (!response.ok) {
                toast.error(`Could not update photo: ${data.error ?? response.status}`);
                return;
            }

            onSave(data.photo.caption ?? '', data.photo.tags ?? []);
            toast.success('Photo updated successfully');
        } catch {
            toast.error('Unable to update photo. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 px-4 py-6"
            onClick={() => !isSaving && onClose()}
        >
            <section
                role="dialog"
                aria-modal="true"
                aria-labelledby="edit-photo-title"
                onClick={(event) => event.stopPropagation()}
                className="w-full max-w-md rounded-xl border border-neutral-200 bg-white p-6 text-neutral-950 shadow-lg dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-50 sm:p-8"
            >
                <div className="mb-6 flex items-start justify-between">
                    <div className="space-y-1.5">
                        <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Gallery</p>
                        <h2 id="edit-photo-title" className="text-2xl font-semibold tracking-tight">
                            Edit photo
                        </h2>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                            Update the caption and tags for this photo.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSaving}
                        aria-label="Close edit dialog"
                        className="inline-flex size-8 shrink-0 items-center justify-center rounded-md text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 disabled:opacity-50 dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-neutral-50"
                    >
                        <IoIosClose aria-hidden="true" className="size-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="edit-photo-caption" className="text-sm font-medium">Caption</label>
                        <input
                            id="edit-photo-caption"
                            type="text"
                            maxLength={500}
                            value={caption}
                            onChange={(event) => setCaption(event.target.value)}
                            className="flex h-10 w-full rounded-md border border-neutral-200 bg-transparent px-3 py-2 text-sm shadow-sm outline-none transition-colors placeholder:text-neutral-400 focus-visible:border-neutral-400 focus-visible:ring-2 focus-visible:ring-neutral-200 dark:border-neutral-800 dark:focus-visible:border-neutral-600 dark:focus-visible:ring-neutral-800"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="edit-photo-tags" className="text-sm font-medium">Tags</label>
                        <input
                            id="edit-photo-tags"
                            type="text"
                            value={tagInput}
                            onChange={(event) => setTagInput(event.target.value)}
                            onKeyDown={addTag}
                            placeholder="Type a tag and press Enter"
                            className="flex h-10 w-full rounded-md border border-neutral-200 bg-transparent px-3 py-2 text-sm shadow-sm outline-none transition-colors placeholder:text-neutral-400 focus-visible:border-neutral-400 focus-visible:ring-2 focus-visible:ring-neutral-200 dark:border-neutral-800 dark:focus-visible:border-neutral-600 dark:focus-visible:ring-neutral-800"
                        />
                        {tags.length > 0 && (
                            <ul className="flex flex-wrap gap-2" aria-label="Photo tags">
                                {tags.map((tag) => (
                                    <li
                                        key={tag}
                                        className="inline-flex items-center gap-1 rounded-md border border-neutral-200 bg-neutral-50 px-2 py-1 text-sm dark:border-neutral-800 dark:bg-neutral-900"
                                    >
                                        <span>{tag}</span>
                                        <button
                                            type="button"
                                            onClick={() => setTags((currentTags) => currentTags.filter((currentTag) => currentTag !== tag))}
                                            aria-label={`Remove ${tag} tag`}
                                            className="text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-50"
                                        >
                                            <IoIosClose aria-hidden="true" className="size-4" />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isSaving}
                        className="inline-flex h-10 w-full items-center justify-center rounded-md bg-neutral-900 px-4 text-sm font-medium text-neutral-50 shadow transition-colors hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-200 dark:focus-visible:ring-neutral-600 dark:focus-visible:ring-offset-neutral-950"
                    >
                        {isSaving ? 'Saving...' : 'Save changes'}
                    </button>
                </form>
            </section>
        </div>
    );
}
