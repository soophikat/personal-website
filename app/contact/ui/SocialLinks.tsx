'use client'
import MyLink from "@/app/ui/MyLink";
import { useState } from "react";
import { IconType } from "react-icons";
import { 
    FaTumblr,
    FaSquareTumblr,
    FaInstagram, 
    FaSpotify,
    FaSoundcloud,
    FaGithub,
    FaYoutube,
    FaDiscord,
    FaLinkedin,
} from "react-icons/fa6";
import { ImSoundcloud2 } from "react-icons/im";

const links = [
    { href: "https://www.tumblr.com/sophia-romantica", name: 'Tumblr', icon: FaSquareTumblr, color: "#36465D", customClass: "group-hover:color-tumblr " },
    { href: "https://github.com/soophikat", name: 'Github', icon: FaGithub , color: "#FFFFFF", customClass: "dark:group-hover:color-github group-hover:text-black" },
    { href: "https://www.instagram.com/soophi.kat/", name: 'Instagram', icon: FaInstagram , color: "#FF0069", customClass: "group-hover:color-instagram" },
    { href: "https://open.spotify.com/user/u008sqwwc8nr9i4gvgn4snjuy", name: 'Spotify', icon: FaSpotify , color: "#1ED760", customClass: "group-hover:color-spotify" },
    { href: "https://soundcloud.com/sxpphickat", name: 'Soundcloud', icon: ImSoundcloud2 , color: "#FF5500", customClass: "rounded-md overflow-hidden group-hover:color-soundcloud" },
    { href: "https://www.youtube.com/@soophia-studies", name: 'Youtube', icon: FaYoutube , color: "#FF0000", customClass: "group-hover:color-youtube" },
    { href: "https://discord.com/users/318138449259528194", name: 'Discord', icon: FaDiscord , color: "#5865F2", customClass: "group-hover:color-discord" },
    { href: "https://www.linkedin.com/in/sophia-pr/", name: 'Linkedin', icon: FaLinkedin , color: "#0077B5", customClass: "group-hover:color-linkedin" },
]


export default function socialLinks(name: string) {
    const link = links.find(link => link.name === name)

    console.log(link)
    if (!link) return ;

    return (
        <SocialLink 
        key={link.href}
        name={link.name}
        href={link.href}
        icon={link.icon}
        color={link.color}
        customClass={link.customClass}/>
    )
}

function SocialLink({href, icon: Icon, name, color, customClass}: {href: string, icon: IconType, name: string, color: string, customClass: string}) {
    const [isHovered, setIsHovered] = useState(false)

    return (
        <MyLink target='_blank' className={`text-neutral-600 dark:text-neutral-600 group inline-flex gap-0.5 `} href={href}>
            <span className="flex items-center">
                <Icon
                    className={`${customClass} transition-colors duration-300 ease-out inline dark:text-neutral-300 `}
                />
            </span>

            <span className=" transition-colors duration-300 ease-out dark:text-neutral-300 dark:group-hover:text-white group-hover:text-black">{name}</span>
        </MyLink>
    )
}