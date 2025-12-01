import ClientOnly from "../components/ClientOnly";
import GraphClient from "./GraphClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "AI Ancestry",
    description: "Visualize model architecture lineages"
}

const GraphPage = () => {
    return (
        <ClientOnly>
            <GraphClient />
        </ClientOnly>
    );
}

export default GraphPage;