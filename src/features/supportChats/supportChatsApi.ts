import { baseApi } from "../../utils/apiBaseQuery";

export interface Participant {
    _id: string;
    profile?: string;
    fullName: string;
    email?: string;
    role?: string;
    phone?: string;
}

export interface ChatItem {
    _id: string;
    participants: Participant[];
    assignSupportAgentId?: string;
    isSolved?: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface ChatListResponse {
    success: boolean;
    message: string;
    data?: {
        meta?: {
            page: number;
            limit: number;
            total: number;
            totalPage: number;
        };
        result?: ChatItem[];
    };
}

export interface MessageSender {
    _id: string;
    profile?: string;
    fullName: string;
    role?: string;
}

export interface MessageItem {
    _id: string;
    message: string;
    image?: string | null;
    seen?: boolean;
    sender: MessageSender;
    chatId: string;
    replyTo?: string | null;
    isPinned?: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface MessageListResponse {
    success: boolean;
    message: string;
    data?: {
        meta?: {
            page: number;
            limit: number;
            total: number;
            totalPage: number;
        };
        newResult?: {
            pinned?: MessageItem[];
            result?: MessageItem[];
        };
    };
}

export const supportChatsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        supportChats: builder.query<ChatListResponse, void>({
            query: () => ({
                url: `/chat/all-chat-list?assigned=assigned`,
                method: "GET",
            }),
            providesTags: ["chat"],
        }),

        getMessageByChatId: builder.query<MessageListResponse, { chatId: string; page?: number }>({
            query: ({ chatId, page = 1 }) => ({
                url: `/message/my-messages/${chatId}?page=${page}`,
                method: "GET",
            }),
            providesTags: ["chat"],
        }),


    }),
});

export const {
    useSupportChatsQuery,
    useGetMessageByChatIdQuery,
} = supportChatsApi;
