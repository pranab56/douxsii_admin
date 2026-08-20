import { useState } from 'react';
import PageHeader from '../../components/ui/PageHeader';
import Pagination from '../../components/ui/Pagination';
import Toast from '../../components/ui/Toast';
import { MOCK_MANAGEMENT_AGENTS } from './agent-management.data';
import { ManagerAgent } from './agent-management.types';
import AgentStatsCards from './AgentStatsCards';
import AgentCardsGrid from './AgentCardsGrid';
import AgentPerformanceDetails from './AgentPerformanceDetails';

const AgentManagement = () => {
    const [toast, setToast] = useState('');

    const showToast = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(''), 3000);
    };

    // Agent Management States & Logic (Manager)
    const [agents, setAgents] = useState<ManagerAgent[]>(MOCK_MANAGEMENT_AGENTS);
    const [selectedAgentKey, setSelectedAgentKey] = useState<string | null>(null);
    const [performanceTab, setPerformanceTab] = useState<'Daily' | 'Weekly' | 'Monthly'>('Daily');
    const [agentPage, setAgentPage] = useState(1);
    const agentPageSize = 4;

    const selectedAgent = agents.find(a => a.key === selectedAgentKey);

    // Calculate Agent Stats
    const totalAgentsCount = agents.length;
    const onlineCount = agents.filter(a => a.status === 'Online').length;
    const busyCount = agents.filter(a => a.status === 'Busy').length;
    const offlineCount = agents.filter(a => a.status === 'Offline').length;

    // No frontend search filtering per instructions - use raw agents directly
    const paginatedAgents = agents.slice((agentPage - 1) * agentPageSize, agentPage * agentPageSize);

    // Calculate Average Chats
    const activeAgentsCount = onlineCount + busyCount;
    const totalActiveChats = agents.reduce((acc, a) => acc + a.activeChats, 0);
    const avgChatsPerAgent = activeAgentsCount > 0 ? (totalActiveChats / activeAgentsCount).toFixed(1) : '0';

    // Suspend agent action
    const handleSuspendAgent = (agentKey: string) => {
        setAgents(prev => prev.map(a => a.key === agentKey ? { ...a, status: 'Offline', activeChats: 0 } : a));
        showToast('Agent has been suspended.');
    };

    // Render Detailed Agent Performance sub-page
    if (selectedAgent) {
        return (
            <AgentPerformanceDetails
                selectedAgent={selectedAgent}
                onBack={() => setSelectedAgentKey(null)}
                performanceTab={performanceTab}
                setPerformanceTab={setPerformanceTab}
            />
        );
    }

    // Render Main Dashboard Overview & Cards List
    return (
        <div className="space-y-6 pb-6 relative">
            <Toast message={toast} />

            {/* Page Header */}
            <PageHeader
                title="Agent Management"
                subtitle="Monitor, reassign, and optimize your support team efficiency in real-time."
            />

            {/* Statistics Cards Row */}
            <AgentStatsCards
                onlineCount={onlineCount}
                busyCount={busyCount}
                totalAgentsCount={totalAgentsCount}
                totalActiveChats={totalActiveChats}
                avgChatsPerAgent={avgChatsPerAgent}
            />

            {/* Agent List / Cards Container */}
            <div className="flex flex-col gap-6">
                <AgentCardsGrid
                    agents={agents}
                    paginatedAgents={paginatedAgents}
                    onlineCount={onlineCount}
                    busyCount={busyCount}
                    offlineCount={offlineCount}
                    onViewDetails={setSelectedAgentKey}
                    onSuspendAgent={handleSuspendAgent}
                />

                {/* Pagination */}
                {totalAgentsCount > agentPageSize && (
                    <div className="flex justify-end pr-6">
                        <Pagination
                            current={agentPage}
                            pageSize={agentPageSize}
                            total={totalAgentsCount}
                            onChange={(p) => setAgentPage(p)}
                            light={true}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default AgentManagement;
