import React from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { ManagerAgent } from './agent-management.types';
import AgentHeaderBanner from './agent-menagement-details/AgentHeaderBanner';
import AgentMetricsGrid from './agent-menagement-details/AgentMetricsGrid';
import PerformanceReportChart from './agent-menagement-details/PerformanceReportChart';
import ActivityLogTable from './agent-menagement-details/ActivityLogTable';
import RatingDistributionCard from './agent-menagement-details/RatingDistributionCard';
import FeedbackCardList from './agent-menagement-details/FeedbackCardList';

interface AgentPerformanceDetailsProps {
    selectedAgent: ManagerAgent;
    onBack: () => void;
    performanceTab: 'Daily' | 'Weekly' | 'Monthly';
    setPerformanceTab: (tab: 'Daily' | 'Weekly' | 'Monthly') => void;
}

export const AgentPerformanceDetails: React.FC<AgentPerformanceDetailsProps> = ({
    selectedAgent,
    onBack,
    performanceTab,
    setPerformanceTab
}) => {
    return (
        <div className="space-y-6 pb-6 relative">
            {/* Back Button and Header */}
            <div className="flex items-center gap-3">
                <button
                    onClick={onBack}
                    className="w-10 h-10 rounded-xl bg-white border border-[#FFD2D6]/40 flex items-center justify-center text-[#56000c] hover:bg-[#56000c]/5 transition-all cursor-pointer shrink-0"
                >
                    <FiArrowLeft size={18} />
                </button>
                <div>
                    <h2 className="text-2xl font-bold text-[#242424] text-left m-0">Agent Performance</h2>
                    <p className="text-xs text-gray-500 text-left mt-0.5">Detailed metrics and review summary.</p>
                </div>
            </div>

            {/* Agent Profile Banner Card */}
            <AgentHeaderBanner selectedAgent={selectedAgent} />

            {/* Performance Metrics Stats Cards */}
            <AgentMetricsGrid selectedAgent={selectedAgent} />

            {/* Split Details Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* Performance reports bar chart */}
                    <PerformanceReportChart
                        chartData={selectedAgent.chartData}
                        performanceTab={performanceTab}
                        setPerformanceTab={setPerformanceTab}
                    />

                    {/* Detailed Activity Log Table */}
                    <ActivityLogTable activityLog={selectedAgent.activityLog} />
                </div>

                {/* Right Column (Ratings and Recent Feedback) */}
                <div className="space-y-6">
                    {/* Rating Distribution Card */}
                    <RatingDistributionCard ratingDistribution={selectedAgent.ratingDistribution} />

                    {/* Feedback Card List */}
                    <FeedbackCardList
                        feedbacks={selectedAgent.feedbacks}
                        totalChatsHandled={selectedAgent.totalChatsHandled}
                    />
                </div>
            </div>
        </div>
    );
};

export default AgentPerformanceDetails;
