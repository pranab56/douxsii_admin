export interface User {
    _id?: string;
    key?: string;
    name: string;
    fullName?: string;
    email: string;
    phone: string;
    role?: string;
    status: string;
    isActive?: boolean;
    orders?: number;
    spent?: string;
    joined?: string;
    createdAt?: string;
    lastLogin?: string;
    address?: string;
    giftsSent?: number;
    giftsReceived?: number;
    walletBalance?: string;
}
