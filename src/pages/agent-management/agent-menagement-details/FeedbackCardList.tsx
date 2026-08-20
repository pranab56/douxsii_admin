import React from 'react';
import { Rate } from 'antd';
import { AgentFeedback } from '../agent-management.types';

interface FeedbackCardListProps {
    feedbacks: AgentFeedback[];
    totalChatsHandled: number;
}

export const FeedbackCardList: React.FC<FeedbackCardListProps> = ({ feedbacks, totalChatsHandled }) => {
    return (
        <div className="bg-white rounded-2xl p-6 border border-[#FFD2D6]/40 shadow-[0_4px_20px_rgba(86,0,12,0.03)] text-left flex flex-col gap-4">
            <h3 className="text-lg font-bold text-[#242424] m-0">Recent Feedback</h3>
            <div className="flex flex-col gap-4">
                {feedbacks.length > 0 ? (
                    feedbacks.map((fb: AgentFeedback) => (
                        <div
                            key={fb.id}
                            className="p-4 bg-[#FAF3F3]/40 border border-[#FFD2D6]/20 rounded-2xl flex flex-col gap-2"
                        >
                            <div className="flex justify-between items-center">
                                <Rate disabled allowHalf value={fb.rating} style={{ fontSize: 13 }} />
                                <span className="text-[10px] text-gray-400 font-semibold">{fb.time}</span>
                            </div>
                            <p className="text-xs text-gray-600 leading-relaxed italic m-0">
                                "{fb.text}"
                            </p>
                            <span className="text-[10px] font-bold text-[#56000c] text-right mt-1 block">
                                {fb.author}
                            </span>
                        </div>
                    ))
                ) : (
                    <div className="py-6 text-center text-gray-400 text-xs">
                        No recent feedback reviews.
                    </div>
                )}
            </div>
            <button className="w-full h-10 border border-[#56000c] text-[#56000c] hover:bg-[#56000c]/5 font-semibold text-xs rounded-xl flex items-center justify-center transition-all bg-transparent cursor-pointer border-solid">
                View All {totalChatsHandled} Reviews
            </button>
        </div>
    );
};

export default FeedbackCardList;
