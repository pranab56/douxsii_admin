import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const PERFORMANCE_DATA = [
    { name: 'Mon', solved: 30, received: 45 },
    { name: 'Tue', solved: 35, received: 30 },
    { name: 'Wed', solved: 28, received: 25 },
    { name: 'Thu', solved: 60, received: 50 },
    { name: 'Fri', solved: 32, received: 35 },
    { name: 'Sat', solved: 20, received: 15 },
    { name: 'Sun', solved: 55, received: 45 },
];

const AgentPerformance: React.FC = () => {
    return (
        <div className="bg-white rounded-2xl p-6 border border-[#FFD2D6]/40 shadow-[0_4px_20px_rgba(86,0,12,0.03)] mt-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-2">
                <div>
                    <h2 className="text-xl font-bold text-[#242424] m-0">Weekly Performance</h2>
                    <p className="text-xs text-[#242424B2] mt-1 m-0">Tracking resolved vs. received volume over 7 days.</p>
                </div>
                
                {/* Custom Legend */}
                <div className="flex items-center gap-4 text-xs font-semibold text-[#242424B2]">
                    <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#56000c]" />
                        <span>Solved</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#A0C4DF]" />
                        <span>Received</span>
                    </div>
                </div>
            </div>

            <div className="h-72 w-full mt-2">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={PERFORMANCE_DATA} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                        <XAxis 
                            dataKey="name" 
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
                            domain={[0, 80]}
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
                        {/* Solved Curve: Solid Maroon */}
                        <Line
                            type="monotone"
                            dataKey="solved"
                            name="Solved"
                            stroke="#56000c"
                            strokeWidth={2.5}
                            dot={false}
                            activeDot={{ r: 5 }}
                        />
                        {/* Received Curve: Dashed Blue */}
                        <Line
                            type="monotone"
                            dataKey="received"
                            name="Received"
                            stroke="#A0C4DF"
                            strokeWidth={2}
                            strokeDasharray="4 4"
                            dot={false}
                            activeDot={{ r: 5 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default AgentPerformance;
