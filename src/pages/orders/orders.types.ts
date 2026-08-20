export interface Order {
    key: string;
    orderId: string;
    orderDate: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    productName: string;
    quantity: number;
    vendorName: string;
    amount: string;
    paymentMethod: string;
    status: string;
    address: string;
    trackingNumber: string;
    giftMessage?: string;
    isGift?: boolean;
}

export interface OrderProduct {
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

export interface OrderRow {
    _id: string;
    key?: string;
    userId: string;
    sellerId?: string;
    shopId?: string;
    productList: OrderProduct[];
    totalAmount: number;
    orderDate: string;
    status: string;
    giftStatus?: string;
    paymentStatus?: string;
    giftAmount?: number;
    giftUserId?: string;
    isRated?: boolean;
    isWithdraw?: boolean;
}
