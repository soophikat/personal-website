'use client'
import socialLinks, { otherSocialLinks } from "./ui/SocialLinks";
import SocialLinks from "./ui/SocialLinks";
import Link from "next/link";

export default function Page() {
    return (
        <div className="flex flex-col justify-center items-center">
            <div className="max-w-5xl p-8 flex flex-col gap-4 ">
                <Link href="/notfound" className="self-center"><img src="10000visitor.gif" alt="" className="w-xl" /></Link>
                <p>now some yapping...</p>
                <p>So, about social media, I use {socialLinks('Tumblr')} the most It's just the best. Also I use {socialLinks('Instagram')} but just because It's super addictive and when I need to farm some dopamine. 
                    Here's my {socialLinks('Youtube')} channel, but It's empty, and I don't plan o posting nothing any time soon, It's here just in case. 
                    I Listen to music a lot <span className="font-mono dark:bg-neutral-700 bg-neutral-200">d-_-b</span>, almost always on {socialLinks('Spotify')}, even though I prefer the {socialLinks('Soundcloud')}, there   
                    you can find some random playlists, nothing neat though. On {socialLinks('Discord')} I talk to my fellow gamers friends and play league and CS.
                    I post my code on {socialLinks('Github')}, you can find some projects and half done repos there.
                </p>
                <p>Here's my {socialLinks('Linkedin')}, don't tell anyone but I don't like this one.</p>

                <p>Finally, here are some other not so usefull links that nobody asked for: </p>
                <p className="inline-flex gap-1.5">{otherSocialLinks()}</p>

                <section aria-labelledby="sponsors-heading" className="mt-8 border-t border-neutral-300 pt-8 dark:border-neutral-700">
                    <h2 id="sponsors-heading" className="text-xl font-semibold text-neutral-700 dark:text-neutral-200">Sponsors</h2>
                    <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                        <div className="flex min-h-24 flex-col items-center justify-center gap-2 rounded border border-neutral-300 bg-white p-4 text-center dark:border-neutral-700 dark:bg-neutral-900">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/8/82/Banco_Master_logo.png" alt="Banco Master" className="max-h-12 max-w-full object-contain" />
                        </div>
                        <div className="flex min-h-24 flex-col items-center justify-center gap-2 rounded border border-neutral-300 bg-white p-4 text-center dark:border-neutral-700 dark:bg-neutral-900">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/e/eb/Theranos_Logo.svg" alt="Theranos" className="max-h-12 max-w-full object-contain" />
                        </div>
                        <div className="flex min-h-24 flex-col items-center justify-center gap-2 rounded border border-neutral-300 bg-white p-4 text-center dark:border-neutral-700 dark:bg-neutral-900">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/6/68/FTX_logo.svg" alt="FTX" className="max-h-12 max-w-full object-contain" />
                        </div>
                        <div className="flex min-h-24 flex-col items-center justify-center gap-2 rounded border border-neutral-300 bg-white p-4 text-center dark:border-neutral-700 dark:bg-neutral-900">
                            <img src="https://upload.wikimedia.org/wikipedia/de/f/f5/Logo_Force_India_F1.svg?utm_source=de.wikipedia.org&utm_campaign=index&utm_content=original" alt="Force India" className=" max-h-14 object-contain" />
                        </div>
                        <div className="col-span-2 flex min-h-24 flex-col items-center justify-center gap-2 rounded border border-neutral-300 bg-white p-4 text-center dark:border-neutral-700 dark:bg-neutral-900 sm:col-span-1">
                            <img src="https://th.bing.com/th/id/OIP.U02nvY4gZ7mnrZKXKMzQcwAAAA?r=0&o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3" alt="" className="max-h-24  object-contain" />
                        </div>
                    </div>
                </section>

            </div>
        </div>
    )
}