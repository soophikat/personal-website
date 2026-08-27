'use client'
import ThemeToggle from "./ThemeToggle";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const links = [
    {
        name: 'Home',
        href: '/'
    },
    {
        name: 'Blog',
        href: '/blog'
    },
    {
        name: 'Gallery',
        href: '/gallery'
    },
    {
        name: 'Projects',
        href: '/projects'
    },
    {
        name: 'Contact',
        href: '/contact'
    },

]

export default function NavBar() {
    const pathname = usePathname()


    return (
        <div className="grid sm:flex grid-cols-2">
            <div className="sm:order-1 p-4 flex  items-center mr-auto  ">
                <Link className="" href={'/'}>
                    <Image
                        className="h-[70px] w-[70px] object-cover"
                        src={'/rio-futaba.gif'}
                        width={100}
                        height={100}
                        alt="rio futaba gif"
                    >
                    </Image>
                </Link>
            </div>
            <div className="text-lg sm:order-2 order-3 p-4 sm:p-8 sm:gap-6 gap-3 grid sm:grid-flow-col sm:justify-end items-center  ">
            {links.map((link) => {
                return (
                    <Link className={pathname === link.href ? 'dark:text-white text-black underline' : ''}
                    key={link.name} href={link.href}>{link.name}</Link>
                )
            })}
            </div>
            <div className="sm:order-3 order-2 pt-8 pr-4 justify-self-end">
                <ThemeToggle />
            </div>
        </div>
    )
}