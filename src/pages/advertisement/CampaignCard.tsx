import { ProductPromotionItem } from '../../features/advertisement/advertisementApi';
import { baseURL } from '../../utils/BaseURL';

interface CampaignCardProps {
    campaign: ProductPromotionItem;
    onApprove: (id: string) => void;
    onReject: (id: string) => void;
}

export const CampaignCard = ({ campaign, onApprove, onReject }: CampaignCardProps) => {
    const rawPic = campaign.productId?.images?.[0];
    const imageSrc = rawPic 
        ? (rawPic.startsWith('http') ? rawPic : `${baseURL}/${rawPic.replace(/\\/g, '/')}`)
        : '/user.svg';

    const title = campaign.title || campaign.productId?.name || 'Special Product Promotion';
    const placement = campaign.selectedPlacement ? campaign.selectedPlacement.replace(/_/g, ' ') : 'Homepage Banner';
    const price = campaign.productId?.price ?? 0;
    const status = campaign.status || 'pending';

    return (
        <div
            className="rounded-2xl overflow-hidden transition-all hover:scale-[1.01]"
            style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)'
            }}
        >
            {/* Image */}
            <div className="relative w-full h-44 bg-[#560e18]">
                <img
                    src={imageSrc}
                    alt={title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = '/user.svg';
                    }}
                />
                <span
                    className="absolute top-3 left-3 text-[10px] font-bold tracking-wider px-2 py-1 rounded text-white uppercase"
                    style={{ background: 'rgba(0,0,0,0.55)' }}
                >
                    {placement}
                </span>
            </div>

            {/* Info */}
            <div className="p-4 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                    <div>
                        <p className="text-white text-sm font-bold leading-tight">{title}</p>
                        <p className="text-white/40 text-xs mt-0.5">{campaign.productId?.name || 'Product'}</p>
                    </div>
                    <div className="text-right shrink-0">
                        <p className="text-white font-bold text-sm">${price.toLocaleString()}</p>
                        <p className="text-white/40 text-xs capitalize">{status}</p>
                    </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                    <span className="text-white/40">Placement</span>
                    <span className="text-[#10b981] font-semibold uppercase">{placement}</span>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => onApprove(campaign._id)}
                        className="flex-1 h-9 rounded-xl text-white text-sm font-semibold cursor-pointer border-0 outline-none transition-all hover:opacity-90 active:scale-95"
                        style={{ background: '#7a0015' }}
                    >
                        Approve
                    </button>
                    <button
                        onClick={() => onReject(campaign._id)}
                        className="flex-1 h-9 rounded-xl text-white text-sm font-semibold cursor-pointer bg-transparent outline-none transition-all hover:bg-white/5 active:scale-95"
                        style={{ border: '1px solid rgba(255,255,255,0.15)' }}
                    >
                        Reject
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CampaignCard;
