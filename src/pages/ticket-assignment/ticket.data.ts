import { SupportAgent } from './ticket.types';

export const MOCK_AGENTS: SupportAgent[] = [
    { key: '1', agentId: 'AGT-1001', name: 'Sarah Johnson',  email: 'sarah@gmail.com',  phone: '+1 234-567-8901', role: 'Support Agent', status: 'Online',  avgRating: 4.5 },
    { key: '2', agentId: 'AGT-1002', name: 'James Don',      email: 'james@gmail.com',  phone: '+1 234-567-8902', role: 'Senior Agent',  status: 'Busy',    avgRating: 4.8 },
    { key: '3', agentId: 'AGT-1003', name: 'Emily Carter',   email: 'emily@gmail.com',  phone: '+1 234-567-8903', role: 'Support Agent', status: 'Offline', avgRating: 4.2 },
    { key: '4', agentId: 'AGT-1004', name: 'Mike Thompson',  email: 'mike@gmail.com',   phone: '+1 234-567-8904', role: 'Team Lead',     status: 'Online',  avgRating: 4.9 },
    { key: '5', agentId: 'AGT-1005', name: 'Anna Williams',  email: 'anna@gmail.com',   phone: '+1 234-567-8905', role: 'Support Agent', status: 'Online',  avgRating: 4.3 },
    { key: '6', agentId: 'AGT-1006', name: 'Carlos Rivera',  email: 'carlos@gmail.com', phone: '+1 234-567-8906', role: 'Senior Agent',  status: 'Busy',    avgRating: 4.6 },
    { key: '7', agentId: 'AGT-1007', name: 'Lisa Park',      email: 'lisa@gmail.com',   phone: '+1 234-567-8907', role: 'Support Agent', status: 'Online',  avgRating: 4.1 },
    { key: '8', agentId: 'AGT-1008', name: 'David Brown',    email: 'david@gmail.com',  phone: '+1 234-567-8908', role: 'Support Agent', status: 'Offline', avgRating: 3.9 },
];
export interface AssignmentTicket {
    key: string;
    ticketId: string;
    title: string;
    updatedAt: string;
    assignedAgent: string | null; // Agent name or null if unassigned
    status: 'Unassigned' | 'Assigned';
}

export const MOCK_ASSIGNMENT_TICKETS: AssignmentTicket[] = [
    {
        key: '1',
        ticketId: 'TK-8842',
        title: 'Refund Inquiry',
        updatedAt: '5m ago',
        assignedAgent: 'Sarah Jenkins',
        status: 'Assigned'
    },
    {
        key: '2',
        ticketId: 'TK-8839',
        title: 'Shipping delay in CA',
        updatedAt: '12m ago',
        assignedAgent: null,
        status: 'Unassigned'
    },
    {
        key: '3',
        ticketId: 'TK-8835',
        title: 'Incorrect item received',
        updatedAt: '1h ago',
        assignedAgent: null,
        status: 'Unassigned'
    },
    {
        key: '4',
        ticketId: 'TK-8840',
        title: 'Payment gateway error',
        updatedAt: '2h ago',
        assignedAgent: 'Marcus Sterling',
        status: 'Assigned'
    },
    {
        key: '5',
        ticketId: 'TK-8838',
        title: 'Discount code not working',
        updatedAt: '3h ago',
        assignedAgent: null,
        status: 'Unassigned'
    },
    {
        key: '6',
        ticketId: 'TK-8837',
        title: 'Change shipping address request',
        updatedAt: '4h ago',
        assignedAgent: null,
        status: 'Unassigned'
    },
    {
        key: '7',
        ticketId: 'TK-8836',
        title: 'Double charged on invoice',
        updatedAt: '5h ago',
        assignedAgent: 'Elena Vance',
        status: 'Assigned'
    },
    {
        key: '8',
        ticketId: 'TK-8834',
        title: 'Account subscription cancel request',
        updatedAt: '1d ago',
        assignedAgent: null,
        status: 'Unassigned'
    },
    {
        key: '9',
        ticketId: 'TK-8833',
        title: 'App crashing on login page',
        updatedAt: '1d ago',
        assignedAgent: null,
        status: 'Unassigned'
    },
    {
        key: '10',
        ticketId: 'TK-8832',
        title: 'Slow page loading times in dashboard',
        updatedAt: '2d ago',
        assignedAgent: 'Marcus Sterling',
        status: 'Assigned'
    },
    {
        key: '11',
        ticketId: 'TK-8831',
        title: 'Missing items from parcel',
        updatedAt: '2d ago',
        assignedAgent: null,
        status: 'Unassigned'
    },
    {
        key: '12',
        ticketId: 'TK-8830',
        title: 'Vendor account approval status inquiry',
        updatedAt: '3d ago',
        assignedAgent: null,
        status: 'Unassigned'
    }
];
