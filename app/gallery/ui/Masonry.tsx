"use client"
import { useCallback, useState } from "react";
import { toast } from "sonner";
import UploadButton from "./UploadButton";
import EditPhotoDialog from "./EditPhotoDialog";

type Photo = {
    id: string;
    key: string;
    image_url: string;
    caption: string;
    tags: string[];
}



export default function Masonry({ photos, logged }: { photos: Photo[]; logged: boolean }) {
    const [ focused, setFocused] = useState<Photo | null>(null)
    const [ editing, setEditing ] = useState<Photo | null>(null)
    const [ photoList, setPhotoList ] = useState(photos);

    const closeEditDialog = useCallback(() => setEditing(null), []);

    const savePhotoChanges = (caption: string, tags: string[]) => {
        if (!editing) return;

        const updatedPhoto = { ...editing, caption, tags };
        setPhotoList((currentPhotos) => currentPhotos.map((photo) => (
            photo.id === updatedPhoto.id ? updatedPhoto : photo
        )));
        setFocused((currentPhoto) => currentPhoto?.id === updatedPhoto.id ? updatedPhoto : currentPhoto);
        setEditing(null);
    };

    const openModal = (photo: Photo) => {
        setFocused(photo);
    }

    const handleDelete = async () => {
        if (!focused) { return ;}

        const confirmed = confirm('r u sure ?');

        if (!confirmed) { return ;}
        const res = await fetch(`/api/photos/${focused.id}`, {
             method: 'DELETE',
            'credentials': 'include'
        })

        if (res.ok) {
            setPhotoList(photoList.filter(p => p.id !== focused.id));
            setFocused(null);
            toast('deleted successfully!');
        } else {
            toast(`could not delete! [${res.status}]`);
        }
    }

    return (
        <div>

            {logged && <UploadButton />}
            <div className="mx-auto max-w-6xl columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-3">
                {photoList.map((photo) => (
                    <div key={photo.id} onClick={() => openModal(photo)} className="break-inside-avoid mb-3">
                        <img src={photo.image_url} className="w-full  block"/>
                    </div>
                ))}
            </div>
            {focused && (
                <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center"
                    onClick={() => setFocused(null)} 
                >
                    <div onClick={(e) => e.stopPropagation()} className="flex flex-col gap-1 text-neutral-100">
                        <img src={focused.image_url} className="max-h-[700px] max-w-screen-lg"/>
                        <div className="flex justify-between text-sm">
                            <div className="flex gap-1">{focused.tags && focused.tags.map((tag) => (
                                <span key={tag} className="bg-neutral-500/50 font-mono px-0.5 text-sm text-neutral-300">#{tag}</span>
                            ))}</div>
                            {logged && (
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setEditing(focused)}
                                        className="bg-blue-500/50 px-1 font-mono hover:cursor-pointer"
                                    >
                                        edit
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleDelete()}
                                        className="bg-red-500/50 px-1 font-mono hover:cursor-pointer"
                                    >
                                        delete
                                    </button>
                                </div>
                            )}
                        </div>
                        <p className="  text-sm">{focused.caption}</p>
                    </div>
                </div>
            )}
            {editing && (
                <EditPhotoDialog
                    photo={editing}
                    onClose={closeEditDialog}
                    onSave={savePhotoChanges}
                />
            )}
        </div>
    )
}