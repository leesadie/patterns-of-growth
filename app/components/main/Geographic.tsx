'use client';

import { font_head } from "@/app/fonts";

// Import and render Altair charts dynamically - allow for interactions
import dynamic from "next/dynamic";
const Chart = dynamic(() => import('../vis/Chart'), {
    ssr: false,
    loading: () => <div>Loading chart...</div>
})

const Geographic = () => {
    return (
        <div>
            <div className={`text-3xl ${font_head.className}`}>
                Geographic patterns
            </div>

            {/* VIEW 1 */}
            <div className="pt-4">
                Stuff goes here
            </div>

            {/* VIEW 2 */}

            {/* VIEW 3 */}
        </div>
    );
}

export default Geographic;