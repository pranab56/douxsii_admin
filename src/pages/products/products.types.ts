export interface Product {
    key: string;
    productName: string;
    productImage: string;
    description: string;
    categoryName: string;
    vendorName: string;
    price: string;
    stock: number;
    sold: number;
    rating: number;
    reviewsCount: number;
    addedDate: string;
}

export interface ProductRow {
    _id: string;
    key?: string;
    name: string;
    type?: string;
    categoryName?: string;
    price: number;
    stock?: number;
    images?: string[];
    rating?: number;
    shopId?: {
        _id: string;
        name: string;
    };
}
