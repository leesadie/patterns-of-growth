'use client';

import { GraphProvider } from "./scripts/interaction/GraphContext";
import SidePanel from "./scripts/interaction/SidePanel";
import TreeView from "./scripts/TreeView";

const GraphClient = () => {
    return (
        <GraphProvider>
            <main className="w-screen h-screen text-graphbg">

                <SidePanel />
                <TreeView />
            </main>
        </GraphProvider>
    );
}

export default GraphClient;