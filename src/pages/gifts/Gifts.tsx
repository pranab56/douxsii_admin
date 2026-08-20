import { useState } from 'react';
import { FiEye } from 'react-icons/fi';
import PageHeader from '../../components/ui/PageHeader';
import Table from '../../components/ui/Table';
import Pagination from '../../components/ui/Pagination';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import GiftDetailsModal, { UnifiedGiftDetail } from '../../components/ui/GiftDetailsModal';
import { useGetAllGiftQuery, useGetAllGiftWalletQuery, GiftOrderRecord, GiftWalletRecord } from '../../features/gifts/giftsApi';
import { baseURL } from '../../utils/BaseURL';

interface UnifiedGiftRow {
    _id: string;
    productName: string;
    productDescription?: string;
    imageUrl?: string;
    senderName: string;
    senderEmail?: string;
    receiverName: string;
    receiverEmail?: string;
    totalAmount: number;
    giftAmount: number;
    orderStatus: string;
    giftStatus: string;
    paymentStatus: string;
    sentDate: string;
}

const Gifts = () => {
    const [activeTab, setActiveTab] = useState<'flower' | 'cash'>('flower');
    const [page, setPage] = useState(1);

    // Modal state
    const [selectedGift, setSelectedGift] = useState<UnifiedGiftDetail | null>(null);
    const [detailsOpen, setDetailsOpen] = useState(false);

    // Queries
    const { data: flowerGiftResponse, isLoading: isFlowerLoading, isFetching: isFlowerFetching } = useGetAllGiftQuery({ page });
    const { data: cashGiftResponse, isLoading: isCashLoading, isFetching: isCashFetching } = useGetAllGiftWalletQuery({ page });

    // Active response & Stats computation
    const activeResponse = activeTab === 'flower' ? flowerGiftResponse : cashGiftResponse;
    const statsData = activeResponse?.data;
    const meta = activeResponse?.meta;

    const totalGiftSent = statsData?.totalGift ?? meta?.total ?? 0;
    const pendingGifts = statsData?.totalPendingGift ?? 0;
    const redeemedGifts = statsData?.totalRedeemedGift ?? 0;

    const stats = [
        { label: 'Total Gift Sent', value: totalGiftSent },
        { label: 'Pending Gifts', value: pendingGifts },
        { label: 'Redeemed Gifts', value: redeemedGifts },
    ];

    let dataSource: UnifiedGiftRow[] = [];

    if (activeTab === 'flower') {
        const result: GiftOrderRecord[] = flowerGiftResponse?.data?.result || [];
        dataSource = result.map((item) => {
            const prod = item.productList?.[0]?.productId;
            const imagePath = prod?.images?.[0];
            const imageUrl = imagePath
                ? (imagePath.startsWith('http') ? imagePath : `${baseURL}/${imagePath.replace(/\\/g, '/')}`)
                : undefined;

            const sender = typeof item.userId === 'object' && item.userId?.fullName 
                ? item.userId.fullName 
                : 'Customer';
            const senderEmail = typeof item.userId === 'object' ? item.userId?.email : undefined;

            const receiver = typeof item.giftUserId === 'object' && item.giftUserId?.fullName 
                ? item.giftUserId.fullName 
                : 'Recipient';
            const receiverEmail = typeof item.giftUserId === 'object' ? item.giftUserId?.email : undefined;

            return {
                _id: item._id,
                productName: prod?.name || 'Flower & Gift Item',
                productDescription: prod?.description,
                imageUrl,
                senderName: sender,
                senderEmail,
                receiverName: receiver,
                receiverEmail,
                totalAmount: item.totalAmount || 0,
                giftAmount: item.giftAmount || 0,
                orderStatus: item.status || 'delivered',
                giftStatus: item.giftStatus || 'redeemed',
                paymentStatus: item.paymentStatus || 'paid',
                sentDate: item.orderDate ? new Date(item.orderDate).toLocaleDateString() : 'N/A',
            };
        });
    } else {
        const result: GiftWalletRecord[] = cashGiftResponse?.data?.result || [];
        dataSource = result.map((item) => {
            return {
                _id: item._id,
                productName: 'Cash Gift',
                productDescription: 'Direct Cash Transfer Gift',
                imageUrl: undefined,
                senderName: item.userId?.fullName || 'Customer',
                senderEmail: item.userId?.email,
                receiverName: item.giftUserId?.fullName || 'Recipient',
                receiverEmail: item.giftUserId?.email,
                totalAmount: item.amount || 0,
                giftAmount: item.amount || 0,
                orderStatus: 'completed',
                giftStatus: item.status || 'redeemed',
                paymentStatus: 'paid',
                sentDate: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A',
            };
        });
    }

    const isLoading = activeTab === 'flower' ? isFlowerLoading : isCashLoading;
    const isFetching = activeTab === 'flower' ? isFlowerFetching : isCashFetching;

    const pageSize = meta?.limit || 10;
    const totalItems = meta?.total ?? dataSource.length;

    const handleOpenDetails = (row: UnifiedGiftRow) => {
        setSelectedGift({
            giftId: row.productName,
            status: row.giftStatus,
            amount: row.totalAmount,
            senderName: row.senderName,
            senderEmail: row.senderEmail,
            receiverName: row.receiverName,
            receiverEmail: row.receiverEmail,
            sentDate: row.sentDate,
            message: row.productDescription || 'Enjoy your gift!',
            imageUrl: row.imageUrl,
        });
        setDetailsOpen(true);
    };

    const columns = [
        {
            title: 'Gift Item',
            key: 'productName',
            render: (record: UnifiedGiftRow) => (
                <div className="flex items-center gap-3">
                    {record.imageUrl ? (
                        <div className="w-10 h-10 rounded-xl overflow-hidden bg-[#560e18] shrink-0 border border-white/10">
                            <img src={record.imageUrl} alt={record.productName} className="w-full h-full object-cover" />
                        </div>
                    ) : (
                        <div className="w-10 h-10 rounded-xl bg-[#ff4b72]/20 border border-[#ff4b72]/30 flex items-center justify-center shrink-0 text-[#ff4b72] font-bold text-xs">
                            🎁
                        </div>
                    )}
                    <div className="max-w-[240px]">
                        <span 
                            className="text-white text-sm font-semibold block truncate cursor-pointer hover:text-[#ff4b72] transition-colors"
                            onClick={() => handleOpenDetails(record)}
                        >
                            {record.productName}
                        </span>
                        {record.productDescription && (
                            <span className="text-white/40 text-xs block truncate mt-0.5">{record.productDescription}</span>
                        )}
                    </div>
                </div>
            )
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
            title: 'Gift Credit',
            dataIndex: 'giftAmount',
            key: 'giftAmount',
            render: (val: number) => (
                <span className="text-[#ff4b72] text-sm font-bold font-sans">
                    ${(val ?? 0).toFixed(2)}
                </span>
            )
        },
        {
            title: 'Payment Status',
            dataIndex: 'paymentStatus',
            key: 'paymentStatus',
            render: (val: string) => (
                <span className="bg-green-500/15 text-[#10b981] border border-green-500/20 px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider inline-block">
                    {val || 'Paid'}
                </span>
            )
        },
        {
            title: 'Gift Status',
            dataIndex: 'giftStatus',
            key: 'giftStatus',
            render: (val: string) => {
                const isRedeemed = val?.toLowerCase() === 'redeemed' || val?.toLowerCase() === 'delivered';
                return (
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider inline-block ${
                        isRedeemed 
                            ? 'bg-emerald-500/15 text-[#10b981] border border-emerald-500/20' 
                            : 'bg-amber-500/15 text-[#fbbf24] border border-amber-500/20'
                    }`}>
                        {val}
                    </span>
                );
            }
        },
        {
            title: 'Date',
            dataIndex: 'sentDate',
            key: 'sentDate',
            render: (val: string) => (
                <span className="text-white/60 text-xs">{val}</span>
            )
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (record: UnifiedGiftRow) => (
                <div className="flex items-center gap-3">
                    <FiEye
                        className="text-[#38bdf8] hover:text-[#7dd3fc] cursor-pointer"
                        size={18}
                        title="View Details"
                        onClick={() => handleOpenDetails(record)}
                    />
                </div>
            )
        }
    ];

    return (
        <div className="space-y-6 pb-6 relative">
            <PageHeader title="Gift System" subtitle="Monitor Gifts of the systems" />

            {/* Stats Cards Section */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
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
                        <h2 className="text-white text-4xl font-bold mt-2 font-sans">
                            {isLoading ? '...' : stat.value}
                        </h2>
                    </div>
                ))}
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-white/10 gap-8">
                <button
                    type="button"
                    onClick={() => {
                        setActiveTab('flower');
                        setPage(1);
                    }}
                    className={`pb-3 text-sm font-semibold transition-all relative cursor-pointer border-0 bg-transparent outline-none ${
                        activeTab === 'flower' ? 'text-[#ff4b72]' : 'text-white/60 hover:text-white'
                    }`}
                >
                    Flower & Cash Gift
                    {activeTab === 'flower' && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#ff4b72] rounded-full" />
                    )}
                </button>
                <button
                    type="button"
                    onClick={() => {
                        setActiveTab('cash');
                        setPage(1);
                    }}
                    className={`pb-3 text-sm font-semibold transition-all relative cursor-pointer border-0 bg-transparent outline-none ${
                        activeTab === 'cash' ? 'text-[#ff4b72]' : 'text-white/60 hover:text-white'
                    }`}
                >
                    Cash Gift
                    {activeTab === 'cash' && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#ff4b72] rounded-full" />
                    )}
                </button>
            </div>

            {/* Content Table Container */}
            <div
                className="p-6 rounded-2xl flex flex-col gap-6"
                style={{
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.08)'
                }}
            >
                <div className="overflow-x-auto relative">
                    {isLoading || isFetching ? (
                        <LoadingSpinner text={`Loading ${activeTab === 'flower' ? 'flower & cash' : 'cash'} gifts...`} />
                    ) : dataSource.length === 0 ? (
                        <div className="py-16 text-center text-white/50 text-base">
                            No {activeTab === 'flower' ? 'flower & cash' : 'cash'} gifts found.
                        </div>
                    ) : (
                        <Table
                            dataSource={dataSource}
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
            <GiftDetailsModal
                open={detailsOpen}
                gift={selectedGift}
                onClose={() => setDetailsOpen(false)}
            />
        </div>
    );
};

export default Gifts;
