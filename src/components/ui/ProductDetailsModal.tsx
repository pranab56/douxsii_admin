import { Modal } from 'antd';
import { FiShoppingBag, FiDollarSign, FiStar, FiUser, FiTruck } from 'react-icons/fi';
import ModalHeader from './ModalHeader';
import InfoBlock from './InfoBlock';
import { useSingleGetProductQuery } from '../../features/products/productsApi';
import LoadingSpinner from './LoadingSpinner';
import { baseURL } from '../../utils/BaseURL';

interface ProductDetailsModalProps {
    open: boolean;
    productId: string | null;
    onClose: () => void;
}

export const ProductDetailsModal = ({ open, productId, onClose }: ProductDetailsModalProps) => {
    const { data: singleProductResponse, isLoading } = useSingleGetProductQuery(productId || '', {
        skip: !open || !productId,
    });

    if (!productId) return null;

    const prod = singleProductResponse?.data;

    const name = prod?.name || 'Product Details';
    const description = prod?.description || 'No description available.';
    const category = prod?.categoryName || 'General';
    const type = prod?.type || 'other';
    const price = prod?.price ?? 0;
    const discount = prod?.discount ?? 0;
    const stock = prod?.availableStock ?? prod?.stock ?? 0;
    const rating = prod?.rating ?? 0;
    const reviewCount = prod?.reviewCount ?? 0;
    const shopName = prod?.shopId?.name || 'N/A';
    const sellerName = prod?.userId?.fullName || 'N/A';
    const sellerEmail = prod?.userId?.email || 'N/A';
    const deliveryTime = prod?.deliveryTime || 'N/A';
    const isAvailable = prod?.isAvailableForSale ?? true;

    const mainImage = prod?.images?.[0];
    const imageUrl = mainImage 
        ? (mainImage.startsWith('http') ? mainImage : `${baseURL}/${mainImage.replace(/\\/g, '/')}`)
        : null;

    return (
        <Modal
            open={open}
            onCancel={onClose}
            footer={null}
            closeIcon={null}
            centered
            width={640}
            styles={{
                content: {
                    background: '#46000B',
                    padding: '24px',
                    borderRadius: '16px',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                },
                mask: {
                    backdropFilter: 'blur(4px)',
                }
            }}
        >
            <div className="flex flex-col gap-6 relative">
                {/* Header */}
                <ModalHeader title="Product Details" onClose={onClose} />

                {isLoading ? (
                    <LoadingSpinner text="Fetching product details..." />
                ) : !prod ? (
                    <div className="py-12 text-center text-white/50 text-base">
                        Product details not found.
                    </div>
                ) : (
                    <>
                        {/* Product Summary Header */}
                        <div className="flex gap-4 border-b border-white/5 pb-4">
                            {imageUrl ? (
                                <img 
                                    src={imageUrl} 
                                    alt={name} 
                                    className="w-24 h-24 rounded-2xl object-cover shrink-0 border border-white/10"
                                />
                            ) : (
                                <div className="w-24 h-24 rounded-2xl bg-[#ff4b72]/20 flex items-center justify-center text-[#ff4b72] font-bold text-2xl shrink-0 border border-white/10">
                                    P
                                </div>
                            )}
                            <div className="flex flex-col justify-center">
                                <div className="flex items-center gap-2">
                                    <h3 className="text-white text-xl font-bold m-0 font-sans">{name}</h3>
                                    <span 
                                        className={`px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase ${
                                            isAvailable 
                                                ? 'bg-green-500/10 text-[#10b981] border border-green-500/20' 
                                                : 'bg-red-500/10 text-[#ef4444] border border-red-500/20'
                                        }`}
                                    >
                                        {isAvailable ? 'Available' : 'Out of Sale'}
                                    </span>
                                </div>
                                <p className="text-white/60 text-xs m-0 mt-1 font-sans leading-relaxed line-clamp-2">
                                    {description}
                                </p>
                                <div className="mt-2 flex items-center gap-2">
                                    <span className="bg-white/[0.05] border border-white/10 text-white/80 rounded-full px-2.5 py-0.5 text-xs font-semibold inline-block uppercase">
                                        Cat: {category}
                                    </span>
                                    <span className="bg-white/[0.05] border border-white/10 text-white/80 rounded-full px-2.5 py-0.5 text-xs font-semibold inline-block uppercase">
                                        Type: {type}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Details Content Grid */}
                        <div className="flex flex-col gap-4">
                            {/* Vendor & Seller info */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <InfoBlock 
                                    label="Shop / Vendor" 
                                    icon={<FiShoppingBag size={16} />} 
                                    value={shopName} 
                                />
                                <InfoBlock 
                                    label="Seller Info" 
                                    icon={<FiUser size={16} />} 
                                    value={
                                        <div className="mt-1">
                                            <div className="text-white text-sm font-semibold">{sellerName}</div>
                                            <div className="text-white/40 text-xs mt-0.5">{sellerEmail}</div>
                                        </div>
                                    } 
                                />
                            </div>

                            {/* Price, Stock, Rating */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <InfoBlock 
                                    label="Price" 
                                    icon={<FiDollarSign size={16} />} 
                                    value={`$${price}`} 
                                    valueClassName="text-2xl font-bold mt-1 text-[#ff4b72] font-sans"
                                />
                                <InfoBlock 
                                    label="Available Stock" 
                                    icon={<FiShoppingBag size={16} />} 
                                    value={stock} 
                                    valueClassName="text-2xl font-bold mt-1 font-sans"
                                />
                                <InfoBlock 
                                    label="Rating" 
                                    icon={<FiStar size={16} className="text-yellow-500 fill-yellow-500" />} 
                                    value={
                                        <div className="flex items-baseline justify-between w-full mt-1">
                                            <span className="text-2xl font-bold font-sans">
                                                ★ {rating}
                                            </span>
                                            <span className="text-white/40 text-[10px]">
                                                {reviewCount} reviews
                                            </span>
                                        </div>
                                    } 
                                />
                            </div>

                            {/* Delivery & Discount */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <InfoBlock 
                                    label="Delivery Time" 
                                    icon={<FiTruck size={16} />} 
                                    value={deliveryTime} 
                                />
                                {discount > 0 && (
                                    <InfoBlock 
                                        label="Discount" 
                                        icon={<FiDollarSign size={16} />} 
                                        value={`${discount}% OFF`} 
                                        valueClassName="text-green-400 font-bold mt-1"
                                    />
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </Modal>
    );
};

export default ProductDetailsModal;
