import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface PerformanceReportChartProps {
    chartData: any[];
    performanceTab: 'Daily' | 'Weekly' | 'Monthly';
    setPerformanceTab: (tab: 'Daily' | 'Weekly' | 'Monthly') => void;
}

export const PerformanceReportChart: React.FC<PerformanceReportChartProps> = ({
    chartData,
    performanceTab,
    setPerformanceTab,
}) => {
    return (
        <div className="bg-white rounded-2xl p-6 border border-[#FFD2D6]/40 shadow-[0_4px_20px_rgba(86,0,12,0.03)] text-left">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                    <h3 className="text-lg font-bold text-[#242424] m-0">Performance Reports</h3>
                    <p className="text-xs text-gray-400 mt-1 m-0">Hourly solved ticket analytics.</p>
                </div>
                <div className="flex bg-[#FFF0F1] border border-[#FFD2D6]/40 p-1 rounded-xl shrink-0">
                    {(['Daily', 'Weekly', 'Monthly'] as const).map(tab => (
                        <button
                            key={tab}
                            onClick={() => setPerformanceTab(tab)}
                            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer border-0 outline-none ${
                                performanceTab === tab
                                    ? 'bg-white text-[#56000c] shadow-[0_1px_4px_rgba(86,0,12,0.08)]'
                                    : 'text-gray-500 hover:text-[#56000c]'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#FFF0F1" vertical={false} />
                        <XAxis
                            dataKey="time"
                            stroke="#242424B2"
                            fontSize={11}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="#242424B2"
                            fontSize={11}
                            tickLine={false}
                            axisLine={false}
                        />
                        <Tooltip
                            contentStyle={{
                                borderRadius: '12px',
                                border: '1px solid #FFD2D6',
                                background: '#ffffff',
                                color: '#242424',
                                boxShadow: '0 4px 12px rgba(86,0,12,0.08)'
                            }}
                        />
                        <Bar
                            dataKey="solved"
                            name="Solved Chats"
                            fill="#56000c"
                            radius={[4, 4, 0, 0]}
                            maxBarSize={45}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default PerformanceReportChart;
