'use client';

import { font_bold } from "@/app/fonts";
import { GoArrowUpRight } from "react-icons/go";

const Hero = () => {
    return (
        <div className="flex flex-col mx-72 items-center">
            {/* TITLE */}
            <div
                id="title"
                className="flex flex-col pt-28"
            >
                <div className={`text-5xl/14 ${font_bold.className}`}>
                    Patterns of Growth: Mapping the Trajectory of AI Model Development
                </div>
            </div>

            {/* ABOUT */}
            <div className="flex flex-row justify-between pt-12 w-full">
                <div className="flex flex-col gap-4">
                    <div className="text-sm text-lightergray">
                        Authors
                    </div>
                    <div className="flex flex-row gap-3 text-sm text-darkgray">
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
                <div className="flex flex-col gap-4">
                    <div className="text-sm text-lightergray">
                        Published
                    </div>
                    <div className="text-sm text-darkgray">
                        November 30, 2025
                    </div>
                </div>
                <div className="flex flex-col gap-4">
                    <div className="text-sm text-lightergray">
                        Resources
                    </div>
                    <div className="flex flex-row gap-1 group cursor-pointer transition duration-200 ease-in-out text-darkgray">
                        <div className="text-sm group-hover:opacity-70">
                            Source code
                        </div>
                        <div className="pt-0.5 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-70 transition duration-200">
                            <GoArrowUpRight size={16}/>
                        </div>
                    </div>
                </div>
            </div>
            <hr className="mt-10 text-gray-300 w-full"/>
        </div>
    );
}

export default Hero;