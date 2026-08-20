import React from 'react';
import { Link } from 'react-router-dom';

const MOCK_NEW_TICKETS = [
    { id: '1', name: 'Elena Gilbert', message: 'Shipping delay in CA', time: '2m ago' },
    { id: '2', name: 'Elena Gilbert', message: 'Incorrect item received', time: '2m ago' }
];

const ManagerTickets: React.FC = () => {
    return (
        <div className="bg-white rounded-2xl p-6 border border-[#FFD2D6]/40 shadow-[0_4px_20px_rgba(86,0,12,0.03)] mt-6 flex flex-col gap-5">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-[#242424] m-0">New Tickets</h3>
                <Link to="/support-team" className="text-[#ff4d4f] hover:text-[#56000c] transition-colors text-sm font-semibold">
                    View All
                </Link>
            </div>

            <div className="flex flex-col gap-4">
                {MOCK_NEW_TICKETS.map((ticket, index) => (
                    <div 
                        key={index} 
                        className="p-4 rounded-xl flex items-center justify-between bg-[#FFF8F5] border border-[#FFEAEA] transition-all duration-300 hover:shadow-sm"
                    >
                        <div className="flex flex-col gap-1 text-left">
                            <h4 className="text-[#242424] text-base font-bold m-0">{ticket.name}</h4>
                            <span className="text-[#242424B2] text-sm">{ticket.message}</span>
                            <span className="text-gray-400 text-xs mt-0.5">{ticket.time}</span>
                        </div>
                        <button 
                            className="h-9 px-6 rounded-lg text-white font-bold text-sm transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                            style={{
                                background: '#56000c'
                            }}
                        >
                            Assign
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ManagerTickets;
