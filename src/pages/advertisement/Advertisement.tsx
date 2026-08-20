import { useState } from 'react';
import { FiEye } from 'react-icons/fi';
import toast from 'react-hot-toast';
import PageHeader from '../../components/ui/PageHeader';
import StatsCards from '../../components/ui/StatsCards';
import Table from '../../components/ui/Table';
import Pagination from '../../components/ui/Pagination';
import Search from '../../components/ui/Search';
import ConfirmModal from '../../components/ui/ConfirmModal';
import CampaignDetailsModal from '../../components/ui/CampaignDetailsModal';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import EmptyData from '../../components/ui/EmptyData';
import CampaignCard from './CampaignCard';
import { 
    useGetAllAdvertisementQuery, 
    useUpdateAdvertisementMutation, 
    ProductPromotionItem 
} from '../../features/advertisement/advertisementApi';

type Tab = 'pending' | 'active';

const STATUS_STYLES: Record<string, { dot: string; text: string }> = {
    active:   { dot: 'bg-[#10b981]', text: 'text-[#10b981]' },
    approved: { dot: 'bg-[#10b981]', text: 'text-[#10b981]' },
    expired:  { dot: 'bg-[#fbbf24]', text: 'text-[#fbbf24]' },
    pending:  { dot: 'bg-[#fbbf24]', text: 'text-[#fbbf24]' },
    rejected: { dot: 'bg-[#ef4444]', text: 'text-[#ef4444]' },
};

