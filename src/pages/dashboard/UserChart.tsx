import { LuTrendingUp } from 'react-icons/lu';
import { TopVendorItem } from '../../features/overview/overviewApi';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

interface UserChartProps {
    topVendors?: TopVendorItem[];
    isLoading?: boolean;
}

const UserChart = ({ topVendors = [], isLoading }: UserChartProps) => {
    return (
        <div 
            className="flex flex-col gap-4 p-6 rounded-2xl h-full justify-start"
            style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
        >
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
                <h2 className="text-lg font-bold text-white">Top Vendors</h2>
                <LuTrendingUp className="text-[#ff4b72]" size={20} />
            </div>

            <div className="flex flex-col gap-3.5 mt-2">
                {isLoading ? (
                    <LoadingSpinner text="Loading top vendors..." />
                ) : topVendors.length === 0 ? (
                    <div className="py-8 text-center text-white/50 text-sm">
                        No top vendors found
                    </div>
                ) : (
                    topVendors.map((vendor, index) => (
                        <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-[#ff4b72] flex items-center justify-center text-white text-sm font-semibold shrink-0">
                                    {index + 1}
                                </div>
                                <div>
                                    <h4 className="text-white text-sm font-medium leading-snug">{vendor.name}</h4>
                                    <p className="text-white/60 text-xs mt-0.5">{vendor.totalOrders} {vendor.totalOrders === 1 ? 'order' : 'orders'}</p>
                                </div>
                            </div>
                            {vendor.amount !== undefined && (
                                <span className="text-white text-sm font-semibold">${vendor.amount}</span>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default UserChart;
