interface UserStatsProps {
    total: number;
    active: number;
    verified: number;
    blocked: number;
}

const UserStats = ({ total, active, verified, blocked }: UserStatsProps) => {
    const stats = [
        { label: 'Total Users', count: total },
        { label: 'Active Users', count: active },
        { label: 'Verified Users', count: verified },
        { label: 'Blocked Users', count: blocked }
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
                <div 
                    key={idx} 
                    className="rounded-2xl p-6 flex flex-col justify-center transition-all duration-300 hover:scale-[1.02]"
                    style={{
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(255, 255, 255, 0.08)'
                    }}
                >
                    <span className="text-white/60 text-sm font-medium">{stat.label}</span>
                    <h2 className="text-white text-4xl font-bold mt-2 font-sans">{stat.count}</h2>
                </div>
            ))}
        </div>
    );
};

export default UserStats;
