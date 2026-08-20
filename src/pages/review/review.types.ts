export interface Feedback {
    key: string;
    userName: string;
    userEmail: string;
    userPhone: string;
    rating: number;
    reviewMessage: string;
    status: string;
}

export interface Gift {
    key: string;
    giftId: string;
    senderName: string;
    senderEmail: string;
    receiverName: string;
    receiverEmail: string;
    amount: string;
    message: string;
    productName: string;
    productImage: string;
    sentDate: string;
    status: 'Redeemed' | 'Pending' | 'Expired';
}
