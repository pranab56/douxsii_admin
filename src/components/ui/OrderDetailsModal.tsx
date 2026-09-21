import { useState } from 'react';
import { Modal } from 'antd';
import { FiUser, FiShoppingBag, FiMapPin, FiCreditCard, FiGift, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';
import ModalHeader from './ModalHeader';
import InfoBlock from './InfoBlock';
import ConfirmModal from './ConfirmModal';
import { useGetSingleOrderQuery, useUpdateStatusMutation } from '../../features/shop/orderApi';
import LoadingSpinner from './LoadingSpinner';
import { baseURL } from '../../utils/BaseURL';

interface OrderDetailsModalProps {
    open: boolean;
    orderId: string | null;
    onClose: () => void;
}

export const OrderDetailsModal = ({ open, orderId, onClose }: OrderDetailsModalProps) => {
    const { data: singleOrderResponse, isLoading } = useGetSingleOrderQuery(orderId || '', {
        skip: !open || !orderId,
    });
    const [updateStatus, { isLoading: isUpdatingStatus }] = useUpdateStatusMutation();
    const [confirmAction, setConfirmAction] = useState<'accepted' | 'rejected' | null>(null);

    if (!orderId) return null;

    const orderData = singleOrderResponse?.data;

    const statusText = orderData?.status || 'Pending';
    const totalAmount = orderData?.totalAmount ?? 0;
    const orderDate = orderData?.orderDate ? new Date(orderData.orderDate).toLocaleString() : 'N/A';
    const paymentStatus = orderData?.paymentStatus || 'N/A';
    const giftStatus = orderData?.giftStatus || 'none';
    const giftAmount = orderData?.giftAmount;
    const products = orderData?.productList || [];
    const mainProductName = products[0]?.productId?.name || 'Order Item Details';

    const rawStatus = (orderData?.status || '').toLowerCase();
    const isAccepted = rawStatus === 'accepted';
    const isRejected = rawStatus === 'rejected';
    // Action has been taken ONLY if status is 'accepted' or 'rejected' (or cancelled)
    // Default incoming orders have status 'completed' (or 'pending'), where Admin CAN take action!
    const isActionTaken = isAccepted || isRejected || rawStatus === 'cancelled';

    // Address construction
    const address = [
        orderData?.address_line1,
        orderData?.city,
        orderData?.state_code,
        orderData?.postal_code,
        orderData?.country_code
    ].filter(Boolean).join(', ') || 'No address provided';

    const phone = orderData?.phone_number || 'N/A';

    const handleConfirmAction = async () => {
        if (!confirmAction || !orderId || isActionTaken) return;
        const target = confirmAction;
        try {
            const res = await updateStatus({ id: orderId, status: target }).unwrap();
            toast.success(res?.message || `Order status updated to ${target} successfully!`);
            setConfirmAction(null);
        } catch (err: any) {
            const errorMsg =
                err?.data?.message ||
                err?.data?.errorSources?.[0]?.message ||
                err?.message ||
                'Failed to update order status';
            toast.error(errorMsg);
        }
    };

    const handleCancelConfirm = () => {
        if (isUpdatingStatus) return;
        setConfirmAction(null);
    };

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
                <ModalHeader title="Order Details" onClose={onClose} />

                {isLoading ? (
                    <LoadingSpinner text="Fetching order details..." />
                ) : !orderData ? (
                    <div className="py-12 text-center text-white/50 text-base">
                        Order details not found.
                    </div>
                ) : (
                    <>
                        {/* Order Item Name, Date & Status Summary */}
                        <div className="flex items-center justify-between border-b border-white/5 pb-4">
                            <div>
                                <h3 className="text-white text-xl font-bold m-0 font-sans tracking-wide">
                                    {mainProductName}
                                </h3>
                                <div className="flex items-center gap-2 mt-2">
                                    <span 
                                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider inline-block ${
                                            isAccepted
                                                ? 'bg-green-500/10 text-[#10b981] border border-green-500/20' 
                                                : statusText.toLowerCase() === 'processing'
                                                ? 'bg-blue-500/10 text-[#38bdf8] border border-blue-500/20'
                                                : isRejected
                                                ? 'bg-red-500/10 text-[#ef4444] border border-red-500/20'
                                                : 'bg-yellow-500/10 text-[#fbbf24] border border-yellow-500/20'
                                        }`}
                                    >
                                        Status: {statusText}
                                    </span>
                                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-white/5 text-white/70 border border-white/10">
                                        Payment: {paymentStatus}
                                    </span>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="text-white/40 text-[11px] font-medium block">Order Date</span>
                                <span className="text-white text-sm font-semibold block mt-1 font-sans">
                                    {orderDate}
                                </span>
                            </div>
                        </div>

                        {/* Content Grid */}
                        <div className="flex flex-col gap-4">
                            {/* Customer info */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <InfoBlock 
                                    label="Customer Information" 
                                    icon={<FiUser size={16} />} 
                                    value={
                                        <div className="mt-1">
                                            <div className="text-white font-medium text-sm">Customer Order</div>
                                            <div className="text-white/40 text-xs mt-0.5">Phone: <span className="text-white font-sans">{phone}</span></div>
                                        </div>
                                    }
                                />
                                <InfoBlock 
                                    label="Vendor / Shop" 
                                    icon={<FiShoppingBag size={16} />} 
                                    value={
                                        <div className="mt-1">
                                            <div className="text-white font-medium text-sm">Verified Vendor</div>
                                            <div className="text-white/40 text-xs mt-0.5">Order Type: <span className="text-white capitalize">{giftStatus !== 'none' ? 'Gift Order' : 'Standard Purchase'}</span></div>
                                        </div>
                                    }
                                />
                            </div>

                            {/* Products List */}
                            <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02]">
                                <span className="text-white/50 text-xs font-semibold uppercase tracking-wider block mb-3">
                                    Ordered Products ({products.length})
                                </span>
                                <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                                    {products.map((item, idx) => {
                                        const prod = item.productId;
                                        const imagePath = prod?.images?.[0];
                                        const imageUrl = imagePath 
                                            ? (imagePath.startsWith('http') ? imagePath : `${baseURL}/${imagePath.replace(/\\/g, '/')}`)
                                            : null;

                                        return (
                                            <div key={item._id || idx} className="flex items-center justify-between gap-3 p-2.5 rounded-lg bg-white/[0.03]">
                                                <div className="flex items-center gap-3">
                                                    {imageUrl ? (
                                                        <img 
                                                            src={imageUrl} 
                                                            alt={prod?.name || 'Product'} 
                                                            className="w-10 h-10 rounded-lg object-cover bg-white/5 border border-white/10 shrink-0" 
                                                        />
                                                    ) : (
                                                        <div className="w-10 h-10 rounded-lg bg-[#ff4b72]/20 flex items-center justify-center text-[#ff4b72] shrink-0 font-bold text-xs">
                                                            🛍️
                                                        </div>
                                                    )}
                                                    <div>
                                                        <h5 className="text-white text-sm font-medium m-0 line-clamp-1">{prod?.name || 'Product'}</h5>
                                                        <span className="text-white/40 text-xs block mt-0.5">
                                                            Qty: {item.quantity ?? 1} × ${item.price ?? 0}
                                                        </span>
                                                    </div>
                                                </div>
                                                <span className="text-white font-bold text-sm shrink-0 font-sans">
                                                    ${(item.price ?? 0) * (item.quantity ?? 1)}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Delivery Address */}
                            <InfoBlock 
                                label="Delivery Address" 
                                icon={<FiMapPin size={16} />} 
                                value={address} 
                            />

                            {/* Payment Summary */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <InfoBlock 
                                    label="Total Amount" 
                                    icon={<FiCreditCard size={16} />} 
                                    value={`$${totalAmount}`} 
                                    valueClassName="text-xl font-bold mt-1 text-[#ff4b72] font-sans"
                                />
                                {giftStatus !== 'none' && (
                                    <InfoBlock 
                                        label="Gift Status" 
                                        icon={<FiGift size={16} />} 
                                        value={
                                            <div className="mt-1">
                                                <div className="text-white text-sm font-semibold capitalize">{giftStatus}</div>
                                                {giftAmount && <div className="text-white/40 text-xs mt-0.5">Amount: ${giftAmount}</div>}
                                            </div>
                                        } 
                                    />
                                )}
                            </div>

                            {/* Accept & Reject Actions or Finalized Status Message */}
                            <div className="pt-4 border-t border-white/10">
                                {isActionTaken ? (
                                    <div className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white/[0.03] border border-white/10 text-center">
                                        <span className="text-sm">🔒</span>
                                        <span className="text-white/60 text-sm font-medium">
                                            Status is finalized as <strong className="capitalize text-white font-semibold">{statusText}</strong>. No further action can be taken.
                                        </span>
                                    </div>
                                ) : (
                                    <div className="flex flex-col sm:flex-row items-center gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setConfirmAction('accepted')}
                                            disabled={isUpdatingStatus}
                                            className="w-full sm:flex-1 h-11 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 border-0 outline-none bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white shadow-lg shadow-emerald-900/30 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                                        >
                                            <FiCheckCircle size={16} />
                                            <span>Accept Order</span>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => setConfirmAction('rejected')}
                                            disabled={isUpdatingStatus}
                                            className="w-full sm:flex-1 h-11 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 border-0 outline-none bg-red-500/15 hover:bg-red-500/25 active:scale-95 text-red-400 border border-red-500/30 hover:border-red-500/50 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                                        >
                                            <FiXCircle size={16} />
                                            <span>Reject Order</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Permanent Action Confirmation Modal */}
            <ConfirmModal
                open={confirmAction !== null}
                title={confirmAction === 'accepted' ? 'Accept This Order?' : 'Reject This Order?'}
                description={
                    confirmAction === 'accepted'
                        ? 'WARNING: This action is PERMANENT. Once accepted, it cannot be undone, cancelled, or rejected later. Are you sure you want to proceed?'
                        : 'WARNING: This action is PERMANENT. Once rejected, it cannot be undone or accepted later. Are you sure you want to proceed?'
                }
                type={confirmAction === 'accepted' ? 'success' : 'danger'}
                confirmText={confirmAction === 'accepted' ? 'Yes, Accept' : 'Yes, Reject'}
                loadingText={confirmAction === 'accepted' ? 'Accepting...' : 'Rejecting...'}
                isLoading={isUpdatingStatus}
                onConfirm={handleConfirmAction}
                onCancel={handleCancelConfirm}
            />
        </Modal>
    );
};

export default OrderDetailsModal;
