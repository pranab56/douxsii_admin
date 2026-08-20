import { useState } from 'react';
import { FiMessageSquare } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/ui/PageHeader';
import Table from '../../components/ui/Table';
import Pagination from '../../components/ui/Pagination';
import Search from '../../components/ui/Search'; 
import { User } from './customer.types';
import { MOCK_USERS } from './customer.data';

const Customer = () => {
    const [users] = useState<User[]>(MOCK_USERS);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [page, setPage] = useState(1);
    const pageSize = 8;
    const navigate = useNavigate();

    // Filter users based on search query and status filter
    const filteredUsers = users.filter(user => {
        const matchesSearch = 
            user.name.toLowerCase().includes(search.toLowerCase()) ||
            user.email.toLowerCase().includes(search.toLowerCase()) ||
            user.phone.toLowerCase().includes(search.toLowerCase());

        const matchesStatus = statusFilter === 'All' || user.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const paginatedUsers = filteredUsers.slice((page - 1) * pageSize, page * pageSize);

    const columns = [
        {
            title: 'User',
            key: 'user',
            render: (record: User) => (
                <div className="flex items-center gap-3 select-none">
                    <div className="w-8 h-8 rounded-full bg-[#f97316] flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {record.name.charAt(0)}
                    </div>
                    <span className="text-[#242424] text-sm font-bold">{record.name}</span>
                </div>
            )
        },
        {
            title: 'Contact',
            key: 'contact',
            render: (record: User) => (
                <div className="flex flex-col text-left">
                    <span className="text-[#242424] text-sm font-semibold">{record.email}</span>
                    <span className="text-gray-400 text-xs mt-0.5">{record.phone}</span>
                </div>
            )
        },
        {
            title: 'Orders',
            dataIndex: 'orders',
            key: 'orders',
            render: (orders: number) => <span className="text-[#242424] text-sm font-medium">{orders}</span>
        },
        {
            title: 'Total Spent',
            dataIndex: 'spent',
            key: 'spent',
            render: (spent: string) => <span className="text-[#242424] text-sm font-bold">{spent}</span>
        },
        {
            title: 'Complain Message',
            dataIndex: 'complainMessage',
            key: 'complainMessage',
            render: (msg?: string) => (
                <span className="text-gray-500 text-sm block truncate max-w-xs" title={msg}>
                    {msg || 'No complain message'}
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
        <div className="space-y-6">
            <PageHeader 
                title="Customers" 
                subtitle="Track all customers information" 
            />

            <div 
                className="bg-white rounded-2xl flex flex-col gap-6 shadow-[0_4px_20px_rgba(86,0,12,0.03)] border border-[#FFD2D6]/40"
            >
                {/* Search & Filter Row */}
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
                        dataSource={paginatedUsers} 
                        columns={columns} 
                        rowKey="key"
                        light={true}
                        pagination={false}
                    />
                </div>

                <Pagination 
                    current={page}
                    pageSize={pageSize}
                    total={filteredUsers.length}
                    onChange={(p) => setPage(p)}
                    light={true}
                />
            </div>
        </div>
    );
};

export default Customer;
