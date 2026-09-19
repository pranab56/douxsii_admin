import { useState, useEffect } from 'react';
import { Modal } from 'antd';
import { FiShoppingBag, FiDollarSign, FiStar, FiUser, FiTruck, FiImage, FiPackage, FiGift } from 'react-icons/fi';
import ModalHeader from './ModalHeader';
import InfoBlock from './InfoBlock';
import { useGetSingleProductQuery } from '../../features/shop/productApi';
import LoadingSpinner from './LoadingSpinner';
import { baseURL } from '../../utils/BaseURL';

interface ProductDetailsModalProps {
    open: boolean;
    productId: string | null;
    onClose: () => void;
}

export const ProductDetailsModal = ({ open, productId, onClose }: ProductDetailsModalProps) => {
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    const { data: singleProductResponse, isLoading } = useGetSingleProductQuery(productId || '', {
        skip: !open || !productId,
    });

    useEffect(() => {
        setActiveImageIndex(0);
    }, [productId, open]);

    if (!productId) return null;

    const prod = singleProductResponse?.data;

    const name = prod?.name || 'Product Details';
    const description = prod?.description || 'No description available.';
    const category = prod?.categoryName || 'General';
    const type = prod?.type || 'other';
    const price = prod?.price ?? 0;
    const mainPrice = prod?.mainPrice;
    const discount = prod?.discount ?? 0;
    const stock = prod?.availableStock ?? prod?.stock ?? 0;
    const rating = prod?.rating ?? 0;
    const reviewCount = prod?.reviewCount ?? 0;
    const shopName = prod?.shopId?.name || 'N/A';
    const sellerName = prod?.userId?.fullName || 'N/A';
    const sellerEmail = prod?.userId?.email || 'N/A';
    const deliveryTime = prod?.deliveryTime || 'N/A';
    const isAvailable = prod?.isAvailableForSale ?? true;
    const isGiftWrappingFree = prod?.isGiftWrappingFree ?? false;
    const weight = prod?.weight;
    const length = prod?.length;
    const width = prod?.width;
    const height = prod?.height;

    const images: string[] = prod?.images || [];

    const getImageUrl = (img?: string) => {
        if (!img) return '';
        return img.startsWith('http') ? img : `${baseURL}/${img.replace(/\\/g, '/')}`;
    };

    const activeImageUrl = images.length > 0 ? getImageUrl(images[activeImageIndex] || images[0]) : null;

    return (
        <Modal
            open={open}
            onCancel={onClose}
            footer={null}
            closeIcon={null}
            centered
            width={680}
            styles={{
                content: {
                    background: '#46000B',
                    padding: '24px',
                    borderRadius: '16px',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    maxHeight: '90vh',
                    overflowY: 'auto',
                },
                mask: {
                    backdropFilter: 'blur(4px)',
                }
            }}
        >
            <div className="flex flex-col gap-5 relative">
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
                        <div className="flex flex-col sm:flex-row gap-4 border-b border-white/5 pb-4">
                            {activeImageUrl ? (
                                <div className="relative w-28 h-28 rounded-2xl overflow-hidden shrink-0 border border-white/10 bg-black/30">
                                    <img 
                                        src={activeImageUrl} 
                                        alt={name} 
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = '/vite.svg';
                                        }}
                                    />
                                    {images.length > 1 && (
                                        <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/75 text-[9px] text-white/90 font-mono">
                                            {activeImageIndex + 1}/{images.length}
                                        </span>
                                    )}
                                </div>
                            ) : (
                                <div className="w-28 h-28 rounded-2xl bg-[#ff4b72]/20 flex items-center justify-center text-[#ff4b72] font-bold text-2xl shrink-0 border border-white/10">
                                    P
                                </div>
                            )}
                            <div className="flex flex-col justify-center flex-1">
                                <div className="flex items-center gap-2 flex-wrap">
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
                                <div className="mt-2.5 flex items-center gap-2 flex-wrap">
                                    <span className="bg-white/[0.05] border border-white/10 text-white/80 rounded-full px-2.5 py-0.5 text-xs font-semibold inline-block uppercase">
                                        Cat: {category}
                                    </span>
                                    <span className="bg-white/[0.05] border border-white/10 text-white/80 rounded-full px-2.5 py-0.5 text-xs font-semibold inline-block uppercase">
                                        Type: {type}
                                    </span>
                                    {isGiftWrappingFree && (
                                        <span className="bg-pink-500/15 border border-pink-500/20 text-[#ff4b72] rounded-full px-2.5 py-0.5 text-xs font-semibold inline-flex items-center gap-1">
                                            <FiGift size={11} /> Free Wrapping
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* All Product Images Gallery Section */}
                        {images.length > 0 && (
                            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-white text-xs font-semibold flex items-center gap-1.5 uppercase tracking-wider text-[#ff4b72]">
                                        <FiImage size={14} /> Product Photos ({images.length})
                                    </span>
                                    <span className="text-white/40 text-[11px]">Click thumbnail to view</span>
                                </div>

                                <div className="flex items-center gap-2.5 overflow-x-auto pb-1 custom-scrollbar">
                                    {images.map((img, idx) => {
                                        const url = getImageUrl(img);
                                        const isSelected = idx === activeImageIndex;
                                        return (
                                            <button
                                                key={idx}
                                                type="button"
                                                onClick={() => setActiveImageIndex(idx)}
                                                className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer p-0 bg-black/40 ${
                                                    isSelected 
                                                        ? 'border-[#ff2150] shadow-lg shadow-[#ff2150]/30 scale-105 ring-2 ring-[#ff2150]/40' 
                                                        : 'border-white/10 hover:border-white/30 opacity-70 hover:opacity-100'
                                                }`}
                                                title={`View photo ${idx + 1}`}
                                            >
                                                <img 
                                                    src={url} 
                                                    alt={`Product photo ${idx + 1}`} 
                                                    className="w-full h-full object-cover" 
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).src = '/vite.svg';
                                                    }}
                                                />
                                                <span className="absolute bottom-0.5 right-0.5 px-1 rounded bg-black/70 text-[8px] text-white/90 font-mono">
                                                    #{idx + 1}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

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
                                    value={
                                        <div className="flex items-baseline gap-2 mt-1">
                                            <span className="text-2xl font-bold text-[#ff4b72] font-sans">
                                                ${price}
                                            </span>
                                            {mainPrice && mainPrice > price ? (
                                                <span className="text-white/40 text-sm line-through font-sans">
                                                    ${mainPrice}
                                                </span>
                                            ) : null}
                                        </div>
                                    } 
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

                            {/* Delivery, Discount & Dimensions */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <InfoBlock 
                                    label="Delivery Time" 
                                    icon={<FiTruck size={16} />} 
                                    value={deliveryTime} 
                                />
                                {discount > 0 ? (
                                    <InfoBlock 
                                        label="Discount" 
                                        icon={<FiDollarSign size={16} />} 
                                        value={`${discount}% OFF`} 
                                        valueClassName="text-green-400 font-bold mt-1" 
                                    />
                                ) : (
                                    <InfoBlock 
                                        label="Dimensions & Weight" 
                                        icon={<FiPackage size={16} />} 
                                        value={
                                            weight || length || width || height
                                                ? `${weight ?? 0}g (${length ?? 0}×${width ?? 0}×${height ?? 0}cm)`
                                                : 'Standard'
                                        } 
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
