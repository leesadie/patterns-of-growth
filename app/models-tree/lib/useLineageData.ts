import { useEffect, useState } from "react";

export interface ModelMetadata {
    architecture?: string;
    organization?: string;
    domain?: string;
    parameters?: number;
    training_compute?: number;
    training_time?: number;
    training_cost?: number;
    power_draw?: number;
    citations?: number;
    notable?: boolean;
}

export interface LineageNode {
    id: string;
    year: number;
    displayName?: string;
    metadata?: ModelMetadata;
}

export interface TreeBranch {
    id: string;
    color: string;
    nodes: LineageNode[];
    children?: TreeBranch[];
}

export interface TreeData {
    root: LineageNode;
    color: string;
    children: TreeBranch[];
}

export interface LineageDataResponse {
    tree: TreeData;
}

export function useLineageData() {
    const [data, setData] = useState<LineageDataResponse | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/data/lineages_new.json")
            .then((res) => res.json())
            .then((json) => {
                setData(json);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to load lineage data:", err)
                setLoading(false);
            });
    }, []);

    return { data, loading };
}