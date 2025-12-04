'use client';

import { font_head } from "@/app/fonts";
import Image from "next/image";

const Hero = () => {
    return (
        <div id="hero" className="flex flex-col w-screen h-screen items-center justify-center bg-herobg">
            <div className={`text-6xl text-white text-center ${font_head.className}`}>
                Patterns of <br /> Growth
            </div>
            <div className="text-lg text-white w-104 pt-10 text-center">
                Mapping the trajectory of AI model development across time, geography, and use of resources
            </div>
            <div className="pt-20">
                <div className="flex flex-row gap-4 text-white">
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
            <div className="pt-2 text-white">
                DSCI 320  •  2025
            </div>
            <div className="mt-20">
                <Image 
                    src='/images/hero.svg'
                    alt="hero"
                    height={500}
                    width={500}
                />
            </div>
        </div>
    );
}

export default Hero;