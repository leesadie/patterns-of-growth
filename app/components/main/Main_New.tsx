'use client';

import Hero from "./Hero_New";
import { font_med, font_bold } from "@/app/fonts";
import ReferenceHover from "../interaction/Reference";
import Navbar from "../nav/Navbar";

import Temporal from "./Temporal_New";
import Geographic from "./Geographic";
import DeepLearning from "./DeepLearning";

const Main_New = () => {
    return (
        <div>
            <Hero />

            <Navbar />

            {/* INTRO */}
            <section
                id="intro"
                className="flex flex-col mx-72 pt-12"
            >
                <hr className="mt-20 mb-10 text-herobg w-full"/>
                <div className="flex flex-row gap-5">
                    <div className={`text-2xl ${font_med.className}`}>
                        I
                    </div>
                    <div className={`text-2xl ${font_med.className}`}>
                        Introduction
                    </div>
                </div>
                <div className="pt-10">
                    Progress in artificial intelligence (AI) has been unusually rapid as a technological development, and has advanced at scale, with models growing by orders of magnitude across various dimensions of development.
                    Understanding how such rapid progress occurred requires tracing the technical lineage of modern models, from the scaling of compute and data usage, to the shifting geographic and institutional landscape.  
                </div>
                <div className="pt-4">
                    By tracing these patterns, we can begin to grasp the scale and scope of growth to better understand how AI systems have emerged and how their trajectories may continue to evolve.
                </div>
            </section>

            {/* TEMPORAL */}
            <section
                id="temporal"
                className="flex flex-col mx-72 pt-8"
            >
                <Temporal />
            </section>

            {/* GEOGRAPHIC */}
            <section
                id="geo"
                className="flex flex-col mx-72 pt-12"
            >
                <Geographic />
            </section>

            {/* DEEP LEARNING */}
            <section
                id="dle"
                className="flex flex-col mx-72 pt-12"
            >
                <DeepLearning />
            </section>

            {/* DISCUSSION */}
            <section
                id="discussion"
                className="flex flex-col mx-72 pt-12"
            >
                <hr className="mt-20 mb-10 text-herobg w-full"/>
                <div className="flex flex-row gap-5">
                    <div className={`text-2xl ${font_med.className}`}>
                        V
                    </div>
                    <div className={`text-2xl ${font_med.className}`}>
                        Discussion
                    </div>
                </div>
                <div className="pt-10">
                    AI development has progressed rapidly over training resources such as compute, trainable parameters, and time in hours, particularly in the deep learning era. Over time, models have been increasingly developed for multimodal tasks compared to earlier models that were task-specific, pointing to the movement towards more generalized models. 
                </div>
                <div className="pt-4">
                    The United States has emerged as the globally dominant country in terms of model releases in the deep learning era, with China following. Notably, China produces large models in terms of compute and parameters, with low export controls on semiconductors and high AI-related academic publications. 
                </div>
                <div className="pt-4">
                    Resource and efficiency patterns indicate that while models have become increasingly resource-intensive, they have also become more resource-efficient. Frontier models, in particular, tend to have a high level of training compute FLOPs per hour.
                </div>
            </section>

            {/* APPENDIX */}
            <section
                id="appendix"
                className="flex flex-col mx-72 pt-12 mb-20"
            >
                <hr className="mt-20 mb-10 text-herobg w-full"/>
                <div className={`text-2xl ${font_med.className}`}>
                    Appendix
                </div>
                <div className="pt-10">
                    <span className={`pr-1 ${font_bold.className}`}>
                        About:
                    </span>
                    <span>
                        Created for DSCI 320 (Visualization for Data Science) at the University of British Columbia.
                    </span>
                </div>
                <div className="pt-4">
                    <span className={`pr-1 ${font_bold.className}`}>
                        Data source:
                    </span>
                    <span className="pr-1">
                        The main dataset on AI models was sourced from Epoch AI
                    </span>
                    <ReferenceHover
                        references={[
                            {
                                ref: 'Epoch AI, "Data on AI Models". Published online at epoch.ai.',
                                link: "https://epoch.ai/data/ai-models"
                            }
                        ]}
                    >
                        [1]
                    </ReferenceHover>
                    <span className="pr-1">
                        . Export controls on semiconductors are from Global Trade Alert 
                    </span>
                    <ReferenceHover
                        references={[
                            {
                                ref: 'Global Trade Alert. "Export controls on semiconductors".',
                                link: "https://globaltradealert.org/threads/export-controls-on-semiconductors"
                            }
                        ]}
                    >
                        [2]
                    </ReferenceHover>
                    <span className="pr-1">
                        , and AI-related academic publications per country and year are from OECD
                    </span>
                    <ReferenceHover
                        references={[
                            {
                                ref: 'OECD.AI (2025), data from OpenAlex, last updated 2025-09-30',
                                link: "https://oecd.ai/en/"
                            }
                        ]}
                    >
                        [3]
                    </ReferenceHover>
                    <span>
                        .
                    </span>
                </div>
                <div className="pt-4">
                    <span className={`pr-1 ${font_bold.className}`}>
                        Technical:
                    </span>
                    <span>
                        This project uses Altair for all visualizations with data wrangling done in Python, a requirement of the course. The website is built with Next.js, TypeScript, and Tailwind CSS.
                    </span>
                </div>
                <div className="pt-2">
                    <span className="pr-1">
                        Explore the
                    </span>
                    <a href="https://github.com/ubc-dsci320-2025w1/project-team_beepbopboop" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:opacity-60 decoration-1 transition duration-200">
                        visualization code
                    </a>
                    <span className="pr-1">
                        . Explore the 
                    </span>
                    <a href="https://github.com/leesadie/dsci320-web" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 decoration-1 hover:opacity-60 transition duration-200">
                        website code
                    </a>
                    <span>
                        .
                    </span>
                </div>
            </section>
        </div>
    );
}

export default Main_New;