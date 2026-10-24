'use client'
import { ReactElement, useEffect, useState } from "react";
import { LuSun } from "react-icons/lu";
import { LuMoonStar } from "react-icons/lu";
import { LuComputer } from "react-icons/lu";
import { useTheme } from "next-themes";



export default function ThemeToggle() {
    const { theme, setTheme } = useTheme()
    const [ mounted, setMounted ] = useState(false)
    const [ mystate, setMystate ] = useState('')

    useEffect(() => {
        setMystate('trigger')
    })


    return (
        <div className="rounded-full border inline-flex p-0.5  border-neutral-300 dark:border-neutral-800 relative dark:bg-neutral-950 bg-neutral-50 ">
            {([
                [<LuSun  />, "light"],
                [<LuMoonStar />, "dark"],
                [<LuComputer />, "system"]
            ] as const).map( ([icon, myTheme]) => {
                return (
                    <button suppressHydrationWarning
                        key={myTheme}
                        onClick={() => setTheme(myTheme)} 
                        className={`${mystate} rounded-full p-2 transition-colors ${myTheme === theme ? 'bg-neutral-200 dark:bg-neutral-800 dark:text-white text-black' : '' }`}>
                        {icon}
                    </button>
                )
            })}

        </div>
    );
}