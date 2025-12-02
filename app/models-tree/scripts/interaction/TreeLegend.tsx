import { useState } from "react";

interface LegendItem {
    id: string;
    name: string;
    color: string;
}

interface TreeLegendProps {
    onBranchFilter: (branchId: string | null) => void;
}

export default function TreeLegend({ onBranchFilter }: TreeLegendProps) {
    const [selectedBranch, setSelectedBranch] = useState<string | null>(null);

    const branches: LegendItem[] = [
        { id: 'cnn_branch', name: 'CNN lineage', color: '#7C9A24' },
        { id: 'transformer_branch', name: 'Transformer lineage', color: '#39758D' },
        { id: 'generation_branch', name: 'Generation lineage', color: '#8A398D' },
        { id: 'gnn_branch', name: 'Graph NN lineage', color: '#7189DD' }
    ];

    const handleBranchClick = (branchId: string) => {
        if (selectedBranch === branchId) {
            // Deselect - show all
            setSelectedBranch(null);
            onBranchFilter(null);
        } else {
            // Select branch
            setSelectedBranch(branchId);
            onBranchFilter(branchId);
        }
    };

    return (
        <div className="absolute top-4 right-8 z-10 bg-white/60 border border-gray-400/20 rounded-md p-3 backdrop-blur-sm">

            <div className="">
                {branches.map(branch => (
                    <button
                        key={branch.id}
                        onClick={() => handleBranchClick(branch.id)}
                        className={`
                            flex items-center gap-3 w-full
                            px-2 py-1.5 rounded
                            transition-all group hover:bg-gray-200/5
                            cursor-pointer
                            ${selectedBranch === branch.id ? 'bg-graphbg/10' : ''} 
                        `}
                    >
                        <div
                            className="w-4 h-4 rounded-full"
                            style={{
                                backgroundColor: branch.color,
                                opacity: selectedBranch && selectedBranch !== branch.id ? 0.3 : 1
                            }}
                        />
                        <span
                            className={`
                                text-xs transition-colors
                                ${selectedBranch && selectedBranch !== branch.id ? 'text-graphbg/40' : 'text-graphbg/80 group-hover:text-graphbg'}    
                            `}
                        >
                            {branch.name}
                        </span>
                    </button>
                ))}
            </div>

            {selectedBranch && (
                <button
                    onClick={() => {
                        setSelectedBranch(null);
                        onBranchFilter(null);
                    }}
                    className="mt-3 w-full text-xs text-graphbg/50 hover:text-graphbg transition-colors"
                >
                    Clear filter
                </button>
            )}
        </div>
    )
}