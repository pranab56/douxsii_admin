import { User } from './customer.types';

export const MOCK_USERS: User[] = [
    { key: '1', name: 'Sarah Johnson', email: 'sarah.j@example.com', phone: '+1 234-567-8901', orders: 24, spent: '$2,450.00', status: 'Active', complainMessage: "Hello! I'm reaching out because I had some issues with my order." },
    { key: '2', name: 'Mike Chen', email: 'mike.chen@example.com', phone: '+1 234-567-8902', orders: 15, spent: '$1,320.50', status: 'Active', complainMessage: "I received a damaged packaging for my product, please help." },
    { key: '3', name: 'Emma Wilson', email: 'emma.w@example.com', phone: '+1 234-567-8903', orders: 8, spent: '$890.00', status: 'Active', complainMessage: "The delivery agent was delayed by two hours." },
    { key: '4', name: 'James Brown', email: 'james.b@example.com', phone: '+1 234-567-8904', orders: 32, spent: '$3,780.25', status: 'Blocked', complainMessage: "Refund was not credited back to my credit card." },
    { key: '5', name: 'Emily Davis', email: 'emily.davis@example.com', phone: '+1 234-567-8905', orders: 12, spent: '$940.00', status: 'Active', complainMessage: "Is there a discount code available for next purchase?" },
    { key: '6', name: 'Carlos Mendez', email: 'c.mendez@example.com', phone: '+1 234-567-8906', orders: 18, spent: '$1,850.50', status: 'Active', complainMessage: "My checkout page keeps returning an error code." }
];
