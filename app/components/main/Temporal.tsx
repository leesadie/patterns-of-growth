'use client';

import { font_bold, font_med, font_head } from "@/app/fonts";
import Accordion from "../interaction/Accordion";
import AccordionItem from "../interaction/AccordionItem";
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
            <div className={`text-3xl ${font_head.className}`}>
                Temporal patterns
            </div>

            {/* VIEW 1 */}
            <ChartWrapper maxWidth={1000} className="pr-20" outerClass="pt-12" id="view1">
                <Chart path="/charts/temporal/chart1.json" id="chart1" />
            </ChartWrapper>
            <div className="pt-8">
                <Accordion>
                    <AccordionItem title="Questions" defaultOpen>
                        <div className="pt-2">
                            <span>
                                This view aims to answer,
                            </span>
                            <span className={`pl-1`}>
                                "How have training compute, parameter count, power draw, training cost, and training time scaled over time, and how do these trends differ across domains, countries, and organization types?"
                            </span>
                            <span>
                                .
                            </span>
                        </div>
                    </AccordionItem>
                    <AccordionItem title="Analytic tasks">
                        <div className="flex flex-col gap-1 pt-2">
                            <div className="flex flex-row gap-1">
                                <div className={`${font_med.className}`}>
                                    Characterize distribution:
                                </div>
                                <div>
                                    How have model training attributes scaled over time?
                                </div>
                            </div>
                            <div className="flex flex-row gap-1">
                                <div className={`${font_med.className}`}>
                                    Correlate:
                                </div>
                                <div>
                                    How do model training attributes correlate with domain and organization types?
                                </div>
                            </div>
                            <div className="flex flex-row gap-1">
                                <div className={`${font_med.className}`}>
                                    Find anomalies:
                                </div>
                                <div>
                                    Are there significant temporal breakpoints in the scaling of model training?
                                </div>
                            </div>
                        </div>
                    </AccordionItem>
                </Accordion>
            </div>
            
            {/* VIEW 2 */}
            <ChartWrapper maxWidth={1100} outerClass="pt-32" id="view2">
                <Chart path="/charts/temporal/chart2.json" id="chart2"/>
            </ChartWrapper>
            <div className="pt-8">
                <Accordion>
                    <AccordionItem title="Questions" defaultOpen>
                        <div className="pt-2">
                            <span>
                                This view aims to answer,
                            </span>
                            <span className={`pl-1`}>
                                "How have model accessibility levels changed over time, and how does this correlate with training compute?"
                            </span>
                            <span>
                                .
                            </span>
                        </div>
                    </AccordionItem>
                    <AccordionItem title="Analytic tasks">
                        <div className="flex flex-col gap-1 pt-2">
                            <div className="flex flex-row gap-1">
                                <div className={`${font_med.className}`}>
                                    Characterize distribution:
                                </div>
                                <div>
                                    How has the model accessibility levels changed over time?
                                </div>
                            </div>
                            <div className="flex flex-row gap-1">
                                <div className={`${font_med.className}`}>
                                    Correlate:
                                </div>
                                <div>
                                    How does model accessibility correlate with training compute?
                                </div>
                            </div>
                        </div>
                    </AccordionItem>
                </Accordion>
            </div>

            {/* VIEW 3 */}
            <ChartWrapper maxWidth={1000} outerClass="pt-32" id="view3">
                <Chart path="/charts/temporal/chart3.json" id="chart3"/>
            </ChartWrapper>
            <div className="pt-8">
                <Accordion>
                    <AccordionItem title="Questions" defaultOpen>
                        <div className="pt-2">
                            <span>
                                This view aims to answer,
                            </span>
                            <span className={`pl-1`}>
                                "How has model resource efficiency (i.e. cost per FLOP, cost per parameter, compute per dollar, compute per watt) evolved over time, and do metrics exhibit diminishing returns?"
                            </span>
                            <span>
                                .
                            </span> 
                        </div>
                    </AccordionItem>
                    <AccordionItem title="Analytic tasks">
                        <div className="flex flex-col gap-1 pt-2">
                            <div className="flex flex-row gap-1">
                                <div className={`${font_med.className}`}>
                                    Compute derived value:
                                </div>
                                <div>
                                    What is a model’s cost per FLOP, cost per parameter, compute per dollar, and compute per watt?
                                </div>
                            </div>
                            <div className="flex flex-row gap-1">
                                <div className={`${font_med.className}`}>
                                    Compute derived value:
                                </div>
                                <div>
                                    What is the composite resource efficiency index for each year?
                                </div>
                            </div>
                            <div className="flex flex-row gap-1">
                                <div className={`${font_med.className}`}>
                                    Characterize distribution:
                                </div>
                                <div>
                                    How have efficiency metrics changed over time?
                                </div>
                            </div>
                        </div>
                    </AccordionItem>
                </Accordion>
            </div>
        </div>
    );
}

export default Temporal;