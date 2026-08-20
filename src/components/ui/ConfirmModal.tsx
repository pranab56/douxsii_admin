import { Modal } from 'antd';
import { FiAlertTriangle } from 'react-icons/fi';
import { IoCloseCircleOutline } from 'react-icons/io5';

interface ConfirmModalProps {
    open: boolean;
    title: string;
    description: string;
    type: 'danger' | 'warning';
    onConfirm: () => void;
    onCancel: () => void;
    isLoading?: boolean;
    confirmText?: string;
}

export const ConfirmModal = ({ 
    open, 
    title, 
    description, 
    type, 
    onConfirm, 
    onCancel,
    isLoading = false,
    confirmText = 'Confirm',
}: ConfirmModalProps) => {
    return (
        <Modal
            open={open}
            onCancel={isLoading ? undefined : onCancel}
            footer={null}
            closeIcon={null}
            centered
            width={400}
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
            <div className="flex flex-col items-center text-center relative">
                {/* Icon */}
                <div className="mb-4">
                    {type === 'danger' ? (
                        <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-[#ff2150]">
                            <IoCloseCircleOutline size={36} />
                        </div>
                    ) : (
                        <div className="w-14 h-14 rounded-full bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-500">
                            <FiAlertTriangle size={30} />
                        </div>
                    )}
                </div>

                {/* Title */}
                <h3 className="text-white text-xl font-bold font-sans m-0">{title}</h3>

                {/* Description */}
                <p className="text-white/60 text-sm mt-3.5 leading-relaxed font-sans max-w-xs m-0">
                    {description}
                </p>

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
                        onClick={onConfirm}
                        className="flex-1 h-11 rounded-lg text-white font-semibold transition-all active:scale-98 cursor-pointer border-0 outline-none flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{
                            background: type === 'danger' ? '#ff2150' : '#ff9100'
                        }}
                    >
                        {isLoading ? (
                            <>
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" />
                                Deleting...
                            </>
                        ) : (
                            confirmText
                        )}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default ConfirmModal;
