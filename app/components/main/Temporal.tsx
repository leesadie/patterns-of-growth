'use client';

import { font_bold, font_med } from "@/app/fonts";

// Import and render Altair charts dynamically - allow for interactions
import dynamic from "next/dynamic";
const Chart = dynamic(() => import('../vis/Chart'), {
    ssr: false,
    loading: () => <div>Loading chart...</div>
})

const Temporal = () => {
    return (
        <div>
            <div className={`text-2xl ${font_bold.className}`}>
                Temporal patterns
            </div>
            {/* VIEW 1 */}
            <div className={`pt-4 text-xl ${font_med.className}`}>
                AI model progress over time
            </div>
            <div className="pt-4 w-full max-w-[800px]">
                <Chart path="/charts/sadie/chart1.json" id="chart1"/>
            </div>
            <div className={`pt-4 ${font_bold.className}`}>
                About
            </div>
            <div className="pt-2">
                This view aims to answer the following question: "How have training compute, parameter count, power draw, training cost, and training time scaled over time, and how do these trends differ across domains, countries, and organization types?". A hexbin plot visualizes the aggregated mean of the selected y-axis metric, with an x-axis brush linked to the below scatterplot. Through this, the high concentration and overlap of points in the deep learning era (2010-present) is addressed where users are able to view overall longitudinal patterns while maintaining model-level granularity. 
            </div>
            <div className={`pt-4 ${font_bold.className}`}>
                Analytic tasks
            </div>
            <div className="pt-2">
                <ul className="list-disc list-inside ml-2">
                    <li>Characterize distribution: How have model training attributes scaled over time?</li>
                    <li>Correlate: How do model training attributes correlate with domain and organization types?</li>
                    <li>Find anomalies: Are there significant temporal breakpoints in the scaling of model training?</li>
                </ul>
            </div>
            <div className={`pt-4 ${font_bold.className}`}>
                Visualization description
            </div>
            <div className={`pt-4 ${font_bold.className}`}>
                Interaction
            </div>
            <div className={`pt-4 ${font_bold.className}`}>
                Critique
            </div>
        </div>
    );
}

export default Temporal;