import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { EarningChartItem } from '../../features/overview/overviewApi';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

interface EarningChartProps {
    chartData?: EarningChartItem[];
    isLoading?: boolean;
}

const EarningChart = ({ chartData = [], isLoading }: EarningChartProps) => {
    const formattedData = chartData.map((item) => ({
        name: item.day.charAt(0).toUpperCase() + item.day.slice(1),
        sales: item.amount,
    }));

    return (
        <div 
            className="flex flex-col gap-4 p-6 rounded-2xl"
            style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
        >
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
                <h2 className="text-lg font-bold text-white">Daily Sales / Earnings</h2>
            </div>
            
            <div className="h-64 mt-2">
                {isLoading ? (
                    <LoadingSpinner text="Loading sales chart..." />
                ) : formattedData.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-white/50 text-sm">
                        No sales data available
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={formattedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
                            <XAxis 
                                dataKey="name" 
                                stroke="rgba(255, 255, 255, 0.4)" 
                                fontSize={12} 
                                tickLine={false} 
                                axisLine={false} 
                            />
                            <YAxis 
                                stroke="rgba(255, 255, 255, 0.4)" 
                                fontSize={12} 
                                tickLine={false} 
                                axisLine={false} 
                            />
                            <Tooltip 
                                contentStyle={{ 
                                    borderRadius: '12px', 
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    background: '#23090a',
                                    color: '#fff',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                                }}
                            />
                            <Line
                                type="monotone"
                                dataKey="sales"
                                name="Sales ($)"
                                stroke="#ff4b72"
                                strokeWidth={3}
                                dot={{ fill: '#ff4b72', stroke: '#fff', strokeWidth: 1.5, r: 4 }}
                                activeDot={{ r: 6 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
};

export default EarningChart;
