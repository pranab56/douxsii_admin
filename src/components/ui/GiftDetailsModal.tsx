import { Modal } from 'antd';
import { FiUser, FiCalendar, FiMessageSquare } from 'react-icons/fi';
import ModalHeader from './ModalHeader';

export interface UnifiedGiftDetail {
    giftId: string;
    status: string;
    amount: number;
    senderName: string;
    senderEmail?: string;
    receiverName: string;
    receiverEmail?: string;
    sentDate: string;
    message?: string;
    imageUrl?: string;
}

interface GiftDetailsModalProps {
    open: boolean;
    gift: UnifiedGiftDetail | null;
    onClose: () => void;
}

export const GiftDetailsModal = ({ open, gift, onClose }: GiftDetailsModalProps) => {
    if (!gift) return null;

    const statusText = gift.status || 'pending';

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
                <ModalHeader title="Gift Details" onClose={onClose} />

                {/* Gift Image (Center Top) */}
                {gift.imageUrl ? (
                    <div className="flex justify-center">
                        <img 
                            src={gift.imageUrl} 
                            alt="Gift Item" 
                            className="w-40 h-40 rounded-2xl object-cover border border-white/10 shadow-lg" 
                        />
                    </div>
                ) : (
                    <div className="flex justify-center">
                        <div className="w-24 h-24 rounded-2xl bg-[#ff4b72]/20 flex items-center justify-center text-4xl border border-white/10 shadow-lg">
                            🎁
                        </div>
                    </div>
                )}

                {/* Gift ID & Amount Banner */}
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-white text-2xl font-bold m-0 font-sans tracking-wide">
                            {gift.giftId}
                        </h3>
                        <span 
                            className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider inline-block mt-2 ${
                                statusText.toLowerCase() === 'redeemed' 
                                    ? 'bg-green-500/20 text-[#10b981] border border-green-500/30' 
                                    : 'bg-yellow-500/20 text-[#fbbf24] border border-yellow-500/30'
                            }`}
                        >
                            {statusText}
                        </span>
                    </div>

                    <div className="text-right">
                        <span className="text-white/40 text-xs font-medium block">Gift Amount</span>
                        <span className="text-white text-3xl font-bold block mt-0.5 font-sans">
                            ${gift.amount}
                        </span>
                    </div>
                </div>

                {/* 3-Column Info Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Sender */}
                    <div className="p-4 rounded-xl border border-white/10 bg-white/[0.03] flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-[#ff4b72] text-xs font-medium">
                            <FiUser size={14} />
                            <span>Sender</span>
                        </div>
                        <span className="text-white font-semibold text-sm mt-1">{gift.senderName}</span>
                        {gift.senderEmail && (
                            <span className="text-white/40 text-xs truncate">{gift.senderEmail}</span>
                        )}
                    </div>

                    {/* Sent Date */}
                    <div className="p-4 rounded-xl border border-white/10 bg-white/[0.03] flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-[#38bdf8] text-xs font-medium">
                            <FiCalendar size={14} />
                            <span>Sent Date</span>
                        </div>
                        <span className="text-white font-semibold text-sm mt-1 font-sans">{gift.sentDate}</span>
                    </div>

                    {/* Receiver */}
                    <div className="p-4 rounded-xl border border-white/10 bg-white/[0.03] flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-[#10b981] text-xs font-medium">
                            <FiUser size={14} />
                            <span>Receiver</span>
                        </div>
                        <span className="text-white font-semibold text-sm mt-1">{gift.receiverName}</span>
                        {gift.receiverEmail && (
                            <span className="text-white/40 text-xs truncate">{gift.receiverEmail}</span>
                        )}
                    </div>
                </div>

                {/* Gift Message Card */}
                <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02] flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-white/50 text-xs font-medium">
                        <FiMessageSquare size={14} />
                        <span>Gift Message</span>
                    </div>
                    <p className="text-white/90 text-sm font-medium italic m-0">
                        "{gift.message || 'No message attached to this gift.'}"
                    </p>
                </div>
            </div>
        </Modal>
    );
};

export default GiftDetailsModal;
