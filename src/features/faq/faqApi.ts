import { baseApi } from "../../utils/apiBaseQuery";

export interface FaqItem {
    _id: string;
    question: string;
    answer: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface GetAllFaqResponse {
    success: boolean;
    message: string;
    meta?: {
        page: number;
        limit: number;
        total: number;
        totalPage: number;
    };
    data?: FaqItem[];
}

export interface SingleFaqResponse {
    success: boolean;
    message: string;
    data?: FaqItem;
}

export interface CreateFaqPayload {
    question: string;
    answer: string;
}

export interface UpdateFaqPayload {
    faqId: string;
    data?: {
        question?: string;
        answer?: string;
    };
    question?: string;
    answer?: string;
}

export const faqApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createFaq: builder.mutation<SingleFaqResponse, CreateFaqPayload | { data: CreateFaqPayload }>({
            query: (arg) => {
                const body = 'data' in arg ? arg.data : arg;
                return {
                    url: `/faq/create-faq`,
                    method: "POST",
                    body,
                };
            },
            invalidatesTags: ["faq"],
        }),

        getAllFaq: builder.query<GetAllFaqResponse, { page?: number } | void>({
            query: (params) => {
                const page = params?.page || 1;
                return {
                    url: `/faq?page=${page}`,
                    method: "GET",
                };
            },
            providesTags: ["faq"],
        }),

        getSingleFaq: builder.query<SingleFaqResponse, string | { faqId: string }>({
            query: (arg) => {
                const faqId = typeof arg === "string" ? arg : arg?.faqId;
                return {
                    url: `/faq/${faqId}`,
                    method: "GET",
                };
            },
            providesTags: ["faq"],
        }),

        updateFaq: builder.mutation<SingleFaqResponse, UpdateFaqPayload>({
            query: (arg) => {
                const faqId = arg.faqId;
                const body = arg.data ? arg.data : { question: arg.question, answer: arg.answer };
                return {
                    url: `/faq/${faqId}`,
                    method: "PATCH",
                    body,
                };
            },
            invalidatesTags: ["faq"],
        }),

        deleteFaq: builder.mutation<{ success: boolean; message: string }, string | { faqId: string }>({
            query: (arg) => {
                const faqId = typeof arg === "string" ? arg : arg?.faqId;
                return {
                    url: `/faq/${faqId}`,
                    method: "DELETE",
                };
            },
            invalidatesTags: ["faq"],
        }),
    }),
});

export const {
    useCreateFaqMutation,
    useGetAllFaqQuery,
    useGetSingleFaqQuery,
    useUpdateFaqMutation,
    useDeleteFaqMutation,
} = faqApi;
