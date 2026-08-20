import React from 'react';
import { ManagerAgent } from '../agent-management.types';

const STATUS_DOT_CLASS: Record<string, string> = {
    Online: 'bg-[#10b981]',
    Busy: 'bg-[#fbbf24]',
    Offline: 'bg-gray-400',
};

interface AgentHeaderBannerProps {
    selectedAgent: ManagerAgent;
}

export const AgentHeaderBanner: React.FC<AgentHeaderBannerProps> = ({ selectedAgent }) => {
    return (
        <div className="bg-white rounded-2xl p-6 border border-[#FFD2D6]/40 shadow-[0_4px_20px_rgba(86,0,12,0.03)] flex flex-col sm:flex-row items-center gap-4 text-left">
            <div className="relative w-16 h-16 shrink-0">
                <img
                    src={selectedAgent.avatar}
                    alt={selectedAgent.name}
                    className="w-full h-full object-cover rounded-full border border-gray-100 shadow-sm"
                />
                <span className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${STATUS_DOT_CLASS[selectedAgent.status]}`} />
            </div>
            <div className="flex-1 text-center sm:text-left">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-center sm:justify-start">
                    <h3 className="text-xl font-bold text-[#242424] m-0">{selectedAgent.name}</h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase inline-block border w-max mx-auto sm:mx-0 ${
                        selectedAgent.status === 'Online'
                            ? 'bg-green-50 text-[#10b981] border-green-200'
                            : selectedAgent.status === 'Busy'
                            ? 'bg-yellow-50 text-[#fbbf24] border-yellow-200'
                            : 'bg-gray-50 text-gray-400 border-gray-200'
                    }`}>
                        {selectedAgent.status}
                    </span>
                </div>
                <span className="text-sm text-gray-500 block mt-1">
                    Employee ID: <strong>{selectedAgent.agentId}</strong>
                </span>
            </div>
        </div>
    );
};

export default AgentHeaderBanner;
