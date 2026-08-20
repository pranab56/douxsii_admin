export interface Vendor {
    key: string;
    storeName: string;
    avatarLetter: string;
    productsCount: number;
    ownerName: string;
    ownerEmail: string;
    ownerPhone: string;
    productsInList: number;
    revenue: string;
    rating: number | null;
    status: 'Approved' | 'Pending' | 'Suspended';
    joined: string;
    address: string;
    workingHours: string;
    pendingOrders: number;
    completedOrders: number;
    totalReviews: number;
}
