export const dynamic = 'force-dynamic';
import { Suspense } from "react";
import UnderConstruction from "../ui/UnderConstruction";
import Masonry from "./ui/Masonry";
import UploadButton from "./ui/UploadButton";


export default async function Page() {
    const res = await fetch("http://localhost:3000/api/photos") 
    const { photos } = await res.json();

    console.log(photos);
    return (
        <div className="p-4">
            <div className="">
                <Masonry photos={photos} />
            </div>
        </div>
    )
}