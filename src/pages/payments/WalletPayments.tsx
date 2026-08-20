import { useState } from 'react';
import PageHeader from '../../components/ui/PageHeader';
import Table from '../../components/ui/Table';
import Pagination from '../../components/ui/Pagination';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { useGetAllPaymentQuery, useGetAllWithDrawQuery } from '../../features/payment_withdraw/paymentAndWithApi';

interface UnifiedTransactionRow {
    _id: string;
    transactionId: string;
    partyName: string;
    type: string;
    amount: number;
    date: string;
    status: string;
}

const WalletPayments = () => {
    const [activeTab, setActiveTab] = useState<'topup' | 'withdraw'>('topup');
    const [page, setPage] = useState(1);

    // Queries
    const { data: paymentResponse, isLoading: isPaymentLoading, isFetching: isPaymentFetching } = useGetAllPaymentQuery({ page });
    const { data: withdrawResponse, isLoading: isWithdrawLoading, isFetching: isWithdrawFetching } = useGetAllWithDrawQuery({ page });

    let dataSource: UnifiedTransactionRow[] = [];
    let meta: { page: number; limit: number; total: number; totalPage: number } | undefined;

    const rawPayment: any = paymentResponse;
    const rawWithdraw: any = withdrawResponse;

    if (activeTab === 'topup') {
        const result: any[] = rawPayment?.data?.result || (Array.isArray(rawPayment?.data) ? rawPayment.data : []);
        meta = rawPayment?.data?.meta || rawPayment?.meta;

        dataSource = result.map((item: any) => ({
            _id: item._id || String(Math.random()),
            transactionId: item.transactionId || item._id || 'N/A',
            partyName: item.userId?.fullName || 'N/A',
            type: item.type === 'deposit' ? 'Wallet Top-up' : (item.type || 'Wallet Top-up'),
            amount: item.amount || 0,
            date: item.transactionDate || item.createdAt || '',
            status: item.status?.toLowerCase() === 'paid' ? 'Completed' : (item.status || 'Pending'),
        }));
    } else {
        const result: any[] = Array.isArray(rawWithdraw?.data) 
            ? rawWithdraw.data 
            : (rawWithdraw?.data?.result || []);
        
        meta = rawWithdraw?.meta || rawWithdraw?.data?.meta;

        dataSource = result.map((item: any) => ({
            _id: item._id || String(Math.random()),
            transactionId: item.transactionId || item._id || 'N/A',
            partyName: item.userId?.fullName || 'N/A',
            type: 'Withdrawal',
            amount: item.amount || 0,
            date: item.createdAt || '',
            status: item.status?.toLowerCase() === 'completed' ? 'Completed' : (item.status || 'Pending'),
        }));
    }

    const isLoading = activeTab === 'topup' ? isPaymentLoading : isWithdrawLoading;
    const isFetching = activeTab === 'topup' ? isPaymentFetching : isWithdrawFetching;

    const pageSize = meta?.limit || 10;
    const totalItems = meta?.total ?? dataSource.length;

    const columns = [
        {
            title: 'Transaction ID',
            key: 'transactionId',
            render: (record: UnifiedTransactionRow) => (
                <span className="text-white text-sm font-semibold font-mono block">
                    {record.transactionId}
                </span>
            )
        },
        {
            title: 'User/Vendor',
            dataIndex: 'partyName',
            key: 'partyName',
            render: (val: string) => <span className="text-white text-sm font-medium">{val}</span>
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
            render: (val: string) => (
                <span className="bg-white/[0.05] border border-white/10 text-white/80 rounded-full px-3 py-1 text-xs font-semibold inline-block">
                    {val}
                </span>
            )
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
            render: (val: number) => (
                <span className="text-white text-sm font-bold font-sans">
                    ${(val ?? 0).toFixed(2)}
                </span>
            )
        },
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            render: (val: string) => (
                <span className="text-white/60 text-sm font-sans">
                    {val ? new Date(val).toLocaleDateString() : 'N/A'}
                </span>
            )
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
                const st = (status || '').toLowerCase();
                return (
                    <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold inline-block capitalize tracking-wider ${
                            st === 'completed' || st === 'paid'
                                ? 'bg-green-500/10 text-[#10b981] border border-green-500/20'
                                : st === 'pending'
                                ? 'bg-yellow-500/10 text-[#fbbf24] border border-yellow-500/20'
                                : 'bg-red-500/10 text-[#ef4444] border border-red-500/20'
                        }`}
                    >
                        {status}
                    </span>
                );
            }
        }
    ];

    return (
        <div className="space-y-6 pb-6 relative">
            <PageHeader title="Wallet & Payments" subtitle="Manage all financial transactions" />

            {/* Navigation Tabs (Top-up vs Withdrawal) */}
            <div className="flex border-b border-white/10 gap-8">
                <button
                    type="button"
                    onClick={() => {
                        setActiveTab('topup');
                        setPage(1);
                    }}
                    className={`pb-3 text-sm font-semibold transition-all relative cursor-pointer border-0 bg-transparent outline-none ${
                        activeTab === 'topup' ? 'text-[#ff4b72]' : 'text-white/60 hover:text-white'
                    }`}
                >
                    Top-up
                    {activeTab === 'topup' && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#ff4b72] rounded-full" />
                    )}
                </button>
                <button
                    type="button"
                    onClick={() => {
                        setActiveTab('withdraw');
                        setPage(1);
                    }}
                    className={`pb-3 text-sm font-semibold transition-all relative cursor-pointer border-0 bg-transparent outline-none ${
                        activeTab === 'withdraw' ? 'text-[#ff4b72]' : 'text-white/60 hover:text-white'
                    }`}
                >
                    Withdrawal
                    {activeTab === 'withdraw' && (
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
                <h3 className="text-white text-lg font-bold font-sans m-0">Recent Transactions</h3>

                <div className="overflow-x-auto relative">
                    {isLoading || isFetching ? (
                        <LoadingSpinner text={`Loading ${activeTab === 'topup' ? 'top-up' : 'withdrawal'} transactions...`} />
                    ) : dataSource.length === 0 ? (
                        <div className="py-16 text-center text-white/50 text-base">
                            No {activeTab === 'topup' ? 'top-up' : 'withdrawal'} transactions found.
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
        </div>
    );
};

export default WalletPayments;
