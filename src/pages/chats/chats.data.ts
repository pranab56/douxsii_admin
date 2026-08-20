import { SupportChat } from './chats.types';

export const MOCK_CHATS: SupportChat[] = [
    {
        key: '1',
        chatId: 'TKT-2041',
        userName: 'Alex Rivera',
        userEmail: 'alex.rivera@example.com',
        agentName: 'Sarah Johnson',
        subject: 'Payment failed but amount deducted',
        lastMessage: 'I checked my bank statement and the charge is there.',
        lastMessageTime: '10 mins ago',
        status: 'In Progress',
        unreadCount: 2,
        messages: [
            { id: '1', sender: 'user', text: 'Hi, I tried to purchase a premium vendor plan, but the transaction failed. However, my card was charged.', time: '10:15 AM' },
            { id: '2', sender: 'agent', text: 'Hello Alex! I am sorry to hear that. Let me look into this for you. Could you please share the payment method and date?', time: '10:18 AM' },
            { id: '3', sender: 'user', text: 'It was via Visa Card on June 23rd at 10:10 AM.', time: '10:20 AM' },
            { id: '4', sender: 'agent', text: 'Thank you. I am checking our billing logs now. Sometimes payments are held by the gateway as pending. Let me check the transaction status.', time: '10:22 AM' },
            { id: '5', sender: 'user', text: 'I checked my bank statement and the charge is there.', time: '10:25 AM' }
        ]
    },
    {
        key: '2',
        chatId: 'TKT-2042',
        userName: 'Emily Chen',
        userEmail: 'emily.chen@example.com',
        agentName: 'Sarah Johnson',
        subject: 'Unable to upload vendor store banner',
        lastMessage: 'Is there a file size limit?',
        lastMessageTime: '2 hours ago',
        status: 'Open',
        unreadCount: 1,
        messages: [
            { id: '1', sender: 'user', text: 'Hello, I keep getting an error when uploading my store banner. Is there a file size limit?', time: '08:30 AM' }
        ]
    },
    {
        key: '3',
        chatId: 'TKT-2043',
        userName: 'Marcus Aurelius',
        userEmail: 'marcus@empire.io',
        agentName: 'Team Lead',
        subject: 'Requesting API documentation for integration',
        lastMessage: 'Got it, looking forward to the docs.',
        lastMessageTime: '1 day ago',
        status: 'Resolved',
        messages: [
            { id: '1', sender: 'user', text: 'Do you have developer API access for syncing inventory?', time: 'Yesterday' },
            { id: '2', sender: 'agent', text: 'Yes, Marcus! I have emailed you the API specifications document. Let us know if you need helper SDKs.', time: 'Yesterday' },
            { id: '3', sender: 'user', text: 'Got it, looking forward to the docs.', time: 'Yesterday' }
        ]
    },
    {
        key: '4',
        chatId: 'TKT-2044',
        userName: 'Liam Davies',
        userEmail: 'liam@daviesdesign.co',
        agentName: 'Senior Agent',
        subject: 'Account suspension inquiry',
        lastMessage: 'Please review my verification documents.',
        lastMessageTime: '3 hours ago',
        status: 'In Progress',
        messages: [
            { id: '1', sender: 'user', text: 'Why is my seller account showing as suspended?', time: '11:00 AM' },
            { id: '2', sender: 'agent', text: 'Hello Liam, your account is temporarily suspended due to missing vendor verification documents.', time: '11:15 AM' },
            { id: '3', sender: 'user', text: 'Please review my verification documents.', time: '11:18 AM' }
        ]
    },
    {
        key: '5',
        chatId: 'TKT-2045',
        userName: 'Sofia Martinez',
        userEmail: 'sofia.m@gmail.com',
        agentName: 'Sarah Johnson',
        subject: 'Refund status for cancelled order #9802',
        lastMessage: 'Thank you for the quick help!',
        lastMessageTime: '3 days ago',
        status: 'Closed',
        messages: [
            { id: '1', sender: 'user', text: 'When will I receive my refund for order #9802?', time: '3 days ago' },
            { id: '2', sender: 'agent', text: 'It has been processed from our end and should reflect in your account within 3-5 business days.', time: '3 days ago' },
            { id: '3', sender: 'user', text: 'Thank you for the quick help!', time: '3 days ago' }
        ]
    }
];
