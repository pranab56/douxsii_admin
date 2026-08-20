import { useState } from 'react';
import { FiEye } from 'react-icons/fi';
import PageHeader from '../../components/ui/PageHeader';
import Table from '../../components/ui/Table';
import Pagination from '../../components/ui/Pagination';
import Search from '../../components/ui/Search';
import CommunityPostDetailsModal from '../../components/ui/CommunityPostDetailsModal';
import CustomSelect from '../../components/ui/CustomSelect';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { useGetAllcommunityQuery } from '../../features/community/communityApi';
import { CommunityRow } from './community.types';
import { baseURL } from '../../utils/BaseURL';

const Community = () => {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [page, setPage] = useState(1);

    // Modals State
    const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
    const [detailsOpen, setDetailsOpen] = useState(false);

    // Unfiltered Query for fixed Stats Cards
    const { data: statsResponse, isLoading: isStatsLoading } = useGetAllcommunityQuery();

    // Filtered Query for Table Data & Search
    const { data: communityResponse, isLoading, isFetching } = useGetAllcommunityQuery({
        page,
        searchTerm: search,
    });

    const allPostsList: CommunityRow[] = statsResponse?.data || [];
    let postsList: CommunityRow[] = communityResponse?.data || [];

    if (statusFilter !== 'All') {
        postsList = postsList.filter(p => p.status?.toLowerCase() === statusFilter.toLowerCase());
    }

    const meta = communityResponse?.meta;

    // Fixed Stats Cards Computation
    const totalPosts = statsResponse?.meta?.total ?? allPostsList.length;
    const approvedPosts = allPostsList.filter(p => p.status?.toLowerCase() === 'approved').length;
    const pendingPosts = allPostsList.filter(p => p.status?.toLowerCase() === 'pending').length;
    const rejectedPosts = allPostsList.filter(p => p.status?.toLowerCase() === 'rejected').length;

    const pageSize = meta?.limit || 10;
    const totalItems = meta?.total ?? postsList.length;

    const handleOpenDetails = (id: string) => {
        setSelectedPostId(id);
        setDetailsOpen(true);
    };

    const stats = [
        { label: 'Total Post', value: totalPosts },
        { label: 'Approved Posts', value: approvedPosts },
        { label: 'Pending Posts', value: pendingPosts },
        { label: 'Rejected Posts', value: rejectedPosts },
    ];

    const columns = [
        {
            title: 'Thumbnail & Caption',
            key: 'thumbnail',
            render: (record: CommunityRow) => {
                const mainImage = record.image;
                const imageUrl = mainImage 
                    ? (mainImage.startsWith('http') ? mainImage : `${baseURL}/${mainImage.replace(/\\/g, '/')}`)
                    : null;

                return (
                    <div 
                        className="flex items-center gap-3 cursor-pointer select-none py-1"
                        onClick={() => handleOpenDetails(record._id)}
                    >
                        {imageUrl ? (
                            <img 
                                src={imageUrl} 
                                alt={record.caption || 'Post'} 
                                className="w-10 h-10 rounded-full object-cover shrink-0 border border-white/10"
                            />
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-[#ff4b72]/20 flex items-center justify-center text-[#ff4b72] font-bold shrink-0 text-xs border border-white/10">
                                P
                            </div>
                        )}
                        <div className="min-w-0 max-w-[260px]">
                            <span className="text-white text-sm font-semibold hover:text-[#ff4b72] transition-colors block truncate">
                                {record.caption || 'Community Post'}
                            </span>
                            <span className="text-white/40 text-[11px] block mt-0.5 truncate">
                                Likes: {record.likeCount ?? record.likesCount ?? 0}
                            </span>
                        </div>
                    </div>
                );
            }
        },
        {
            title: 'User',
            key: 'user',
            render: (record: CommunityRow) => (
                <div>
                    <div className="text-white text-sm font-medium">{record.userId?.fullName || 'User'}</div>
                    {record.userId?.email && (
                        <div className="text-white/40 text-xs mt-0.5">{record.userId.email}</div>
                    )}
                </div>
            )
        },
        {
            title: 'Submitted Date',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (val?: string) => (
                <span className="text-white/70 text-sm font-sans">
                    {val ? new Date(val).toLocaleDateString() : 'N/A'}
                </span>
            )
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status?: string) => {
                const st = (status || 'approved').toLowerCase();
                return (
                    <span 
                        className={`px-3 py-1 rounded-full text-xs font-semibold inline-block uppercase tracking-wider ${
                            st === 'approved' 
                                ? 'bg-green-500/10 text-[#10b981] border border-green-500/20' 
                                : st === 'pending'
                                ? 'bg-yellow-500/10 text-[#fbbf24] border border-yellow-500/20'
                                : 'bg-red-500/10 text-[#ef4444] border border-red-500/20'
                        }`}
                    >
                        {status || 'approved'}
                    </span>
                );
            }
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (record: CommunityRow) => (
                <div className="flex items-center gap-3.5">
                    <FiEye 
                        className="text-[#38bdf8] hover:text-[#7dd3fc] cursor-pointer transition-colors" 
                        size={18} 
                        onClick={() => handleOpenDetails(record._id)}
                        title="View Details"
                    />
                </div>
            )
        }
    ];

    return (
        <div className="space-y-6 pb-6 relative">
            <PageHeader title="Community Post Management" subtitle="Manage all post in community, created by users" />

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
                        placeholder="Search post caption..."
                    />
                    <CustomSelect 
                        value={statusFilter}
                        onChange={(val) => {
                            setStatusFilter(val);
                            setPage(1);
                        }}
                        options={[
                            { value: 'All', label: 'All Status' },
                            { value: 'approved', label: 'Approved' },
                            { value: 'pending', label: 'Pending' },
                            { value: 'rejected', label: 'Rejected' }
                        ]}
                        className="w-40"
                    />
                </div>

                <div className="overflow-x-auto relative">
                    {isLoading || isFetching ? (
                        <LoadingSpinner text="Loading community posts..." />
                    ) : postsList.length === 0 ? (
                        <div className="py-16 text-center text-white/50 text-base">
                            No community posts found.
                        </div>
                    ) : (
                        <Table 
                            dataSource={postsList} 
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
            <CommunityPostDetailsModal
                open={detailsOpen}
                postId={selectedPostId}
                onClose={() => setDetailsOpen(false)}
            />
        </div>
    );
};

export default Community;
