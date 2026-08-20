import { baseApi } from "../../utils/apiBaseQuery";

export interface ProductPromotionItem {
    _id: string;
    userId?: string;
    shopId?: string;
    productId?: {
        _id: string;
        name: string;
        price: number;
        images?: string[];
    };
    selectedPlacement?: string;
    title?: string;
    message?: string;
    status: 'pending' | 'approved' | 'rejected' | string;
    createdAt?: string;
    updatedAt?: string;
}

export interface ProductPromotionResponse {
    success: boolean;
    message: string;
    meta?: {
        page: number;
        limit: number;
        total: number;
        totalPage: number;
    };
    data?: {
        totalActiveCampaigns?: number;
        totalPendingCampaigns?: number;
        totalAdsRevenue?: number;
        result?: ProductPromotionItem[];
    };
};

// cut of loser friends 

// do not scrol for more then 10 minit 

// do the herdest task of the day first 

// create more then you consume 

// learn sales and persuasion 

// make sure you are better 1% better then yesterday 

// stop sleping past 11 pm 

// keep your phone far away from you 

// study successfull people 

// study books 

// train 5x per week 

// sleep at last 5 hour 

// spend time with rice people 

// avoied the unlucky 

// do the work you`ve been avoiding 

// go on phone free walks 

// put your phone do not distrub 

// eat nutural whole - foods 

//belive that you can and you will 

// eliminate all procrastitations

// make it happen



export const advertisementApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllAdvertisement: builder.query<ProductPromotionResponse, { page?: number; limit?: number; status?: string } | void>({
            query: (params) => {
                const page = params?.page || 1;
                const limit = params?.limit || 10;
                let url = `/product-promotion/all?page=${page}&limit=${limit}`;
                if (params?.status && params.status !== 'all') {
                    url += `&status=${params.status}`;
                }
                return {
                    url,
                    method: "GET",
                };
            },
            providesTags: ["advertisement"],
        }),


        updateAdvertisement: builder.mutation<{ success: boolean; message: string }, { id: string; status: 'approved' | 'rejected' | string }>({
            query: ({ id, status }) => {
                return {
                    url: `/product-promotion/${id}?status=${status}`,
                    method: "PATCH",
                };
            },
            invalidatesTags: ["advertisement"],
        }),

    }),
});

export const {
    useGetAllAdvertisementQuery,
    useUpdateAdvertisementMutation,
} = advertisementApi;
