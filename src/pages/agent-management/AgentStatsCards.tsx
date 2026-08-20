import React from 'react';

interface AgentStatsCardsProps {
    onlineCount: number;
    busyCount: number;
    totalAgentsCount: number;
    totalActiveChats: number;
    avgChatsPerAgent: string;
}

export const AgentStatsCards: React.FC<AgentStatsCardsProps> = ({
    onlineCount,
    busyCount,
    totalAgentsCount,
    totalActiveChats,
    avgChatsPerAgent
}) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
                { 
                    label: 'Active Agents', 
                    value: `${onlineCount + busyCount} / ${totalAgentsCount} Available`, 
                    desc: 'Online & Busy' 
                },
                { 
                    label: 'Total Active Chats', 
                    value: `${totalActiveChats} Chats`, 
                    desc: `${avgChatsPerAgent} per active agent` 
                }
            ].map((stat, idx) => (
                <div
                    key={idx}
                    className="bg-white rounded-2xl p-6 flex flex-col justify-center border border-[#FFD2D6]/40 shadow-[0_4px_20px_rgba(86,0,12,0.03)] text-left transition-all duration-300 hover:scale-[1.01]"
                >
                    <span className="text-gray-400 text-sm font-semibold block">{stat.label}</span>
                    <h2 className="text-3xl font-extrabold text-[#242424] mt-2 font-sans">{stat.value}</h2>
                    <span className="text-xs text-gray-400 mt-1 block">{stat.desc}</span>
                </div>
            ))}
        </div>
    );
};

export default AgentStatsCards;
