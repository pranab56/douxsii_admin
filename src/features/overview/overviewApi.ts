import { baseApi } from "../../utils/apiBaseQuery";

export interface EarningChartItem {
  day: string;
  amount: number;
}

export interface TopVendorItem {
  name: string;
  totalOrders: number;
  amount?: number;
}

export interface NewVendorRequestItem {
  id?: string;
  _id?: string;
  name?: string;
  contact?: string;
  email?: string;
  date?: string;
  createdAt?: string;
}

export interface OverviewData {
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
  totalVendorUsers: number;
  topVendors: TopVendorItem[];
  newVendorRequest: NewVendorRequestItem[];
  EarningChart: EarningChartItem[];
}

export interface OverviewResponse {
  success: boolean;
  message: string;
  data: OverviewData;
}

export const overviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTopOverview: builder.query<OverviewResponse, void | Record<string, unknown>>({
      query: () => ({
        url: "/payment/overview-by-super-admin",
        method: "GET",
      }),
      providesTags: ["overview"],
    }),

  }),
});

export const {
  useGetTopOverviewQuery,
} = overviewApi;
