'use client';

import { font_head, font_med } from "@/app/fonts";
import ChartWrapper from "../vis/ChartWrapper";

// Import and render Altair charts dynamically - allow for interactions
import dynamic from "next/dynamic";
const Chart = dynamic(() => import('../vis/Chart'), {
    ssr: false,
    loading: () => <div>Loading chart...</div>
})

const Geographic = () => {
    return (
        <div>
            <hr className="mt-20 mb-10 text-herobg w-full"/>
            <div className="flex flex-row gap-5">
                <div className={`text-2xl ${font_med.className}`}>
                    III
                </div>
                <div className={`text-2xl ${font_med.className}`}>
                    Geographic patterns
                </div>
            </div>
            <div className="pt-10">
                <span>
                    Geographic patterns examine how model development is globally distributed, how a country's AI ecosystem are related to model size and parameters, and how model accessibility varies across the top producing countries.
                </span>
                <span className={`pl-1 ${font_med.className}`}>
                    To begin, what is the geographic distribution of the top 10 contributors to AI model releases?
                </span>
            </div>

            {/* VIEW 1 */}
            <ChartWrapper maxWidth={1400} className="" outerClass="pt-20" id="geo_view1">
                <Chart path="/charts/geographic/chart1_geo.json" id="chart1" />
            </ChartWrapper>

            {/* VIEW 2 */}
            <div className="pt-32">
                <span>
                    We then explore,
                </span>
                <span className={`pl-1 ${font_med.className}`}>
                    how do AI-related academic publication intensity and export controls on semiconductors relate to model size (parameters) and training compute across countries and organizations?
                </span>
            </div>

            <ChartWrapper maxWidth={900} outerClass="pt-12" id="geo_view2">
                <Chart path="/charts/geographic/chart3_geo.json" id="chart3"/>
            </ChartWrapper>

            {/* VIEW 3 */}
            <div className="pt-32">
                <span>
                    Once again considering compute as a key training resource, 
                </span>
                <span className={`pl-1 ${font_med.className}`}>
                    how does model accessibility vary across the top 10 model-producing countries, and how does training compute differ across accessibility levels?
                </span>
            </div>

            <ChartWrapper maxWidth={1100} outerClass="pt-12" id="geo_view3">
                <Chart path="/charts/geographic/chart2_geo.json" id="chart2"/>
            </ChartWrapper>
        </div>
    );
}

export default Geographic;