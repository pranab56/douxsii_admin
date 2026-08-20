export interface SupportAgent {
    key: string;
    agentId: string;
    name: string;
    email: string;
    phone: string;
    role: 'Support Agent' | 'Senior Agent' | 'Team Lead';
    status: 'Online' | 'Busy' | 'Offline';
    avgRating: number;
    avatar?: string;
}
