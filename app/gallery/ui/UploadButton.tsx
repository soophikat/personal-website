'use client'

import { useEffect, useState, type FormEvent, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { GoUpload } from "react-icons/go";
import { IoIosClose } from "react-icons/io";
import { toast } from "sonner";

export default function UploadButton() {
    const [modalOpen, setModalOpen] = useState(false);
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        if (!modalOpen) return;

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setModalOpen(false);
                setTags([]);
                setTagInput('');
            }
        };

        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [modalOpen]);

    const closeModal = () => {
        setModalOpen(false);
        setTags([]);
        setTagInput('');
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        formData.set('tags', tags.join(','));
        setIsUploading(true);

        try {
            const response = await fetch('/api/photos', {
                method: 'POST',
                credentials: 'include',
                body: formData,
            });
            const data = await response.json();

            if (!response.ok) {
                toast.error(`Could not upload image: ${data.error ?? response.status}`);
                return;
            }

            toast.success('Image uploaded successfully');
            closeModal();
            window.location.reload();
        } catch {
            toast.error('Unable to upload image. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    const handleAddTag = (event: ReactKeyboardEvent<HTMLInputElement>) => {
        if (event.key !== 'Enter') return;

        event.preventDefault();
        const tag = tagInput.trim();
        if (!tag || tags.includes(tag)) return;

        setTags((currentTags) => [...currentTags, tag]);
        setTagInput('');
    };

    const removeTag = (tagToRemove: string) => {
        setTags((currentTags) => currentTags.filter((tag) => tag !== tagToRemove));
    };

    return (
        <>
            <button
                type="button"
                onClick={() => setModalOpen(true)}
                aria-label="Upload image"
                className="mb-4 inline-flex size-10 items-center justify-center rounded-md border border-neutral-200 bg-white text-neutral-900 shadow-sm transition-colors hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-50 dark:hover:bg-neutral-900 dark:focus-visible:ring-offset-neutral-950"
            >
                <GoUpload aria-hidden="true" />
            </button>

            {modalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6"
                    onClick={closeModal}
                >
                    <section
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="upload-dialog-title"
                        onClick={(event) => event.stopPropagation()}
                        className="w-full max-w-md rounded-xl border border-neutral-200 bg-white p-6 text-neutral-950 shadow-lg dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-50 sm:p-8"
                    >
                        <div className="mb-6 flex items-start justify-between">
                            <div className="space-y-1.5">
                                <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Gallery</p>
                                <h2 id="upload-dialog-title" className="text-2xl font-semibold tracking-tight">
                                    Upload an image
                                </h2>
                                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                    Add an image and details to your gallery.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={closeModal}
                                aria-label="Close upload dialog"
                                className="inline-flex size-8 shrink-0 items-center justify-center rounded-md text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-neutral-50"
                            >
                                <IoIosClose aria-hidden="true" className="size-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label htmlFor="upload-image" className="text-sm font-medium">
                                    Image
                                </label>
                                <input
                                    id="upload-image"
                                    type="file"
                                    name="image"
                                    accept="image/jpeg,image/png,image/webp,image/gif"
                                    required
                                    className="block w-full rounded-md border border-neutral-200 bg-transparent text-sm text-neutral-700 file:mr-3 file:border-0 file:border-r file:border-neutral-200 file:bg-neutral-50 file:px-3 file:py-2 file:text-sm file:font-medium file:text-neutral-900 hover:file:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300 dark:border-neutral-800 dark:text-neutral-300 dark:file:border-neutral-800 dark:file:bg-neutral-900 dark:file:text-neutral-100 dark:hover:file:bg-neutral-800 dark:focus-visible:ring-neutral-700"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="upload-caption" className="text-sm font-medium">
                                    Caption
                                </label>
                                <input
                                    id="upload-caption"
                                    type="text"
                                    name="caption"
                                    placeholder="Add a caption"
                                    className="flex h-10 w-full rounded-md border border-neutral-200 bg-transparent px-3 py-2 text-sm shadow-sm outline-none transition-colors placeholder:text-neutral-400 focus-visible:border-neutral-400 focus-visible:ring-2 focus-visible:ring-neutral-200 dark:border-neutral-800 dark:focus-visible:border-neutral-600 dark:focus-visible:ring-neutral-800"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="upload-tags" className="text-sm font-medium">
                                    Tags
                                </label>
                                <input
                                    id="upload-tags"
                                    type="text"
                                    value={tagInput}
                                    onChange={(event) => setTagInput(event.target.value)}
                                    onKeyDown={handleAddTag}
                                    placeholder="Type a tag and press Enter"
                                    className="flex h-10 w-full rounded-md border border-neutral-200 bg-transparent px-3 py-2 text-sm shadow-sm outline-none transition-colors placeholder:text-neutral-400 focus-visible:border-neutral-400 focus-visible:ring-2 focus-visible:ring-neutral-200 dark:border-neutral-800 dark:focus-visible:border-neutral-600 dark:focus-visible:ring-neutral-800"
                                />
                                {tags.length > 0 && (
                                    <ul className="flex flex-wrap gap-2" aria-label="Added tags">
                                        {tags.map((tag) => (
                                            <li
                                                key={tag}
                                                className="inline-flex items-center gap-1 rounded-md border border-neutral-200 bg-neutral-50 px-2 py-1 text-sm dark:border-neutral-800 dark:bg-neutral-900"
                                            >
                                                <span>{tag}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => removeTag(tag)}
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
                                disabled={isUploading}
                                className="inline-flex h-10 w-full items-center justify-center rounded-md bg-neutral-900 px-4 text-sm font-medium text-neutral-50 shadow transition-colors hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-200 dark:focus-visible:ring-neutral-600 dark:focus-visible:ring-offset-neutral-950"
                            >
                                {isUploading ? 'Uploading...' : 'Upload image'}
                            </button>
                        </form>
                    </section>
                </div>
            )}
        </>
    );
}
