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
            <hr className="mt-20 mb-10 w-full border-t-5 border-herobg" />
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

            <div className="pt-12">
                The United States and China lead global AI development in terms of the total number of AI models released over time. 
                This is expected, given that many of the institutions that are key players in AI development are based in the United States, such as OpenAI, Google, Meta AI, and NVIDIA. 
            </div>
            <div className="pt-4">
                Also expected are the remainder of the countries which make up the top five. Namely, the United Kingdom is home to Google DeepMind, and Canada is home to academic institutions that led key methodological innovations particularly in the earlier stages of AI, such as backpropagation and the ReLU activation function.
            </div>

            <hr className="my-24 w-full border-t border-lightgray" />

            {/* VIEW 2 */}
            <div className="">
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

            <div className="pt-12">
                Reflecting the top countries in terms of number of AI models released, it's interesting to note that while both the United States and China produce large models, the United States has greater variation in its export controls on semiconductors and intensity of AI-related publications.
                Whereas, China tends to have low export controls and a high intensity of AI-related publications.
            </div>
            <div className="pt-2">
                Further, for the United States, the distribution of training compute is fairly comparable across all levels of export controls, indicating that export controls have not significantly limited available training compute.
            </div>

            <hr className="my-24 w-full border-t border-lightgray" />

            {/* VIEW 3 */}
            <div className="">
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

            <div className="pt-12">
                At both a country-level and organization-level, compute is not significantly related to model accessibility, reflecting the earlier temporal findings. 
            </div>
        </div>
    );
}

export default Geographic;