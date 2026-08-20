interface Stat {
    label: string;
    value: string | number;
}

interface StatsCardsProps {
    stats: Stat[];
    cols?: 2 | 3 | 4;
}

const colClasses: Record<number, string> = {
    2: 'sm:grid-cols-2',
    3: 'sm:grid-cols-2 lg:grid-cols-3',
    4: 'sm:grid-cols-2 lg:grid-cols-4',
};

const StatsCards = ({ stats, cols = 4 }: StatsCardsProps) => (
    <div className={`grid grid-cols-1 ${colClasses[cols]} gap-6`}>
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
                <h2 className="text-white text-4xl font-bold mt-2 font-sans">{stat.value}</h2>
            </div>
        ))}
    </div>
);

export default StatsCards;
