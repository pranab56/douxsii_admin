import { useState } from 'react';
import { FiEye, FiShoppingCart, FiCheckCircle, FiClock, FiCreditCard, FiBox } from 'react-icons/fi';
import PageHeader from '../../components/ui/PageHeader';
import Table from '../../components/ui/Table';
import Pagination from '../../components/ui/Pagination';
import OrderDetailsModal from '../../components/ui/OrderDetailsModal';
import CustomSelect from '../../components/ui/CustomSelect';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { useGetAllOrderQuery, OrderItem } from '../../features/shop/orderApi';
import { baseURL } from '../../utils/BaseURL';

const Orders = () => {
    const [statusFilter, setStatusFilter] = useState('All');
    const [page, setPage] = useState(1);

    // Modals State
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
    const [detailsOpen, setDetailsOpen] = useState(false);

    // Unfiltered Query for fixed Stats Cards
    const { data: statsResponse, isLoading: isStatsLoading } = useGetAllOrderQuery();

    // Filtered Query for Table Data & Status Filter
    const { data: ordersResponse, isLoading } = useGetAllOrderQuery({
        page,
        status: statusFilter,
    });

    const allOrdersList: OrderItem[] = statsResponse?.data || [];
    const ordersList: OrderItem[] = ordersResponse?.data || [];
    const meta = ordersResponse?.meta;

    // Fixed Stats Cards Computation
    const totalOrders = statsResponse?.meta?.total ?? allOrdersList.length;
    const completedOrders = allOrdersList.filter(o => ['completed', 'delivered'].includes(o.status?.toLowerCase())).length;
    const pendingOrders = allOrdersList.filter(o => ['pending', 'processing'].includes(o.status?.toLowerCase())).length;
    const totalRevenue = allOrdersList.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);

    const pageSize = meta?.limit || 10;
    const totalItems = meta?.total ?? ordersList.length;

    const handleOpenDetails = (orderId: string) => {
        setSelectedOrderId(orderId);
        setDetailsOpen(true);
    };

    const stats = [
        { 
            label: 'Total Orders', 
            value: isStatsLoading ? '...' : totalOrders.toLocaleString(),
            icon: <FiShoppingCart size={20} className="text-white" />,
            iconBg: '#46000B',
        },
        { 
            label: 'Completed Orders', 
            value: isStatsLoading ? '...' : completedOrders.toLocaleString(),
            icon: <FiCheckCircle size={20} className="text-[#10b981]" />,
            iconBg: '#46000B',
        },
        { 
            label: 'Pending Orders', 
            value: isStatsLoading ? '...' : pendingOrders.toLocaleString(),
            icon: <FiClock size={20} className="text-[#fbbf24]" />,
            iconBg: '#46000B',
        },
        { 
            label: 'Total Revenue', 
            value: isStatsLoading ? '...' : `$${totalRevenue.toFixed(2)}`,
            icon: <FiCreditCard size={20} className="text-[#ff4b72]" />,
            iconBg: '#46000B',
        }
    ];

    const columns = [
        {
            title: 'Order ID',
            dataIndex: '_id',
            key: '_id',
            render: (id: string) => (
                <span 
                    onClick={() => handleOpenDetails(id)}
                    className="text-white/80 hover:text-[#ff4b72] text-xs font-mono font-medium cursor-pointer transition-colors"
                >
                    #{id.slice(-6).toUpperCase()}
                </span>
            ),
        },
        {
            title: 'Ordered Item',
            key: 'orderedItem',
            render: (record: OrderItem) => {
                const firstItem = record.productList?.[0];
                const prod = firstItem?.productId;
                const prodName = prod?.name || 'Ordered Product';
                const imagePath = prod?.images?.[0];
                const imageUrl = imagePath 
                    ? (imagePath.startsWith('http') ? imagePath : `${baseURL}/${imagePath.replace(/\\/g, '/')}`)
                    : null;
                const count = record.productList?.length || 0;

                return (
                    <div 
                        className="flex items-center gap-3 cursor-pointer group"
                        onClick={() => handleOpenDetails(record._id)}
                    >
                        {imageUrl ? (
                            <img 
                                src={imageUrl} 
                                alt={prodName} 
                                className="w-11 h-11 rounded-xl object-cover bg-white/5 border border-white/10 shrink-0" 
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = '/vite.svg';
                                }}
                            />
                        ) : (
                            <div className="w-11 h-11 rounded-xl bg-[#ff4b72]/20 border border-[#ff4b72]/30 flex items-center justify-center text-[#ff4b72] shrink-0">
                                <FiBox size={18} />
                            </div>
                        )}
                        <div className="max-w-[240px]">
                            <span className="text-white text-sm font-semibold block truncate group-hover:text-[#ff4b72] transition-colors">
                                {prodName}
                            </span>
                            <span className="text-white/40 text-xs block mt-0.5 truncate">
                                Qty: {firstItem?.quantity || 1} • ${(firstItem?.price ?? record.totalAmount ?? 0).toFixed(2)}
                                {count > 1 ? ` (+${count - 1} more)` : ''}
                            </span>
                        </div>
                    </div>
                );
            }
        },
        {
            title: 'Total Amount',
            dataIndex: 'totalAmount',
            key: 'totalAmount',
            render: (val: number) => (
                <span className="text-white text-sm font-bold font-sans">
                    ${(val ?? 0).toFixed(2)}
                </span>
            )
        },
        {
            title: 'Order Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
                const st = (status || '').toLowerCase();
                const isAccepted = st === 'accepted';
                const isRejected = st === 'rejected' || st === 'cancelled';
                const isCompleted = st === 'completed';
                const isProcessing = st === 'processing' || st === 'delivered';

                return (
                    <span 
                        className={`px-3 py-1 rounded-full text-xs font-semibold inline-block uppercase tracking-wider ${
                            isAccepted
                                ? 'bg-emerald-500/15 text-[#10b981] border border-emerald-500/20' 
                                : isCompleted
                                ? 'bg-blue-500/15 text-[#38bdf8] border border-blue-500/20'
                                : isProcessing
                                ? 'bg-purple-500/15 text-[#a855f7] border border-purple-500/20'
                                : isRejected
                                ? 'bg-red-500/15 text-[#ef4444] border border-red-500/20'
                                : 'bg-amber-500/15 text-[#fbbf24] border border-amber-500/20'
                        }`}
                    >
                        {status || 'Completed'}
                    </span>
                );
            }
        },
        {
            title: 'Payment Status',
            dataIndex: 'paymentStatus',
            key: 'paymentStatus',
            render: (val?: string) => (
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider inline-block ${
                    val?.toLowerCase() === 'paid'
                        ? 'bg-green-500/15 text-[#10b981] border border-green-500/20'
                        : 'bg-amber-500/15 text-[#fbbf24] border border-amber-500/20'
                }`}>
                    {val || 'Unpaid'}
                </span>
            )
        },
        {
            title: 'Gift Status',
            dataIndex: 'giftStatus',
            key: 'giftStatus',
            render: (val?: string) => {
                const st = (val || 'none').toLowerCase();
                return (
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider inline-block ${
                        st === 'redeemed' 
                            ? 'bg-emerald-500/15 text-[#10b981] border border-emerald-500/20' 
                            : 'bg-white/[0.05] text-white/60 border border-white/10'
                    }`}>
                        {val || 'none'}
                    </span>
                );
            }
        },
        {
            title: 'Date',
            dataIndex: 'orderDate',
            key: 'orderDate',
            render: (val?: string) => (
                <span className="text-white/60 text-xs">
                    {val ? new Date(val).toLocaleDateString() : 'N/A'}
                </span>
            )
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (record: OrderItem) => (
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => handleOpenDetails(record._id)}
                        className="p-2 rounded-lg bg-white/5 hover:bg-[#ff4b72]/20 text-[#ff4b72] transition-colors border border-white/10 cursor-pointer"
                        title="View Order Details"
                    >
                        <FiEye size={16} />
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="space-y-6 pb-6 relative">
            <PageHeader title="Order Management" subtitle="Manage all customer and store orders" />

            {/* Stats Cards Section (Fixed & Unfiltered) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                    <div 
                        key={idx} 
                        className="rounded-2xl p-6 flex items-center justify-between transition-all duration-300 hover:scale-[1.02]"
                        style={{
                            background: 'rgba(255, 255, 255, 0.04)',
                            border: '1px solid rgba(255, 255, 255, 0.08)'
                        }}
                    >
                        <div>
                            <span className="text-white/60 text-sm font-medium tracking-wide">{stat.label}</span>
                            <h2 className="text-white text-3xl font-bold mt-2 font-sans">{stat.value}</h2>
                        </div>
                        <div 
                            className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border border-white/10 shadow-sm"
                            style={{ backgroundColor: stat.iconBg }}
                        >
                            {stat.icon}
                        </div>
                    </div>
                ))}
            </div>

            {/* Content Table Area */}
            <div 
                className="p-6 rounded-2xl flex flex-col gap-6"
                style={{
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.08)'
                }}
            >
                <div className="flex justify-end items-center">
                    <CustomSelect 
                        value={statusFilter}
                        onChange={(val) => {
                            setStatusFilter(val);
                            setPage(1);
                        }}
                        options={[
                            { value: 'All', label: 'All Status' },
                            { value: 'completed', label: 'Completed' },
                            { value: 'delivered', label: 'Delivered' },
                            { value: 'pending', label: 'Pending' },
                            { value: 'processing', label: 'Processing' },
                            { value: 'rejected', label: 'Rejected' }
                        ]}
                        className="w-40"
                    />
                </div>

                <div className="overflow-x-auto relative">
                    {isLoading  ? (
                        <LoadingSpinner text="Loading orders..." />
                    ) : ordersList.length === 0 ? (
                        <div className="py-16 text-center text-white/50 text-base">
                            No orders found.
                        </div>
                    ) : (
                        <Table 
                            dataSource={ordersList} 
                            columns={columns} 
                            rowKey="_id"
                        />
                    )}
                </div>

                {totalItems > pageSize && (
                    <Pagination 
                        current={page}
                        pageSize={pageSize}
                        total={totalItems}
                        onChange={(p) => setPage(p)}
                    />
                )}
            </div>

            {/* Details Modal */}
            <OrderDetailsModal
                open={detailsOpen}
                orderId={selectedOrderId}
                onClose={() => setDetailsOpen(false)}
            />
        </div>
    );
};

export default Orders;
