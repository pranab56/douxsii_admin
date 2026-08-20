import { Modal } from 'antd';
import { FiMail, FiPhone, FiMapPin, FiStar, FiUserCheck } from 'react-icons/fi';
import ModalHeader from './ModalHeader';
import InfoBlock from './InfoBlock';
import { SupportMember } from '../../features/support_team/supportApi';
import { baseURL } from '../../utils/BaseURL';

interface SupportDetailsModalProps {
    open: boolean;
    member: SupportMember | null;
    onClose: () => void;
}

export const SupportDetailsModal = ({ open, member, onClose }: SupportDetailsModalProps) => {
    if (!member) return null;

    const fullName = member.fullName || 'N/A';
    const email = member.email || 'N/A';
    const phone = member.phone || 'N/A';
    const address = member.address?.trim() ? member.address : 'N/A';
    const roleText = member.role === 'support_manager' ? 'Support Manager' : member.role === 'support_agent' ? 'Support Agent' : (member.role || 'Support Member');
    const statusText = (member.agentStatus || (member.isOnline ? 'online' : 'offline')).toLowerCase();
    const ratingVal = member.ratings ?? member.rating ?? 0;
    const createdAt = member.createdAt ? new Date(member.createdAt).toLocaleDateString() : 'N/A';

    const rawPic = member.profile;
    const avatarSrc = rawPic 
        ? (rawPic.startsWith('http') ? rawPic : `${baseURL}/${rawPic.replace(/\\/g, '/')}`)
        : null;

    return (
        <Modal
            open={open}
            onCancel={onClose}
            footer={null}
            closeIcon={null}
            centered
            width={540}
            styles={{
                content: {
                    background: '#46000B',
                    padding: '24px',
                    borderRadius: '16px',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                },
                mask: {
                    backdropFilter: 'blur(4px)',
                    background: 'rgba(0, 0, 0, 0.6)',
                }
            }}
        >
            <div className="flex flex-col gap-6 relative">
                {/* Header */}
                <ModalHeader title="Support Member Details" onClose={onClose} />

                {/* Summary Header */}
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-[#ff4b72]/15 border-2 border-[#ff4b72]/30 flex items-center justify-center text-white text-2xl font-bold shrink-0 overflow-hidden">
                        {avatarSrc ? (
                            <img src={avatarSrc} alt={fullName} className="w-full h-full object-cover" />
                        ) : (
                            fullName.charAt(0) || 'S'
                        )}
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="text-white text-xl font-bold m-0 font-sans">{fullName}</h3>
                            <span 
                                className={`px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${
                                    statusText === 'online'
                                        ? 'bg-emerald-500/15 text-[#10b981] border border-emerald-500/20'
                                        : statusText === 'busy'
                                        ? 'bg-amber-500/15 text-[#fbbf24] border border-amber-500/20'
                                        : 'bg-white/10 text-white/50 border border-white/10'
                                }`}
                            >
                                {statusText}
                            </span>
                        </div>
                        <p className="text-white/50 text-xs m-0 mt-1 font-sans">
                            Role: <span className="text-white font-medium">{roleText}</span> • Joined: {createdAt}
                        </p>
                    </div>
                </div>

                {/* Details Grid */}
                <div className="flex flex-col gap-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <InfoBlock label="Email" value={email} icon={<FiMail size={16} />} />
                        <InfoBlock label="Phone Number" value={phone} icon={<FiPhone size={16} />} />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <InfoBlock label="Role Title" value={roleText} icon={<FiUserCheck size={16} />} />
                        <InfoBlock label="Average Rating" value={`${ratingVal} / 5`} icon={<FiStar className="text-[#fbbf24]" size={16} />} />
                    </div>

                    <InfoBlock label="Address" value={address} icon={<FiMapPin size={16} />} />
                </div>

                {/* Close Button */}
                <div className="flex justify-end mt-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="h-11 px-6 rounded-xl text-white font-semibold text-sm transition-all hover:bg-white/10 active:scale-98 cursor-pointer border border-white/20 outline-none"
                    >
                        Close
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default SupportDetailsModal;
