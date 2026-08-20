import React from 'react';
import { FiUsers, FiAlertTriangle, FiStar, FiClock } from 'react-icons/fi';

const ManagerStats: React.FC = () => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: Agent Capacity */}
            <div 
                className="bg-white rounded-2xl p-6 border border-[#FFD2D6]/40 shadow-[0_4px_20px_rgba(86,0,12,0.03)] flex flex-col justify-between"
                style={{ minHeight: '140px' }}
            >
                <div className="flex items-center justify-between">
                    <span className="text-[#242424B2] text-xs font-semibold uppercase tracking-wider">Agent Capacity</span>
                    <FiUsers className="text-[#3b82f6]" size={20} />
                </div>
                <div className="flex items-baseline justify-start mt-2">
                    <span className="text-[#242424] text-[36px] font-bold tracking-tight leading-none">124</span>
                </div>
                <div className="flex items-center justify-between text-xs text-[#242424B2] font-semibold mt-2">
                    <span>Total Agents</span>
                    <span className="text-[#3b82f6]">98 Online</span>
                </div>
                <div className="w-full bg-[#f0f0f0] h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-[#3b82f6] h-full rounded-full" style={{ width: '79%' }} />
                </div>
            </div>

            {/* Card 2: Unassigned */}
            <div 
                className="bg-white rounded-2xl p-6 border border-[#FFD2D6]/40 shadow-[0_4px_20px_rgba(86,0,12,0.03)] flex flex-col justify-between"
                style={{ minHeight: '140px' }}
            >
                <div className="flex items-center justify-between">
                    <span className="text-[#242424B2] text-xs font-semibold uppercase tracking-wider">Unassigned</span>
                    <FiAlertTriangle className="text-[#ef4444]" size={20} />
                </div>
                <div className="flex items-baseline justify-start mt-2">
                    <span className="text-[#ef4444] text-[36px] font-bold tracking-tight leading-none">12</span>
                </div>
                <div className="text-xs text-[#242424B2] font-semibold mt-2 leading-none">
                    Requires immediate action
                </div>
            </div>

            {/* Card 3: Avg Rating */}
            <div 
                className="bg-white rounded-2xl p-6 border border-[#FFD2D6]/40 shadow-[0_4px_20px_rgba(86,0,12,0.03)] flex flex-col justify-between"
                style={{ minHeight: '140px' }}
            >
                <div className="flex items-center justify-between">
                    <span className="text-[#242424B2] text-xs font-semibold uppercase tracking-wider">Avg Rating</span>
                    <FiStar className="text-[#9333ea]" size={20} />
                </div>
                <div className="flex items-baseline justify-start mt-2">
                    <span className="text-[#242424] text-[36px] font-bold tracking-tight leading-none">4.82/5.0</span>
                </div>
                <div className="text-xs text-[#242424B2] font-semibold mt-2 leading-none">
                    High satisfaction rate
                </div>
            </div>

            {/* Card 4: Avg Response */}
            <div 
                className="bg-white rounded-2xl p-6 border border-[#FFD2D6]/40 shadow-[0_4px_20px_rgba(86,0,12,0.03)] flex flex-col justify-between"
                style={{ minHeight: '140px' }}
            >
                <div className="flex items-center justify-between">
                    <span className="text-[#242424B2] text-xs font-semibold uppercase tracking-wider">Avg Response</span>
                    <FiClock className="text-[#0d9488]" size={20} />
                </div>
                <div className="flex items-baseline justify-start mt-2">
                    <span className="text-[#242424] text-[36px] font-bold tracking-tight leading-none">14m 22s</span>
                </div>
                <div className="text-xs text-[#242424B2] font-semibold mt-2 leading-none">
                    Global average today
                </div>
            </div>
        </div>
    );
};

export default ManagerStats;
