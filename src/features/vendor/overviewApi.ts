import { baseApi } from "../../utils/apiBaseQuery";

export interface IncomeChartItem {
    month: string;
    amount: number;
}

export interface ShopOverviewData {
    totalOrder: number;
    totalPendingOrder: number;
    totalCompletedOrder: number;
    totalRevenue: number;
    incomeChart: IncomeChartItem[];
}

export interface ShopOverviewResponse {
    success: boolean;
    message: string;
    data: ShopOverviewData;
}

export const overviewApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllShopOverview: builder.query<ShopOverviewResponse, void>({
            query: () => {
                return {
                    url: `/order/overview`,
                    method: "GET",
                };
            },
            providesTags: ["shop"],
        }),
    }),
});

// Export hooks
export const {
    useGetAllShopOverviewQuery
} = overviewApi;

