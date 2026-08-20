import { baseApi } from "../../utils/apiBaseQuery";

export interface GiftUserInfo {
    _id: string;
    profile?: string;
    fullName: string;
    email?: string;
}

export interface GiftProductItem {
    _id: string;
    productId: {
        _id: string;
        name: string;
        description?: string;
        images?: string[];
    };
    price: number;
    quantity: number;
}

export interface GiftOrderRecord {
    _id: string;
    userId: string | GiftUserInfo;
    sellerId?: string;
    shopId?: string;
    productList?: GiftProductItem[];
    totalAmount?: number;
    orderDate?: string;
    status?: string;
    giftStatus?: string;
    paymentStatus?: string;
    giftAmount?: number;
    giftUserId?: string | GiftUserInfo;
    isRated?: boolean;
    isWithdraw?: boolean;
    createdAt?: string;
}

export interface GiftWalletRecord {
    _id: string;
    userId?: GiftUserInfo;
    giftUserId?: GiftUserInfo;
    amount: number;
    status?: string;
    isDeleted?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface GiftApiResponse<T> {
    success: boolean;
    message: string;
    meta?: {
        page: number;
        limit: number;
        total: number;
        totalPage: number;
    };
    data?: {
        totalGift?: number;
        totalPendingGift?: number;
        totalRedeemedGift?: number;
        result?: T[];
    };
}

export const giftsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllGiftWallet: builder.query<GiftApiResponse<GiftWalletRecord>, { page?: number } | void>({
            query: (params) => {
                const page = params?.page || 1;
                return {
                    url: `/gift-wallet/all?page=${page}`,
                    method: "GET",
                };
            },
            providesTags: ["gift-wallet"],
        }),

        getAllGift: builder.query<GiftApiResponse<GiftOrderRecord>, { page?: number } | void>({
            query: (params) => {
                const page = params?.page || 1;
                return {
                    url: `/order/gift?page=${page}`,
                    method: "GET",
                };
            },
            providesTags: ["gift"],
        }),
    }),
});

export const {
    useGetAllGiftQuery,
    useGetAllGiftWalletQuery,
} = giftsApi;
