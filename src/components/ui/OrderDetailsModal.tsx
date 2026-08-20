import { Modal } from 'antd';
import { FiUser, FiShoppingBag, FiMapPin, FiCreditCard, FiGift } from 'react-icons/fi';
import ModalHeader from './ModalHeader';
import InfoBlock from './InfoBlock';
import { useSingleOrderQuery } from '../../features/orders/ordersApi';
import LoadingSpinner from './LoadingSpinner';
import { baseURL } from '../../utils/BaseURL';

interface OrderDetailsModalProps {
    open: boolean;
    orderId: string | null;
    onClose: () => void;
}

export const OrderDetailsModal = ({ open, orderId, onClose }: OrderDetailsModalProps) => {
    const { data: singleOrderResponse, isLoading } = useSingleOrderQuery(orderId || '', {
        skip: !open || !orderId,
    });

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

    // Address construction
    const address = [
        orderData?.address_line1,
        orderData?.city,
        orderData?.state_code,
        orderData?.postal_code,
        orderData?.country_code
    ].filter(Boolean).join(', ') || 'No address provided';

    const phone = orderData?.phone_number || 'N/A';

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
                                            statusText.toLowerCase() === 'delivered' 
                                                ? 'bg-green-500/10 text-[#10b981] border border-green-500/20' 
                                                : statusText.toLowerCase() === 'processing'
                                                ? 'bg-blue-500/10 text-[#38bdf8] border border-blue-500/20'
                                                : statusText.toLowerCase() === 'rejected'
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
                                                            Qty: {item.quantity} × ${item.price}
                                                        </span>
                                                    </div>
                                                </div>
                                                <span className="text-white font-bold text-sm shrink-0 font-sans">
                                                    ${item.price * item.quantity}
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
                        </div>
                    </>
                )}
            </div>
        </Modal>
    );
};

export default OrderDetailsModal;
