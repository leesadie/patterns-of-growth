'use client';

import Hero from "./Hero";
import Navbar from "../nav/Navbar";
import { font_med, font_head } from "@/app/fonts";
import ReferenceHover from "../interaction/Reference";

import Temporal from "./Temporal";
import Geographic from "./Geographic";
import DeepLearning from "./DeepLearning";

const Main = () => {
    return (
        <div>
            <Navbar />
            <Hero />
            {/* INTRO */}
            <section
                id="intro"
                className="flex flex-col mx-72 pt-12"
            >
                <div className={`text-3xl ${font_head.className}`}>
                    Overview
                </div>
                <div className="pt-4">
                    This report visualizes data related to the technical progress of artificial intelligence (AI) and the evolution of the ecosystem that has enabled it, across time and geography.
                </div>
                <div className="pt-4">
                    <span className={`pr-1 ${font_med.className}`}>
                        Data.
                    </span>
                    <span>
                        We use the AI models dataset from Epoch AI{' '}
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
                    <span>
                        , which contains over 3000 machine learning models released from 1950 to present (2025) and documents key factors that have driven progress. Models are collected from a variety of sources including literature reviews, historical accounts, publications, leading industry labs, bibliographies, pre-existing datasets on AI papers, and suggestions from contributors. 
                    </span>
                </div>
            </section>

            <hr className="my-20 text-evenlightergray w-full"/>

            {/* TEMPORAL */}
            <section
                id="temporal"
                className="flex flex-col mx-72"
            >
                <Temporal />
            </section>

            <hr className="my-20 text-evenlightergray w-full"/>

            {/* GEOGRAPHIC */}
            <section
                id="geo"
                className="flex flex-col mx-72"
            >
                <Geographic />
            </section>

            <hr className="my-20 text-evenlightergray w-full"/>

            {/* DEEP LEARNING */}
            <section
                id="dle"
                className="flex flex-col mx-72"
            >
                <DeepLearning />
            </section>

            <hr className="my-20 text-evenlightergray w-full"/>

            {/* SUMMARY */}
            <section
                id="summary"
                className="flex flex-col mx-72"
            >
                <div className={`text-3xl ${font_head.className}`}>
                    Summary
                </div>
                <div className="pt-4">
                    Stuff here
                </div>
            </section>

            <hr className="my-20 text-evenlightergray w-full"/>

            {/* REFERENCES */}
            <section
                id="refs"
                className="flex flex-col mx-72 mb-20"
            >
                <div className={`text-3xl ${font_head.className}`}>
                    References
                </div>
                <div className="pt-4">
                    <ol className="list-decimal list-outside ml-4" type="1">
                        <li>
                            <span>
                                Epoch AI, "Data on AI Models". Published online at epoch.ai. Retrieved from: 
                            </span>
                            <a
                                href="https://epoch.ai/data/ai-models"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline underline-offset-1 px-1 hover:opacity-70"
                            >
                                https://epoch.ai/data/ai-models
                            </a>
                            <span>
                                [online resource].
                            </span>
                        </li>
                    </ol>
                </div>
            </section>
        </div>
    );
}

export default Main;