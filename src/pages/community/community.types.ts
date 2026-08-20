export interface CommunityPost {
    key: string;
    thumbnail: string;
    postTitle: string;
    description: string;
    userName: string;
    userEmail: string;
    submittedDate: string;
    status: 'Pending' | 'Approved' | 'Rejected';
    likesCount: number;
    commentsCount: number;
    category: string;
}

export interface CommunityRow {
    _id: string;
    key?: string;
    caption?: string;
    image?: string;
    likesCount?: number;
    likeCount?: number;
    status?: string;
    isDeleted?: boolean;
    createdAt?: string;
    updatedAt?: string;
    userId?: {
        _id: string;
        profile?: string;
        fullName: string;
        email?: string;
    };
}
