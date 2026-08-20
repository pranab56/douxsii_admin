import PageHeader from '../../components/ui/PageHeader';
import { useGetTopOverviewQuery } from '../../features/overview/overviewApi';
import { useGetAllUsersQuery } from '../../features/users/usersApi';
import DashboardStats from './DashboardStats';
import EarningChart from './EarningChart';
import UserChart from './UserChart';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const { data: overviewResponse, isLoading: isOverviewLoading } = useGetTopOverviewQuery();
    const { data: vendorsResponse, isLoading: isVendorsLoading } = useGetAllUsersQuery({ role: 'partner' });

    const overviewData = overviewResponse?.data;
    const rawVendors = vendorsResponse?.data?.result || [];
    
    // Display maximum 5 vendors on the overview page
    const vendorsList = rawVendors.slice(0, 5);

    return (
        <div className="space-y-6 pb-6">
            {/* Title & Subtitle */}
            <PageHeader 
                title="Dashboard Overview" 
                subtitle="Welcome back! Here's what's happening today." 
            />

            {/* Stats Cards */}
            <DashboardStats stats={overviewData} isLoading={isOverviewLoading} />

            {/* Daily Sales & Top Vendors */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mt-6">
                <div className="lg:col-span-3">
                    <EarningChart chartData={overviewData?.EarningChart} isLoading={isOverviewLoading} />
                </div>
                <div className="lg:col-span-2">
                    <UserChart topVendors={overviewData?.topVendors} isLoading={isOverviewLoading} />
                </div>
            </div>

            {/* Vendors Overview Section (Max 5 items & View All link) */}
            <div 
                className="p-6 rounded-2xl flex flex-col gap-5"
                style={{
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.08)'
                }}
            >
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-white m-0">Vendor & Partner Overview</h3>
                        <p className="text-white/40 text-xs mt-0.5 m-0">Showing latest 5 vendors</p>
                    </div>
                    <Link 
                        to="/vendors" 
                        className="text-[#ff4b72] hover:text-[#ff4b72]/80 transition-colors text-sm font-semibold cursor-pointer flex items-center gap-1 no-underline"
                    >
                        View All →
                    </Link>
                </div>

                <div className="flex flex-col gap-3">
                    {isVendorsLoading ? (
                        <LoadingSpinner text="Loading vendors..." />
                    ) : vendorsList.length === 0 ? (
                        <div className="py-6 text-center text-white/50 text-sm">
                            No vendors found
                        </div>
                    ) : (
                        vendorsList.map((vendor) => (
                            <div 
                                key={vendor._id} 
                                className="p-4 rounded-xl flex items-center justify-between transition-all duration-300 hover:bg-white/[0.04]"
                                style={{
                                    background: 'rgba(255, 255, 255, 0.02)',
                                    border: '1px solid rgba(255, 255, 255, 0.05)'
                                }}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-[#ff4b72] flex items-center justify-center text-white text-sm font-bold uppercase shrink-0">
                                        {(vendor.fullName || vendor.email || 'V').charAt(0)}
                                    </div>
                                    <div className="flex flex-col">
                                        <h4 className="text-white text-sm font-semibold m-0">{vendor.fullName || 'Vendor Partner'}</h4>
                                        <span className="text-white/60 text-xs mt-0.5">{vendor.email || vendor.phone || 'N/A'}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <span 
                                        className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase ${
                                            vendor.isActive 
                                                ? 'bg-green-500/10 text-[#10b981] border border-green-500/20' 
                                                : 'bg-red-500/10 text-[#ef4444] border border-red-500/20'
                                        }`}
                                    >
                                        {vendor.isActive ? 'Active' : 'Blocked'}
                                    </span>
                                    <Link
                                        to="/vendors"
                                        className="h-8 px-4 rounded-lg text-white font-medium text-xs flex items-center justify-center transition-all hover:opacity-90 cursor-pointer border border-white/10 no-underline"
                                        style={{ background: '#560e18' }}
                                    >
                                        Manage
                                    </Link>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
