import React from 'react';

interface RatingDistributionCardProps {
    ratingDistribution: { stars: number; percentage: number }[];
}

export const RatingDistributionCard: React.FC<RatingDistributionCardProps> = ({ ratingDistribution }) => {
    return (
        <div className="bg-white rounded-2xl p-6 border border-[#FFD2D6]/40 shadow-[0_4px_20px_rgba(86,0,12,0.03)] text-left flex flex-col gap-4">
            <h3 className="text-lg font-bold text-[#242424] m-0">Rating Distribution</h3>
            <div className="flex flex-col gap-3">
                {ratingDistribution.map((dist, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                        <span className="text-xs font-semibold text-gray-500 w-3">{dist.stars}</span>
                        <div className="flex-1 h-2 bg-[#FFF0F1] rounded-full overflow-hidden">
                            <div
                                className="h-full bg-[#56000c] rounded-full"
                                style={{ width: `${dist.percentage}%` }}
                            />
                        </div>
                        <span className="text-xs font-semibold text-gray-400 w-8 text-right">{dist.percentage}%</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RatingDistributionCard;
