import { User } from './users.types';

export const MOCK_USERS: User[] = [
    { key: '1', name: 'Sarah Johnson', email: 'sarah.j@example.com', phone: '+1 234-567-8901', orders: 24, spent: '$2,450.00', status: 'Active', joined: '2025-01-15', lastLogin: '2026-06-05 10:30 AM', address: '123 Main St, New York, NY 10001', giftsSent: 8, giftsReceived: 5, walletBalance: '$125.50' },
    { key: '2', name: 'Mike Chen', email: 'mike.chen@example.com', phone: '+1 234-567-8902', orders: 15, spent: '$1,320.50', status: 'Active', joined: '2025-02-10', lastLogin: '2026-06-04 11:20 AM', address: '456 Elm St, San Francisco, CA 94102', giftsSent: 12, giftsReceived: 7, walletBalance: '$210.00' },
    { key: '3', name: 'Emma Wilson', email: 'emma.w@example.com', phone: '+1 234-567-8903', orders: 8, spent: '$890.00', status: 'Active', joined: '2025-03-05', lastLogin: '2026-06-02 09:15 AM', address: '789 Oak Ave, Chicago, IL 60605', giftsSent: 4, giftsReceived: 2, walletBalance: '$45.75' },
    { key: '4', name: 'James Brown', email: 'james.b@example.com', phone: '+1 234-567-8904', orders: 32, spent: '$3,780.25', status: 'Blocked', joined: '2024-11-20', lastLogin: '2026-06-01 02:40 PM', address: '321 Pine Rd, Seattle, WA 98101', giftsSent: 19, giftsReceived: 14, walletBalance: '$320.40' },
    { key: '5', name: 'Emma Wilson', email: 'emma.w@example.com', phone: '+1 234-567-8903', orders: 8, spent: '$890.00', status: 'Active', joined: '2025-03-05', lastLogin: '2026-06-02 09:15 AM', address: '789 Oak Ave, Chicago, IL 60605', giftsSent: 4, giftsReceived: 2, walletBalance: '$45.75' },
    { key: '6', name: 'James Brown', email: 'james.b@example.com', phone: '+1 234-567-8904', orders: 32, spent: '$3,780.25', status: 'Blocked', joined: '2024-11-20', lastLogin: '2026-06-01 02:40 PM', address: '321 Pine Rd, Seattle, WA 98101', giftsSent: 19, giftsReceived: 14, walletBalance: '$320.40' }
];
