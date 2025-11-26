'use client';

interface ChartWrapperProps {
    children: React.ReactNode;
    maxWidth?: number | string;
    className?: string; // extra classes for inner wrapper
    outerClass?: string; // extra classes for outer wrapper
}

// Creates full bleed wrapper to break out of set margins
export default function ChartWrapper({
    children,
    maxWidth = 950,
    className = "",
    outerClass = ""
}: ChartWrapperProps) {
    return (
        <div
            className={`
                relative
                left-1/2
                ml-[-50vw]
                w-screen
                ${outerClass}    
            `}
        >
            <div
                className={`mx-auto ${className}`}
                style={{ maxWidth }}
            >
                {children}
            </div>
        </div>
    );
}