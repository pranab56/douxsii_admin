import { useState } from 'react';
import { FiEye, FiEdit2, FiTrash2, FiStar } from 'react-icons/fi';
import { AiOutlinePlus } from 'react-icons/ai';
import toast from 'react-hot-toast';
import PageHeader from '../../components/ui/PageHeader';
import Table from '../../components/ui/Table';
import Pagination from '../../components/ui/Pagination';
import Search from '../../components/ui/Search';
import StatsCards from '../../components/ui/StatsCards';
import ConfirmModal from '../../components/ui/ConfirmModal';
import SupportAgentModal, { AgentFormValues } from '../../components/ui/SupportAgentModal';
import SupportDetailsModal from '../../components/ui/SupportDetailsModal';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import EmptyData from '../../components/ui/EmptyData';

import {
    useGetAllSupportMembersQuery,
    useCreateSupportMemberMutation,
    useUpdateSupportMemberMutation,
    useDeleteSupportMemberMutation,
    SupportMember
} from '../../features/support_team/supportApi';
import { baseURL } from '../../utils/BaseURL';

const STATUS_DOT: Record<string, string> = {
    online: 'bg-[#10b981]',
    busy: 'bg-[#fbbf24]',
    offline: 'bg-white/30',
};

const STATUS_TEXT: Record<string, string> = {
    online: 'text-[#10b981]',
    busy: 'text-[#fbbf24]',
    offline: 'text-white/50',
};

