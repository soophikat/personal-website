import Link from "next/link";
import { Children } from "react";

export default function MyLink({href, target = '', children, className}: { href: string, target?: string, children: React.ReactNode, className: string}) {
    return (
        <Link 
            className={`max-w-max dark:text-white text-black dark:hover:border-b-white hover:border-b-black transition-colors border-b rounded-none dark:border-b-neutral-700 border-b-neutral-300  ${className}`}
            href={href}
            target={target}
            >
            {children}
        </Link>
    )
}