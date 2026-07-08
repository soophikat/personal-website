export const dynamic = 'force-dynamic';
import { Suspense } from "react";
import UnderConstruction from "../ui/UnderConstruction";
import Masonry from "./ui/Masonry";
import UploadButton from "./ui/UploadButton";
import { getPhotos } from "../lib/getPhotos";


export default async function Page() {
    try {
        const photos = await getPhotos()
        console.log(photos);
        if (!photos) return ;

        return (
            <div className="p-4">
                <div className="">
                    <Masonry photos={photos} />
                </div>
            </div>
        )
    } catch(err) {
        console.error(err);
        return;
    }
    

}