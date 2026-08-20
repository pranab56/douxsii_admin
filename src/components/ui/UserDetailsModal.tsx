import { Modal } from 'antd';
import { FiMail, FiPhone, FiMapPin, FiGift, FiShoppingBag } from 'react-icons/fi';
import { User } from '../../pages/users/users.types';
import ModalHeader from './ModalHeader';
import InfoBlock from './InfoBlock';
import { useGetSingleUsersQuery } from '../../features/users/usersApi';
import LoadingSpinner from './LoadingSpinner';

interface UserDetailsModalProps {
    open: boolean;
    user: User | null;
    onClose: () => void;
    onBlockToggle: (user: User) => void;
}

export const UserDetailsModal = ({ open, user, onClose, onBlockToggle }: UserDetailsModalProps) => {
    const userId = user?._id || '';
    const { data: singleUserResponse, isLoading } = useGetSingleUsersQuery(userId, {
        skip: !open || !userId,
    });

    if (!user) return null;

    const singleData = singleUserResponse?.data;
    const userData = singleData?.result;

    const fullName = userData?.fullName || user.name || user.fullName || 'N/A';
    const email = userData?.email || user.email || 'N/A';
    const phone = userData?.phone || user.phone || 'N/A';
    const address = userData?.address || user.address || 'N/A';
    const role = userData?.role || user.role || 'user';
    const isActive = userData?.isActive !== undefined ? userData.isActive : user.isActive;
    const statusText = isActive ? 'Active' : 'Blocked';

    const totalOrders = singleData?.totalOrder ?? user.orders ?? 0;
    const giftsSent = singleData?.totalGiftSend ?? user.giftsSent ?? 0;
    const giftsReceived = singleData?.totalGiftReceived ?? user.giftsReceived ?? 0;
    const createdAt = userData?.createdAt || user.createdAt || '';
    const joined = createdAt ? new Date(createdAt).toLocaleDateString() : 'N/A';

    return (
        <Modal
            open={open}
            onCancel={onClose}
            footer={null}
            closeIcon={null}
            centered
            width={600}
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
                <ModalHeader title="User Details" onClose={onClose} />

                {isLoading ? (
                    <LoadingSpinner text="Fetching user details..." />
                ) : (
                    <>
                        {/* User Profile Summary */}
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-2xl bg-[#ff4b72]/15 border border-[#ff4b72]/20 flex items-center justify-center text-white text-2xl font-bold shrink-0 uppercase">
                                {fullName.charAt(0)}
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h3 className="text-white text-xl font-bold m-0 font-sans">{fullName}</h3>
                                    <span 
                                        className={`px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase ${
                                            isActive 
                                                ? 'bg-green-500/10 text-[#10b981] border border-green-500/20' 
                                                : 'bg-red-500/10 text-[#ef4444] border border-red-500/20'
                                        }`}
                                    >
                                        {statusText}
                                    </span>
                                </div>
                                <p className="text-white/40 text-xs m-0 mt-1 font-sans">
                                    Role: <span className="text-white/80 font-medium capitalize">{role}</span> • Joined: {joined}
                                </p>
                            </div>
                        </div>

                        {/* Content Grid */}
                        <div className="flex flex-col gap-4">
                            {/* Contact details row */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <InfoBlock label="Email" value={email} icon={<FiMail size={16} />} />
                                <InfoBlock label="Phone" value={phone} icon={<FiPhone size={16} />} />
                            </div>

                            {/* Address */}
                            <InfoBlock label="Address" value={address} icon={<FiMapPin size={16} />} />

                            {/* Numeric Stats Grid */}
                            <div className="grid grid-cols-3 gap-4">
                                {[
                                    { 
                                        label: 'Total Orders', 
                                        value: totalOrders, 
                                        icon: <FiShoppingBag className="text-[#ffa726]" size={16} />,
                                        bg: '#5A121D',
                                        border: 'rgba(255, 167, 38, 0.15)'
                                    },
                                    { 
                                        label: 'Gifts Sent', 
                                        value: giftsSent, 
                                        icon: <FiGift className="text-[#ff4081]" size={16} />,
                                        bg: '#591D1A',
                                        border: 'rgba(255, 64, 129, 0.15)'
                                    },
                                    { 
                                        label: 'Gifts Received', 
                                        value: giftsReceived, 
                                        icon: <FiGift className="text-[#00e676]" size={16} />,
                                        bg: '#293322',
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
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-4 mt-2">
                            <button
                                type="button"
                                onClick={() => onBlockToggle(user)}
                                className="w-full h-12 rounded-xl text-white font-semibold transition-all hover:opacity-90 active:scale-98 cursor-pointer border-0 outline-none"
                                style={{
                                    background: isActive ? '#ff2150' : '#10b981'
                                }}
                            >
                                {isActive ? 'Block User' : 'Unblock User'}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </Modal>
    );
};

export default UserDetailsModal;
