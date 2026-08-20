import { Modal } from 'antd';
import { FiMail, FiCalendar, FiMapPin, FiStar } from 'react-icons/fi';
import ModalHeader from './ModalHeader';
import InfoBlock from './InfoBlock';
import { ProductPromotionItem } from '../../features/advertisement/advertisementApi';
import { baseURL } from '../../utils/BaseURL';

interface CampaignDetailsModalProps {
    open: boolean;
    campaign: ProductPromotionItem | null;
    onClose: () => void;
}

const STATUS_STYLES: Record<string, { bg: string; text: string; border: string }> = {
    active:   { bg: 'bg-green-500/10',  text: 'text-[#10b981]', border: 'border-green-500/20' },
    approved: { bg: 'bg-green-500/10',  text: 'text-[#10b981]', border: 'border-green-500/20' },
    expired:  { bg: 'bg-yellow-500/10', text: 'text-[#fbbf24]', border: 'border-yellow-500/20' },
    pending:  { bg: 'bg-blue-500/10',   text: 'text-[#38bdf8]', border: 'border-blue-500/20' },
    rejected: { bg: 'bg-red-500/10',    text: 'text-[#ef4444]', border: 'border-red-500/20' },
};

export const CampaignDetailsModal = ({ open, campaign, onClose }: CampaignDetailsModalProps) => {
    if (!campaign) return null;
    const statusKey = (campaign.status || 'pending').toLowerCase();
    const s = STATUS_STYLES[statusKey] ?? STATUS_STYLES['pending'];

    const rawPic = campaign.productId?.images?.[0];
    const imageSrc = rawPic 
        ? (rawPic.startsWith('http') ? rawPic : `${baseURL}/${rawPic.replace(/\\/g, '/')}`)
        : '/user.svg';

    const title = campaign.title || campaign.productId?.name || 'Special Product Promotion';
    const placement = campaign.selectedPlacement ? campaign.selectedPlacement.replace(/_/g, ' ') : 'Homepage Banner';
    const price = campaign.productId?.price ?? 0;

    return (
        <Modal
            open={open}
            onCancel={onClose}
            footer={null}
            closeIcon={null}
            centered
            width={580}
            modalRender={() => (
                <div
                    className="p-6 rounded-2xl flex flex-col gap-5 border border-white/5"
                    style={{ background: '#46000B' }}
                >
                    <ModalHeader title="Campaign Details" onClose={onClose} />

                    {/* Campaign Card Preview */}
                    <div
                        className="rounded-xl p-3 border border-white/[0.06]"
                        style={{ background: 'rgba(255,255,255,0.03)' }}
                    >
                        <p className="text-white/40 text-[10px] font-medium uppercase tracking-wider mb-2">
                            Campaign Card Preview
                        </p>
                        <div className="flex items-center gap-4">
                            <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-[#560e18]">
                                <img
                                    src={imageSrc}
                                    alt={title}
                                    className="w-full h-full object-cover"
                                    onError={(e) => { (e.target as HTMLImageElement).src = '/user.svg'; }}
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <span className="text-[10px] font-bold bg-white/10 text-white/60 px-2 py-0.5 rounded uppercase tracking-wider">
                                    SPONSORED
                                </span>
                                <p className="text-white font-bold text-sm mt-1 truncate">{title}</p>
                                <p className="text-white/50 text-xs mt-0.5 truncate">{campaign.message || campaign.productId?.name}</p>
                                <div className="flex items-center justify-between mt-1.5">
                                    <div className="flex items-center gap-1">
                                        <FiStar size={11} className="text-[#fbbf24]" />
                                        <span className="text-white/60 text-xs">5.0 (Review)</span>
                                    </div>
                                    <span className="text-white font-bold text-sm">${price}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ID + Status + Revenue row */}
                    <div className="grid grid-cols-3 gap-4">
                        <div
                            className="p-4 rounded-xl flex flex-col gap-1 border border-white/[0.05]"
                            style={{ background: 'rgba(255,255,255,0.03)' }}
                        >
                            <p className="text-white/40 text-[11px] font-medium">ID</p>
                            <p className="text-white font-bold text-sm font-mono">#{campaign._id ? campaign._id.slice(-6) : 'N/A'}</p>
                            <span className={`mt-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border self-start ${s.bg} ${s.text} ${s.border}`}>
                                {campaign.status}
                            </span>
                        </div>
                        <div
                            className="p-4 rounded-xl flex flex-col gap-1 border border-white/[0.05]"
                            style={{ background: 'rgba(255,255,255,0.03)' }}
                        >
                            <p className="text-white/40 text-[11px] font-medium">Product Price</p>
                            <p className="text-white font-bold text-xl font-sans mt-1">${price}</p>
                        </div>
                        <div
                            className="p-4 rounded-xl flex flex-col gap-1 border border-white/[0.05]"
                            style={{ background: 'rgba(255,255,255,0.03)' }}
                        >
                            <p className="text-white/40 text-[11px] font-medium">Placement</p>
                            <p className="text-white font-bold text-sm font-sans mt-1 uppercase">{placement}</p>
                        </div>
                    </div>

                    {/* Info Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <InfoBlock
                            label="Promotion Title"
                            value={title}
                            icon={<FiMapPin size={15} />}
                        />
                        <InfoBlock
                            label="Status"
                            value={campaign.status}
                            icon={<FiCalendar size={15} />}
                        />
                        <InfoBlock
                            label="Message"
                            value={campaign.message || 'N/A'}
                            icon={<FiMail size={15} />}
                        />
                        <InfoBlock
                            label="Placement Section"
                            value={placement}
                            icon={<FiCalendar size={15} />}
                        />
                    </div>
                </div>
            )}
        />
    );
};

export default CampaignDetailsModal;
