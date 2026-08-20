import { useState, useEffect } from 'react';
import PageHeader from '../../components/ui/PageHeader';
import ChatSidebar from './ChatSidebar';
import ChatWindow from './ChatWindow';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { useSupportChatsQuery, ChatItem } from '../../features/supportChats/supportChatsApi';

const Chats = () => {
    const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState<'active' | 'resolved'>('active');

    // Fetch live chats from API
    const { data: supportChatsResponse, isLoading } = useSupportChatsQuery();
    const chatsList: ChatItem[] = supportChatsResponse?.data?.result || [];

    // Select first chat automatically when chats list is loaded
    useEffect(() => {
        if (!selectedChatId && chatsList.length > 0) {
            setSelectedChatId(chatsList[0]._id);
        }
    }, [chatsList, selectedChatId]);

    const selectedChat = chatsList.find(c => c._id === selectedChatId);

    return (
        <div className="flex flex-col h-[calc(100vh-140px)] text-white">
            <PageHeader 
                title="Support Chats" 
                subtitle="Monitor all user and vendor support conversations in real-time." 
            />

            {isLoading ? (
                <div className="py-20 flex-1 flex items-center justify-center">
                    <LoadingSpinner text="Loading support conversations..." />
                </div>
            ) : (
                <div className="flex flex-col lg:flex-row gap-6 mt-6 flex-1 overflow-hidden min-h-0">
                    <ChatSidebar
                        chats={chatsList}
                        selectedChatId={selectedChatId}
                        onSelectChat={setSelectedChatId}
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                    />

                    <ChatWindow
                        selectedChat={selectedChat}
                    />
                </div>
            )}
        </div>
    );
};

export default Chats;
