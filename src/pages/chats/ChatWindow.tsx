import { useRef, useEffect } from 'react';
import { FiLock, FiCheckCircle } from 'react-icons/fi';
import { ChatItem, useGetMessageByChatIdQuery, MessageItem } from '../../features/supportChats/supportChatsApi';
import EmptyChatState from './EmptyChatState';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { baseURL } from '../../utils/BaseURL';
import { useChatSocket } from '../../hooks/useChatSocket';

interface ChatWindowProps {
    selectedChat: ChatItem | undefined;
}

export const ChatWindow = ({ selectedChat }: ChatWindowProps) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Initialize real-time socket connection for selected chat messages: new-message::${chatId}
    useChatSocket(selectedChat?._id);

    // Fetch messages for selected chatId
    const { data: messagesResponse, isLoading, isFetching } = useGetMessageByChatIdQuery(
        { chatId: selectedChat?._id || '' },
        { skip: !selectedChat?._id }
    );

    const rawMessages: MessageItem[] = messagesResponse?.data?.newResult?.result || [];
    // Sort chronologically (oldest at top, newest at bottom)
    const messagesList = [...rawMessages].reverse();

    // Scroll to bottom when messages load or change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messagesList.length, selectedChat?._id]);

    if (!selectedChat) {
        return <EmptyChatState />;
    }

    const participant = selectedChat.participants?.[0];
    const name = participant?.fullName || 'User';
    const email = participant?.email || 'N/A';
    const role = participant?.role || 'user';
    const phone = participant?.phone || '';

    const rawPic = participant?.profile;
    const avatarUrl = rawPic
        ? (rawPic.startsWith('http') ? rawPic : `${baseURL}/${rawPic.replace(/\\/g, '/')}`)
        : null;


    return (
        <div
            className="flex-1 flex flex-col rounded-2xl overflow-hidden min-h-0"
            style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)'
            }}
        >
            {/* Chat Header */}
            <div className="p-4 border-b border-white/5 bg-white/5 flex flex-wrap gap-3 items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#ff4b72]/20 border border-[#ff4b72]/30 flex items-center justify-center text-white text-sm font-bold shrink-0 overflow-hidden">
                        {avatarUrl ? (
                            <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
                        ) : (
                            name.charAt(0).toUpperCase()
                        )}
                    </div>
                    <div>
                        <h3 className="font-semibold text-sm text-white flex items-center gap-2 m-0">
                            {name}
                            <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-white/80 border border-white/10 uppercase font-semibold">
                                {role}
                            </span>
                        </h3>
                        <p className="text-xs text-white/50 m-0 mt-0.5">
                            {email} {phone ? `• ${phone}` : ''}
                        </p>
                    </div>
                </div>

                {/* Status Badge */}
                <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-1.5 ${selectedChat.isSolved
                        ? 'bg-green-500/15 text-[#10b981] border border-green-500/20'
                        : 'bg-blue-500/15 text-[#38bdf8] border border-blue-500/20'
                        }`}>
                        {selectedChat.isSolved && <FiCheckCircle size={14} />}
                        {selectedChat.isSolved ? 'Resolved' : 'Active Ticket'}
                    </span>
                </div>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-black/10">
                {isLoading || isFetching ? (
                    <div className="py-12">
                        <LoadingSpinner text="Loading conversation history..." />
                    </div>
                ) : messagesList.length === 0 ? (
                    <div className="py-16 text-center text-white/40 text-sm">
                        No messages in this conversation yet.
                    </div>
                ) : (
                    messagesList.map((msg) => {
                        const isAgent = msg.sender?.role === 'support_agent' || msg.sender?.role === 'admin' || msg.sender?.role === 'super_admin';
                        const senderName = msg.sender?.fullName || (isAgent ? 'Support Agent' : name);
                        const senderPic = msg.sender?.profile;
                        const msgAvatar = senderPic
                            ? (senderPic.startsWith('http') ? senderPic : `${baseURL}/${senderPic.replace(/\\/g, '/')}`)
                            : null;

                        const imgPath = msg.image;
                        const msgImageUrl = imgPath
                            ? (imgPath.startsWith('http') ? imgPath : `${baseURL}/${imgPath.replace(/\\/g, '/')}`)
                            : null;

                        const timeStr = msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';



                        return (
                            <div
                                key={msg._id}
                                className={`flex flex-col ${isAgent ? 'items-end' : 'items-start'}`}
                            >
                                <span className="text-white/40 text-[10px] mb-1 px-1 font-medium">
                                    {senderName} ({msg.sender?.role || 'user'})
                                </span>

                                <div className="flex items-start gap-2 max-w-[75%]">
                                    {!isAgent && msgAvatar && (
                                        <img src={msgAvatar} alt={senderName} className="w-7 h-7 rounded-full object-cover shrink-0 mt-1" />
                                    )}

                                    <div
                                        className={`rounded-2xl p-4 shadow-sm ${isAgent
                                            ? 'bg-[#560e18] text-white rounded-tr-none border border-[#ff4b72]/20'
                                            : 'bg-white/10 text-white rounded-tl-none border border-white/10'
                                            }`}
                                    >
                                        {/* Image attachment if available */}
                                        {msgImageUrl && (
                                            <div className="mb-2 rounded-xl overflow-hidden border border-white/10 max-w-xs">
                                                <img src={msgImageUrl} alt="Attachment" className="w-full h-auto object-cover" />
                                            </div>
                                        )}

                                        {msg.message && (
                                            <p className="text-sm leading-relaxed m-0 whitespace-pre-wrap">{msg.message}</p>
                                        )}

                                        <span className="block text-[9px] text-white/40 text-right mt-1.5 font-sans">
                                            {timeStr}
                                        </span>
                                    </div>

                                    {isAgent && msgAvatar && (
                                        <img src={msgAvatar} alt={senderName} className="w-7 h-7 rounded-full object-cover shrink-0 mt-1" />
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Read-Only Status Footer (No Message Input as per user instruction) */}
            <div className="p-3 border-t border-white/5 bg-white/[0.02] flex items-center justify-center gap-2 text-white/40 text-xs font-medium">
                <FiLock size={14} className="text-white/40" />
                <span>Read-Only Mode — Support Monitoring View</span>
            </div>
        </div>
    );
};

export default ChatWindow;
