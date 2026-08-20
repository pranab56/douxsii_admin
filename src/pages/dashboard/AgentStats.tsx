import React from 'react';

const AgentStats: React.FC = () => {
    const stats = [
        { name: 'Active Chats', count: '2' },
        { name: 'Pending Chats', count: '2' },
        { name: 'Solved Chats', count: '2' },
        { name: 'Avg. Rating', count: '4.5' },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((item, index) => (
                <div 
                    key={index} 
                    className="bg-white rounded-2xl p-6 border border-[#FFD2D6]/40 shadow-[0_4px_20px_rgba(86,0,12,0.03)] transition-all duration-300 hover:scale-[1.02] flex flex-col justify-between"
                    style={{ minHeight: '130px' }}
                >
                    <span className="text-[#242424B2] text-sm font-medium tracking-wide">
                        {item.name}
                    </span>
                    <span className="text-[#242424] text-[38px] font-bold mt-2 font-sans tracking-tight leading-none">
                        {item.count}
                    </span>
                </div>
            ))}
        </div>
    );
};

export default AgentStats;
