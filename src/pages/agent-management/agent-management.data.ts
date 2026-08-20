import { Vendor, ManagerAgent } from './agent-management.types';

export const MOCK_VENDORS: Vendor[] = [
    {
        key: '1',
        storeName: 'Blossom Flowers',
        avatarLetter: 'B',
        productsCount: 48,
        ownerName: 'Alice Smith',
        ownerEmail: 'alice@blossomflowers.com',
        ownerPhone: '+1 555-0101',
        productsInList: 24,
        revenue: '$2,450.00',
        rating: 4.8,
        status: 'Approved',
        joined: '2024-02-15',
        address: '456 Garden Street, New York, NY 10002',
        workingHours: '06:00 AM - 12:00 AM',
        pendingOrders: 12,
        completedOrders: 342,
        totalReviews: 156
    },
    {
        key: '2',
        storeName: 'Blossom Flowers',
        avatarLetter: 'B',
        productsCount: 48,
        ownerName: 'Alice Smith',
        ownerEmail: 'alice@blossomflowers.com',
        ownerPhone: '+1 555-0101',
        productsInList: 24,
        revenue: '$2,450.00',
        rating: 4.8,
        status: 'Approved',
        joined: '2024-02-15',
        address: '456 Garden Street, New York, NY 10002',
        workingHours: '06:00 AM - 12:00 AM',
        pendingOrders: 12,
        completedOrders: 342,
        totalReviews: 156
    },
    {
        key: '3',
        storeName: 'Blossom Flowers',
        avatarLetter: 'B',
        productsCount: 48,
        ownerName: 'Alice Smith',
        ownerEmail: 'alice@blossomflowers.com',
        ownerPhone: '+1 555-0101',
        productsInList: 24,
        revenue: '$2,450.00',
        rating: null,
        status: 'Pending',
        joined: '2024-02-15',
        address: '456 Garden Street, New York, NY 10002',
        workingHours: '06:00 AM - 12:00 AM',
        pendingOrders: 12,
        completedOrders: 342,
        totalReviews: 156
    },
    {
        key: '4',
        storeName: 'Blossom Flowers',
        avatarLetter: 'B',
        productsCount: 48,
        ownerName: 'Alice Smith',
        ownerEmail: 'alice@blossomflowers.com',
        ownerPhone: '+1 555-0101',
        productsInList: 24,
        revenue: '$2,450.00',
        rating: null,
        status: 'Pending',
        joined: '2024-02-15',
        address: '456 Garden Street, New York, NY 10002',
        workingHours: '06:00 AM - 12:00 AM',
        pendingOrders: 12,
        completedOrders: 342,
        totalReviews: 156
    },
    {
        key: '5',
        storeName: 'Blossom Flowers',
        avatarLetter: 'B',
        productsCount: 48,
        ownerName: 'Alice Smith',
        ownerEmail: 'alice@blossomflowers.com',
        ownerPhone: '+1 555-0101',
        productsInList: 24,
        revenue: '$2,450.00',
        rating: 4.8,
        status: 'Approved',
        joined: '2024-02-15',
        address: '456 Garden Street, New York, NY 10002',
        workingHours: '06:00 AM - 12:00 AM',
        pendingOrders: 12,
        completedOrders: 342,
        totalReviews: 156
    },
    {
        key: '6',
        storeName: 'Blossom Flowers',
        avatarLetter: 'B',
        productsCount: 48,
        ownerName: 'Alice Smith',
        ownerEmail: 'alice@blossomflowers.com',
        ownerPhone: '+1 555-0101',
        productsInList: 24,
        revenue: '$2,450.00',
        rating: 4.8,
        status: 'Suspended',
        joined: '2024-02-15',
        address: '456 Garden Street, New York, NY 10002',
        workingHours: '06:00 AM - 12:00 AM',
        pendingOrders: 12,
        completedOrders: 342,
        totalReviews: 156
    }
];

