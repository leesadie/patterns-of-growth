'use client';

import { useEffect, useState, useRef } from "react";

interface ChartProps {
    path: string;
    width?: string | number;
    height?: string | number;
    id?: string;
}

export default function Chart({ path, width='100%', height='100%', id}: ChartProps) {
    const chartRef = useRef<HTMLDivElement>(null);
    const [isClient, setIsClient] = useState(false);

    // Ensure fully client-side
    useEffect(() => setIsClient(true), [])

    // Embed chart
    useEffect(() => {
        if (!isClient || !chartRef.current) return;

        let view: any = null;

        const loadChart = async() => {
            try {
                // Import vega-embed dynamically
                const vegaEmbed = (await import('vega-embed')).default;

                const res = await fetch(path); // path to JSON
                const spec = await res.json();

                // Store for cleanup
                const result = await vegaEmbed(chartRef.current!, spec, {
                    actions: false,
                    renderer: 'canvas'
                });

                view = result.view
            } catch (err) {
                console.error("Failed to load Altair chart:", err)
            }
        };

        loadChart();

        // Cleanup
        return () => {
            if (view) {
                view.finalize();
            }
        };
    }, [isClient, path]);

    return (
        <div 
            ref={chartRef}
            id={id}
            style={{ width, height }}
        />
    );
}