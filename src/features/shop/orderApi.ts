import { baseApi } from "../../utils/apiBaseQuery";

export interface ProductInfo {
    _id: string;
    name: string;
    description?: string;
    images?: string[];
}

export interface OrderProductItem {
    productId: ProductInfo;
    sellerId?: string;
    userId?: string;
    price?: number;
    quantity?: number;
    weight?: number;
    height?: number;
    width?: number;
    length?: number;
    _id: string;
}

export interface OrderItem {
    _id: string;
    userId?: string;
    shopId?: string;
    productList: OrderProductItem[];
    totalAmount: number;
    orderDate: string;
    status: string;
    giftStatus?: string;
    giftAmount?: number;
    qrCodeUrl?: string;
    isShared?: boolean;
    isRated?: boolean;
    paymentStatus?: string;
    phone_number?: string;
    postal_code?: string;
    state_code?: string;
    country_code?: string;
    address_line1?: string;
    city?: string;
    isWithdraw?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface OrderMeta {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
}

export interface GetAllOrderResponse {
    success: boolean;
    message: string;
    meta?: OrderMeta;
    data: OrderItem[];
}

export interface GetSingleOrderResponse {
    success: boolean;
    message: string;
    data: OrderItem;
}

export interface GetAllOrderParams {
    searchTerm?: string;
    page?: number;
    status?: string;
}

export const orderApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllOrder: builder.query<GetAllOrderResponse, GetAllOrderParams | void>({
            query: (params) => {
                const queryParams = new URLSearchParams();
                if (params?.page) queryParams.append("page", params.page.toString());
                if (params?.searchTerm) queryParams.append("searchTerm", params.searchTerm);
                if (params?.status && params.status !== "All" && params.status !== "all") {
                    queryParams.append("status", params.status);
                }
                const queryString = queryParams.toString();
                return {
                    url: `/order/all${queryString ? `?${queryString}` : ""}`,
                    method: "GET",
                };
            },
            providesTags: ["order"],
        }),

        getSingleOrder: builder.query<GetSingleOrderResponse, string | { orderId: string }>({
            query: (arg) => {
                const orderId = typeof arg === "string" ? arg : arg?.orderId;
                return {
                    url: `/order/${orderId}`,
                    method: "GET",
                };
            },
            providesTags: ["order"],
        }),

        updateStatus: builder.mutation({
            query: ({ id, status }: { id: string, status: string }) => {
                return {
                    url: `/order/${id}?status=${status}`, // accepted || rejected
                    method: "PATCH",
                };
            },
            invalidatesTags: ["order"],
        }),

    }),
});

// Export hooks
export const {
    useGetAllOrderQuery,
    useGetSingleOrderQuery,
    useUpdateStatusMutation
} = orderApi;

