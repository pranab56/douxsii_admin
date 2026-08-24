import { Modal } from 'antd';
import { FiMail, FiPhone, FiMapPin, FiClock, FiGlobe, FiFileText, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import ModalHeader from './ModalHeader';
import InfoBlock from './InfoBlock';
import { baseURL } from '../../utils/BaseURL';

export interface ShopRequest {
    _id: string;
    userId?: {
        _id?: string;
        profile?: string;
        fullName?: string;
        email?: string;
    } | string;
    name: string;
    businessName?: string;
    description?: string;
    website?: string;
    phone?: string;
    tradeLicense?: string;
    image?: string;
    address?: string;
    latitude?: number;
    longitude?: number;
    workingHours?: string;
    status: 'pending' | 'approved' | 'rejected' | string;
    isDeleted?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

interface ShopRequestDetailsModalProps {
    open: boolean;
    request: ShopRequest | null;
    onClose: () => void;
    onApprove: (request: ShopRequest) => void;
    onReject: (request: ShopRequest) => void;
}

export const ShopRequestDetailsModal = ({
    open,
    request,
    onClose,
    onApprove,
    onReject,
}: ShopRequestDetailsModalProps) => {
    if (!request) return null;

    const ownerName = typeof request.userId === 'object' && request.userId?.fullName
        ? request.userId.fullName
        : request.name || 'N/A';

    const ownerEmail = typeof request.userId === 'object' && request.userId?.email
        ? request.userId.email
        : 'N/A';

    const getImageUrl = (url?: string) => {
        if (!url) return '';
        if (url.startsWith('http://') || url.startsWith('https://')) return url;
        const cleanPath = url.replace(/\\/g, '/');
        return `${baseURL}/${cleanPath.startsWith('/') ? cleanPath.slice(1) : cleanPath}`;
    };

    const logoUrl = getImageUrl(request.image);
    const tradeLicenseUrl = getImageUrl(request.tradeLicense);

    return (
        <Modal
            open={open}
            onCancel={onClose}
            footer={null}
            closeIcon={null}
            centered
            width={580}
            styles={{
                content: {
                    background: '#46000B',
                    padding: '16px 20px',
                    borderRadius: '16px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    maxHeight: '88vh',
                    display: 'flex',
                    flexDirection: 'column',
                },
                mask: {
                    backdropFilter: 'blur(4px)',
                }
            }}
        >
            <div className="flex flex-col gap-3 relative font-sans max-h-[82vh] overflow-y-auto pr-1 custom-scrollbar">
                {/* Header */}
                <ModalHeader title="Shop Request Details" onClose={onClose} />

                {/* Shop Summary */}
                <div className="flex items-center gap-3 p-3 rounded-xl border border-white/10 bg-white/[0.03]">
                    {logoUrl ? (
                        <img
                            src={logoUrl}
                            alt={request.name}
                            className="w-12 h-12 rounded-xl object-cover border border-[#ff4b72]/30 shrink-0"
                            onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none';
                            }}
                        />
                    ) : null}
                    {!logoUrl && (
                        <div className="w-12 h-12 rounded-xl bg-[#ff4b72]/20 border border-[#ff4b72]/30 flex items-center justify-center text-white text-xl font-bold shrink-0 uppercase">
                            {request.name ? request.name.charAt(0) : 'S'}
                        </div>
                    )}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-white text-lg font-bold m-0 tracking-tight truncate">
                                {request.name}
                            </h3>
                            <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                                    request.status === 'approved'
                                        ? 'bg-green-500/10 text-[#10b981] border border-green-500/20'
                                        : request.status === 'pending'
                                        ? 'bg-yellow-500/10 text-[#fbbf24] border border-yellow-500/20'
                                        : 'bg-red-500/10 text-[#ef4444] border border-red-500/20'
                                }`}
                            >
                                {request.status}
                            </span>
                        </div>
                        {request.businessName && (
                            <p className="text-white/60 text-xs m-0 mt-0.5 font-medium">
                                Business: {request.businessName}
                            </p>
                        )}
                        <p className="text-white/40 text-[11px] m-0 mt-0.5">
                            Submitted on: {request.createdAt ? new Date(request.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                        </p>
                    </div>
                </div>

                {/* Details Grid */}
                <div className="flex flex-col gap-2.5">
                    {/* Owner Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <InfoBlock label="Owner Name" value={ownerName} icon={<FiFileText size={15} />} />
                        <InfoBlock label="Owner Email" value={ownerEmail} icon={<FiMail size={15} />} />
                    </div>

                    {/* Contacts & Working Hours */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <InfoBlock label="Phone Number" value={request.phone || 'N/A'} icon={<FiPhone size={15} />} />
                        <InfoBlock label="Working Hours" value={request.workingHours || 'N/A'} icon={<FiClock size={15} />} />
                    </div>

                    {/* Address & Website */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <InfoBlock label="Address" value={request.address || 'N/A'} icon={<FiMapPin size={15} />} />
                        <InfoBlock
                            label="Website"
                            value={request.website ? (
                                <a
                                    href={request.website.startsWith('http') ? request.website : `https://${request.website}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-[#38bdf8] hover:underline"
                                >
                                    {request.website}
                                </a>
                            ) : 'N/A'}
                            icon={<FiGlobe size={15} />}
                        />
                    </div>

                    {/* Coordinates */}
                    {(request.latitude || request.longitude) && (
                        <div className="grid grid-cols-2 gap-2.5">
                            <InfoBlock label="Latitude" value={request.latitude?.toString() || 'N/A'} icon={<FiMapPin size={15} />} />
                            <InfoBlock label="Longitude" value={request.longitude?.toString() || 'N/A'} icon={<FiMapPin size={15} />} />
                        </div>
                    )}

                    {/* Description */}
                    {request.description && (
                        <div className="p-3 rounded-xl border border-white/10 bg-white/[0.02]">
                            <span className="text-white/40 text-[11px] block mb-0.5 font-medium">Description</span>
                            <p className="text-white text-xs m-0 leading-relaxed font-sans">{request.description}</p>
                        </div>
                    )}

                    {/* Trade License Section */}
                    {request.tradeLicense && (
                        <div className="p-3 rounded-xl border border-white/10 bg-white/[0.02] flex flex-col gap-2">
                            <span className="text-white/40 text-[11px] block font-medium">Trade License Document</span>
                            <div className="flex items-center gap-3 flex-wrap">
                                {tradeLicenseUrl && (tradeLicenseUrl.endsWith('.png') || tradeLicenseUrl.endsWith('.jpg') || tradeLicenseUrl.endsWith('.jpeg') || tradeLicenseUrl.endsWith('.webp')) ? (
                                    <img
                                        src={tradeLicenseUrl}
                                        alt="Trade License"
                                        className="h-16 rounded-lg object-cover border border-white/20 max-w-full cursor-pointer transition-transform hover:scale-[1.02]"
                                        onClick={() => window.open(tradeLicenseUrl, '_blank')}
                                    />
                                ) : null}
                                <a
                                    href={tradeLicenseUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="px-3 py-1.5 rounded-lg bg-[#ff4b72]/20 hover:bg-[#ff4b72]/30 text-[#ff4b72] text-xs font-semibold border border-[#ff4b72]/40 transition-all inline-flex items-center gap-1.5"
                                >
                                    <FiFileText size={14} /> View Document
                                </a>
                            </div>
                        </div>
                    )}
                </div>

                {/* Actions inside modal if pending */}
                {request.status === 'pending' && (
                    <div className="flex items-center gap-3 mt-1 pt-1">
                        <button
                            type="button"
                            onClick={() => {
                                onClose();
                                onApprove(request);
                            }}
                            className="flex-1 h-10 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90 active:scale-98 cursor-pointer border-0 outline-none flex items-center justify-center gap-1.5"
                            style={{ background: '#10b981' }}
                        >
                            <FiCheckCircle size={16} /> Approve Request
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                onClose();
                                onReject(request);
                            }}
                            className="flex-1 h-10 rounded-xl text-white text-sm font-semibold transition-all hover:bg-red-500/20 active:scale-98 cursor-pointer border border-red-500/30 bg-red-500/10 outline-none flex items-center justify-center gap-1.5 text-[#ef4444]"
                        >
                            <FiXCircle size={16} /> Reject Request
                        </button>
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default ShopRequestDetailsModal;