export const MOCK_MANAGEMENT_AGENTS: ManagerAgent[] = [
    {
        key: '1',
        agentId: 'AG-40291',
        name: 'Marcus Sterling',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        status: 'Online',
        activeChats: 8,
        maxChats: 10,
        role: 'Team Lead',
        totalChatsHandled: 1284,
        avgResponseTime: '42s',
        avgChatHandling: '6.4m',
        rateScore: 4.8,
        chartData: [
            { time: '08:00', solved: 20 },
            { time: '10:00', solved: 35 },
            { time: '12:00', solved: 48 },
            { time: '14:00', solved: 65 },
            { time: '16:00', solved: 38 },
            { time: '18:00', solved: 25 },
        ],
        ratingDistribution: [
            { stars: 5, percentage: 85 },
            { stars: 4, percentage: 10 },
            { stars: 3, percentage: 3 },
            { stars: 2, percentage: 1 },
            { stars: 1, percentage: 1 },
        ],
        feedbacks: [
            {
                id: 'fb1',
                rating: 5,
                time: '2 hours ago',
                text: 'Marcus was extremely helpful and resolved my billing issue in under 5 minutes. Super polite!',
                author: 'Sarah J., Premium User'
            },
            {
                id: 'fb2',
                rating: 4,
                time: 'Yesterday',
                text: 'Great technical knowledge. Fixed the API integration issue quickly.',
                author: 'TechSolutions Inc.'
            },
            {
                id: 'fb3',
                rating: 5,
                time: 'Oct 22',
                text: 'Best support experience I\'ve had all year. Very thorough explanations.',
                author: 'Kevin L.'
            }
        ],
        activityLog: [
            { key: 'act1', action: 'Logged In', timestamp: 'Oct 24, 08:32 AM', duration: '--', source: 'Desktop App (v4.2)', status: 'Online' },
            { key: 'act2', action: 'Break (Lunch)', timestamp: 'Oct 24, 12:45 PM', duration: '45m', source: 'Web Browser', status: 'Busy' },
            { key: 'act3', action: 'Back Online', timestamp: 'Oct 24, 01:30 PM', duration: '--', source: 'Desktop App (v4.2)', status: 'Online' },
            { key: 'act4', action: 'Logged Out', timestamp: 'Oct 23, 05:45 PM', duration: '9h 13m Session', source: 'Desktop App (v4.2)', status: 'Offline' }
        ]
    },
    {
        key: '2',
        agentId: 'AG-40292',
        name: 'Elena Vance',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        status: 'Busy',
        activeChats: 3,
        maxChats: 10,
        role: 'Senior Agent',
        totalChatsHandled: 954,
        avgResponseTime: '55s',
        avgChatHandling: '8.2m',
        rateScore: 4.6,
        chartData: [
            { time: '08:00', solved: 15 },
            { time: '10:00', solved: 28 },
            { time: '12:00', solved: 34 },
            { time: '14:00', solved: 45 },
            { time: '16:00', solved: 30 },
            { time: '18:00', solved: 18 },
        ],
        ratingDistribution: [
            { stars: 5, percentage: 76 },
            { stars: 4, percentage: 18 },
            { stars: 3, percentage: 4 },
            { stars: 2, percentage: 1 },
            { stars: 1, percentage: 1 },
        ],
        feedbacks: [
            {
                id: 'fb1',
                rating: 5,
                time: '3 hours ago',
                text: 'Elena resolved a very tricky refund setup for us. Highly professional!',
                author: 'Robert D.'
            },
            {
                id: 'fb2',
                rating: 4,
                time: '2 days ago',
                text: 'Very helpful, though the wait time was a bit longer than expected.',
                author: 'Diana M.'
            }
        ],
        activityLog: [
            { key: 'act1', action: 'Logged In', timestamp: 'Oct 24, 09:00 AM', duration: '--', source: 'Web Browser', status: 'Online' },
            { key: 'act2', action: 'Assigned chat', timestamp: 'Oct 24, 10:15 AM', duration: '--', source: 'Web Browser', status: 'Busy' }
        ]
    },
    {
        key: '3',
        agentId: 'AG-40305',
        name: 'Julian Cross',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        status: 'Offline',
        activeChats: 0,
        maxChats: 10,
        role: 'Support Agent',
        totalChatsHandled: 412,
        avgResponseTime: '1.2m',
        avgChatHandling: '9.8m',
        rateScore: 4.1,
        chartData: [
            { time: '08:00', solved: 5 },
            { time: '10:00', solved: 12 },
            { time: '12:00', solved: 18 },
            { time: '14:00', solved: 22 },
            { time: '16:00', solved: 15 },
            { time: '18:00', solved: 8 },
        ],
        ratingDistribution: [
            { stars: 5, percentage: 50 },
            { stars: 4, percentage: 30 },
            { stars: 3, percentage: 12 },
            { stars: 2, percentage: 5 },
            { stars: 1, percentage: 3 },
        ],
        feedbacks: [
            {
                id: 'fb1',
                rating: 4,
                time: 'Last week',
                text: 'Friendly agent. Got the job done.',
                author: 'Customer A.'
            }
        ],
        activityLog: [
            { key: 'act1', action: 'Logged Out', timestamp: 'Oct 23, 06:00 PM', duration: '8h Session', source: 'Desktop App (v4.2)', status: 'Offline' }
        ]
    },
    {
        key: '4',
        agentId: 'AG-40311',
        name: 'Sarah Jenkins',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80',
        status: 'Online',
        activeChats: 10,
        maxChats: 10,
        role: 'Support Agent',
        totalChatsHandled: 1520,
        avgResponseTime: '30s',
        avgChatHandling: '5.2m',
        rateScore: 4.9,
        chartData: [
            { time: '08:00', solved: 25 },
            { time: '10:00', solved: 40 },
            { time: '12:00', solved: 55 },
            { time: '14:00', solved: 70 },
            { time: '16:00', solved: 45 },
            { time: '18:00', solved: 30 },
        ],
        ratingDistribution: [
            { stars: 5, percentage: 92 },
            { stars: 4, percentage: 6 },
            { stars: 3, percentage: 1 },
            { stars: 2, percentage: 1 },
            { stars: 0, percentage: 0 },
        ],
        feedbacks: [
            {
                id: 'fb1',
                rating: 5,
                time: '1 hour ago',
                text: 'Sarah is amazing! Fastest chat response I have ever received.',
                author: 'George P.'
            },
            {
                id: 'fb2',
                rating: 5,
                time: 'Yesterday',
                text: 'Extremely polite, very professional.',
                author: 'Alice K.'
            }
        ],
        activityLog: [
            { key: 'act1', action: 'Logged In', timestamp: 'Oct 24, 08:00 AM', duration: '--', source: 'Desktop App (v4.2)', status: 'Online' }
        ]
    },
    {
        key: '5',
        agentId: 'AG-40312',
        name: 'Anna Williams',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
        status: 'Online',
        activeChats: 5,
        maxChats: 10,
        role: 'Support Agent',
        totalChatsHandled: 830,
        avgResponseTime: '48s',
        avgChatHandling: '7.1m',
        rateScore: 4.5,
        chartData: [
            { time: '08:00', solved: 10 },
            { time: '10:00', solved: 20 },
            { time: '12:00', solved: 30 },
            { time: '14:00', solved: 42 },
            { time: '16:00', solved: 25 },
            { time: '18:00', solved: 15 },
        ],
        ratingDistribution: [
            { stars: 5, percentage: 70 },
            { stars: 4, percentage: 20 },
            { stars: 3, percentage: 7 },
            { stars: 2, percentage: 2 },
            { stars: 1, percentage: 1 },
        ],
        feedbacks: [],
        activityLog: [
            { key: 'act1', action: 'Logged In', timestamp: 'Oct 24, 08:45 AM', duration: '--', source: 'Desktop App (v4.2)', status: 'Online' }
        ]
    },
    {
        key: '6',
        agentId: 'AG-40313',
        name: 'Carlos Rivera',
        avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
        status: 'Busy',
        activeChats: 9,
        maxChats: 10,
        role: 'Senior Agent',
        totalChatsHandled: 1105,
        avgResponseTime: '52s',
        avgChatHandling: '6.9m',
        rateScore: 4.7,
        chartData: [
            { time: '08:00', solved: 18 },
            { time: '10:00', solved: 30 },
            { time: '12:00', solved: 40 },
            { time: '14:00', solved: 55 },
            { time: '16:00', solved: 35 },
            { time: '18:00', solved: 20 },
        ],
        ratingDistribution: [
            { stars: 5, percentage: 80 },
            { stars: 4, percentage: 15 },
            { stars: 3, percentage: 3 },
            { stars: 2, percentage: 1 },
            { stars: 1, percentage: 1 },
        ],
        feedbacks: [],
        activityLog: [
            { key: 'act1', action: 'Logged In', timestamp: 'Oct 24, 09:15 AM', duration: '--', source: 'Web Browser', status: 'Online' }
        ]
    }
];
