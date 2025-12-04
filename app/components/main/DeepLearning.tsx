'use client';

import { font_head, font_med } from "@/app/fonts";
import ChartWrapper from "../vis/ChartWrapper";

// Import and render Altair charts dynamically - allow for interactions
import dynamic from "next/dynamic";
const Chart = dynamic(() => import('../vis/Chart'), {
    ssr: false,
    loading: () => <div>Loading chart...</div>
})

const DeepLearning = () => {
    return (
        <div>
            <hr className="mt-20 mb-10 text-herobg w-full"/>
            <div className="flex flex-row gap-5">
                <div className={`text-2xl ${font_med.className}`}>
                    IV
                </div>
                <div className={`text-2xl ${font_med.className}`}>
                    Resource and efficiency patterns
                </div>
            </div>
            <div className="pt-10">
                <span>
                    Resource and efficiency patterns examine how model efficiency has changed across the deep learning era (2010-2025), how resource usage varies across frontier and non-frontier models, and how these resource efficiency metrics correlate with each other.
                </span>
                <span className={`pl-1 ${font_med.className}`}>
                    First, how has model efficiency changed over time, and how do release patterns contextualize these changes?
                </span>
            </div>

            {/* VIEW 1 */}
            <ChartWrapper maxWidth={1000} className="" outerClass="pt-20" id="efficiency_view1">
                <Chart path="/charts/deeplearning/chart1_dle.json" id="chart1" />
            </ChartWrapper>

            {/* VIEW 2 */}
            <div className="pt-32">
                <span>
                    We then examine,
                </span>
                <span className={`pl-1 ${font_med.className}`}>
                    how has training compute and training cost changed over time for frontier versus non-frontier models?
                </span>
            </div>

            <ChartWrapper maxWidth={1100} className="" outerClass="pt-20" id="efficiency_view2">
                <Chart path="/charts/deeplearning/chart2_dle.json" id="chart1" />
            </ChartWrapper>

            {/* VIEW 3 */}
            <div className="pt-32">
                <span>
                    Finally,
                </span>
                <span className={`pl-1 ${font_med.className}`}>
                    how do efficiency, cost, and scale metrics correlate with each other and how have these relations changed across time?
                </span>
            </div>

            <ChartWrapper maxWidth={1100} className="" outerClass="pt-20" id="efficiency_view3">
                <Chart path="/charts/deeplearning/chart3_dle.json" id="chart1" />
            </ChartWrapper>
        </div>
    );
}

export default DeepLearning;