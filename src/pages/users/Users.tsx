import { useState } from 'react';
import { FiEye, FiUserMinus, FiUserCheck } from 'react-icons/fi';
import PageHeader from '../../components/ui/PageHeader';
import Table from '../../components/ui/Table';
import UserStats from '../../components/ui/UserStats';
import Pagination from '../../components/ui/Pagination';
import UserDetailsModal from '../../components/ui/UserDetailsModal';
import ConfirmModal from '../../components/ui/ConfirmModal';
import Toast from '../../components/ui/Toast';
import Search from '../../components/ui/Search';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import CustomSelect from '../../components/ui/CustomSelect';
import { User } from './users.types';
import { useGetAllUsersQuery, useBlockUnblockUserMutation } from '../../features/users/usersApi';

const Users = () => {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [page, setPage] = useState(1);

    // Modal & Toast States
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [userToConfirm, setUserToConfirm] = useState<User | null>(null);
    const [toast, setToast] = useState('');

    const showToast = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(''), 3000);
    };

    // Unfiltered Query for fixed Stats Cards
    const { data: statsResponse } = useGetAllUsersQuery({ role: 'user' });

    // API Query specifically for role='user' with search and status filter
    const { data: usersResponse, isLoading, isFetching } = useGetAllUsersQuery({
        role: 'user',
        status: statusFilter,
        searchTerm: search,
        page,
    });

    const [blockUnblockUser, { isLoading: isBlocking }] = useBlockUnblockUserMutation();

    const rawUsers = usersResponse?.data?.result || [];
    const meta = usersResponse?.meta;

    const dataSource: User[] = rawUsers.map((item) => ({
        _id: item._id,
        key: item._id,
        name: item.fullName || 'N/A',
        fullName: item.fullName || 'N/A',
        email: item.email || 'N/A',
        phone: item.phone || 'N/A',
        role: item.role || 'user',
        status: item.isActive ? 'Active' : 'Blocked',
        isActive: item.isActive,
        createdAt: item.createdAt,
    }));

    // Fixed Stats computation from statsResponse
    const totalUsers = statsResponse?.data?.totalUsers ?? statsResponse?.meta?.total ?? 0;
    const activeUsers = statsResponse?.data?.activeUsers ?? 0;
    const blockedUsers = statsResponse?.data?.blockedUsers ?? 0;
    const verifiedUsers = activeUsers;

    const pageSize = meta?.limit || 10;
    const totalItems = meta?.total ?? totalUsers;

    // Modal triggers
    const handleOpenDetails = (user: User) => {
        setSelectedUser(user);
        setDetailsOpen(true);
    };

    const triggerBlockToggleConfirm = (user: User) => {
        setUserToConfirm(user);
        setDetailsOpen(false);
        setConfirmOpen(true);
    };

    const handleConfirmAction = async () => {
        if (!userToConfirm) return;

        try {
            const res = await blockUnblockUser(userToConfirm._id || userToConfirm.key || '').unwrap();
            showToast(res?.message || 'User status updated successfully');
        } catch (err: any) {
            showToast(err?.data?.message || err?.message || 'Failed to update user status');
        } finally {
            setConfirmOpen(false);
            setUserToConfirm(null);
        }
    };

    const columns = [
        {
            title: 'User',
            dataIndex: 'name',
            key: 'name',
            render: (text: string, record: User) => (
                <div
                    className="flex items-center gap-3 cursor-pointer select-none"
                    onClick={() => handleOpenDetails(record)}
                >
                    <div className="w-8 h-8 rounded-full bg-[#ff4b72] flex items-center justify-center text-white text-sm font-semibold shrink-0 uppercase">
                        {text.charAt(0)}
                    </div>
                    <span className="text-white text-sm font-medium hover:text-[#ff4b72] transition-colors">{text}</span>
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
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
            render: (role: string) => (
                <span className="px-2.5 py-1 rounded-lg text-xs font-semibold uppercase bg-white/5 text-white/80 border border-white/10">
                    {role}
                </span>
            )
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
                            title="Block User"
                            onClick={() => triggerBlockToggleConfirm(record)}
                        />
                    ) : (
                        <FiUserCheck
                            className="text-[#10b981] hover:text-[#34d399] cursor-pointer"
                            size={18}
                            title="Unblock User"
                            onClick={() => triggerBlockToggleConfirm(record)}
                        />
                    )}
                </div>
            )
        }
    ];

    return (
        <div className="space-y-6 pb-6 relative">
            {/* Reusable Toast Notification */}
            <Toast message={toast} />

            <PageHeader title="User Management" subtitle="Manage all customer accounts" />

            <UserStats total={totalUsers} active={activeUsers} verified={verifiedUsers} blocked={blockedUsers} />

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
                        placeholder="Search users by name, email, or phone..."
                    />

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        {/* Status Filter */}
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
                </div>

                <div className="overflow-x-auto relative">
                    {isLoading || isFetching ? (
                        <LoadingSpinner text="Loading users..." />
                    ) : dataSource.length === 0 ? (
                        <div className="py-16 text-center text-white/50 text-base">
                            No users found.
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

            {/* User Details Modal */}
            <UserDetailsModal
                open={detailsOpen}
                user={selectedUser}
                onClose={() => setDetailsOpen(false)}
                onBlockToggle={triggerBlockToggleConfirm}
            />

            {/* Confirm Actions Modal */}
            <ConfirmModal
                open={confirmOpen}
                title={userToConfirm?.isActive ? 'Block User' : 'Unblock User'}
                description={
                    userToConfirm?.isActive
                        ? `Are you sure you want to block ${userToConfirm?.name}? They will lose access to the platform.`
                        : `Are you sure you want to unblock ${userToConfirm?.name}? They will regain access to the platform.`
                }
                type={userToConfirm?.isActive ? 'danger' : 'warning'}
                confirmText={userToConfirm?.isActive ? 'Block User' : 'Unblock User'}
                isLoading={isBlocking}
                onConfirm={handleConfirmAction}
                onCancel={() => setConfirmOpen(false)}
            />
        </div>
    );
};

export default Users;
