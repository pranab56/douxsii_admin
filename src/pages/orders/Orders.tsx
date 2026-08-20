import { useState } from 'react';
import { FiEye } from 'react-icons/fi';
import PageHeader from '../../components/ui/PageHeader';
import Table from '../../components/ui/Table';
import Pagination from '../../components/ui/Pagination';
import Search from '../../components/ui/Search';
import OrderDetailsModal from '../../components/ui/OrderDetailsModal';
import CustomSelect from '../../components/ui/CustomSelect';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { useGetAllOrdersQuery } from '../../features/orders/ordersApi';
import { OrderRow } from './orders.types';
import { baseURL } from '../../utils/BaseURL';

const Orders = () => {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [page, setPage] = useState(1);

    // Modals State
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
    const [detailsOpen, setDetailsOpen] = useState(false);

    // Unfiltered Query for fixed Stats Cards
    const { data: statsResponse, isLoading: isStatsLoading } = useGetAllOrdersQuery();

    // Filtered Query for Table Data & Search
    const { data: ordersResponse, isLoading, isFetching } = useGetAllOrdersQuery({
        page,
        status: statusFilter,
        searchTerm: search,
    });

    const allOrdersList: OrderRow[] = statsResponse?.data || [];
    const ordersList: OrderRow[] = ordersResponse?.data || [];
    const meta = ordersResponse?.meta;

    // Fixed Stats Cards Computation
    const totalOrders = statsResponse?.meta?.total ?? allOrdersList.length;
    const deliveredOrders = allOrdersList.filter(o => o.status?.toLowerCase() === 'delivered').length;
    const rejectedOrders = allOrdersList.filter(o => o.status?.toLowerCase() === 'rejected').length;
    const paidOrders = allOrdersList.filter(o => o.paymentStatus?.toLowerCase() === 'paid').length;

    const pageSize = meta?.limit || 10;
    const totalItems = meta?.total ?? ordersList.length;

    const handleOpenDetails = (orderId: string) => {
        setSelectedOrderId(orderId);
        setDetailsOpen(true);
    };

    const stats = [
        { label: 'Total Orders', value: totalOrders },
        { label: 'Delivered Orders', value: deliveredOrders },
        { label: 'Rejected Orders', value: rejectedOrders },
        { label: 'Paid Orders', value: paidOrders }
    ];

    const columns = [
        {
            title: 'Ordered Item',
            key: 'orderedItem',
            render: (record: OrderRow) => {
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
                            />
                        ) : (
                            <div className="w-11 h-11 rounded-xl bg-[#ff4b72]/20 border border-[#ff4b72]/30 flex items-center justify-center text-[#ff4b72] font-bold text-xs shrink-0">
                                🛍️
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
            title: 'Order Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
                const st = (status || '').toLowerCase();
                return (
                    <span 
                        className={`px-3 py-1 rounded-full text-xs font-semibold inline-block uppercase tracking-wider ${
                            st === 'delivered' 
                                ? 'bg-green-500/15 text-[#10b981] border border-green-500/20' 
                                : st === 'processing'
                                ? 'bg-blue-500/15 text-[#38bdf8] border border-blue-500/20'
                                : st === 'rejected'
                                ? 'bg-red-500/15 text-[#ef4444] border border-red-500/20'
                                : 'bg-amber-500/15 text-[#fbbf24] border border-amber-500/20'
                        }`}
                    >
                        {status}
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
            render: (record: OrderRow) => (
                <div className="flex items-center gap-3">
                    <FiEye 
                        className="text-[#38bdf8] hover:text-[#7dd3fc] cursor-pointer" 
                        size={18} 
                        title="View Order Details"
                        onClick={() => handleOpenDetails(record._id)}
                    />
                </div>
            )
        }
    ];

    return (
        <div className="space-y-6 pb-6 relative">
            <PageHeader title="Order Management" subtitle="Manage all customer and gift orders" />

            {/* Stats Cards Section (Fixed & Unfiltered) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                    <div 
                        key={idx} 
                        className="rounded-2xl p-6 flex flex-col justify-center transition-all duration-300 hover:scale-[1.02]"
                        style={{
                            background: 'rgba(255, 255, 255, 0.04)',
                            border: '1px solid rgba(255, 255, 255, 0.08)'
                        }}
                    >
                        <span className="text-white/60 text-sm font-medium">{stat.label}</span>
                        <h2 className="text-white text-4xl font-bold mt-2 font-sans">{isStatsLoading ? '...' : stat.value}</h2>
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
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                    <Search 
                        value={search}
                        onChange={(val) => {
                            setSearch(val);
                            setPage(1);
                        }}
                        placeholder="Search orders..."
                    />
                    <CustomSelect 
                        value={statusFilter}
                        onChange={(val) => {
                            setStatusFilter(val);
                            setPage(1);
                        }}
                        options={[
                            { value: 'All', label: 'All Status' },
                            { value: 'delivered', label: 'Delivered' },
                            { value: 'rejected', label: 'Rejected' },
                            { value: 'pending', label: 'Pending' }
                        ]}
                        className="w-40"
                    />
                </div>

                <div className="overflow-x-auto relative">
                    {isLoading || isFetching ? (
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
