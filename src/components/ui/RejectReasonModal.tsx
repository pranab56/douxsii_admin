import { useState } from 'react';
import { Modal } from 'antd';
import { IoCloseCircleOutline } from 'react-icons/io5';
import { getLoadingText } from '../../utils/loadingText';

interface RejectReasonModalProps {
    open: boolean;
    title?: string;
    description?: string;
    onConfirm: (reason: string) => void;
    onCancel: () => void;
    isLoading?: boolean;
}

export const RejectReasonModal = ({
    open,
    title = 'Reject Vendor Request',
    description = 'Are you sure you want to reject this request? Please specify a reason below.',
    onConfirm,
    onCancel,
    isLoading = false,
}: RejectReasonModalProps) => {
    const [reason, setReason] = useState('');

    const handleConfirm = () => {
        onConfirm(reason);
    };

    return (
        <Modal
            open={open}
            onCancel={isLoading ? undefined : onCancel}
            footer={null}
            closeIcon={null}
            centered
            width={440}
            styles={{
                content: {
                    background: '#46000B',
                    padding: '32px',
                    borderRadius: '16px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                },
                mask: {
                    backdropFilter: 'blur(4px)',
                }
            }}
        >
            <div className="flex flex-col items-center text-center relative font-sans">
                {/* Icon */}
                <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-[#ff2150] mb-4">
                    <IoCloseCircleOutline size={36} />
                </div>

                {/* Title */}
                <h3 className="text-white text-xl font-bold font-sans m-0">{title}</h3>

                {/* Description */}
                <p className="text-white/60 text-sm mt-2 leading-relaxed font-sans max-w-xs m-0">
                    {description}
                </p>

                {/* Reason Input */}
                <div className="w-full mt-4 text-left">
                    <label className="text-white/70 text-xs font-medium block mb-1.5">
                        Reason for Rejection <span className="text-white/40">(Optional)</span>
                    </label>
                    <textarea
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Enter the reason for rejection..."
                        rows={3}
                        className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-[#ff4b72] transition-colors resize-none font-sans"
                    />
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4 w-full mt-6">
                    <button
                        type="button"
                        disabled={isLoading}
                        onClick={onCancel}
                        className="flex-1 h-11 rounded-lg text-white font-medium border border-white/20 bg-transparent transition-all hover:bg-white/5 cursor-pointer outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        disabled={isLoading}
                        onClick={handleConfirm}
                        className="flex-1 h-11 rounded-lg text-white font-semibold transition-all active:scale-98 cursor-pointer border-0 outline-none flex items-center justify-center gap-2 bg-[#ff2150] hover:bg-[#ff2150]/90 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <>
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" />
                                {getLoadingText('Reject')}
                            </>
                        ) : (
                            'Reject'
                        )}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default RejectReasonModal;
