import Image from "next/image";
import Link from "next/link";
import MyLink from "./ui/MyLink";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
    subsets: ['latin']
})

export default function NotFound() {
    return (

        <div className="flex justify-center flex-col items-center gap-4 ">
            <h1 className={`text-2xl text-neutral-900 dark:text-neutral-50 ${montserrat.className} `}>404 Page Not Found</h1>
            <Image 
                className="w-[250px] sm:w-[400px]"
                src={'/john-travolta.gif'}
                width={400}
                height={400}
                alt="john travolta meme gif"
            />
            <MyLink 
                href={'/'}
                target={''}
                className=""
                >
                        Go Back to home page
            </MyLink>

        </div>
    )
}