import React, { createContext, useContext, useState, ReactNode } from "react";

interface Node {
    id: string;
    arch: string;
    year: number;
    size: number;
    x: number;
    y: number;
    z: number;
    tree_view?: boolean;
    notable?: boolean;
}

type ViewMode = '3d' | 'tree';

interface GraphContextType {
    selectedNode: Node | null;
    setSelectedNode: (node: Node | null) => void;
    showFamilyEdges: boolean;
    setShowFamilyEdges: (show: boolean) => void;
    showSimilarityEdges: boolean;
    setShowSimilarityEdges: (show: boolean) => void;
    viewMode: ViewMode;
    setViewMode: (mode: ViewMode) => void;
}

const GraphContext = createContext<GraphContextType | undefined>(undefined)

export function GraphProvider({ children }: { children: ReactNode }) {
    const [selectedNode, setSelectedNode] = useState<Node | null>(null);
    const [showFamilyEdges, setShowFamilyEdges] = useState(false);
    const [showSimilarityEdges, setShowSimilarityEdges] = useState(true);
    const [viewMode, setViewMode] = useState<ViewMode>('tree');

    return (
        <GraphContext.Provider value={{
            selectedNode,
            setSelectedNode,
            showFamilyEdges, 
            setShowFamilyEdges,
            showSimilarityEdges, 
            setShowSimilarityEdges,
            viewMode,
            setViewMode
        }}>
            {children}
        </GraphContext.Provider>
    );
}

export function useGraph() {
    const context = useContext(GraphContext);
    if (!context) {
        throw new Error('useGraph must be used within GraphProvider');
    }

    return context;
}