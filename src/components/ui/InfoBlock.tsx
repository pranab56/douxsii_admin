import { ReactNode } from 'react';

interface InfoBlockProps {
    label: string;
    value: string | number | ReactNode;
    icon: ReactNode;
    className?: string;
    valueClassName?: string;
}

export function InfoBlock({ label, value, icon, className = '', valueClassName = 'text-sm font-medium mt-0.5' }: InfoBlockProps) {
    return (
        <div className={`p-4 rounded-xl flex items-start gap-3 border border-white/[0.03] bg-white/[0.02] ${className}`}>
            <div className="text-white/40 mt-1 shrink-0">
                {icon}
            </div>
            <div>
                <span className="text-white/40 text-[11px] font-medium block">{label}</span>
                <span className={`text-white block ${valueClassName}`}>{value}</span>
            </div>
        </div>
    );
}

export default InfoBlock;
