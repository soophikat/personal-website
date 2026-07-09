import { Space_Mono } from "next/font/google"
import { Geist_Mono } from "next/font/google"

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Footer() {

    return (
        <div className="flex justify-center items-center p-8 ">
            <p className={`${geistMono.variable} font-mono text-xs `}>
                Made with love by <a target="_blank" className="  dark:text-white text-black dark:hover:decoration-white hover:decoration-black transition-colors underline underline-offset-4 dark:decoration-neutral-700 decoration-neutral-300" href="https://github.com/soophikat">@soophikat</a>
            </p>
        </div>
    )
}