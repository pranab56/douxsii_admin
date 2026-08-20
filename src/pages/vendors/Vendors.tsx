import { useState } from 'react';
import { FiEye, FiUserMinus, FiUserCheck } from 'react-icons/fi';
import PageHeader from '../../components/ui/PageHeader';
import Table from '../../components/ui/Table';
import Pagination from '../../components/ui/Pagination';
import Search from '../../components/ui/Search';
import Toast from '../../components/ui/Toast';
import ConfirmModal from '../../components/ui/ConfirmModal';
import UserDetailsModal from '../../components/ui/UserDetailsModal';
import CustomSelect from '../../components/ui/CustomSelect';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { User } from '../users/users.types';
import { useGetAllUsersQuery, useBlockUnblockUserMutation } from '../../features/users/usersApi';

const Vendors = () => {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [page, setPage] = useState(1);

    // Modals & Toast State
    const [selectedVendor, setSelectedVendor] = useState<User | null>(null);
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [vendorToConfirm, setVendorToConfirm] = useState<User | null>(null);
    const [toast, setToast] = useState('');

    const showToast = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(''), 3000);
    };

    // Unfiltered Query for fixed Stats Cards
    const { data: statsResponse, isLoading: isStatsLoading } = useGetAllUsersQuery({ role: 'partner' });

    // Filtered API Query specifically for role='partner'
    const { data: vendorsResponse, isLoading, isFetching } = useGetAllUsersQuery({
        role: 'partner',
        status: statusFilter,
        searchTerm: search,
        page,
    });

    const [blockUnblockUser] = useBlockUnblockUserMutation();

    const rawVendors = vendorsResponse?.data?.result || [];
    const meta = vendorsResponse?.meta;

    const dataSource: User[] = rawVendors.map((item) => ({
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

    // Dynamic fixed stats from statsResponse
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

    const columns = [
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
            render: (val?: string) => <span className="text-white text-sm">{val || 'N/A'}</span>
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string, record: User) => (
                <span 
                    className={`px-3 py-1 rounded-full text-xs font-semibold inline-block ${
                        record.isActive 
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

    return (
        <div className="space-y-6 pb-6 relative">
            <Toast message={toast} />

            <PageHeader title="Vendor / Partner Management" subtitle="Manage all partner vendors and stores" />

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
                    {isLoading || isFetching ? (
                        <LoadingSpinner text="Loading vendors..." />
                    ) : dataSource.length === 0 ? (
                        <div className="py-16 text-center text-white/50 text-base">
                            No vendors found.
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
            <UserDetailsModal
                open={detailsOpen}
                user={selectedVendor}
                onClose={() => setDetailsOpen(false)}
                onBlockToggle={triggerBlockToggleConfirm}
            />

            {/* Confirm Actions Modal */}
            <ConfirmModal
                open={confirmOpen}
                title={vendorToConfirm?.isActive ? 'Block Vendor' : 'Unblock Vendor'}
                description={
                    vendorToConfirm?.isActive
                        ? `Are you sure you want to block ${vendorToConfirm?.name}? They will lose access to the platform.`
                        : `Are you sure you want to unblock ${vendorToConfirm?.name}? They will regain access to the platform.`
                }
                type={vendorToConfirm?.isActive ? 'danger' : 'warning'}
                onConfirm={handleConfirmAction}
                onCancel={() => setConfirmOpen(false)}
            />
        </div>
    );
};

export default Vendors;
