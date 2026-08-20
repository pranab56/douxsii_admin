import React from 'react';
import { ManagerAgent } from './agent-management.types';

const STATUS_DOT_CLASS: Record<string, string> = {
    Online: 'bg-[#10b981]',
    Busy: 'bg-[#fbbf24]',
    Offline: 'bg-gray-400',
};

interface AgentCardsGridProps {
    agents: ManagerAgent[];
    paginatedAgents: ManagerAgent[];
    onlineCount: number;
    busyCount: number;
    offlineCount: number;
    onViewDetails: (agentKey: string) => void;
    onSuspendAgent: (agentKey: string) => void;
}

export const AgentCardsGrid: React.FC<AgentCardsGridProps> = ({
    paginatedAgents,
    onlineCount,
    busyCount,
    offlineCount,
    onViewDetails,
    onSuspendAgent
}) => {
    return (
        <div
            className="bg-white rounded-2xl p-6 flex flex-col gap-6 shadow-[0_4px_20px_rgba(86,0,12,0.03)] border border-[#FFD2D6]/40"
        >
            {/* Header Controls Row */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="flex flex-col text-left">
                    <h3 className="text-lg font-bold text-[#242424] m-0">Team Overview</h3>
                    <div className="flex items-center gap-4 text-xs font-semibold text-gray-400 mt-1">
                        <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-[#10b981]" />
                            <span>Online ({onlineCount})</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-[#fbbf24]" />
                            <span>Busy ({busyCount})</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-gray-400" />
                            <span>Offline ({offlineCount})</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Agent Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {paginatedAgents.length > 0 ? (
                    paginatedAgents.map((agent) => {
                        const chatPercentage = (agent.activeChats / agent.maxChats) * 100;
                        let barBgColor = 'bg-[#56000c]';
                        if (agent.activeChats === 0) {
                            barBgColor = 'bg-[#FAF3F3]';
                        } else if (agent.activeChats < 8) {
                            barBgColor = 'bg-[#fbbf24]';
                        }

                        return (
                            <div
                                key={agent.key}
                                className="bg-white border border-[#FFD2D6]/30 shadow-sm hover:shadow-md rounded-2xl p-5 flex flex-col gap-4 transition-all"
                            >
                                <div className="flex items-center gap-3.5 text-left">
                                    <div className="relative w-12 h-12 shrink-0">
                                        <img
                                            src={agent.avatar}
                                            alt={agent.name}
                                            className="w-full h-full object-cover rounded-full border border-gray-100 shadow-sm"
                                        />
                                        <span className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${STATUS_DOT_CLASS[agent.status]}`} />
                                    </div>
                                    <div>
                                        <h4 className="text-base font-bold text-[#242424] m-0">{agent.name}</h4>
                                        <span className="text-xs text-gray-400 block mt-0.5">ID: {agent.agentId}</span>
                                    </div>
                                </div>

                                <div className="flex flex-col text-left gap-1">
                                    <div className="flex justify-between items-center text-xs font-bold text-gray-500">
                                        <span>Active Chats</span>
                                        <span className="text-[#242424]">{agent.activeChats} / {agent.maxChats}</span>
                                    </div>
                                    <div className="w-full h-2 bg-[#FAF3F3] rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all ${barBgColor}`}
                                            style={{ width: `${chatPercentage}%` }}
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 mt-1 justify-center">
                                    {agent.status === 'Offline' ? (
                                        <>
                                            <button
                                                disabled
                                                className="flex-1 h-10 bg-[#FAF3F3] text-[#b4989b] border border-[#FFD2D6]/40 font-semibold text-xs rounded-xl cursor-not-allowed select-none uppercase"
                                            >
                                                Offline
                                            </button>
                                            <button
                                                onClick={() => onSuspendAgent(agent.key)}
                                                className="flex-1 h-10 text-[#56000c] hover:bg-[#56000c]/5 font-semibold text-xs rounded-xl transition-colors cursor-pointer border-0 bg-transparent uppercase"
                                            >
                                                Suspend
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            onClick={() => onViewDetails(agent.key)}
                                            className="w-full h-10 border border-[#56000c] text-[#56000c] hover:bg-[#56000c]/5 font-semibold text-xs rounded-xl transition-all cursor-pointer bg-transparent border-solid uppercase"
                                        >
                                            View Details
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="col-span-2 py-12 text-center text-gray-400 text-sm">
                        No support agents found.
                    </div>
                )}
            </div>
        </div>
    );
};

export default AgentCardsGrid;
