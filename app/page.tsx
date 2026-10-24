'use client'
import Image from "next/image";
import ThemeToggle from "./ui/ThemeToggle";
import { useEffect } from "react";
import NavBar from "./ui/Navbar";
import MyLink from "./ui/MyLink";

export default function Home() {
  return (
    <div className="flex p-4 flex-col gap-8 justify-start items-center w-full h-full ">
      <main className="max-w-5xl p-8 flex flex-col justify-center items-center ">
        <h1 className="text-3xl sm:text-5xl font-bold italic mb-8 dark:text-white text-neutral-800">Hi O_o, I'm <span className=" bg-linear-65 from-purple-500 to-pink-500 bg-clip-text text-transparent">Soophia</span>.</h1>
        <p className="">A Software engineer/dev Currently based in Rio de Janeiro, Brazil that likes games (a few), coding, listening to music and gifs. This is my website btw O_o !!</p>
        <p className="mt-4">Here you can find a little bit about me, on <MyLink className="" href="https://sophia-romantica.tumblr.com/" target="_blank" >blog ↗</MyLink> you can read some yapping, I generally blog on Tumblr, but, I'm thinking about posting here too,
        on <MyLink className="" href="/gallery">gallery</MyLink> I'll post some photos maybe, I'm tring to learn some photography, well on <MyLink className="" href="/projects">projects</MyLink> are some of my coding projets, there're no much, but I'm working on It
        and on <MyLink href="/contact" className="">contact</MyLink> there are some links to social media and stuff. !(some of these are under construction) </p>
        <img src="/rey-ayanami.webp" className="sm:w-[300px] w-[200px] mt-16" alt="rey-ayanami" />
      </main>
    </div>
  );
}


// https://88x31.nl/gifs/linuxnow2.gif
// https://88x31.nl/gifs/linux_mint.gif
// https://88x31.nl/gifs/mysqla.gif
// https://88x31.nl/gifs/ublock-now.png
// https://88x31.nl/gifs/ubuntu-88x31.gif
// http://www.textfiles.com/underconstruction/88x31/cs3.gif