import { useState } from 'react';
import {
    FiEdit2,
    FiShoppingBag,
    FiGlobe,
    FiPhone,
    FiMapPin,
    FiClock,
    FiFileText,
    FiPlus,
    FiShoppingCart,
    FiBox,
    FiPieChart,
} from 'react-icons/fi';
import { Link } from 'react-router-dom';
import PageHeader from '../../components/ui/PageHeader';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Toast from '../../components/ui/Toast';
import ShopFormModal from '../../components/ui/ShopFormModal';
import { useGetMyProfileQuery, ShopInfo } from '../../features/profile/profileApi';
import { baseURL } from '../../utils/BaseURL';

const MyShop = () => {
    const { data: profileResponse, isLoading } = useGetMyProfileQuery();
    const shopData: ShopInfo | null | undefined = profileResponse?.data?.result?.shopId;
    const hasShop = Boolean(shopData && (shopData._id || shopData.name));

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [toast, setToast] = useState('');

    const showToast = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(''), 3000);
    };

    const getImageUrl = (url?: string) => {
        if (!url) return '';
        if (url.startsWith('http://') || url.startsWith('https://')) return url;
        const cleanPath = url.replace(/\\/g, '/');
        return `${baseURL}/${cleanPath.startsWith('/') ? cleanPath.slice(1) : cleanPath}`;
    };

    if (isLoading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <LoadingSpinner text="Loading shop details..." />
            </div>
        );
    }

    // ===================== NO SHOP — CREATE VIEW =====================
    if (!hasShop) {
        return (
            <div className="space-y-6 pb-8">
                <PageHeader
                    title="My Shop"
                    subtitle="Set up your store to start managing products and orders."
                />

                <div
                    className="flex flex-col items-center justify-center py-20 rounded-2xl text-center"
                    style={{
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                    }}
                >
                    <div
                        className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 shadow-lg"
                        style={{ background: 'linear-gradient(135deg, #46000B, #6B000F)' }}
                    >
                        <FiShoppingBag size={36} className="text-white" />
                    </div>

                    <h2 className="text-white text-2xl font-bold m-0">You don't have a shop yet</h2>
                    <p className="text-white/50 text-sm mt-2 max-w-md">
                        Create your shop to start listing products, receiving orders, and managing your business from this dashboard.
                    </p>

                    <button
                        onClick={() => setIsFormOpen(true)}
                        className="mt-8 h-12 px-8 rounded-xl text-white font-semibold text-sm flex items-center gap-2.5 transition-all hover:opacity-90 active:scale-95 shadow-lg cursor-pointer border-0"
                        style={{ background: 'linear-gradient(135deg, #46000B, #8B0015)' }}
                    >
                        <FiPlus size={18} />
                        Create Your Shop
                    </button>
                </div>

                {/* Create Shop Modal */}
                <ShopFormModal
                    open={isFormOpen}
                    initialData={null}
                    onClose={() => setIsFormOpen(false)}
                    onSuccess={(msg) => showToast(msg)}
                />
                <Toast message={toast} />
            </div>
        );
    }

    // ===================== HAS SHOP — DETAIL VIEW =====================
    const shopImage = getImageUrl(shopData?.image);
    const tradeLicenseUrl = getImageUrl(shopData?.tradeLicense);

    const infoRows = [
        { icon: <FiShoppingBag size={16} />, label: 'Business Name', value: shopData?.businessName || 'N/A' },
        { icon: <FiGlobe size={16} />, label: 'Website', value: shopData?.website || 'N/A', isLink: Boolean(shopData?.website) },
        { icon: <FiPhone size={16} />, label: 'Phone', value: shopData?.phone || 'N/A' },
        { icon: <FiMapPin size={16} />, label: 'Address', value: shopData?.address || 'N/A' },
        { icon: <FiClock size={16} />, label: 'Working Hours', value: shopData?.workingHours || 'N/A' },
    ];

    return (
        <div className="space-y-6 pb-8">
            <PageHeader
                title="My Shop"
                subtitle="Manage your store details, products, and orders."
                extra={
                    <div className="flex items-center gap-3">
                        <Link
                            to="/shop/overview"
                            className="h-10 px-4 rounded-xl text-white font-medium text-xs sm:text-sm flex items-center gap-2 transition-all hover:opacity-90 cursor-pointer border border-white/15 no-underline shadow-sm"
                            style={{ background: '#560e18' }}
                        >
                            <FiPieChart size={16} />
                            <span>Overview</span>
                        </Link>
                        <Link
                            to="/shop/orders"
                            className="h-10 px-4 rounded-xl text-white font-medium text-xs sm:text-sm flex items-center gap-2 transition-all hover:opacity-90 cursor-pointer border border-white/15 no-underline shadow-sm"
                            style={{ background: '#560e18' }}
                        >
                            <FiShoppingCart size={16} />
                            <span>Orders</span>
                        </Link>
                        <Link
                            to="/shop/products"
                            className="h-10 px-4 rounded-xl text-white font-medium text-xs sm:text-sm flex items-center gap-2 transition-all hover:opacity-90 cursor-pointer border border-white/15 no-underline shadow-sm"
                            style={{ background: '#560e18' }}
                        >
                            <FiBox size={16} />
                            <span>Products</span>
                        </Link>
                    </div>
                }
            />

            {/* Shop Card */}
            <div
                className="rounded-2xl overflow-hidden"
                style={{
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                }}
            >
                {/* Card Header (Logo, Name, Edit Button) */}
                <div className="p-6 sm:p-8 pb-6 border-b border-white/10">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 justify-between">
                        <div className="flex items-center gap-5 min-w-0">
                            {/* Avatar */}
                            <div
                                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 shrink-0 flex items-center justify-center shadow-lg"
                                style={{
                                    borderColor: 'rgba(255, 255, 255, 0.15)',
                                    background: shopImage ? 'transparent' : 'linear-gradient(135deg, #46000B, #6B000F)',
                                }}
                            >
                                {shopImage ? (
                                    <img src={shopImage} alt={shopData?.name} className="w-full h-full object-cover" />
                                ) : (
                                    <FiShoppingBag size={36} className="text-white/70" />
                                )}
                            </div>

                            {/* Title & Description */}
                            <div className="min-w-0">
                                <h2 className="text-white text-2xl font-bold m-0 truncate">{shopData?.name || 'Unnamed Shop'}</h2>
                                {shopData?.businessName && (
                                    <p className="text-white/60 text-sm font-medium mt-1 mb-0">{shopData.businessName}</p>
                                )}
                                {shopData?.description && (
                                    <p className="text-white/40 text-xs sm:text-sm mt-1.5 m-0 line-clamp-2">{shopData.description}</p>
                                )}
                            </div>
                        </div>

                        {/* Edit Button */}
                        <button
                            onClick={() => setIsFormOpen(true)}
                            className="h-10 px-5 rounded-xl text-white text-xs font-semibold flex items-center gap-2 transition-all hover:opacity-90 active:scale-95 cursor-pointer shrink-0"
                            style={{
                                background: 'linear-gradient(135deg, #46000B, #8B0015)',
                                border: '1px solid rgba(255, 255, 255, 0.15)',
                            }}
                        >
                            <FiEdit2 size={14} />
                            Edit Shop
                        </button>
                    </div>
                </div>

                {/* Detail Rows */}
                <div className="px-6 sm:px-8 pb-6 pt-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {infoRows.map((row, idx) => (
                            <div
                                key={idx}
                                className="flex items-start gap-3 p-4 rounded-xl transition-colors"
                                style={{
                                    background: 'rgba(255, 255, 255, 0.02)',
                                    border: '1px solid rgba(255, 255, 255, 0.06)',
                                }}
                            >
                                <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 text-[#ff4b72] bg-[#ff4b72]/10">
                                    {row.icon}
                                </div>
                                <div className="min-w-0">
                                    <span className="block text-[11px] text-white/40 font-medium uppercase tracking-wider">{row.label}</span>
                                    {row.isLink ? (
                                        <a
                                            href={row.value.startsWith('http') ? row.value : `https://${row.value}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm text-[#60a5fa] font-medium hover:underline truncate block mt-0.5"
                                        >
                                            {row.value}
                                        </a>
                                    ) : (
                                        <span className="text-sm text-white/80 font-medium truncate block mt-0.5">{row.value}</span>
                                    )}
                                </div>
                            </div>
                        ))}

                        {/* Coordinates */}
                        {(shopData?.latitude || shopData?.longitude) && (
                            <div
                                className="flex items-start gap-3 p-4 rounded-xl transition-colors"
                                style={{
                                    background: 'rgba(255, 255, 255, 0.02)',
                                    border: '1px solid rgba(255, 255, 255, 0.06)',
                                }}
                            >
                                <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 text-[#ff4b72] bg-[#ff4b72]/10">
                                    <FiMapPin size={16} />
                                </div>
                                <div className="min-w-0">
                                    <span className="block text-[11px] text-white/40 font-medium uppercase tracking-wider">Coordinates</span>
                                    <span className="text-sm text-white/80 font-medium mt-0.5 block">
                                        {shopData?.latitude || '—'}, {shopData?.longitude || '—'}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Trade License */}
                    {tradeLicenseUrl && (
                        <div className="mt-4">
                            <div
                                className="flex items-center gap-3 p-4 rounded-xl"
                                style={{
                                    background: 'rgba(255, 255, 255, 0.02)',
                                    border: '1px solid rgba(255, 255, 255, 0.06)',
                                }}
                            >
                                <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 text-emerald-400 bg-emerald-400/10">
                                    <FiFileText size={16} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <span className="block text-[11px] text-white/40 font-medium uppercase tracking-wider">Trade License</span>
                                    <a
                                        href={tradeLicenseUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-[#60a5fa] font-medium hover:underline truncate block mt-0.5"
                                    >
                                        View Trade License Document
                                    </a>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Edit Shop Modal */}
            <ShopFormModal
                open={isFormOpen}
                initialData={shopData}
                onClose={() => setIsFormOpen(false)}
                onSuccess={(msg) => showToast(msg)}
            />
            <Toast message={toast} />
        </div>
    );
};

export default MyShop;
