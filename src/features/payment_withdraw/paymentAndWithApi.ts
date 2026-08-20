import { baseApi } from "../../utils/apiBaseQuery";

export interface PaymentUser {
    _id: string;
    profile?: string;
    fullName: string;
    email?: string;
}

export interface PaymentRecord {
    _id: string;
    userId?: PaymentUser;
    method?: string;
    amount: number;
    type?: string;
    status: string;
    transactionId?: string;
    transactionDate?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface PaymentResponse {
    success: boolean;
    message: string;
    data?: {
        meta?: {
            page: number;
            limit: number;
            total: number;
            totalPage: number;
        };
        result?: PaymentRecord[];
    };
}

export interface WithdrawRecord {
    _id: string;
    userId?: PaymentUser;
    amount: number;
    transactionId?: string;
    status: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface WithdrawResponse {
    success: boolean;
    message: string;
    meta?: {
        page: number;
        limit: number;
        total: number;
        totalPage: number;
    };
    data?: WithdrawRecord[];
}

export const payAndWithApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllPayment: builder.query<PaymentResponse, { page?: number } | void>({
            query: (params) => {
                const page = params?.page || 1;
                return {
                    url: `/payment?page=${page}`,
                    method: "GET",
                };
            },
            providesTags: ["payAndWith"],
        }),

        getAllWithDraw: builder.query<WithdrawResponse, { page?: number } | void>({
            query: (params) => {
                const page = params?.page || 1;
                return {
                    url: `/withdraw/all?page=${page}`,
                    method: "GET",
                };
            },
            providesTags: ["payAndWith"],
        }),
    }),
});

export const {
    useGetAllPaymentQuery,
    useGetAllWithDrawQuery,
} = payAndWithApi;
