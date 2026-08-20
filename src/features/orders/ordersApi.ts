import { baseApi } from "../../utils/apiBaseQuery";

export interface ProductItem {
    _id: string;
    productId: {
        _id: string;
        name: string;
        description?: string;
        images?: string[];
    };
    sellerId?: string;
    userId?: string;
    price: number;
    quantity: number;
    weight?: number;
    height?: number;
    width?: number;
    length?: number;
}

export interface OrderItem {
    _id: string;
    userId: string;
    sellerId?: string;
    shopId?: string;
    productList: ProductItem[];
    totalAmount: number;
    orderDate: string;
    status: string;
    giftStatus?: string;
    paymentStatus?: string;
    giftAmount?: number;
    giftUserId?: string;
    isRated?: boolean;
    isWithdraw?: boolean;
    createdAt?: string;
    updatedAt?: string;
    address_line1?: string;
    city?: string;
    country_code?: string;
    phone_number?: string;
    postal_code?: string;
    state_code?: string;
}

export interface GetAllOrdersResponse {
    success: boolean;
    message: string;
    meta?: {
        page: number;
        limit: number;
        total: number;
        totalPage: number;
    };
    data?: OrderItem[];
}

export interface SingleOrderResponse {
    success: boolean;
    message: string;
    data?: OrderItem;
}

export const ordersApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllOrders: builder.query<GetAllOrdersResponse, void | { page?: number; status?: string; searchTerm?: string }>({
            query: (params) => {
                const queryParams = new URLSearchParams();
                if (params?.page) queryParams.append("page", params.page.toString());
                if (params?.status && params.status !== "All" && params.status !== "all") {
                    queryParams.append("status", params.status);
                }
                if (params?.searchTerm) queryParams.append("searchTerm", params.searchTerm);

                const queryString = queryParams.toString();
                return {
                    url: `/order/all${queryString ? `?${queryString}` : ""}`,
                    method: "GET",
                };
            },
            providesTags: ["orders"],
        }),

        singleOrder: builder.query<SingleOrderResponse, string | { orderId: string }>({
            query: (arg) => {
                const orderId = typeof arg === "string" ? arg : arg?.orderId;
                return {
                    url: `/order/${orderId}`,
                    method: "GET",
                };
            },
            providesTags: ["orders"],
        }),
    }),
});

// Export hooks
export const {
    useGetAllOrdersQuery,
    useSingleOrderQuery,
} = ordersApi;
