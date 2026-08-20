export interface ChatMessage {
    id: string;
    sender: 'user' | 'agent';
    text: string;
    time: string;
}

export interface SupportChat {
    key: string;
    chatId: string;
    userName: string;
    userEmail: string;
    agentName?: string;
    subject: string;
    lastMessage: string;
    lastMessageTime: string;
    status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
    messages: ChatMessage[];
    unreadCount?: number;
}

export interface ChatSidebarProps {
    filteredChats: SupportChat[];
    selectedChatKey: string | null;
    onSelectChat: (key: string) => void;
    searchQuery: string;
    onSearchChange: (val: string) => void;
    activeTab: 'active' | 'resolved';
    onTabChange: (tab: 'active' | 'resolved') => void;
    getAvatarBg: (name: string) => string;
    statusBadge: Record<string, string>;
}

export interface ChatWindowProps {
    selectedChat: SupportChat | undefined;
    onStatusChange: (status: SupportChat['status']) => void;
    onSendMessage: (text: string) => void;
    showToast: (msg: string) => void;
    messagesEndRef: React.RefObject<HTMLDivElement> | React.MutableRefObject<HTMLDivElement | null>;
    getAvatarBg: (name: string) => string;
}