const SupportTeam = () => {
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const pageSize = 10;

    // RTK Query Hooks
    const { data: supportResponse, isLoading, isFetching } = useGetAllSupportMembersQuery({ page, limit: pageSize, search });
    const [createSupportMember, { isLoading: isCreating }] = useCreateSupportMemberMutation();
    const [updateSupportMember, { isLoading: isUpdating }] = useUpdateSupportMemberMutation();
    const [deleteSupportMember, { isLoading: isDeleting }] = useDeleteSupportMemberMutation();

    const supportList = supportResponse?.data || [];

    const meta = supportResponse?.meta;

    // Modal states
    const [modalOpen, setModalOpen] = useState(false);
    const [editingAgent, setEditingAgent] = useState<SupportMember | null>(null);
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [viewingMember, setViewingMember] = useState<SupportMember | null>(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    // Calculate dynamic stats from API
    const totalMembers = meta?.total || supportList.length;
    const totalManagers = supportList.filter(item => item.role === 'support_manager').length;
    const totalAgents = supportList.filter(item => item.role === 'support_agent').length;
    const onlineAgents = supportList.filter(item => item.agentStatus === 'online' || item.isOnline).length;

    const stats = [
        { label: 'Total Support Members', value: totalMembers },
        { label: 'Support Managers', value: totalManagers },
        { label: 'Support Agents', value: totalAgents },
        { label: 'Online Status', value: onlineAgents },
    ];

    const handleAdd = () => {
        setEditingAgent(null);
        setModalOpen(true);
    };

    const handleEdit = (agent: SupportMember) => {
        setEditingAgent(agent);
        setModalOpen(true);
    };

    const handleView = (member: SupportMember) => {
        setViewingMember(member);
        setViewModalOpen(true);
    };

    const handleDeleteRequest = (id: string) => {
        setDeletingId(id);
        setConfirmOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (deletingId) {
            try {
                const res = await deleteSupportMember(deletingId).unwrap();
                toast.success(res?.message || 'Support member deleted successfully');
            } catch (err: any) {
                toast.error(err?.data?.message || 'Failed to delete support member');
            }
        }
        setConfirmOpen(false);
        setDeletingId(null);
    };

    const handleSubmit = async (values: AgentFormValues) => {
        try {
            if (editingAgent) {
                const updatePayload: Partial<AgentFormValues> = {
                    fullName: values.fullName,
                    email: values.email,
                    role: values.role,
                    phone: values.phone,
                };
                if (values.password) {
                    updatePayload.password = values.password;
                }
                const res = await updateSupportMember({ id: editingAgent._id, data: updatePayload }).unwrap();
                toast.success(res?.message || 'Support member updated successfully');
            } else {
                const createPayload = {
                    fullName: values.fullName,
                    email: values.email,
                    role: values.role,
                    password: values.password,
                    phone: values.phone,
                };
                const res = await createSupportMember(createPayload).unwrap();
                toast.success(res?.message || 'Support member created successfully');
            }
        } catch (err: any) {
            toast.error(err?.data?.message || 'Failed to save support member');
        }
    };

    const formatRole = (role: string) => {
        if (role === 'support_manager') return 'Support Manager';
        if (role === 'support_agent') return 'Support Agent';
        return role ? role.replace(/_/g, ' ') : 'Support Agent';
    };

    const columns = [
        {
            title: 'Member',
            key: 'fullName',
            render: (record: SupportMember) => {
                const rawPic = record.profile;
                const avatarSrc = rawPic
                    ? (rawPic.startsWith('http') ? rawPic : `${baseURL}/${rawPic.replace(/\\/g, '/')}`)
                    : null;

                return (
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#ff4b72]/15 border border-[#ff4b72]/20 flex items-center justify-center text-white text-sm font-bold shrink-0 overflow-hidden">
                            {avatarSrc ? (
                                <img src={avatarSrc} alt={record.fullName} className="w-full h-full object-cover" />
                            ) : (
                                record.fullName?.charAt(0) || 'S'
                            )}
                        </div>
                        <div>
                            <span className="text-white text-sm font-semibold block">{record.fullName}</span>
                            <span className="text-white/40 text-xs block">{record.email}</span>
                        </div>
                    </div>
                );
            }
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            key: 'phone',
            render: (val: string) => (
                <span className="text-white/80 text-sm">{val || 'N/A'}</span>
            )
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
            render: (val: string) => (
                <span className="bg-white/[0.05] border border-white/10 text-white rounded-full px-2.5 py-0.5 text-xs font-semibold inline-block capitalize">
                    {formatRole(val)}
                </span>
            )
        },
        {
            title: 'Status',
            key: 'agentStatus',
            render: (record: SupportMember) => {
                const status = (record.agentStatus || (record.isOnline ? 'online' : 'offline')).toLowerCase();
                const dotClass = STATUS_DOT[status] || STATUS_DOT['offline'];
                const textClass = STATUS_TEXT[status] || STATUS_TEXT['offline'];

                return (
                    <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full inline-block ${dotClass}`} />
                        <span className={`text-sm font-medium capitalize ${textClass}`}>{status}</span>
                    </div>
                );
            }
        },
        {
            title: 'Rating',
            key: 'rating',
            render: (record: SupportMember) => {
                const ratingVal = record.ratings ?? record.rating ?? 0;
                return (
                    <div className="flex items-center gap-1">
                        <FiStar className="text-[#fbbf24]" size={13} />
                        <span className="text-white text-sm font-medium">{ratingVal}</span>
                    </div>
                );
            }
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (record: SupportMember) => (
                <div className="flex items-center gap-3">
                    <FiEye
                        className="text-[#38bdf8] hover:text-[#7dd3fc] cursor-pointer"
                        size={17}
                        onClick={() => handleView(record)}
                    />
                    <FiEdit2
                        className="text-white/40 hover:text-white cursor-pointer"
                        size={15}
                        onClick={() => handleEdit(record)}
                    />
                    <FiTrash2
                        className="text-[#ff4b72]/60 hover:text-[#ff4b72] cursor-pointer"
                        size={15}
                        onClick={() => handleDeleteRequest(record._id)}
                    />
                </div>
            )
        },
    ];

    return (
        <div className="space-y-6 pb-6 relative">
            <PageHeader
                title="Support Team Management"
                subtitle="Manage and monitor support team for the platform"
                extra={
                    <button
                        onClick={handleAdd}
                        className="h-11 px-5 rounded-xl text-white text-sm font-semibold flex items-center gap-2 transition-all hover:opacity-90 active:scale-95 cursor-pointer border-0 outline-none"
                        style={{ background: '#5e000d' }}
                    >
                        <AiOutlinePlus size={16} />
                        Add New Member
                    </button>
                }
            />

            <StatsCards stats={stats} />

            {/* Table */}
            <div
                className="p-6 rounded-2xl flex flex-col gap-6"
                style={{
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.08)'
                }}
            >
                <Search
                    value={search}
                    onChange={(val) => { setSearch(val); setPage(1); }}
                    placeholder="Search support team by name, email, or role..."
                />

                <div className="overflow-x-auto relative">
                    {isLoading || isFetching ? (
                        <LoadingSpinner text="Loading support team..." />
                    ) : supportList.length === 0 ? (
                        <EmptyData message="No support team members found." />
                    ) : (
                        <Table dataSource={supportList} columns={columns} rowKey="_id" />
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

            {/* Add / Edit Modal */}
            <SupportAgentModal
                open={modalOpen}
                editingAgent={editingAgent}
                onClose={() => setModalOpen(false)}
                onSubmit={handleSubmit}
                isLoading={isCreating || isUpdating}
            />

            {/* Read-Only Details View Modal */}
            <SupportDetailsModal
                open={viewModalOpen}
                member={viewingMember}
                onClose={() => setViewModalOpen(false)}
            />

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                open={confirmOpen}
                title="Remove Support Member"
                description="This support team member will be permanently removed. Are you sure?"
                type="danger"
                isLoading={isDeleting}
                onConfirm={handleDeleteConfirm}
                onCancel={() => setConfirmOpen(false)}
            />
        </div>
    );
};

export default SupportTeam;
