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
                Sadie: Temporal patterns
            </div>

            {/* VIEW 1 */}
            <div className={`pt-6 text-lg ${font_med.className}`}>
                View 1 - AI Model Progress Over Time
            </div>
            <div className="pt-6">
                <Accordion>
                    <AccordionItem title="Questions">
                        <div className="pt-2">
                            <span>
                                This view aims to answer,
                            </span>
                            <span className={`pl-1 ${font_med.className}`}>
                                "How have training compute, parameter count, power draw, training cost, and training time scaled over time, and how do these trends differ across domains, countries, and organization types?"
                            </span>
                            <span>
                                .
                            </span>
                        </div>
                    </AccordionItem>
                    <AccordionItem title="Low-level tasks">
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
            <ChartWrapper maxWidth={1000} className="pr-20" outerClass="pt-12">
                <Chart path="/charts/temporal/chart1.json" id="chart1" />
            </ChartWrapper>
            <div className="pt-8">
                <Accordion>
                    <AccordionItem title="Description and characteristics">
                        <div className="flex flex-col gap-1 pt-2">
                            <div className={`${font_med.className}`}>
                                Marks
                            </div>
                            <div>
                                Both charts use points. Chart 1 uses hexbins as shape where individual models are aggregated by log-mean of the selected y-axis metric. Chart 2 uses filled circles as shape, which each represent an individual model.
                            </div>
                        </div>
                        <div className="flex flex-col gap-1 pt-3">
                            <div className={`${font_med.className}`}>
                                Channels
                            </div>
                            <div>
                                Chart 1 (hexbin) uses x-position for publication year, y-position for selected y-axis metric, and color (saturation) for level of y-axis metric. 
                                Discriminability is exploited such that individual points can be easily distinguished via aggregation. 
                                Aggregating individual models into hexbins is well-aligned to the analytic task of characterizing the overall distribution of how model training attributes have scaled over time
                                by representing all models across the full range of years, while reducing overplotting. By visualizing the overall distribution, determining if temporal breakpoints exist is also achievable.
                            </div>
                            <div className="pt-1">
                                Chart 2 (scatter) uses x-position for publication year, y-position for selected y-axis metric, and color (hue) if a category is selected via radio buttons.
                                Separability is exploited to encourage users to concentrate on each individual point (model) sequentially. 
                                Color hue for each category aligns with the task of understanding the relationship between model training attributes and categories such as domain and organization type. 
                            </div>
                        </div>
                    </AccordionItem>
                    <AccordionItem title="Interaction">
                        <div className="flex flex-col gap-1 pt-2">
                            <div className={`${font_med.className}`}>
                                Indirect manipulations
                            </div>
                            <div className="flex flex-col gap-1">
                                <div>
                                    1. Y-axis dropdown selection: Selects a metric and changes the y-axis of both charts simultaneously. Default is training compute.
                                </div>
                                <div>
                                    2. Categorize models radio buttons (chart 2): Colors model points by domain, country, or organization type. Default is none.
                                </div>
                                <div>
                                    3. Deep learning era checkbox (chart 1): Overlays a box and text to mark the deep learning era (2010-current). Default is empty.
                                </div>
                                <div>
                                    4. Model name regex search input (chart 2): Search for a model name in the brush selected year range. Default is empty.
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-1 pt-3">
                            <div className={`${font_med.className}`}>
                                Direct manipulations
                            </div>
                            <div className="flex flex-col gap-1">
                                <div>
                                    1. Bidirectional
                                </div>
                                <div className="pl-5 flex flex-col gap-1">
                                    <div>
                                        a. X-axis (year) brush selection in chart 1 filters chart 2.
                                    </div>
                                    <div>
                                        b. Clicking on a point in chart 2 maintains opacity of the associated hexbin and reduces opacity of other points in chart 1.
                                    </div>
                                </div>
                                <div>
                                    2. Selecting a category on the legend in chart 2 when models are categorized maintains opacity of points in that category and reduces opacity of other points.
                                </div>
                            </div>
                        </div>
                    </AccordionItem>
                    <AccordionItem title="Critique">
                        <div className="pt-2">
                            While this view aimed to reduce overlap and high concentration of model points in the deep learning era, for years 2018 to 2025, points still display non-trivial overlap in the scatterplot (chart 2) given the many models of similar scale (e.g. in compute or parameters) within these years.
                        </div>
                        <div className="pt-4">
                            Additionally, since certain metrics such as power draw and training cost were not extensively recorded until around 2010, when the x-axis brush selection is before 2010, chart 2 is empty. 
                        </div>
                        <div className="pt-4">
                            Although the many interactions used in this view enable the user to actively engage with the data, this may require significant time and attention even with the imposition of defaults, thereby increasing cognitive load and perceptual costs.
                        </div>
                    </AccordionItem>
                </Accordion>
            </div>
            
            {/* VIEW 2 */}
            <div className={`pt-32 text-lg ${font_med.className}`}>
                View 2 - Evolution of Model Accessibility
            </div>
            <div className="pt-6">
                <Accordion>
                    <AccordionItem title="Questions">
                        <div className="pt-2">
                            <span>
                                This view aims to answer,
                            </span>
                            <span className={`pl-1 ${font_med.className}`}>
                                "How have model accessibility levels changed over time, and how does this correlate with training compute?"
                            </span>
                            <span>
                                .
                            </span>
                        </div>
                    </AccordionItem>
                    <AccordionItem title="Low-level tasks">
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
            <ChartWrapper maxWidth={1100} outerClass="pt-12">
                <Chart path="/charts/temporal/chart2.json" id="chart2"/>
            </ChartWrapper>
            <div className="pt-8">
                <Accordion>
                    <AccordionItem title="Description and characteristics">
                        <div className="flex flex-col gap-1 pt-2">
                            <div className={`${font_med.className}`}>
                                Marks
                            </div>
                            <div>
                                Chart 1 uses lines which represent log-mean training compute in FLOPs over time. Chart 2 uses lines (bars) to indicate the specific model accessibility levels for the brush selected year range.
                            </div>
                        </div>
                        <div className="flex flex-col gap-1 pt-3">
                            <div className={`${font_med.className}`}>
                                Channels
                            </div>
                            <div>
                                Chart 1 (line) uses x-position for publication year, y-position for log-mean training compute in FLOPs, and color (hue) to categorize open versus closed models.
                                Accuracy is exploited in order to visualize differences in compute between open and closed models, with the common x-position and y-position scales. 
                            </div>
                            <div className="pt-1">
                                Chart 2 (bar) uses x-position for model count, y-position for model accessibility level, and color (saturation) for model accessibility level. 
                                Y-position of model accessibility levels are sorted from most open (unrestricted open weights) to least open (unreleased), and unknown.
                                Discriminability is exploited such that the difference in counts for each model accessibility level can be clearly seen based on the x-position of the bar as well as the distinct color saturation for each level.
                            </div>
                        </div>
                    </AccordionItem>
                    <AccordionItem title="Interaction">
                        <div className="flex flex-col gap-1 pt-2">
                            <div className={`${font_med.className}`}>
                                Direct manipulations
                            </div>
                            <div className="flex flex-col gap-1">
                                <div>
                                    1. X-axis (year) brush selection in chart 1 filters chart 2.
                                </div>
                                <div>
                                    2. Selecting a category on the legend in chart 2 maintains opacity of points in that category and reduces opacity of other points.
                                </div>
                                <div>
                                    3. Selecting a bar in chart 2 overlays text for the model with the highest amount of training compute in that category, given the year range selected by the brush.
                                </div>
                            </div>
                        </div>
                    </AccordionItem>
                    <AccordionItem title="Critique">
                        <div className="pt-2">
                            While bars in chart 2 are sorted from most open to least open, sorting is not necessarily in numerical order. This may increase cognitive load and be unintuitive to users.
                        </div>
                        <div className="pt-4">
                            From 1950 to 1990, all models have an unknown model accessibility level. It may then be difficult to fully understand how model accessibility has changed across the entire year range, and particularly from the pre deep learning era to the deep learning era.  
                        </div>
                        <div className="pt-4">
                            Given the aggregation of models into open versus closed in chart 1, it may be difficult to see how a specific model accessibility level, e.g. unrestricted open weights, is correlated with training compute. Although text overlays on click display the model with the highest compute for that accessibility level within the year range, attempting to identify the correlation over time may require significant attentional demand.
                        </div>
                    </AccordionItem>
                </Accordion>
            </div>

            {/* VIEW 3 */}
            <div className={`pt-32 text-lg ${font_med.className}`}>
                View 3 - Resource Efficiency Over TIme
            </div>
            <div className="pt-6">
                <Accordion>
                    <AccordionItem title="Questions">
                        <div className="pt-2">
                            <span>
                                This view aims to answer,
                            </span>
                            <span className={`pl-1 ${font_med.className}`}>
                                "How has model resource efficiency (i.e. cost per FLOP, cost per parameter, compute per dollar, compute per watt) evolved over time, and do metrics exhibit diminishing returns?"
                            </span>
                            <span>
                                .
                            </span> 
                        </div>
                    </AccordionItem>
                    <AccordionItem title="Low-level tasks">
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
            <ChartWrapper maxWidth={1000} outerClass="pt-12">
                <Chart path="/charts/temporal/chart3.json" id="chart3"/>
            </ChartWrapper>
            <div className="pt-8">
                <Accordion>
                    <AccordionItem title="Description and characteristics">
                        <div className="flex flex-col gap-1 pt-2">
                            <div className={`${font_med.className}`}>
                                Marks
                            </div>
                            <div>
                                Chart 1 uses a line which represents the mean composite resource efficiency index over time. 
                                Chart 2 uses lines to indicate the composition of metric values (cost per FLOP, cost per parameter, compute per dollar, and compute per watt) for the brush selected year range.
                                Chart 3 uses points with a filled circle shape for each individual model.
                            </div>
                        </div>
                        <div className="flex flex-col gap-1 pt-3">
                            <div className={`${font_med.className}`}>
                                Channels
                            </div>
                            <div>
                                Chart 1 (line) uses x-position for publication year and y-position for mean composite efficiency. 
                                Accuracy is exploited given the common x-position and y-position scales to visualize how overall resource efficiency has changed over time. 
                                An overall line is well-aligned to the task of characterizing the distribution of how efficiency metrics have changed over time.
                            </div>
                            <div className="pt-1">
                                Chart 2 (line - bars) uses x-position for publication year (ordinal scale), y-position for normalized metric value, and color (hue) for normalized metric category.
                                Grouping is exploited as metrics are grouped by year in order to compare between years and metric differences within each year. 
                                Visualizing the composition of metrics is also aligned to the task of understanding how each efficiency metric has changed over time.
                            </div>
                            <div className="pt-1">
                                Chart 3 (scatter) uses x-position for composite efficiency index and y-position for training compute in FLOPs. 
                                Accuracy is exploited with the common x-position and y-position scales to visualize how a model’s composite resource efficiency compares to its scale in terms of compute. 
                            </div>
                        </div>
                    </AccordionItem>
                    <AccordionItem title="Interaction">
                        <div className="flex flex-col gap-1 pt-2">
                            <div className={`${font_med.className}`}>
                                Indirect manipulations
                            </div>
                            <div className="flex flex-col gap-1">
                                <div>
                                    1. Yearly percent change checkbox (chart 1): Overlays text above the line to mark the year-to-year percent change in composite efficiency index. Default is empty.
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-1 pt-3">
                            <div className={`${font_med.className}`}>
                                Direct manipulations
                            </div>
                            <div className="flex flex-col gap-1">
                                <div>
                                    1. X-axis (year) brush selection in chart 1 filters chart 2 and chart 3.
                                </div>
                            </div>
                        </div>
                    </AccordionItem>
                    <AccordionItem title="Critique">
                        <div className="pt-2">
                            Since metrics such as power draw were only consistently reported starting around 2010, this chart only displays data from 2010-2025, i.e. the deep learning era. This may not necessarily answer the question of how model resource efficiency has evolved over time, rather, it is more aligned with answering how model resource efficiency has evolved across the deep learning era. 
                        </div>
                        <div className="pt-4">
                            Points in the scatterplot (chart 3) are also highly clustered, making it difficult to determine individual points. Additionally, while the scatterplot explores compute versus the aggregated efficiency index, identifying which models contribute to which specific metric for the year range may have been more beneficial to understanding how metrics have changed over time in relation to model scale.
                        </div>
                    </AccordionItem>
                </Accordion>
            </div>

            {/* Summary */}
            <div className={`pt-12 text-lg ${font_med.className}`}>
                Individual summary
            </div>
            <div className="pt-2">
                Specific to my theme of temporal patterns, I have learnt that resource efficiency has not shown diminishing returns, i.e. as models have scaled over time in terms of training compute, average composite efficiency has also grown. Additionally, access to models has grown irrespective of scale in compute, with more models generally having open weights. 
            </div>
            <div className="pt-2">
                By breaking down the data visualization process into separate parts to create these views, e.g. identifying low-level analytic tasks and making choices to use certain marks and channels, I have found that doing so enables more effective and appropriate visualizations for a question. Further, I now understand to a greater extent the benefit of using data visualization for large datasets, given the size of our own dataset, such that it is significantly easier to identify patterns and relationships. 
            </div>
            <div className="pt-2">
                Regarding what I would do differently, I would want to get more feedback as to how my individual visualizations and overall views could be improved at various points throughout the visualization process. I would specifically look to people who fit the intended audience, and not rely only on TA or within-team feedback. 
            </div>
        </div>
    );
}

export default Temporal;