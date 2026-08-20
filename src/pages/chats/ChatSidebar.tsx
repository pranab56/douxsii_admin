import Search from '../../components/ui/Search';
import { ChatItem } from '../../features/supportChats/supportChatsApi';
import { baseURL } from '../../utils/BaseURL';

interface ChatSidebarProps {
    chats: ChatItem[];
    selectedChatId: string | null;
    onSelectChat: (chatId: string) => void;
    searchQuery: string;
    onSearchChange: (val: string) => void;
    activeTab: 'active' | 'resolved';
    onTabChange: (tab: 'active' | 'resolved') => void;
}

export const ChatSidebar = ({
    chats,
    selectedChatId,
    onSelectChat,
    searchQuery,
    onSearchChange,
    activeTab,
    onTabChange,
}: ChatSidebarProps) => {
    // Calculate counts for active vs resolved chats
    const activeCount = chats.filter(chat => !chat.isSolved).length;
    const resolvedCount = chats.filter(chat => Boolean(chat.isSolved)).length;

    // Filter chats based on tab and search query
    const filteredChats = chats.filter(chat => {
        const isSolved = Boolean(chat.isSolved);
        const matchesTab = activeTab === 'resolved' ? isSolved : !isSolved;

        const participant = chat.participants?.[0];
        const name = participant?.fullName || '';
        const email = participant?.email || '';
        const role = participant?.role || '';

        const matchesSearch = searchQuery
            ? name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              email.toLowerCase().includes(searchQuery.toLowerCase()) ||
              role.toLowerCase().includes(searchQuery.toLowerCase())
            : true;

        return matchesTab && matchesSearch;
    });

    return (
        <div 
            className="w-full lg:w-80 xl:w-96 flex flex-col rounded-2xl overflow-hidden flex-shrink-0"
            style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)'
            }}
        >
            {/* Search Section */}
            <div className="p-4 border-b border-white/5">
                <Search
                    value={searchQuery}
                    onChange={onSearchChange}
                    placeholder="Search by name, email, role..."
                    className="!max-w-none"
                />
            </div>

            {/* Tab Switcher with Item Count Badges */}
            <div className="flex px-4 py-3 gap-2 border-b border-white/5">
                <button
                    type="button"
                    onClick={() => onTabChange('active')}
                    className={`flex-1 py-2 px-3 text-xs font-semibold rounded-xl transition cursor-pointer border-0 outline-none flex items-center justify-center gap-2 ${
                        activeTab === 'active'
                            ? 'bg-[#560e18] text-white shadow-md'
                            : 'bg-transparent text-white/60 hover:text-white hover:bg-white/5'
                    }`}
                >
                    <span>Active Chats</span>
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full transition-colors ${
                        activeTab === 'active' ? 'bg-[#ff4b72] text-white' : 'bg-white/10 text-white/70'
                    }`}>
                        {activeCount}
                    </span>
                </button>
                <button
                    type="button"
                    onClick={() => onTabChange('resolved')}
                    className={`flex-1 py-2 px-3 text-xs font-semibold rounded-xl transition cursor-pointer border-0 outline-none flex items-center justify-center gap-2 ${
                        activeTab === 'resolved'
                            ? 'bg-[#560e18] text-white shadow-md'
                            : 'bg-transparent text-white/60 hover:text-white hover:bg-white/5'
                    }`}
                >
                    <span>Resolved Chats</span>
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full transition-colors ${
                        activeTab === 'resolved' ? 'bg-[#10b981] text-white' : 'bg-white/10 text-white/70'
                    }`}>
                        {resolvedCount}
                    </span>
                </button>
            </div>

            {/* Chats scroll area */}
            <div className="flex-1 overflow-y-auto divide-y divide-white/5 custom-scrollbar">
                {filteredChats.length === 0 ? (
                    <div className="p-8 text-center text-white/40 text-sm">
                        No conversations found
                    </div>
                ) : (
                    filteredChats.map((chat) => {
                        const isSelected = chat._id === selectedChatId;
                        const participant = chat.participants?.[0];
                        const name = participant?.fullName || 'User';
                        const email = participant?.email || 'No email';
                        const role = participant?.role || 'user';

                        const rawPic = participant?.profile;
                        const avatarUrl = rawPic
                            ? (rawPic.startsWith('http') ? rawPic : `${baseURL}/${rawPic.replace(/\\/g, '/')}`)
                            : null;

                        const dateStr = chat.updatedAt || chat.createdAt;
                        const formattedTime = dateStr ? new Date(dateStr).toLocaleDateString() : '';

                        return (
                            <div
                                key={chat._id}
                                onClick={() => onSelectChat(chat._id)}
                                className={`p-4 cursor-pointer transition flex gap-3 items-center ${
                                    isSelected ? 'bg-white/10 border-l-4 border-[#ff4b72]' : 'hover:bg-white/5'
                                }`}
                            >
                                {/* Avatar */}
                                <div className="w-10 h-10 rounded-full bg-[#ff4b72]/20 border border-[#ff4b72]/30 flex items-center justify-center text-white text-sm font-bold shrink-0 overflow-hidden">
                                    {avatarUrl ? (
                                        <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
                                    ) : (
                                        name.charAt(0).toUpperCase()
                                    )}
                                </div>

                                {/* Content info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-baseline mb-0.5">
                                        <h4 className="font-semibold text-sm truncate text-white m-0">
                                            {name}
                                        </h4>
                                        <span className="text-[10px] text-white/40 whitespace-nowrap ml-2">
                                            {formattedTime}
                                        </span>
                                    </div>
                                    <p className="text-xs text-white/50 truncate m-0">
                                        {email}
                                    </p>
                                    <div className="flex items-center gap-2 mt-1.5">
                                        <span className="text-[10px] px-2 py-0.5 rounded-md font-semibold uppercase bg-white/10 text-white/80 border border-white/10">
                                            {role}
                                        </span>
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                                            chat.isSolved 
                                                ? 'bg-green-500/15 text-[#10b981] border border-green-500/20' 
                                                : 'bg-blue-500/15 text-[#38bdf8] border border-blue-500/20'
                                        }`}>
                                            {chat.isSolved ? 'Resolved' : 'Active'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default ChatSidebar;
