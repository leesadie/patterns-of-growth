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
            <hr className="mt-20 mb-10 w-full border-t-5 border-herobg" />
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

            <div className="pt-12">
                Over time, it's clear that models have scaled across all of the attributes examined, particularly in terms of training compute required, number of trainable parameters, and training time. 
                It is notably more difficult to examine patterns over time for power draw and training cost, as these metrics were generally not recorded until after 2010. 
            </div>
            <div className="pt-4">
                The deep learning era (2010-2025) contains the highest concentration of model releases, as expected, and also shows an increase in usage for the metrics examined. 
                This implies the evident significance of the deep learning era as an inflection point in AI development, likely due to other factors such as the introduction of graphical processing units (GPUs) for general purpose parallel computing.
            </div>

            <hr className="my-24 w-full border-t border-lightgray" />

            {/* VIEW 2 */}
            <div className="">
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

            <div className="pt-12">
                Seeing how overall model scale has grown over time, it is significant to note that the use of these resources required to train AI models has become generally more efficient. 
                In many domains, scaling leads to increased expenses on a per-unit basis. Even in an algorithmic complexity sense, for example, more complex algorithms tend to have worse asymptotic constraints.
                The fact that larger AI models yield more efficient usage, e.g. lower cost per parameter and cost per FLOP, thus runs counter to traditional intuitions about scaling. 
            </div>
            <div className="pt-4">
                In other words, while most technologies show diminishing returns at high scale, there's no apparent saturation point yet for the large-scale AI models we're currently at. This could suggest that improving models by scaling up is a more efficient path.
            </div>

            <hr className="my-24 w-full border-t border-lightgray" />

            {/* VIEW 3 */}
            <div className="">
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

            <div className="pt-12">
                Models have changed in how they can be accessed and used by the public, with more institutions offering open weights, i.e. where a model's trained parameters are publicly shared, yet not having access be a significant factor in the scale of a model's compute.
                This means that some of the largest-scale models in terms of compute that have been trained to date generally have some level of transparency and accessibility. However, given this large scale, it also means that users would need the necessary computational power to actually use these weights efficiently, which may not be feasible. 
            </div>
        </div>
    );
}

export default Temporal;