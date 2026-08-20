import { useState } from 'react';
import { FiMessageSquare } from 'react-icons/fi';
import { AiFillStar } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/ui/PageHeader';
import Table from '../../components/ui/Table';
import Pagination from '../../components/ui/Pagination';
import Search from '../../components/ui/Search';
import { Feedback } from './review.types';
import { MOCK_FEEDBACKS } from './review.data';

const Review = () => {
    const [feedbacks] = useState<Feedback[]>(MOCK_FEEDBACKS);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [page, setPage] = useState(1);
    const pageSize = 8;
    const navigate = useNavigate();

    // Filter feedbacks based on search query and status filter
    const filteredFeedbacks = feedbacks.filter(fb => {
        const matchesSearch = 
            fb.userName.toLowerCase().includes(search.toLowerCase()) ||
            fb.userEmail.toLowerCase().includes(search.toLowerCase()) ||
            fb.userPhone.toLowerCase().includes(search.toLowerCase()) ||
            fb.reviewMessage.toLowerCase().includes(search.toLowerCase());

        const matchesStatus = statusFilter === 'All' || fb.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const paginatedFeedbacks = filteredFeedbacks.slice((page - 1) * pageSize, page * pageSize);

    const columns = [
        {
            title: 'User',
            key: 'user',
            render: (record: Feedback) => (
                <div className="flex items-center gap-3 select-none">
                    <div className="w-8 h-8 rounded-full bg-[#f97316] flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {record.userName.charAt(0)}
                    </div>
                    <span className="text-[#242424] text-sm font-bold">{record.userName}</span>
                </div>
            )
        },
        {
            title: 'Contact',
            key: 'contact',
            render: (record: Feedback) => (
                <div className="flex flex-col text-left">
                    <span className="text-[#242424] text-sm font-semibold">{record.userEmail}</span>
                    <span className="text-gray-400 text-xs mt-0.5">{record.userPhone}</span>
                </div>
            )
        },
        {
            title: 'Given Rate',
            dataIndex: 'rating',
            key: 'rating',
            render: (rating: number) => (
                <div className="flex items-center gap-1.5">
                    <AiFillStar className="text-amber-500" size={18} />
                    <span className="text-[#242424] text-sm font-bold">{rating.toFixed(1)}</span>
                </div>
            )
        },
        {
            title: 'Review Message',
            dataIndex: 'reviewMessage',
            key: 'reviewMessage',
            render: (msg: string) => (
                <span className="text-gray-500 text-sm block truncate max-w-xs" title={msg}>
                    {msg}
                </span>
            )
        },
        {
            title: 'Chat History',
            key: 'chatHistory',
            render: () => (
                <button
                    onClick={() => navigate('/chats')}
                    className="w-14 h-8 rounded-lg flex items-center justify-center text-white transition-all hover:opacity-90 active:scale-95 cursor-pointer border-0 outline-none"
                    style={{ background: '#56000c' }}
                >
                    <FiMessageSquare size={16} />
                </button>
            )
        }
    ];

    return (
        <div className="space-y-6 pb-6 relative">
            <PageHeader 
                title="Rating & Feedback" 
                subtitle="Track all customers given rating & feedback" 
            />

            {/* Content Table Area */}
            <div
                className="bg-white rounded-2xl flex flex-col gap-6 shadow-[0_4px_20px_rgba(86,0,12,0.03)] border border-[#FFD2D6]/40"
            >
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-center p-6 pb-0">
                    <Search
                        value={search}
                        onChange={(val) => {
                            setSearch(val);
                            setPage(1);
                        }}
                        placeholder="Search users by name, email, or phone..."
                        inputClassName="bg-[#FFE5E7]/40 border border-[#FFD2D6] text-[#333333] placeholder-gray-400 focus:border-[#56000c]"
                        iconColor="text-[#56000c]/60"
                    />
                    <select
                        value={statusFilter}
                        onChange={(e) => {
                            setStatusFilter(e.target.value);
                            setPage(1);
                        }}
                        className="h-11 px-4 bg-[#FFE5E7]/40 border border-[#FFD2D6] rounded-xl text-[#333333] focus:outline-none focus:border-[#56000c] transition-colors cursor-pointer text-sm font-semibold"
                    >
                        <option value="All" className="bg-white text-[#333333]">All Status</option>
                        <option value="Active" className="bg-white text-[#333333]">Active</option>
                        <option value="Blocked" className="bg-white text-[#333333]">Blocked</option>
                    </select>
                </div>

                <div className="overflow-x-auto px-6">
                    <Table
                        dataSource={paginatedFeedbacks}
                        columns={columns}
                        rowKey="key"
                        light={true}
                        pagination={false}
                    />
                </div>

                <Pagination
                    current={page}
                    pageSize={pageSize}
                    total={filteredFeedbacks.length}
                    onChange={(p) => setPage(p)}
                    light={true}
                />
            </div>
        </div>
    );
};

export default Review;
