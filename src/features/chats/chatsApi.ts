import { baseApi } from "../../utils/apiBaseQuery";

export const chatsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        getAllChat: builder.query({
            query: () => {
                return {
                    url: `/chat/all-chat-list?assigned=assigned`,
                    method: "GET",
                };
            },
            providesTags: ["chat"],
        }),


        getChatMessages: builder.query({
            query: (chatId) => {
                return {
                    url: `/message/my-messages/${chatId}`,
                    method: "GET",
                };
            },
            providesTags: ["chat"],
        }),

    }),
});

// Export hooks
export const {
    useGetAllChatQuery,
    useGetChatMessagesQuery
} = chatsApi;
