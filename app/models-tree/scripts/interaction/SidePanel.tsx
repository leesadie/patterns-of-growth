import { useGraph } from "./GraphContext";
import { MdClose } from "react-icons/md";
import { font_bold, font_head } from "@/app/fonts";

export default function SidePanel() {
    const { selectedNode, setSelectedNode } = useGraph();

    if (!selectedNode) return null;

    const formatNumber = (num: number | null | undefined) => {
        if (!num) return 'N/A';
        if (num >= 1e9) return `${(num / 1e9).toFixed(2)}`;
        if (num >= 1e6) return `${(num / 1e6).toFixed(2)}`;
        if (num >= 1e3) return `${(num / 1e3).toFixed(2)}`;
        return num.toFixed(2);
    };

    const formatCost = (cost: number | null | undefined) => {
        if (!cost) return 'N/A';
        return `${formatNumber(cost)}`;
    };

    const metadata = (selectedNode as any).metadata || {};

    return (
        <div className="absolute right-4 bottom-4 h-72 w-80 bg-white backdrop-blur-sm z-20 p-6 overflow-y-auto border border-gray-400/20 rounded-md shadow-xs shadow-gray-100">
            {/* Close button */}
            <button
                onClick={() => setSelectedNode(null)}
                className="absolute top-4 right-4 text-graphbg/60 hover:text-graphbg transition-colors cursor-pointer"
            >
                <MdClose size={14}/>
            </button>

            {/* Content */}
            <div className="space-y-4 mt-2">
                <div>
                    <h2 className={`text-2xl text-graphbg mb-1 ${font_head.className}`}>
                        {selectedNode.id}
                    </h2>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-graphbg/50">
                        {selectedNode.year}
                    </span>
                    {metadata.notable && (
                        <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-700 text-xs rounded-full">
                            Notable model
                        </span>
                    )}
                </div>

                {/* Metadata sections */}
                <div className="space-y-4">
                    {metadata.architecture && (
                        <div>
                            <label className="text-xs text-graphbg/50 block mb-1">
                                Architecture
                            </label>
                            <p className="text-graphbg text-sm">{metadata.architecture}</p>
                        </div>
                    )}

                    {metadata.organization && (
                        <div>
                            <label className="text-xs text-graphbg/50 block mb-1">
                                Organization
                            </label>
                            <p className="text-graphbg text-sm">{metadata.organization}</p>
                        </div>
                    )}

                    {metadata.domain && (
                        <div>
                            <label className="text-xs text-graphbg/50 block mb-1">
                                Domain
                            </label>
                            <p className="text-graphbg text-sm">{metadata.domain}</p>
                        </div>
                    )}

                    {/* Divider */}
                    <div className="border-t border-graphbg/10"></div>

                    {/* Model specs */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs text-graphbg/50 block mb-1">
                                Parameters
                            </label>
                            <p className="text-graphbg text-sm">
                                {formatNumber(metadata.parameters)}
                            </p>
                        </div>

                        <div>
                            <label className="text-xs text-graphbg/50 block mb-1">
                                Citations
                            </label>
                            <p className="text-graphbg text-sm">
                                {metadata.citations || 'N/A'}
                            </p>
                        </div>
                    </div>

                    {/* Training info */}
                    {(metadata.training_compute || metadata.training_time || metadata.training_cost) && (
                        <>
                            <div className="border-t border-graphbg/10"></div>
                            <div className="space-y-3">
                                <h3 className="text-sm font-semibold text-graphbg/70">
                                    Training
                                </h3>

                                {metadata.training_compute && (
                                    <div>
                                        <label className="text-xs text-graphbg/50 block mb-1">
                                            Compute (FLOPs)
                                        </label>
                                        <p className="text-graphbg text-sm">
                                            {formatNumber(metadata.training_compute)}
                                        </p>
                                    </div>
                                )}

                                {metadata.training_time && (
                                    <div>
                                        <label className="text-xs text-graphbg/50 block mb-1">
                                            Training time (hours)
                                        </label>
                                        <p className="text-graphbg text-sm">
                                            {formatNumber(metadata.training_time)}
                                        </p>
                                    </div>
                                )}

                                {metadata.training_cost && (
                                    <div>
                                        <label className="text-xs text-graphbg/50 block mb-1">
                                            Training cost (2023 USD)
                                        </label>
                                        <p className="text-graphbg text-sm">
                                            {formatCost(metadata.training_cost)}
                                        </p>
                                    </div>
                                )}

                                {metadata.power_draw && (
                                    <div>
                                        <label className="text-xs text-graphbg/50 block mb-1">
                                            Power draw (watts)
                                        </label>
                                        <p className="text-graphbg text-sm">
                                            {formatNumber(metadata.power_draw)}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}