'use client'
import { useState } from "react";
import { GoUpload } from "react-icons/go";
import { IoIosClose } from "react-icons/io";
import { toast, Toaster } from "sonner";



export default function UploadButton({onSuccessUpload}) {
    const [modalOpen, setModalOpen] = useState(false);
    const [tags, setTags] = useState<string[]>([])
    const handleUpload = () => {
        setModalOpen(true);
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        formData.append('tags', tags.join(','));
        console.log(formData);
        const res = await fetch('/api/photos', {
            method: 'POST',
            credentials: 'include',
            body: formData
        })

        const data = await res.json()
        if (!res.ok) {
            console.log(data.error)
            toast(`cannot upload, ${data.error}`);
        } else {

            console.log(data);
            toast('upload successful');
            // onSuccessUpload(data.photo) // nao ta funcionando por causa das tags.
            setModalOpen(false);
            setTags([])
            window.location.reload();
        }
    }

    const handleTags = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const tag = e.target.value;
            if (tag === "") { return ;}
            if (tags.includes(tag)) { return ;}
            setTags([...tags, tag])
            e.target.value = '';
        }
    }

    const handleClose = () => {
        setModalOpen(false);
        setTags([])
    }

    const deleteTag = (tag) => {
        setTags(tags.filter(t => t !== tag))
    }

    return (
        <>
            {modalOpen && (
                <div onClick={handleClose} className="fixed inset-0 z-50 bg-black/50 flex justify-center items-center"> 
                    <div onClick={(e) => e.stopPropagation()} className="max-w-96 flex flex-col bg-neutral-900 rounded-sm p-4">
                        <button onClick={handleClose} className="bg-red-800 self-end hover:bg-red-600 hover:cursor-pointer" ><IoIosClose /></button>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                            <input type="file" name="image" />
                            <input type="text" name="caption" placeholder="caption" />                           
                            <div className="flex flex-wrap gap-1.5">
                                {tags.map((tag) => (
                                    <div key={tag} className="group relative inline-block">
                                        <span  className=" block bg-neutral-800 px-1">{tag}</span>
                                        <span onClick={() => deleteTag(tag)} className="absolute inset-0 bg-red-800/90 text-center hidden group-hover:flex items-center justify-center">X</span>
                                    </div>
                                ))}

                            </div>
                            <input type="text" placeholder="tags" onKeyDown={handleTags}/>
                            <input type="submit" value="Submit"/>
                        </form>
                    </div>
                </div>
            )}
            <button onClick={handleUpload} className="text-2xl rounded-lg p-1 hover:bg-blue-300 hover:text-black hover:cursor-pointer">
                <GoUpload />
            </button>
        </>
    )
}