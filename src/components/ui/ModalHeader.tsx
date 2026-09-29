import { IoCloseOutline } from 'react-icons/io5';

interface ModalHeaderProps {
    title: string;
    subtitle?: string;
    onClose: () => void;
    className?: string;
}

export function ModalHeader({ title, subtitle, onClose, className = '' }: ModalHeaderProps) {
    return (
        <div className={`flex items-start justify-between border-b border-white/5 pb-4 ${className}`}>
            <div>
                <h2 className="text-white text-xl font-bold m-0 font-sans">{title}</h2>
                {subtitle && <p className="text-white/60 text-xs mt-1 mb-0">{subtitle}</p>}
            </div>
            <button 
                onClick={onClose}
                className="text-white/60 hover:text-white transition-colors bg-transparent border-0 outline-none cursor-pointer p-0"
            >
                <IoCloseOutline size={24} />
            </button>
        </div>
    );
}

export default ModalHeader;
