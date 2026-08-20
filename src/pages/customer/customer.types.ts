export interface User {
    key: string;
    name: string;
    email: string;
    phone: string;
    orders: number;
    spent: string;
    status: string;
    joined?: string;
    lastLogin?: string;
    address?: string;
    giftsSent?: number;
    giftsReceived?: number;
    walletBalance?: string;
    complainMessage?: string;
}
