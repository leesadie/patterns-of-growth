'use client';

import { useState, useEffect } from "react";
import { font_med, font_bold } from "@/app/fonts";

const sections = [
    { id: "intro", label: "Introduction" },
    { id: "temporal", label: "Temporal patterns" },
    { id: "geo", label: "Geographic patterns" },
    { id: "dle", label: "Deep learning era" },
    { id: "discussion", label: "Discussion" }
]

const Navbar = () => {
    const [activeSection, setActiveSection] = useState<string>("intro");
    const [isSticky, setIsSticky] = useState(false);

    // Sticky scroll
    useEffect(() => {
        const handleScroll = () => {
            const triggerPoint = (5 / 12) * window.innerHeight;

            setIsSticky(window.scrollY > triggerPoint);
        };

        window.addEventListener("scroll", handleScroll);

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Section visibility
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((e) => e.isIntersecting)
                    .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

                if (visible.length > 0) {
                    const newActive = visible[0].target.id;
                    setActiveSection(newActive);
                }
            },
            {
                threshold: [0.25, 0.5, 0.75],
            }
        );

        sections.forEach(({ id }) => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);

    // Scroll to section on click
    const handleClick = (id: string) => {
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
            setActiveSection(id);
        };
    }

    return (
        <nav
            className={`
                fixed
                block
                bg-white
                p-2
                w-fit
                flex-col
                space-y-2
                transition-all
                duration-300
                ease-in-out
                z-50
            `}
            style={{ left: "2.5rem", top: isSticky ? "1rem" : `${(5/12) * 100}vh` }}
        >
            <div className={`text-large ${font_bold.className}`}>
                Contents
            </div>

            {/* Sections */}
            {sections.map((s) => (
                <button
                    key={s.id}
                    onClick={(() => handleClick(s.id))}
                    className="flex items-center text-lightergray hover:opacity-70 text-sm transition cursor-pointer"
                >
                    <div className={`${font_med.className}`}>
                        {s.label}
                    </div>
                </button>
            ))}
        </nav>
    );
}

export default Navbar;