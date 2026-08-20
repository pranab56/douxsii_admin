import { SupportAgent } from './support.types';

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
