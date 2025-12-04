'use client';

import { font_med } from "@/app/fonts";
import ChartWrapper from "../vis/ChartWrapper";

// Import and render Altair charts dynamically - allow for interactions
import dynamic from "next/dynamic";
const Chart = dynamic(() => import('../vis/Chart'), {
    ssr: false,
    loading: () => <div>Loading chart...</div>
})

const Temporal = () => {
    return (
        <div>
            <hr className="mt-12 mb-10 text-herobg w-full"/>
            <div className="flex flex-row gap-5">
                <div className={`text-2xl ${font_med.className}`}>
                    II
                </div>
                <div className={`text-2xl ${font_med.className}`}>
                    Temporal patterns
                </div>
            </div>
            <div className="pt-10">
                <span>
                    Temporal patterns examine how model training resources have changed over time, how those resources are used efficiently or otherwise, and how public access to a model changes in relation to compute as a training resource.
                </span>
                <span className={`pl-1 ${font_med.className}`}>
                    First, how have training compute, parameter count, power draw, training cost, and training time scaled over time, and how do these patterns differ across domains, countries, and organization types?
                </span>
            </div>

            {/* VIEW 1 */}
            <ChartWrapper maxWidth={1000} className="pr-20" outerClass="pt-12" id="view1">
                <Chart path="/charts/temporal/chart1.json" id="chart1" />
            </ChartWrapper>

            {/* VIEW 2 */}
            <div className="pt-32">
                <span>
                    With an understanding of the overall scaling of key training resources, we then examine,
                </span>
                <span className={`pl-1 ${font_med.className}`}>
                    how has model resource efficiency (i.e. cost per FLOP, cost per parameter, compute per dollar, compute per watt) evolved over time, and do metrics exhibit diminishing returns?
                </span>
            </div>

            <ChartWrapper maxWidth={1000} outerClass="pt-12" id="view2">
                <Chart path="/charts/temporal/chart3.json" id="chart3"/>
            </ChartWrapper>

            {/* VIEW 3 */}
            <div className="pt-32">
                <span>
                    Considering compute as a key training resource,
                </span>
                <span className={`pl-1 ${font_med.className}`}>
                    how have model accessibility levels changed over time, and how does this correlate with training compute?
                </span>
            </div>

            <ChartWrapper maxWidth={1100} outerClass="pt-12" id="view3">
                <Chart path="/charts/temporal/chart2.json" id="chart2"/>
            </ChartWrapper>
        </div>
    );
}

export default Temporal;