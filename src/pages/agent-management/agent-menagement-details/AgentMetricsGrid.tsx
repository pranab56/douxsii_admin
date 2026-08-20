import React from 'react';
import { Rate } from 'antd';
import { ManagerAgent } from '../agent-management.types';

interface AgentMetricsGridProps {
    selectedAgent: ManagerAgent;
}

export const AgentMetricsGrid: React.FC<AgentMetricsGridProps> = ({ selectedAgent }) => {
    const stats = [
        { label: 'TOTAL CHATS HANDLED', value: selectedAgent.totalChatsHandled.toLocaleString() },
        { label: 'AVG. RESPONSE TIME', value: selectedAgent.avgResponseTime },
        { label: 'AVG. CHAT HANDLING', value: selectedAgent.avgChatHandling },
        { label: 'RATE SCORE', value: `${selectedAgent.rateScore}/5`, rating: selectedAgent.rateScore }
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, idx) => (
                <div
                    key={idx}
                    className="bg-white rounded-2xl p-5 border border-[#FFD2D6]/40 shadow-[0_4px_20px_rgba(86,0,12,0.03)] flex flex-col justify-center text-left"
                >
                    <span className="text-[10px] font-bold text-gray-400 tracking-wider block uppercase">{stat.label}</span>
                    <h2 className="text-2xl font-medium text-[#242424] mt-2 font-sans">{stat.value}</h2>
                    {stat.rating !== undefined && (
                        <div className="mt-2 flex items-center">
                            <Rate disabled allowHalf value={stat.rating} style={{ fontSize: 14 }} />
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default AgentMetricsGrid;
