'use client';

import { useState } from "react";
import { font_bold } from "@/app/fonts";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";

interface AccordionItemProps {
    title: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
}

export default function AccordionItem({ title, children, defaultOpen }: AccordionItemProps) {
    const [open, setOpen] = useState(defaultOpen);

    return (
        <div className="border-b border-evenlightergray">
            {/* Title */}
            <button
                onClick={() => setOpen(!open)}
                className={`w-full flex justify-between items-center py-4 text-left cursor-pointer ${font_bold.className}`}
            >
                <span>{title}</span>

                <MdOutlineKeyboardArrowDown 
                    className={`
                        h-6
                        w-6
                        transition-all
                        duration-300
                        ${open ? "rotate-180" : ""}    
                    `}
                />
            </button>

            {/* Content */}
            {open && (
                <div className="pb-4">
                    {children}
                </div>
            )}
        </div>
    );
}