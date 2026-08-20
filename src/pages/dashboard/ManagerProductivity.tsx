import React from 'react';

const AGENT_PRODUCTIVITY_DATA = [
    { name: 'Sarah Jenkins', solved: 42, pct: 100 },
    { name: 'Mark Thompson', solved: 38, pct: 90 },
    { name: 'Elena Rodriguez', solved: 31, pct: 74 },
    { name: 'David Chen', solved: 28, pct: 66 },
    { name: 'Jessica Lee', solved: 22, pct: 52 },
];

const ManagerProductivity: React.FC = () => {
    return (
        <div className="bg-white rounded-2xl p-6 border border-[#FFD2D6]/40 shadow-[0_4px_20px_rgba(86,0,12,0.03)] mt-6 flex flex-col gap-6">
            <div>
                <h3 className="text-xl font-bold text-[#242424] m-0">Agent Productivity</h3>
            </div>

            <div className="flex flex-col gap-5">
                {AGENT_PRODUCTIVITY_DATA.map((agent, index) => (
                    <div key={index} className="flex flex-col gap-2">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-bold text-[#242424]">{agent.name}</span>
                            <span className="text-xs font-semibold text-[#242424B2]">{agent.solved} solved</span>
                        </div>
                        <div className="w-full bg-[#FFF0F2] h-2.5 rounded-full overflow-hidden">
                            <div 
                                className="bg-[#56000c] h-full rounded-full transition-all duration-500" 
                                style={{ width: `${agent.pct}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ManagerProductivity;
