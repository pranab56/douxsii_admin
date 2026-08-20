import { Modal } from 'antd';
import { FiMail, FiPhone, FiMapPin, FiShoppingBag, FiDollarSign, FiClock, FiCheckCircle, FiStar } from 'react-icons/fi';
import { Vendor } from '../../pages/vendors/vendors.types';
import ModalHeader from './ModalHeader';
import InfoBlock from './InfoBlock';

interface VendorDetailsModalProps {
    open: boolean;
    vendor: Vendor | null;
    onClose: () => void;
    onStatusToggle: (vendor: Vendor, nextStatus: 'Approved' | 'Suspended') => void;
    onReject: (vendor: Vendor) => void;
}

export const VendorDetailsModal = ({ open, vendor, onClose, onStatusToggle, onReject }: VendorDetailsModalProps) => {
    if (!vendor) return null;

    // Set fallback rating star array
    const ratingValue = vendor.rating || 0;
    const fullStars = Math.floor(ratingValue);
    const hasHalfStar = ratingValue % 1 >= 0.5;

    return (
        <Modal
            open={open}
            onCancel={onClose}
            footer={null}
            closeIcon={null}
            centered
            width={600}
            modalRender={() => (
                <div 
                    className="p-6 rounded-2xl flex flex-col gap-6 relative border border-white/5"
                    style={{
                        background: '#46000B',
                    }}
                >
                    {/* Header */}
                    <ModalHeader title="Vendor Details" onClose={onClose} />

                    {/* Vendor Summary */}
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-[#ff4b72]/15 border border-[#ff4b72]/20 flex items-center justify-center text-white text-2xl font-bold shrink-0">
                            {vendor.avatarLetter}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="text-white text-xl font-bold m-0 font-sans">{vendor.storeName}</h3>
                                <span 
                                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                                        vendor.status === 'Approved' 
                                            ? 'bg-green-500/10 text-[#10b981] border border-green-500/20' 
                                            : vendor.status === 'Pending'
                                            ? 'bg-yellow-500/10 text-[#fbbf24] border border-yellow-500/20'
                                            : 'bg-red-500/10 text-[#ef4444] border border-red-500/20'
                                    }`}
                                >
                                    {vendor.status}
                                </span>
                            </div>
                            <p className="text-white/40 text-xs m-0 mt-1 font-sans">
                                Owned by {vendor.ownerName} • Joined: {vendor.joined}
                            </p>
                        </div>
                    </div>

                    {/* Details Content */}
                    <div className="flex flex-col gap-4">
                        {/* Contacts Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <InfoBlock label="Email" value={vendor.ownerEmail} icon={<FiMail size={16} />} />
                            <InfoBlock label="Phone" value={vendor.ownerPhone} icon={<FiPhone size={16} />} />
                        </div>

                        {/* Address and Hours Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <InfoBlock label="Business Address" value={vendor.address} icon={<FiMapPin size={16} />} />
                            <InfoBlock label="Working Hours" value={vendor.workingHours} icon={<FiClock size={16} />} />
                        </div>

                        {/* Stats Cards Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {[
                                { 
                                    label: 'Revenue', 
                                    value: `$${vendor.revenue.replace(/[^0-9.]/g, '') || '45,200'}`, 
                                    icon: <FiDollarSign className="text-[#ff4b72]" size={16} />,
                                    bg: '#5A121D',
                                    border: 'rgba(255, 75, 114, 0.15)'
                                },
                                { 
                                    label: 'Products', 
                                    value: vendor.productsCount, 
                                    icon: <FiShoppingBag className="text-[#ba68c8]" size={16} />,
                                    bg: '#4C1A30',
                                    border: 'rgba(186, 104, 200, 0.15)'
                                },
                                { 
                                    label: 'Pending Orders', 
                                    value: vendor.pendingOrders, 
                                    icon: <FiClock className="text-[#38bdf8]" size={16} />,
                                    bg: '#311F53',
                                    border: 'rgba(56, 189, 248, 0.15)'
                                },
                                { 
                                    label: 'Completed Orders', 
                                    value: vendor.completedOrders, 
                                    icon: <FiCheckCircle className="text-[#00e676]" size={16} />,
                                    bg: '#1A3020',
                                    border: 'rgba(0, 230, 118, 0.15)'
                                }
                            ].map((stat, idx) => (
                                <div 
                                    key={idx} 
                                    className="p-4 rounded-xl flex flex-col gap-1 border"
                                    style={{
                                        background: stat.bg,
                                        borderColor: stat.border
                                    }}
                                >
                                    <div className="flex items-center justify-between text-white/40">
                                        <span className="text-[11px] font-medium">{stat.label}</span>
                                        {stat.icon}
                                    </div>
                                    <span className="text-white text-lg font-bold mt-1 font-sans">{stat.value}</span>
                                </div>
                            ))}
                        </div>

                        {/* Customer Rating Box */}
                        <div className="p-4 rounded-xl flex items-center justify-between border border-white/[0.03] bg-white/[0.02]">
                            <div className="flex flex-col gap-1.5">
                                <span className="text-white/40 text-[11px] font-medium">Customer Rating</span>
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-0.5">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <FiStar 
                                                key={star} 
                                                size={15} 
                                                className={
                                                    star <= fullStars 
                                                        ? 'text-yellow-500 fill-yellow-500' 
                                                        : (star === fullStars + 1 && hasHalfStar) 
                                                        ? 'text-yellow-500 fill-yellow-500 opacity-50' 
                                                        : 'text-white/10'
                                                }
                                            />
                                        ))}
                                    </div>
                                    <span className="text-white text-base font-bold font-sans mt-0.5">
                                        {vendor.rating ? vendor.rating.toFixed(1) : 'No reviews'}
                                    </span>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="text-white/40 text-[11px] font-medium block">Total Reviews</span>
                                <span className="text-white text-base font-bold font-sans block mt-1">{vendor.totalReviews}</span>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-4 mt-2">
                        {vendor.status === 'Pending' ? (
                            <>
                                <button
                                    onClick={() => onStatusToggle(vendor, 'Approved')}
                                    className="flex-1 h-12 rounded-xl text-white font-semibold transition-all hover:opacity-90 active:scale-98 cursor-pointer border-0 outline-none"
                                    style={{ background: '#ffa700' }}
                                >
                                    Approve
                                </button>
                                <button
                                    onClick={() => onReject(vendor)}
                                    className="flex-1 h-12 rounded-xl text-white font-semibold transition-all hover:bg-white/5 active:scale-98 cursor-pointer border border-white/10 bg-transparent outline-none"
                                >
                                    Reject
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={() => onStatusToggle(vendor, vendor.status === 'Approved' ? 'Suspended' : 'Approved')}
                                    className="flex-1 h-12 rounded-xl text-white font-semibold transition-all hover:opacity-90 active:scale-98 cursor-pointer border-0 outline-none"
                                    style={{
                                        background: vendor.status === 'Approved' ? '#ff2150' : '#ffa700'
                                    }}
                                >
                                    {vendor.status === 'Approved' ? 'Suspend' : 'Activate'}
                                </button>
                                <button
                                    onClick={() => onReject(vendor)}
                                    className="flex-1 h-12 rounded-xl text-white font-semibold transition-all hover:bg-white/5 active:scale-98 cursor-pointer border border-white/10 bg-transparent outline-none"
                                >
                                    Reject
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        />
    );
};

export default VendorDetailsModal;
