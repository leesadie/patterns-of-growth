'use client';

import { font_head } from "@/app/fonts";
import Image from "next/image";

const Hero = () => {
    return (
        <div id="hero" className="flex flex-col w-screen h-screen items-center justify-center bg-herobg">
            <div className={`md:text-6xl text-4xl text-white text-center ${font_head.className}`}>
                Patterns of <br /> Growth
            </div>
            <div className="md:text-lg text-sm text-white md:w-104 w-80 pt-10 text-center">
                Mapping the trajectory of AI model development across time, geography, and use of resources
            </div>
            <div className="pt-20">
                <div className="flex flex-row gap-4 text-white md:text-base text-sm">
                    <div>
                        Rafa Africa,
                    </div>
                    <div>
                        Ignacio Mijares,
                    </div>
                    <div>
                        Sadie Lee
                    </div>
                </div>
            </div>
            <div className="pt-2 text-white md:text-base text-sm">
                DSCI 320  •  2025
            </div>
            <div className="mt-20">
                <Image 
                    src='/images/hero.svg'
                    alt="hero"
                    height={500}
                    width={500}
                    className="md:w-full w-80"
                />
            </div>
        </div>
    );
}

export default Hero;