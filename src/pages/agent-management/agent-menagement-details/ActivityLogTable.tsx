import React from 'react';
import Table from '../../../components/ui/Table';
import { AgentActivityLog } from '../agent-management.types';

interface ActivityLogTableProps {
    activityLog: AgentActivityLog[];
}

export const ActivityLogTable: React.FC<ActivityLogTableProps> = ({ activityLog }) => {
    const logColumns = [
        {
            title: 'Action',
            key: 'action',
            render: (record: AgentActivityLog) => {
                let dotColor = 'bg-[#10b981]';
                if (record.action.includes('Break') || record.action.includes('Assigned')) {
                    dotColor = 'bg-[#fbbf24]';
                } else if (record.action.includes('Logged Out')) {
                    dotColor = 'bg-gray-400';
                }
                return (
                    <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full inline-block ${dotColor}`} />
                        <span className="text-[#242424] text-sm font-semibold">{record.action}</span>
                    </div>
                );
            }
        },
        {
            title: 'Timestamp',
            dataIndex: 'timestamp',
            key: 'timestamp',
            render: (val: string) => <span className="text-gray-500 text-sm">{val}</span>
        },
        {
            title: 'Duration',
            dataIndex: 'duration',
            key: 'duration',
            render: (val: string) => <span className="text-gray-500 text-sm font-medium">{val}</span>
        },
        {
            title: 'Source',
            dataIndex: 'source',
            key: 'source',
            render: (val: string) => <span className="text-gray-400 text-xs">{val}</span>
        }
    ];

    return (
        <div className="bg-white rounded-2xl p-6 border border-[#FFD2D6]/40 shadow-[0_4px_20px_rgba(86,0,12,0.03)] text-left flex flex-col gap-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-[#242424] m-0">Detailed Activity Log</h3>
                <button className="text-xs font-semibold text-[#ff4d4f] hover:text-[#56000c] bg-transparent border-0 cursor-pointer outline-none hover:underline">
                    View Full History &gt;
                </button>
            </div>
            <div className="overflow-x-auto">
                <Table
                    dataSource={activityLog}
                    columns={logColumns}
                    rowKey="key"
                    light={true}
                    pagination={false}
                />
            </div>
        </div>
    );
};

export default ActivityLogTable;
