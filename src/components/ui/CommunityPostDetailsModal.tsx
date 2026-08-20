import { Modal } from 'antd';
import { FiHeart } from 'react-icons/fi';
import ModalHeader from './ModalHeader';
import { useGetSingleCommunityQuery } from '../../features/community/communityApi';
import LoadingSpinner from './LoadingSpinner';
import { baseURL } from '../../utils/BaseURL';

interface CommunityPostDetailsModalProps {
    open: boolean;
    postId: string | null;
    onClose: () => void;
}

export const CommunityPostDetailsModal = ({ open, postId, onClose }: CommunityPostDetailsModalProps) => {
    const { data: singleCommunityResponse, isLoading } = useGetSingleCommunityQuery(postId || '', {
        skip: !open || !postId,
    });

    if (!postId) return null;

    const post = singleCommunityResponse?.data;

    const caption = post?.caption || 'Community Post';
    const rawImage = post?.image;
    const imageUrl = rawImage 
        ? (rawImage.startsWith('http') ? rawImage : `${baseURL}/${rawImage.replace(/\\/g, '/')}`)
        : null;

    const userName = post?.userId?.fullName || 'User';
    const userEmail = post?.userId?.email || 'N/A';
    const likesCount = post?.likeCount ?? post?.likesCount ?? 0;
    const status = post?.status || 'approved';
    const createdAt = post?.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'N/A';

    return (
        <Modal
            open={open}
            onCancel={onClose}
            footer={null}
            closeIcon={null}
            centered
            width={550}
            styles={{
                content: {
                    background: '#46000B',
                    padding: '24px',
                    borderRadius: '24px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                },
                mask: {
                    backdropFilter: 'blur(4px)',
                }
            }}
        >
            <div className="flex flex-col relative">
                {/* Modal Header */}
                <ModalHeader title="Post Details" onClose={onClose} className="mb-4" />

                {isLoading ? (
                    <LoadingSpinner text="Fetching post details..." />
                ) : !post ? (
                    <div className="py-12 text-center text-white/50 text-base">
                        Community post not found.
                    </div>
                ) : (
                    <>
                        {/* Centered Post Image */}
                        {imageUrl ? (
                            <div className="flex justify-center mt-1">
                                <img 
                                    src={imageUrl} 
                                    alt={caption} 
                                    className="w-52 h-52 sm:w-56 sm:h-56 rounded-2xl object-cover shadow-lg border border-white/10"
                                />
                            </div>
                        ) : (
                            <div className="flex justify-center mt-1">
                                <div className="w-52 h-52 sm:w-56 sm:h-56 rounded-2xl bg-white/5 flex items-center justify-center text-white/40 border border-white/10">
                                    No Image
                                </div>
                            </div>
                        )}

                        {/* Post Caption */}
                        <h3 className="text-white text-xl font-bold mt-4 text-center font-sans m-0">
                            {caption}
                        </h3>

                        <div className="flex flex-col items-center">
                            <p className="text-white/70 text-sm mt-1.5 text-center m-0 font-normal">
                                Shared by <span className="text-white font-semibold">{userName}</span> 
                                {userEmail !== 'N/A' && <span className="mx-1.5 text-white/40">• {userEmail}</span>}
                            </p>
                            
                            <div className="flex items-center justify-center gap-2.5 mt-2.5">
                                <span className={`px-3 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${
                                    status.toLowerCase() === 'approved' 
                                        ? 'bg-green-500/10 text-[#10b981] border border-green-500/20' 
                                        : 'bg-yellow-500/10 text-[#fbbf24] border border-yellow-500/20'
                                }`}>
                                    {status}
                                </span>
                                <span className="text-white/60 text-xs">
                                    Posted Date: {createdAt}
                                </span>
                            </div>

                            {/* Likes Card */}
                            <div className="mt-6 w-full">
                                <div 
                                    className="p-4 rounded-2xl flex flex-col justify-center items-center text-center border transition-all"
                                    style={{ background: 'rgba(255, 75, 114, 0.12)', borderColor: 'rgba(255, 75, 114, 0.25)' }}
                                >
                                    <div className="flex items-center gap-2 text-white/70 text-sm font-medium">
                                        <FiHeart className="text-[#ff4b72]" size={18} />
                                        <span>Total Likes</span>
                                    </div>
                                    <span className="text-white text-3xl font-bold mt-1.5 font-sans">
                                        {likesCount}
                                    </span>
                                </div>
                            </div>

                            {/* Close Button */}
                            <div className="mt-6 w-full">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="w-full h-12 rounded-xl text-white font-medium transition-all hover:bg-white/5 active:scale-98 cursor-pointer border border-white/20 bg-transparent outline-none"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </Modal>
    );
};

export default CommunityPostDetailsModal;
