"use client"
import { useState } from "react";
import { toast } from "sonner";
import UploadButton from "./UploadButton";

type Photo = {
    id: string;
    key: string;
    image_url: string;
    caption: string;
    tags: string[];
}



export default function Masonry({ photos }: { photos: Photo[] }) {
    const [ focused, setFocused] = useState<Photo | null>(null)
    const [ logged, setLogged ] = useState(true)
    const [ photoList, setPhotoList ] = useState(photos);

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

    const onSuccessUpload = (newPhoto: Photo) => {
        setPhotoList([...photoList, newPhoto]);
    }
    
    return (
        <div>

            <UploadButton  />
            <div style={{ columns: "3 220px", gap: "12px"}}>
                {photoList.map((photo) => (
                    <div key={photo.id} onClick={() => openModal(photo)} className="break-inside-avoid mb-3">
                        <img src={photo.image_url} className="w-full block"/>
                    </div>
                ))}
            </div>
            {focused && (
                <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center"
                    onClick={() => setFocused(null)} 
                >
                    <div onClick={(e) => e.stopPropagation()} className="flex flex-col gap-1">
                        <img src={focused.image_url} className="max-h-[700px] max-w-screen-lg"/>
                        <div className="flex justify-between text-sm">
                            <div className="flex gap-1">{focused.tags && focused.tags.map((tag) => (
                                <span key={tag} className="bg-neutral-500/50 font-mono px-0.5 text-sm">#{tag}</span>
                            ))}</div>
                            {logged && <button onClick={() => handleDelete()} className="bg-red-500/50 px-1 font-mono hover:cursor-pointer">delete</button>}
                        </div>
                        <p className="text-neutral-400 text-sm">{focused.caption}</p>
                    </div>
                </div>
            )}
        </div>
    )
}