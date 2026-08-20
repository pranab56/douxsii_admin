import { FiUsers, FiShoppingCart } from 'react-icons/fi';
import { PiStorefront } from 'react-icons/pi';
import { LuFlower } from 'react-icons/lu';

interface DashboardStatsProps {
    stats?: {
        totalProducts?: number;
        totalUsers?: number;
        totalVendorUsers?: number;
        totalOrders?: number;
    };
    isLoading?: boolean;
}

const DashboardStats = ({ stats, isLoading }: DashboardStatsProps) => {
    const data = [
        {
            name: 'Total Products',
            count: isLoading ? '...' : (stats?.totalProducts ?? 0).toLocaleString(),
            icon: <LuFlower className="text-white" size={22} />,
            iconBg: '#46000B',
        },
        {
            name: 'Total Users',
            count: isLoading ? '...' : (stats?.totalUsers ?? 0).toLocaleString(),
            icon: <FiUsers className="text-white" size={22} />,
            iconBg: '#46000B',
        },
        {
            name: 'Total Vendors',
            count: isLoading ? '...' : (stats?.totalVendorUsers ?? 0).toLocaleString(),
            icon: <PiStorefront className="text-white" size={22} />,
            iconBg: '#46000B',
        },
        {
            name: 'Total Orders',
            count: isLoading ? '...' : (stats?.totalOrders ?? 0).toLocaleString(),
            icon: <FiShoppingCart className="text-white" size={22} />,
            iconBg: '#46000B',
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.map((item, index) => (
                <div 
                    key={index} 
                    className="rounded-2xl p-6 flex items-center justify-between transition-all duration-300 hover:scale-[1.02]"
                    style={{
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                    }}
                >
                    <div className="flex-1 flex flex-col justify-center">
                        <p className="text-white/60 text-sm font-medium tracking-wide">
                            {item.name}
                        </p>
                        <p className="text-white text-[32px] font-bold mt-2 font-sans tracking-tight">
                            {item.count} 
                        </p>
                    </div>
                    <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                        style={{ backgroundColor: item.iconBg }}
                    >
                        {item.icon}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default DashboardStats;
