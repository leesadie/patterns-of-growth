'use client';

interface AccordionProps {
    children: React.ReactNode;
}

export default function Accordion({ children }: AccordionProps) {
    return <div className="w-full">{children}</div>
}