import { useEffect, useRef, useState } from "react";
import * as d3 from 'd3';
import { useLineageData, TreeBranch } from "../lib/useLineageData";
import { useGraph } from "./interaction/GraphContext";
import TreeLegend from "./interaction/TreeLegend";
import { font_head } from "@/app/fonts";

export default function TreeView() {
    const svgRef = useRef<SVGSVGElement>(null);
    const { data, loading } = useLineageData();
    const { selectedNode, setSelectedNode } = useGraph();
    const [filteredBranch, setFilteredBranch] = useState<string | null>(null);

    useEffect(() => {
        if (!svgRef.current || !data) return;

        const width = 1500
        const height = 1600
        const margin = { top: 30, right: 0, bottom: 100, left: 0 };

        // Clear prev
        d3.select(svgRef.current).selectAll('*').remove();

        const svg = d3.select(svgRef.current)
            .attr('width', width)
            .attr('height', height)

        const g = svg.append('g')
            .attr('transform', `translate(0,${margin.top})`);

        // Tree structure to d3 hierarchy
        function branchToHierarchy(branch: TreeBranch, branchId: string): any {
            const children: any[] = [];

            // Add nodes as chain
            let prevNode: any = null;
            branch.nodes.forEach(node => {
                const treeNode = {
                    ...node,
                    color: branch.color,
                    branchId: branchId,
                    children: []
                };

                if (prevNode) {
                    prevNode.children.push(treeNode);
                } else {
                    children.push(treeNode);
                }
                prevNode = treeNode;
            });

            // Add child branches to last node
            if (branch.children && branch.children.length > 0 && prevNode) {
                branch.children.forEach(childBranch => {
                    const childHierarchy = branchToHierarchy(childBranch, branchId);
                    if (Array.isArray(childHierarchy)) {
                        prevNode.children.push(...childHierarchy);
                    } else {
                        prevNode.children.push(childHierarchy);
                    }
                });
            }

            return children;
        }

        // Build root
        const rootData = {
            ...data.tree.root,
            color: data.tree.color,
            branchId: 'root',
            children: []
        };

        // Add all branch as children of root
        data.tree.children.forEach(branch => {
            const branchHierarchy = branchToHierarchy(branch, branch.id);
            rootData.children.push(...branchHierarchy)
        });

        // Create tree layout
        const treeLayout = d3.tree<any>()
            .size([1500, 1500])
            .separation((a, b) => {
                return (a.parent === b.parent ? 0.6 : 0.5);
            });

        const hierarchyRoot = d3.hierarchy(rootData);
        treeLayout(hierarchyRoot);

        // Check if node should be highlighted
        const isHighlighted = (d: any) => {
            if (!filteredBranch) return true;
            return d.data.branchId === filteredBranch || d.data.branchId === 'root';
        };

        // Draw links (connections between nodes)
        g.selectAll('.link')
            .data(hierarchyRoot.links())
            .join('path')
            .attr('class', 'link')
            .attr('d', d => {
                const source = d.source as any;
                const target = d.target as any;
                
                return `M${source.x},${source.y}
                        C${source.x},${(source.y + target.y) / 2}
                         ${target.x},${(source.y + target.y) / 2}
                         ${target.x},${target.y}`;
            })
            .attr('fill', 'none')
            .attr('stroke', (d: any) => d.target.data.color || '#757575')
            .attr('stroke-width', 2)
            .attr('opacity', (d: any) => isHighlighted(d.target) ? 0.4 : 0.1)
            .transition()
            .duration(300);

        // Draw nodes
        const nodes = g.selectAll('.node')
            .data(hierarchyRoot.descendants())
            .join('g')
            .attr('class', 'node')
            .attr('transform', (d: any) => `translate(${d.x},${d.y})`)
            .style('cursor', 'pointer')
            .on('click', (event, d: any) => {
                event.stopPropagation();
                setSelectedNode({
                    id: d.data.id,
                    year: d.data.year,
                    arch: d.data.metadata?.architecture || '',
                    size: 1,
                    x: 0, y: 0, z: 0,
                    metadata: d.data.metadata
                } as any);
            })
            .on('mouseenter', function() {
                d3.select(this).select('circle')
                    .transition()
                    .duration(200)
                    .attr('r', 8);
            })
            .on('mouseleave', function() {
                d3.select(this).select('circle')
                    .transition()
                    .duration(200)
                    .attr('r', 5);
            });

        // Node labels
        nodes.append('text')
            .attr('dy', -12)
            .attr('text-anchor', 'middle')
            .style('fill', '#1f2937')
            .style('font-size', '10px')
            .style('pointer-events', 'none')
            .attr('opacity', (d: any) => isHighlighted(d) ? 1 : 0.2)
            .each(function(d: any) {
                const text = d.data.displayName || d.data.id;
                const words = text.split(/\s+/);
                
                const selection = d3.select(this);
                
                // Simple text wrapping
                if (words.length > 2) {
                    const half = Math.ceil(words.length / 2);
                    selection.append('tspan')
                        .attr('x', 0)
                        .attr('dy', -18)
                        .text(words.slice(0, half).join(' '));
                    selection.append('tspan')
                        .attr('x', 0)
                        .attr('dy', 10)
                        .text(words.slice(half).join(' '));
                } else {
                    selection.text(text);
                }
            })
            .transition()
            .duration(300);

        // Node circles
        nodes.append('circle')
            .attr('r', 5)
            .attr('fill', (d: any) => 
                selectedNode?.id === d.data.id ? '#000' : (d.data.color || '#60a5fa')
            )
            .attr('stroke', '#fff')
            .attr('stroke-width', 2)
            .attr('opacity', (d: any) => isHighlighted(d) ? 1 : 0.2)
            .transition()
            .duration(300);

    }, [data, selectedNode, setSelectedNode, filteredBranch]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full text-black">
                Loading timeline
            </div>
        )
    }

    if (!data) {
        return (
            <div className="flex items-center justify-center h-full text-black">
                Failed to load timeline data
            </div>
        );
    }

    return (
        <>
            <TreeLegend onBranchFilter={setFilteredBranch}/>
            <div
                className="w-full h-full overflow-auto bg-treebg"
                style={{ backgroundColor: '#EDEFF4' }}
            >
                <div className="relative top-5 left-8">
                    <h1 className={`text-4xl ${font_head.className}`}>
                        AI Ancestry
                    </h1>
                    <p className="w-lg pt-4 text-sm">
                        Trace the conceptual evolution from early neural networks to modern AI models. Each branch represents a distinct architectural lineage, with sub-branches denoting major model families. 
                    </p>
                    <div className="text-xs pt-2">
                        <span>
                            Data from
                        </span>
                        <a href="https://epoch.ai/data/ai-models" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 pl-1 hover:opacity-70">
                            Epoch AI
                        </a>
                        <span>
                            .
                        </span>
                    </div>
                </div>
                <svg ref={svgRef}/>
            </div>
        </>
    );
}