const Advertisement = () => {
    const [activeTab, setActiveTab] = useState<Tab>('active');
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const pageSize = 6;

    // RTK Query Hooks
    const { data: adResponse, isLoading, isFetching } = useGetAllAdvertisementQuery({ page, limit: pageSize, status: activeTab === 'pending' ? 'pending' : 'approved' });
    const [updateAdvertisement, { isLoading: isUpdating }] = useUpdateAdvertisementMutation();

    const adData = adResponse?.data;
    const meta = adResponse?.meta;

    const promotionList = adData?.result || [];

    // Filter by search
    const filteredList = search
        ? promotionList.filter(item => {
            const title = item.title || item.productId?.name || '';
            return title.toLowerCase().includes(search.toLowerCase());
        })
        : promotionList;

    // Modal states
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [selectedCampaign, setSelectedCampaign] = useState<ProductPromotionItem | null>(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmId, setConfirmId] = useState<string | null>(null);
    const [confirmType, setConfirmType] = useState<'approve' | 'reject'>('approve');

    // Dynamic stats matching original card titles
    const stats = [
        { label: 'Total Active Campaigns', value: adData?.totalActiveCampaigns ?? 0 },
        { label: 'Pending Request',        value: adData?.totalPendingCampaigns ?? 0 },
        { label: 'Total Ads Revenue',      value: `AED ${(adData?.totalAdsRevenue ?? 0).toLocaleString()}` },
    ];

    const openDetails = (c: ProductPromotionItem) => {
        setSelectedCampaign(c);
        setDetailsOpen(true);
    };

    const requestConfirm = (id: string, type: 'approve' | 'reject') => { 
        setConfirmId(id);
        setConfirmType(type);
        setConfirmOpen(true);
    };

    const handleConfirm = async () => {
        if (confirmId) {
            try {
                const targetStatus = confirmType === 'approve' ? 'approved' : 'rejected';
                const res = await updateAdvertisement({ id: confirmId, status: targetStatus }).unwrap();
                toast.success(res?.message || (confirmType === 'approve' ? 'Campaign approved successfully' : 'Campaign rejected'));
            } catch (err: any) {
                toast.error(err?.data?.message || 'Failed to update campaign status');
            }
        }
        setConfirmOpen(false);
        setConfirmId(null);
    };

    const activeCampaignColumns = [
        {
            title: 'Campaign',
            key: 'campaign',
            render: (r: ProductPromotionItem) => {
                const title = r.title || r.productId?.name || 'Special Product Promotion';
                return (
                    <div>
                        <p className="text-white text-sm font-semibold m-0">{title}</p>
                        <p className="text-white/40 text-xs m-0">ID #{r._id ? r._id.slice(-6) : 'N/A'}</p>
                    </div>
                );
            },
        },
        {
            title: 'Product',
            key: 'product',
            render: (r: ProductPromotionItem) => <span className="text-white/80 text-sm">{r.productId?.name || 'N/A'}</span>,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (s: string) => {
                const statusKey = (s || 'pending').toLowerCase();
                const style = STATUS_STYLES[statusKey] ?? { dot: 'bg-white/30', text: 'text-white/50' };
                return (
                    <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${style.dot}`} />
                        <span className={`text-sm font-medium capitalize ${style.text}`}>{s}</span>
                    </div>
                );
            },
        },
        {
            title: 'Price',
            key: 'price',
            render: (r: ProductPromotionItem) => <span className="text-white text-sm font-medium">${r.productId?.price ?? 0}</span>,
        },
        {
            title: 'Placement',
            dataIndex: 'selectedPlacement',
            key: 'selectedPlacement',
            render: (v: string) => (
                <span className="text-white/60 text-sm uppercase">{v ? v.replace(/_/g, ' ') : 'Homepage Banner'}</span>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (r: ProductPromotionItem) => (
                <FiEye
                    className="text-[#38bdf8] hover:text-[#7dd3fc] cursor-pointer"
                    size={17}
                    onClick={() => openDetails(r)}
                />
            ),
        },
    ];

    const tabs: { key: Tab; label: string }[] = [
        { key: 'active',  label: 'Active Campaigns' },
        { key: 'pending', label: 'Pending Approval' },
    ];

    return (
        <div className="space-y-6 pb-6">
            <PageHeader
                title="Advertisement Management"
                subtitle="Manage premium placements and vendor campaign approvals."
            />

            <StatsCards stats={stats} cols={3} />

            {/* Tabs */}
            <div className="flex items-center gap-6 border-b border-white/10 pb-0">
                {tabs.map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => { setActiveTab(tab.key); setPage(1); }}
                        className={`pb-3 text-sm font-semibold transition-all cursor-pointer bg-transparent border-0 outline-none border-b-2 -mb-[1px]
                            ${activeTab === tab.key
                                ? 'text-[#ff4b72] border-[#ff4b72]'
                                : 'text-white/40 border-transparent hover:text-white/70'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Active Campaigns — Table */}
            {activeTab === 'active' && (
                <div
                    className="p-6 rounded-2xl flex flex-col gap-6"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                    <Search
                        value={search}
                        onChange={(v) => { setSearch(v); setPage(1); }}
                        placeholder="Search campaigns..."
                    />

                    <div className="overflow-x-auto relative">
                        {isLoading || isFetching ? (
                            <LoadingSpinner text="Loading active campaigns..." />
                        ) : filteredList.length === 0 ? (
                            <EmptyData message="No active campaigns found." />
                        ) : (
                            <Table dataSource={filteredList} columns={activeCampaignColumns} rowKey="_id" />
                        )}
                    </div>

                    {meta && meta.total > 0 && (
                        <Pagination 
                            current={page} 
                            pageSize={pageSize} 
                            total={meta.total} 
                            onChange={(p) => setPage(p)} 
                        />
                    )}
                </div>
            )}

            {/* Pending Approval — Card Grid */}
            {activeTab === 'pending' && (
                <div className="space-y-4">
                    <Search
                        value={search}
                        onChange={(v) => { setSearch(v); setPage(1); }}
                        placeholder="Search campaigns..."
                    />

                    <div className="overflow-x-auto relative">
                        {isLoading || isFetching ? (
                            <LoadingSpinner text="Loading pending campaigns..." />
                        ) : filteredList.length === 0 ? (
                            <EmptyData message="No pending campaigns found." />
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                {filteredList.map(c => (
                                    <CampaignCard
                                        key={c._id}
                                        campaign={c}
                                        onApprove={(id) => requestConfirm(id, 'approve')}
                                        onReject={(id) => requestConfirm(id, 'reject')}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {meta && meta.total > 0 && (
                        <Pagination 
                            current={page} 
                            pageSize={pageSize} 
                            total={meta.total} 
                            onChange={(p) => setPage(p)} 
                        />
                    )}
                </div>
            )}

            {/* Details Modal */}
            <CampaignDetailsModal
                open={detailsOpen}
                campaign={selectedCampaign}
                onClose={() => setDetailsOpen(false)}
            />

            {/* Confirm Approval / Rejection Modal */}
            <ConfirmModal
                open={confirmOpen}
                title={confirmType === 'approve' ? 'Approve Campaign' : 'Reject Campaign'}
                description={
                    confirmType === 'approve'
                        ? 'This campaign will be published and made visible to users. Confirm?'
                        : 'This campaign will be rejected and the vendor will be notified. Confirm?'
                }
                type={confirmType === 'approve' ? 'warning' : 'danger'}
                isLoading={isUpdating}
                onConfirm={handleConfirm}
                onCancel={() => setConfirmOpen(false)}
            />
        </div>
    );
};

export default Advertisement;
