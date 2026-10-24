export const dynamic = 'force-dynamic';
import { Suspense } from "react";
import UnderConstruction from "../ui/UnderConstruction";
import Masonry from "./ui/Masonry";
import UploadButton from "./ui/UploadButton";
import { getPhotos } from "../lib/getPhotos";
import { verifyToken } from "../lib/auth";

type Photo = {
  id: string;
  key: string;
  image_url: string;
  caption: string;
  tags: string[];
};

// const photos: Photo[] = [
//   {
//     id: "1",
//     key: "photos/sunset-beach.jpg",
//     image_url: "https://picsum.photos/id/1015/800/600",
//     caption: "Pôr do sol na praia",
//     tags: ["natureza", "praia", "pôr do sol"],
//   },
//   {
//     id: "2",
//     key: "photos/mountain-view.jpg",
//     image_url: "https://picsum.photos/id/1018/800/600",
//     caption: "Vista das montanhas ao amanhecer",
//     tags: ["natureza", "montanha", "paisagem"],
//   },
//   {
//     id: "3",
//     key: "photos/city-night.jpg",
//     image_url: "https://picsum.photos/id/1031/800/600",
//     caption: "Cidade iluminada à noite",
//     tags: ["cidade", "noite", "urbano"],
//   },
//   {
//     id: "4",
//     key: "photos/forest-path.jpg",
//     image_url: "https://picsum.photos/id/1043/800/600",
//     caption: "Trilha no meio da floresta",
//     tags: ["natureza", "floresta", "trilha"],
//   },
//   {
//     id: "5",
//     key: "photos/coffee-desk.jpg",
//     image_url: "https://picsum.photos/id/1060/800/600",
//     caption: "Café e setup de trabalho",
//     tags: ["café", "trabalho", "setup"],
//   },
//   {
//     id: "6",
//     key: "photos/lake-reflection.jpg",
//     image_url: "https://picsum.photos/id/1039/800/600",
//     caption: "Reflexo no lago",
//     tags: ["natureza", "lago", "paisagem"],
//   },
//   {
//     id: "7",
//     key: "photos/old-street.jpg",
//     image_url: "https://picsum.photos/id/1067/800/600",
//     caption: "Rua antiga de paralelepípedo",
//     tags: ["cidade", "rua", "arquitetura"],
//   },
//   {
//     id: "8",
//     key: "photos/wildlife.jpg",
//     image_url: "https://picsum.photos/id/1074/800/600",
//     caption: "Leão descansando na savana",
//     tags: ["animais", "natureza", "selvagem"],
//   },
//   {
//     id: "9",
//     key: "photos/waterfall.jpg",
//     image_url: "https://picsum.photos/id/1036/800/600",
//     caption: "Cachoeira em meio à mata",
//     tags: ["natureza", "cachoeira", "água"],
//   },
//   {
//     id: "10",
//     key: "photos/bridge-fog.jpg",
//     image_url: "https://picsum.photos/id/1044/800/600",
//     caption: "Ponte coberta de neblina",
//     tags: ["paisagem", "neblina", "arquitetura"],
//   },
// ];

export default async function Page() {
    try {
        const photos = await getPhotos()
        const logged = await verifyToken();
        console.log(photos);
        if (!photos) return ;

        return (
            <div className="p-4 flex justify-center ">
                    <Masonry photos={photos} logged={logged} />
            </div>
        )
    } catch(err) {
        console.error(err);
        return;
    }
    

}