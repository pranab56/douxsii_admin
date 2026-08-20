export interface Vendor {
    key: string;
    storeName: string;
    avatarLetter: string;
    productsCount: number;
    ownerName: string;
    ownerEmail: string;
    ownerPhone: string;
    productsInList: number;
    revenue: string;
    rating: number | null;
    status: 'Approved' | 'Pending' | 'Suspended';
    joined: string;
    address: string;
    workingHours: string;
    pendingOrders: number;
    completedOrders: number;
    totalReviews: number;
}

export interface AgentFeedback {
    id: string;
    rating: number;
    text: string;
    time: string;
    author: string;
}

export interface AgentActivityLog {
    key: string;
    action: string;
    timestamp: string;
    duration: string;
    source: string;
    status: 'Online' | 'Busy' | 'Offline';
}

export interface ManagerAgent {
    key: string;
    agentId: string;
    name: string;
    avatar: string;
    status: 'Online' | 'Busy' | 'Offline';
    activeChats: number;
    maxChats: number;
    role: string;
    // Details
    totalChatsHandled: number;
    avgResponseTime: string;
    avgChatHandling: string;
    rateScore: number;
    chartData: { time: string; solved: number }[];
    ratingDistribution: { stars: number; percentage: number }[];
    feedbacks: AgentFeedback[];
    activityLog: AgentActivityLog[];
}
