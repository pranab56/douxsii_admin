import { Link } from 'react-router-dom';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from 'recharts';
import {
    FiShoppingCart,
    FiClock,
    FiCheckCircle,
    FiDollarSign,
    FiArrowRight,
    FiTrendingUp,
    FiPieChart,
    FiBox,
} from 'react-icons/fi';
import PageHeader from '../../components/ui/PageHeader';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { useGetAllShopOverviewQuery } from '../../features/shop/overviewApi';

const ShopOverview = () => {
    // Primary Shop Overview Query
    const { data: overviewResponse, isLoading: isOverviewLoading } = useGetAllShopOverviewQuery();
    const overviewData = overviewResponse?.data;

    // Format incomeChart for 12 months (Jan - Dec)
    const formattedIncomeChart = (overviewData?.incomeChart || []).map((item) => ({
        month: item.month.charAt(0).toUpperCase() + item.month.slice(1),
        revenue: item.amount || 0,
    }));

    // Calculate metrics
    const totalOrders = overviewData?.totalOrder ?? 0;
    const pendingOrders = overviewData?.totalPendingOrder ?? 0;
    const completedOrders = overviewData?.totalCompletedOrder ?? 0;
    const totalRevenue = overviewData?.totalRevenue ?? 0;

    const completionRate = totalOrders > 0 ? Math.round((completedOrders / totalOrders) * 100) : 0;
    const pendingRate = totalOrders > 0 ? Math.round((pendingOrders / totalOrders) * 100) : 0;

    // KPI Cards Data
    const kpiCards = [
        {
            title: 'Total Revenue',
            value: `$${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            subtitle: 'Cumulative store earnings',
            icon: <FiDollarSign size={22} className="text-white" />,
            iconBg: '#46000B',
            badge: (
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-[#10b981] border border-emerald-500/20">
                    Gross Income
                </span>
            ),
        },
        {
            title: 'Total Orders',
            value: totalOrders.toLocaleString(),
            subtitle: 'Lifetime customer orders',
            icon: <FiShoppingCart size={22} className="text-white" />,
            iconBg: '#46000B',
            badge: (
                <Link
                    to="/orders"
                    className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/10 text-white/80 hover:text-white border border-white/15 no-underline flex items-center gap-1 transition-colors"
                >
                    View All <FiArrowRight size={10} />
                </Link>
            ),
        },
        {
            title: 'Pending Orders',
            value: pendingOrders.toLocaleString(),
            subtitle: 'Awaiting fulfillment',
            icon: <FiClock size={22} className="text-[#fbbf24]" />,
            iconBg: '#46000B',
            badge: (
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/15 text-[#fbbf24] border border-amber-500/20">
                    Needs Action
                </span>
            ),
        },
        {
            title: 'Completed Orders',
            value: completedOrders.toLocaleString(),
            subtitle: 'Successfully delivered',
            icon: <FiCheckCircle size={22} className="text-[#10b981]" />,
            iconBg: '#46000B',
            badge: (
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-green-500/15 text-[#10b981] border border-green-500/20">
                    Fulfilled
                </span>
            ),
        },
    ];

    return (
        <div className="space-y-6 pb-8">
            {/* Header with Quick Navigation */}
            <PageHeader
                title="Shop Overview"
                subtitle="Monitor order fulfillment, sales trends, and store revenue performance."
                extra={
                    <div className="flex items-center gap-3">
                        <Link
                            to="/orders"
                            className="h-10 px-4 rounded-xl text-white font-medium text-xs sm:text-sm flex items-center gap-2 transition-all hover:opacity-90 cursor-pointer border border-white/15 no-underline shadow-sm"
                            style={{ background: 'linear-gradient(135deg, #46000B, #6B000F)' }}
                        >
                            <FiShoppingCart size={16} />
                            <span>Orders</span>
                        </Link>
                        <Link
                            to="/products"
                            className="h-10 px-4 rounded-xl text-white font-medium text-xs sm:text-sm flex items-center gap-2 transition-all hover:opacity-90 cursor-pointer border border-white/15 no-underline shadow-sm"
                            style={{ background: '#560e18' }}
                        >
                            <FiBox size={16} />
                            <span>Products</span>
                        </Link>
                    </div>
                }
            />

            {/* Top KPI Statistics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {kpiCards.map((item, idx) => (
                    <div
                        key={idx}
                        className="rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 hover:scale-[1.02]"
                        style={{
                            background: 'rgba(255, 255, 255, 0.04)',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                        }}
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-white/60 text-sm font-medium tracking-wide">
                                {item.title}
                            </span>
                            <div
                                className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-sm border border-white/10"
                                style={{ backgroundColor: item.iconBg }}
                            >
                                {item.icon}
                            </div>
                        </div>

                        <div className="mt-3">
                            <h2 className="text-white text-3xl sm:text-4xl font-bold font-sans tracking-tight m-0">
                                {isOverviewLoading ? '...' : item.value}
                            </h2>
                        </div>

                        <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-white/50">
                            <span>{item.subtitle}</span>
                            {item.badge}
                        </div>
                    </div>
                ))}
            </div>

            {/* Analytics Section: Monthly Revenue Chart + Order Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* 12-Month Income Chart (3 cols) */}
                <div
                    className="lg:col-span-3 p-6 rounded-2xl flex flex-col justify-between"
                    style={{
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                    }}
                >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-white/5">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-[#ff4b72]/15 flex items-center justify-center text-[#ff4b72]">
                                <FiTrendingUp size={18} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white m-0">Monthly Revenue & Income</h3>
                                <p className="text-white/40 text-xs mt-0.5 m-0">12-Month Store Sales Performance</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/5 text-white/80 border border-white/10">
                                Total: ${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                        </div>
                    </div>

                    <div className="h-72 mt-4">
                        {isOverviewLoading ? (
                            <LoadingSpinner text="Loading revenue chart..." />
                        ) : formattedIncomeChart.length === 0 ? (
                            <div className="h-full flex items-center justify-center text-white/50 text-sm">
                                No income chart data available
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart
                                    data={formattedIncomeChart}
                                    margin={{ top: 15, right: 10, left: -20, bottom: 0 }}
                                >
                                    <defs>
                                        <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#ff4b72" stopOpacity={0.45} />
                                            <stop offset="95%" stopColor="#ff4b72" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
                                    <XAxis
                                        dataKey="month"
                                        stroke="rgba(255, 255, 255, 0.4)"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis
                                        stroke="rgba(255, 255, 255, 0.4)"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(val) => `$${val}`}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            borderRadius: '12px',
                                            border: '1px solid rgba(255, 255, 255, 0.12)',
                                            background: '#36050e',
                                            color: '#fff',
                                            boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
                                            padding: '8px 14px',
                                        }}
                                        formatter={(val: number) => [`$${val.toFixed(2)}`, 'Revenue']}
                                        labelStyle={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600, marginBottom: '2px' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="revenue"
                                        name="Revenue"
                                        stroke="#ff4b72"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#incomeGradient)"
                                        dot={{ fill: '#ff4b72', stroke: '#fff', strokeWidth: 1.5, r: 3.5 }}
                                        activeDot={{ r: 6, stroke: '#ff4b72', strokeWidth: 2, fill: '#fff' }}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>

                {/* Order Fulfillment & Status Distribution (2 cols) */}
                <div
                    className="lg:col-span-2 p-6 rounded-2xl flex flex-col justify-between"
                    style={{
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                    }}
                >
                    <div className="flex items-center justify-between pb-4 border-b border-white/5">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-[#46000B] flex items-center justify-center text-white">
                                <FiPieChart size={18} />
                            </div>
                            <h3 className="text-lg font-bold text-white m-0">Fulfillment Status</h3>
                        </div>
                        <span className="text-xs text-white/50">{totalOrders} Total</span>
                    </div>

                    <div className="my-6 flex flex-col gap-5">
                        {/* Overall Fulfillment Rate Indicator */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-white/70 text-xs font-semibold">Fulfillment Rate</span>
                                <span className="text-[#10b981] font-bold text-sm">{completionRate}%</span>
                            </div>
                            <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden flex">
                                <div
                                    style={{ width: `${completionRate}%` }}
                                    className="h-full bg-[#10b981] transition-all duration-500"
                                />
                                <div
                                    style={{ width: `${pendingRate}%` }}
                                    className="h-full bg-[#fbbf24] transition-all duration-500"
                                />
                            </div>
                        </div>

                        {/* Breakdown List */}
                        <div className="space-y-3">
                            {/* Pending item */}
                            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-amber-500/15 flex items-center justify-center text-[#fbbf24]">
                                        <FiClock size={16} />
                                    </div>
                                    <div>
                                        <h4 className="text-white text-xs font-semibold m-0">Pending Orders</h4>
                                        <p className="text-white/50 text-[11px] m-0">Needs packaging or shipping</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="text-[#fbbf24] font-bold text-sm block">
                                        {pendingOrders}
                                    </span>
                                    <span className="text-white/40 text-[10px]">{pendingRate}%</span>
                                </div>
                            </div>

                            {/* Completed item */}
                            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-green-500/15 flex items-center justify-center text-[#10b981]">
                                        <FiCheckCircle size={16} />
                                    </div>
                                    <div>
                                        <h4 className="text-white text-xs font-semibold m-0">Completed Orders</h4>
                                        <p className="text-white/50 text-[11px] m-0">Delivered to customers</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="text-[#10b981] font-bold text-sm block">
                                        {completedOrders}
                                    </span>
                                    <span className="text-white/40 text-[10px]">{completionRate}%</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Link
                        to="/orders"
                        className="w-full h-10 rounded-xl flex items-center justify-center gap-2 text-white font-medium text-xs transition-all hover:bg-white/10 border border-white/10 no-underline"
                        style={{ background: 'rgba(255, 255, 255, 0.03)' }}
                    >
                        <span>Manage All Orders</span>
                        <FiArrowRight size={14} />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ShopOverview;
