export interface Campaign {
    key: string;
    adId: string;
    title: string;
    vendorName: string;
    vendorEmail: string;
    badge: string;
    price: number;
    duration: number;
    paymentStatus: 'Paid' | 'Unpaid';
    status: 'Pending' | 'Active' | 'Expired' | 'Rejected';
    image: string;
    startDate: string;
    endDate: string;
    sales: string;
    totalRevenue: string;
    dailyAverage: string;
    remainingDays: number;
    placementSection: string;
    placementEmail: string;
    rating: number;
    reviewCount: number;
    offer: string;
}
