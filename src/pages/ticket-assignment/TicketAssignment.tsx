import { useState } from 'react';
import { FiUser } from 'react-icons/fi';
import PageHeader from '../../components/ui/PageHeader';
import Pagination from '../../components/ui/Pagination';
import Search from '../../components/ui/Search';
import Toast from '../../components/ui/Toast';
import { MOCK_ASSIGNMENT_TICKETS, AssignmentTicket } from './ticket.data';
import { MOCK_MANAGEMENT_AGENTS } from '../agent-management/agent-management.data';

const TicketAssignment = () => {
    const [tickets, setTickets] = useState<AssignmentTicket[]>(MOCK_ASSIGNMENT_TICKETS);
    const [activeTab, setActiveTab] = useState<'Unassigned' | 'Assigned'>('Unassigned');
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const pageSize = 5;

    // Toast State
    const [toast, setToast] = useState('');

    const showToast = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(''), 3000);
    };

    // Filter tickets based on active tab only (no frontend search filtering)
    const filteredTickets = tickets.filter(ticket => ticket.status === activeTab);

    const paginatedTickets = filteredTickets.slice((page - 1) * pageSize, page * pageSize);

    // Counts
    const unassignedCount = tickets.filter(t => t.status === 'Unassigned').length;
    const assignedCount = tickets.filter(t => t.status === 'Assigned').length;

    // Handle agent dropdown change
    const handleAgentSelect = (ticketKey: string, agentName: string) => {
        setTickets(prev => prev.map(ticket => {
            if (ticket.key === ticketKey) {
                return {
                    ...ticket,
                    assignedAgent: agentName === 'Unassigned' ? null : agentName
                };
            }
            return ticket;
        }));
    };

    // Handle click on Assign / Reassign button
    const handleAssignClick = (ticket: AssignmentTicket) => {
        if (!ticket.assignedAgent) {
            showToast('Please select an agent to assign the ticket.');
            return;
        }

        setTickets(prev => prev.map(t => {
            if (t.key === ticket.key) {
                return {
                    ...t,
                    status: 'Assigned'
                };
            }
            return t;
        }));

        showToast(`Ticket ${ticket.ticketId} successfully assigned to ${ticket.assignedAgent}`);
    };

    return (
        <div className="space-y-6 pb-6 relative">
            <Toast message={toast} />

            {/* Page Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <PageHeader
                    title="Ticket Assignment"
                    subtitle="Manage and distribute unassigned tickets across multi-vendor teams."
                />
                
                {/* Segmented Buttons / Tabs */}
                <div className="flex bg-[#FFF0F1] border border-[#FFD2D6]/40 p-1 rounded-xl shrink-0">
                    <button
                        onClick={() => { setActiveTab('Unassigned'); setPage(1); }}
                        className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all cursor-pointer border-0 outline-none ${
                            activeTab === 'Unassigned'
                                ? 'bg-white text-[#56000c] shadow-[0_2px_8px_rgba(86,0,12,0.08)]'
                                : 'text-gray-500 hover:text-[#56000c]'
                        }`}
                    >
                        Unassigned ({unassignedCount})
                    </button>
                    <button
                        onClick={() => { setActiveTab('Assigned'); setPage(1); }}
                        className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all cursor-pointer border-0 outline-none ${
                            activeTab === 'Assigned'
                                ? 'bg-white text-[#56000c] shadow-[0_2px_8px_rgba(86,0,12,0.08)]'
                                : 'text-gray-500 hover:text-[#56000c]'
                        }`}
                    >
                        Assigned ({assignedCount})
                    </button>
                </div>
            </div>

            {/* Table / Content Container */}
            <div
                className="bg-white rounded-2xl flex flex-col gap-6 shadow-[0_4px_20px_rgba(86,0,12,0.03)] border border-[#FFD2D6]/40 p-6"
            >
                {/* Search Bar */}
                <Search
                    value={search}
                    onChange={(val) => { setSearch(val); setPage(1); }}
                    placeholder="Search here..."
                    inputClassName="bg-[#FFE5E7]/30 border border-[#FFD2D6]/60 text-[#242424] placeholder-gray-400 focus:border-[#56000c] focus:bg-white text-sm"
                    iconColor="text-[#56000c]/60"
                />

                {/* Ticket List */}
                <div className="flex flex-col">
                    {paginatedTickets.length > 0 ? (
                        paginatedTickets.map((ticket, index) => (
                            <div
                                key={ticket.key}
                                className={`flex flex-col sm:flex-row items-start sm:items-center justify-between py-5 gap-4 ${
                                    index !== paginatedTickets.length - 1 ? 'border-b border-[#FFD2D6]/20' : ''
                                }`}
                            >
                                {/* Left Side: Checkbox and Details */}
                                <div className="flex items-center gap-4 text-left">
                                    <input
                                        type="checkbox"
                                        className="w-5 h-5 rounded border-[#FFD2D6] accent-[#56000c] cursor-pointer"
                                    />
                                    <div>
                                        <h4 className="text-base font-bold text-[#242424] m-0">
                                            #{ticket.ticketId} - {ticket.title}
                                        </h4>
                                        <span className="text-xs text-gray-400 block mt-1">
                                            • Updated {ticket.updatedAt}
                                        </span>
                                    </div>
                                </div>

                                {/* Right Side: Assign Agent Dropdown & Button */}
                                <div className="flex items-center gap-6 w-full sm:w-auto shrink-0 justify-between sm:justify-end">
                                    {/* Assign Agent Select */}
                                    <div className="flex flex-col text-left">
                                        <span className="text-xs font-semibold text-gray-400 mb-1">
                                            Assign Agent
                                        </span>
                                        <div className="relative">
                                            <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                            <select
                                                value={ticket.assignedAgent || 'Unassigned'}
                                                onChange={(e) => handleAgentSelect(ticket.key, e.target.value)}
                                                className="pl-9 pr-8 h-10 bg-white border border-[#FFD2D6] rounded-xl text-sm font-semibold text-gray-700 focus:outline-none focus:border-[#56000c] transition-colors cursor-pointer appearance-none min-w-[180px]"
                                            >
                                                <option value="Unassigned">Unassigned</option>
                                                {MOCK_MANAGEMENT_AGENTS.map(agent => (
                                                    <option key={agent.key} value={agent.name}>
                                                        {agent.name}
                                                    </option>
                                                ))}
                                            </select>
                                            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Assign / Assigned Button */}
                                    <div className="flex flex-col justify-end pt-5">
                                        {ticket.status === 'Assigned' && ticket.assignedAgent ? (
                                            <button
                                                disabled
                                                className="h-9 px-6 rounded-lg text-sm font-bold text-[#b4989b] bg-[#FAF3F3] border border-[#FFD2D6]/40 cursor-not-allowed uppercase shrink-0"
                                            >
                                                Assigned
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleAssignClick(ticket)}
                                                className="h-9 px-6 rounded-lg text-sm font-bold text-white transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer border-0 outline-none uppercase shrink-0"
                                                style={{ background: '#56000c' }}
                                            >
                                                Assign
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="py-12 text-center text-gray-400 text-sm">
                            No tickets found matching your search.
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {filteredTickets.length > pageSize && (
                    <Pagination
                        current={page}
                        pageSize={pageSize}
                        total={filteredTickets.length}
                        onChange={(p) => setPage(p)}
                        light={true}
                    />
                )}
            </div>
        </div>
    );
};

export default TicketAssignment;
