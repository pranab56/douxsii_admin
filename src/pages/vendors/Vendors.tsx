import { useState } from 'react';
import { Tooltip } from 'antd';
import { FiEye, FiUserMinus, FiUserCheck, FiCheckCircle, FiXCircle, FiMapPin } from 'react-icons/fi';
import PageHeader from '../../components/ui/PageHeader';
import Table from '../../components/ui/Table';
import Pagination from '../../components/ui/Pagination';
import Search from '../../components/ui/Search';
import Toast from '../../components/ui/Toast';
import ConfirmModal from '../../components/ui/ConfirmModal';
import UserDetailsModal from '../../components/ui/UserDetailsModal';
import CustomSelect from '../../components/ui/CustomSelect';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ShopRequestDetailsModal, { ShopRequest } from '../../components/ui/ShopRequestDetailsModal';
import RejectReasonModal from '../../components/ui/RejectReasonModal';
import { User } from '../users/users.types';
import { useGetAllUsersQuery, useBlockUnblockUserMutation } from '../../features/users/usersApi';
import { useGetAllRequestQuery, useRequestAcceptCancelMutation } from '../../features/request/requestApi';
import { baseURL } from '../../utils/BaseURL';

const Vendors = () => {
    // Tab State: 'all' or 'requests'
    const [activeTab, setActiveTab] = useState<'all' | 'requests'>('all');

    // Toast Notification
    const [toast, setToast] = useState('');
    const showToast = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(''), 3000);
    };

    // ================= ALL VENDORS TAB STATE & APIS =================
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [page, setPage] = useState(1);

    const [selectedVendor, setSelectedVendor] = useState<User | null>(null);
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [vendorToConfirm, setVendorToConfirm] = useState<User | null>(null);

    // Stats Query
    const { data: statsResponse, isLoading: isStatsLoading } = useGetAllUsersQuery({ role: 'partner' });

    // Filtered Query specifically for role='partner'
    const { data: vendorsResponse, isLoading: isVendorsLoading, isFetching: isVendorsFetching } = useGetAllUsersQuery({
        role: 'partner',
        status: statusFilter,
        searchTerm: search,
        page,
    });

    const [blockUnblockUser, { isLoading: isBlocking }] = useBlockUnblockUserMutation();

    const rawVendors = vendorsResponse?.data?.result || [];
    const meta = vendorsResponse?.meta;

    const vendorDataSource: User[] = rawVendors.map((item) => ({
        _id: item._id,
        key: item._id,
        name: item.fullName || 'N/A',
        fullName: item.fullName || 'N/A',
        email: item.email || 'N/A',
        phone: item.phone || 'N/A',
        role: item.role || 'partner',
        status: item.isActive ? 'Active' : 'Blocked',
        isActive: item.isActive,
        address: item.address,
        createdAt: item.createdAt,
    }));

    const totalVendors = statsResponse?.data?.totalVendor ?? statsResponse?.meta?.total ?? 0;
    const totalShops = statsResponse?.data?.shop ?? 0;
    const activeVendors = statsResponse?.data?.result?.filter(v => v.isActive).length ?? 0;

    const pageSize = meta?.limit || 10;
    const totalItems = meta?.total ?? totalVendors;

    const stats = [
        { label: 'Total Vendors', value: totalVendors },
        { label: 'Total Shops', value: totalShops },
        { label: 'Active Vendors', value: activeVendors }
    ];

    const handleOpenDetails = (vendor: User) => {
        setSelectedVendor(vendor);
        setDetailsOpen(true);
    };

    const triggerBlockToggleConfirm = (vendor: User) => {
        setVendorToConfirm(vendor);
        setDetailsOpen(false);
        setConfirmOpen(true);
    };

    const handleConfirmAction = async () => {
        if (!vendorToConfirm) return;

        try {
            const res = await blockUnblockUser(vendorToConfirm._id || vendorToConfirm.key || '').unwrap();
            showToast(res?.message || 'Vendor status updated successfully');
        } catch (err: any) {
            showToast(err?.data?.message || err?.message || 'Failed to update vendor status');
        } finally {
            setConfirmOpen(false);
            setVendorToConfirm(null);
        }
    };

    // ================= VENDOR REQUEST TAB STATE & APIS =================
    const [requestSearch, setRequestSearch] = useState('');
    const [requestStatusFilter, setRequestStatusFilter] = useState('All');
    const [requestPage, setRequestPage] = useState(1);

    const [selectedRequest, setSelectedRequest] = useState<ShopRequest | null>(null);
    const [requestDetailsOpen, setRequestDetailsOpen] = useState(false);

    const [requestToApprove, setRequestToApprove] = useState<ShopRequest | null>(null);
    const [approveModalOpen, setApproveModalOpen] = useState(false);

    const [requestToReject, setRequestToReject] = useState<ShopRequest | null>(null);
    const [rejectModalOpen, setRejectModalOpen] = useState(false);

    // Fetch Shop / Vendor Requests
    const { data: requestsResponse, isLoading: isRequestsLoading, isFetching: isRequestsFetching } = useGetAllRequestQuery(undefined);
    const [requestAcceptCancel, { isLoading: isUpdatingRequest }] = useRequestAcceptCancelMutation();

    const rawRequests: ShopRequest[] = Array.isArray(requestsResponse?.data)
        ? requestsResponse.data
        : (requestsResponse?.data?.result || []);

    const requestsMeta = requestsResponse?.meta || requestsResponse?.data?.meta;

    // Filter requests
    const filteredRequests = rawRequests.filter((item) => {
        if (requestStatusFilter !== 'All' && item.status?.toLowerCase() !== requestStatusFilter.toLowerCase()) {
            return false;
        }
        if (requestSearch) {
            const query = requestSearch.toLowerCase();
            const shopName = (item.name || '').toLowerCase();
            const bizName = (item.businessName || '').toLowerCase();
            const ownerName = (typeof item.userId === 'object' ? item.userId?.fullName || '' : '').toLowerCase();
            const ownerEmail = (typeof item.userId === 'object' ? item.userId?.email || '' : '').toLowerCase();
            const phone = (item.phone || '').toLowerCase();
            const address = (item.address || '').toLowerCase();

            return (
                shopName.includes(query) ||
                bizName.includes(query) ||
                ownerName.includes(query) ||
                ownerEmail.includes(query) ||
                phone.includes(query) ||
                address.includes(query)
            );
        }
        return true;
    });

    const pendingRequestsCount = rawRequests.filter(r => (r.status || '').toLowerCase() === 'pending').length;
    const requestPageSize = requestsMeta?.limit || 10;
    const totalRequestItems = requestsMeta?.total ?? filteredRequests.length;

    const getImageUrl = (url?: string) => {
        if (!url) return '';
        if (url.startsWith('http://') || url.startsWith('https://')) return url;
        const cleanPath = url.replace(/\\/g, '/');
        return `${baseURL}/${cleanPath.startsWith('/') ? cleanPath.slice(1) : cleanPath}`;
    };

    const handleOpenRequestDetails = (request: ShopRequest) => {
        setSelectedRequest(request);
        setRequestDetailsOpen(true);
    };

    const triggerApproveRequest = (request: ShopRequest) => {
        setRequestToApprove(request);
        setApproveModalOpen(true);
    };

    const triggerRejectRequest = (request: ShopRequest) => {
        setRequestToReject(request);
        setRejectModalOpen(true);
    };

    const handleConfirmApproveRequest = async () => {
        if (!requestToApprove) return;
        try {
            const res = await requestAcceptCancel({
                id: requestToApprove._id,
                data: { status: 'approved' }
            }).unwrap();
            showToast(res?.message || 'Vendor request approved successfully');
        } catch (err: any) {
            showToast(err?.data?.message || err?.message || 'Failed to approve vendor request');
        } finally {
            setApproveModalOpen(false);
            setRequestToApprove(null);
        }
    };

    const handleConfirmRejectRequest = async (reason: string) => {
        if (!requestToReject) return;
        try {
            const res = await requestAcceptCancel({
                id: requestToReject._id,
                data: { status: 'rejected', reason }
            }).unwrap();
            showToast(res?.message || 'Vendor request rejected successfully');
        } catch (err: any) {
            showToast(err?.data?.message || err?.message || 'Failed to reject vendor request');
        } finally {
            setRejectModalOpen(false);
            setRequestToReject(null);
        }
    };

    // ================= TABLE COLUMNS =================
    const vendorColumns = [
        {
            title: 'Partner / Store',
            key: 'store',
            render: (record: User) => (
                <div
                    className="flex items-center gap-3 cursor-pointer select-none"
                    onClick={() => handleOpenDetails(record)}
                >
                    <div className="w-8 h-8 rounded-full bg-[#ff4b72] flex items-center justify-center text-white text-sm font-bold shrink-0 uppercase">
                        {record.name.charAt(0)}
                    </div>
                    <div>
                        <span className="text-white text-sm font-medium hover:text-[#ff4b72] transition-colors block">
                            {record.name}
                        </span>
                        <span className="text-white/40 text-[10px] block mt-0.5 uppercase tracking-wider">
                            Role: {record.role}
                        </span>
                    </div>
                </div>
            )
        },
        {
            title: 'Contact',
            key: 'contact',
            render: (record: User) => (
                <div>
                    <div className="text-white text-sm">{record.email}</div>
                    <div className="text-white/40 text-xs mt-0.5">{record.phone}</div>
                </div>
            )
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
            width: 280,
            render: (val?: string) => {
                if (!val || !val.trim()) {
                    return <span className="text-white/40 text-xs italic">N/A</span>;
                }
                return (
                    <Tooltip title={val} placement="topLeft" color="#5a121d">
                        <div className="flex items-start gap-2 cursor-pointer max-w-[260px] group">
                            <FiMapPin className="text-[#ff4b72] shrink-0 mt-0.5" size={14} />
                            <span className="text-white/80 text-xs leading-relaxed line-clamp-2 group-hover:text-white transition-colors">
                                {val}
                            </span>
                        </div>
                    </Tooltip>
                );
            }
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string, record: User) => (
                <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold inline-block ${record.isActive
                            ? 'bg-green-500/10 text-[#10b981] border border-green-500/20'
                            : 'bg-red-500/10 text-[#ef4444] border border-red-500/20'
                        }`}
                >
                    {status}
                </span>
            )
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (record: User) => (
                <div className="flex items-center gap-6">
                    <FiEye
                        className="text-[#38bdf8] hover:text-[#7dd3fc] cursor-pointer"
                        size={18}
                        title="View Details"
                        onClick={() => handleOpenDetails(record)}
                    />
                    {record.isActive ? (
                        <FiUserMinus
                            className="text-[#fbbf24] hover:text-[#fde047] cursor-pointer"
                            size={18}
                            title="Block Vendor"
                            onClick={() => triggerBlockToggleConfirm(record)}
                        />
                    ) : (
                        <FiUserCheck
                            className="text-[#10b981] hover:text-[#34d399] cursor-pointer"
                            size={18}
                            title="Unblock Vendor"
                            onClick={() => triggerBlockToggleConfirm(record)}
                        />
                    )}
                </div>
            )
        }
    ];

    const requestColumns = [
        {
            title: 'Store',
            key: 'store',
            render: (record: ShopRequest) => {
                const logoUrl = getImageUrl(record.image);
                return (
                    <div
                        className="flex items-center gap-3 cursor-pointer select-none"
                        onClick={() => handleOpenRequestDetails(record)}
                    >
                        {logoUrl ? (
                            <img
                                src={logoUrl}
                                alt={record.name}
                                className="w-8 h-8 rounded-full object-cover border border-[#ff4b72]/30 shrink-0"
                                onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                            />
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-[#ff4b72] flex items-center justify-center text-white text-sm font-bold shrink-0 uppercase">
                                {record.name ? record.name.charAt(0) : 'S'}
                            </div>
                        )}
                        <div>
                            <span className="text-white text-sm font-medium hover:text-[#ff4b72] transition-colors block">
                                {record.name}
                            </span>
                            {record.businessName && (
                                <span className="text-white/40 text-[11px] block mt-0.5">
                                    {record.businessName}
                                </span>
                            )}
                        </div>
                    </div>
                );
            }
        },
        {
            title: 'Owner',
            key: 'owner',
            render: (record: ShopRequest) => {
                const ownerName = typeof record.userId === 'object' && record.userId?.fullName
                    ? record.userId.fullName
                    : record.name || 'N/A';
                const ownerEmail = typeof record.userId === 'object' && record.userId?.email
                    ? record.userId.email
                    : 'N/A';
                return (
                    <div>
                        <div className="text-white text-sm font-medium">{ownerName}</div>
                        <div className="text-white/40 text-xs mt-0.5">{ownerEmail}</div>
                    </div>
                );
            }
        },
        {
            title: 'Contact',
            key: 'contact',
            render: (record: ShopRequest) => (
                <div>
                    <div className="text-white text-sm">{record.phone || 'N/A'}</div>
                    {record.address ? (
                        <Tooltip title={record.address} placement="topLeft" color="#5a121d">
                            <div className="flex items-center gap-1.5 text-white/50 text-xs mt-0.5 max-w-[200px] hover:text-white/80 cursor-pointer transition-colors">
                                <FiMapPin className="text-[#ff4b72] shrink-0" size={12} />
                                <span className="truncate">{record.address}</span>
                            </div>
                        </Tooltip>
                    ) : (
                        <div className="text-white/40 text-xs mt-0.5 italic">N/A</div>
                    )}
                </div>
            )
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
                const normalizedStatus = (status || 'pending').toLowerCase();
                return (
                    <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold inline-block capitalize ${
                            normalizedStatus === 'approved'
                                ? 'bg-green-500/10 text-[#10b981] border border-green-500/20'
                                : normalizedStatus === 'pending'
                                ? 'bg-yellow-500/10 text-[#fbbf24] border border-yellow-500/20'
                                : 'bg-red-500/10 text-[#ef4444] border border-red-500/20'
                        }`}
                    >
                        {status}
                    </span>
                );
            }
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (record: ShopRequest) => {
                const normalizedStatus = (record.status || 'pending').toLowerCase();
                return (
                    <div className="flex items-center gap-4">
                        <FiEye
                            className="text-[#38bdf8] hover:text-[#7dd3fc] cursor-pointer transition-colors"
                            size={18}
                            title="View Details"
                            onClick={() => handleOpenRequestDetails(record)}
                        />
                        {normalizedStatus === 'pending' && (
                            <>
                                <FiCheckCircle
                                    className="text-[#10b981] hover:text-[#34d399] cursor-pointer transition-colors"
                                    size={18}
                                    title="Approve Request"
                                    onClick={() => triggerApproveRequest(record)}
                                />
                                <FiXCircle
                                    className="text-[#ef4444] hover:text-[#f87171] cursor-pointer transition-colors"
                                    size={18}
                                    title="Reject Request"
                                    onClick={() => triggerRejectRequest(record)}
                                />
                            </>
                        )}
                    </div>
                );
            }
        }
    ];

    return (
        <div className="space-y-6 pb-6 relative">
            <Toast message={toast} />

            <PageHeader title="Vendor / Partner Management" subtitle="Manage all partner vendors and shop requests" />

            {/* Stats Cards Section (Fixed & Unfiltered) */}
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
                        <h2 className="text-white text-4xl font-bold mt-2 font-sans">{isStatsLoading ? '...' : stat.value}</h2>
                    </div>
                ))}
            </div>

            {/* Navigation Tabs (All Vendors vs Vendor Request) */}
            <div className="flex border-b border-white/10 gap-8">
                <button
                    type="button"
                    onClick={() => {
                        setActiveTab('all');
                        setPage(1);
                    }}
                    className={`pb-3 text-sm font-semibold transition-all relative cursor-pointer border-0 bg-transparent outline-none ${
                        activeTab === 'all' ? 'text-[#ff4b72]' : 'text-white/60 hover:text-white'
                    }`}
                >
                    All Vendors
                    {activeTab === 'all' && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#ff4b72] rounded-full" />
                    )}
                </button>
                <button
                    type="button"
                    onClick={() => {
                        setActiveTab('requests');
                        setRequestPage(1);
                    }}
                    className={`pb-3 text-sm font-semibold transition-all relative cursor-pointer border-0 bg-transparent outline-none flex items-center gap-2 ${
                        activeTab === 'requests' ? 'text-[#ff4b72]' : 'text-white/60 hover:text-white'
                    }`}
                >
                    Vendor Request
                    {pendingRequestsCount > 0 && (
                        <span className="px-2 py-0.5 text-xs rounded-full bg-[#ff4b72] text-white font-bold">
                            {pendingRequestsCount}
                        </span>
                    )}
                    {activeTab === 'requests' && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#ff4b72] rounded-full" />
                    )}
                </button>
            </div>

            {/* TAB 1: ALL VENDORS */}
            {activeTab === 'all' && (
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
                                placeholder="Search vendors by name, email, or address..."
                            />
                            <CustomSelect
                                value={statusFilter}
                                onChange={(val) => {
                                    setStatusFilter(val);
                                    setPage(1);
                                }}
                                options={[
                                    { value: 'All', label: 'All Status' },
                                    { value: 'true', label: 'Active' },
                                    { value: 'false', label: 'Blocked' }
                                ]}
                                className="w-40"
                            />
                        </div>

                        <div className="overflow-x-auto relative">
                            {isVendorsLoading || isVendorsFetching ? (
                                <LoadingSpinner text="Loading vendors..." />
                            ) : vendorDataSource.length === 0 ? (
                                <div className="py-16 text-center text-white/50 text-base">
                                    No vendors found.
                                </div>
                            ) : (
                                <Table
                                    dataSource={vendorDataSource}
                                    columns={vendorColumns}
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
            )}

            {/* TAB 2: VENDOR REQUEST */}
            {activeTab === 'requests' && (
                <div
                    className="p-6 rounded-2xl flex flex-col gap-6"
                    style={{
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(255, 255, 255, 0.08)'
                    }}
                >
                    <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                        <Search
                            value={requestSearch}
                            onChange={(val) => {
                                setRequestSearch(val);
                                setRequestPage(1);
                            }}
                            placeholder="Search vendor requests by store, owner, email..."
                        />
                        <CustomSelect
                            value={requestStatusFilter}
                            onChange={(val) => {
                                setRequestStatusFilter(val);
                                setRequestPage(1);
                            }}
                            options={[
                                { value: 'All', label: 'All Status' },
                                { value: 'pending', label: 'Pending' },
                                { value: 'approved', label: 'Approved' },
                                { value: 'rejected', label: 'Rejected' }
                            ]}
                            className="w-40"
                        />
                    </div>

                    <div className="overflow-x-auto relative">
                        {isRequestsLoading || isRequestsFetching ? (
                            <LoadingSpinner text="Loading vendor requests..." />
                        ) : filteredRequests.length === 0 ? (
                            <div className="py-16 text-center text-white/50 text-base">
                                No vendor requests found.
                            </div>
                        ) : (
                            <Table
                                dataSource={filteredRequests}
                                columns={requestColumns}
                                rowKey="_id"
                            />
                        )}
                    </div>

                    {totalRequestItems > requestPageSize && (
                        <Pagination
                            current={requestPage}
                            pageSize={requestPageSize}
                            total={totalRequestItems}
                            onChange={(p) => setRequestPage(p)}
                        />
                    )}
                </div>
            )}

            {/* Vendor User Details Modal (Tab 1) */}
            <UserDetailsModal
                open={detailsOpen}
                user={selectedVendor}
                onClose={() => setDetailsOpen(false)}
                onBlockToggle={triggerBlockToggleConfirm}
            />

            {/* Confirm Block/Unblock Modal (Tab 1) */}
            <ConfirmModal
                open={confirmOpen}
                title={vendorToConfirm?.isActive ? 'Block Vendor' : 'Unblock Vendor'}
                description={
                    vendorToConfirm?.isActive
                        ? `Are you sure you want to block ${vendorToConfirm?.name}? They will lose access to the platform.`
                        : `Are you sure you want to unblock ${vendorToConfirm?.name}? They will regain access to the platform.`
                }
                type={vendorToConfirm?.isActive ? 'danger' : 'warning'}
                confirmText={vendorToConfirm?.isActive ? 'Block Vendor' : 'Unblock Vendor'}
                isLoading={isBlocking}
                onConfirm={handleConfirmAction}
                onCancel={() => setConfirmOpen(false)}
            />

            {/* Shop Request Details Modal (Tab 2) */}
            <ShopRequestDetailsModal
                open={requestDetailsOpen}
                request={selectedRequest}
                onClose={() => setRequestDetailsOpen(false)}
                onApprove={triggerApproveRequest}
                onReject={triggerRejectRequest}
            />

            {/* Confirm Approve Modal (Tab 2) */}
            <ConfirmModal
                open={approveModalOpen}
                title="Approve Vendor Request"
                description={`Are you sure you want to approve the shop request for "${requestToApprove?.name}"?`}
                type="warning"
                confirmText="Approve Request"
                isLoading={isUpdatingRequest}
                onConfirm={handleConfirmApproveRequest}
                onCancel={() => setApproveModalOpen(false)}
            />

            {/* Reject Reason Modal (Tab 2) */}
            <RejectReasonModal
                open={rejectModalOpen}
                title="Reject Vendor Request"
                description={`Are you sure you want to reject the shop request for "${requestToReject?.name}"?`}
                isLoading={isUpdatingRequest}
                onConfirm={handleConfirmRejectRequest}
                onCancel={() => setRejectModalOpen(false)}
            />
        </div>
    );
};

export default Vendors;
