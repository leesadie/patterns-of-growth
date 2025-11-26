'use client';

import { useState } from "react";

interface Reference {
    ref: string;
    link: string;
}

interface RefHoverProps {
    children: React.ReactNode;
    references: Reference[];
}

export default function ReferenceHover({ children, references}: RefHoverProps) {
    const [show, setShow] = useState(false);

    return (
        <span
            className="relative inline-block"
            onMouseEnter={() => setShow(true)}
            onMouseLeave={() => setShow(false)}
        >
            {/* Ref number as inline text */}
            <span className="text-refblue cursor-default hover:opacity-70">
                {children}
            </span>

            {/* Popup */}
            {show && (
                <div
                    className="
                        absolute
                        left-0
                        p-4
                        rounded-md
                        bg-white
                        border
                        border-evenlightergray
                        z-50
                        whitespace-normal
                        max-w-[800px]
                        min-w-[350px]
                        text-sm
                    "
                >
                    {references.map((ref, i) => (
                        <div key={i} className="mb-3 last:mb-0">
                            <div className="flex">
                                <span className="mr-2 font-semibold">{i+1}.</span>
                                <span className="leading-snug">
                                    {ref.ref}{' '}
                                    <a
                                        href={ref.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-refblue underline hover:opacity-70 transition"
                                    >
                                        [Link]
                                    </a>
                                </span>
                            </div>
                            {i < references.length - 1 && (
                                <hr className="my-2 border-evenlightergray"/>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </span>
    );
}