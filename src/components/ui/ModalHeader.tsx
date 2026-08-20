import { IoCloseOutline } from 'react-icons/io5';

interface ModalHeaderProps {
    title: string;
    onClose: () => void;
    className?: string;
}

export function ModalHeader({ title, onClose, className = '' }: ModalHeaderProps) {
    return (
        <div className={`flex items-center justify-between border-b border-white/5 pb-4 ${className}`}>
            <h2 className="text-white text-xl font-bold m-0 font-sans">{title}</h2>
            <button 
                onClick={onClose}
                className="text-white/60 hover:text-white transition-colors bg-transparent border-0 outline-none cursor-pointer"
            >
                <IoCloseOutline size={24} />
            </button>
        </div>
    );
}

export default ModalHeader;
