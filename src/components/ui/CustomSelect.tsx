import React, { useState, useRef, useEffect } from 'react';
import { FiChevronDown, FiCheck } from 'react-icons/fi';

export interface SelectOption {
    value: string;
    label: string;
    icon?: React.ReactNode;
}

interface CustomSelectProps {
    value: string;
    onChange: (value: string) => void;
    options: SelectOption[];
    placeholder?: string;
    icon?: React.ReactNode;
    className?: string;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
    value,
    onChange,
    options,
    placeholder = 'Select option',
    icon,
    className = '',
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find((opt) => opt.value === value);

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className={`relative select-none ${className}`} ref={containerRef}>
            {/* Trigger Button */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full h-11 px-4 rounded-xl flex items-center justify-between gap-3 text-sm font-medium transition-all duration-200 cursor-pointer outline-none ${
                    isOpen
                        ? 'bg-white/[0.08] border-[#ff4b72] shadow-[0_0_12px_rgba(255,75,114,0.2)]'
                        : 'bg-white/[0.04] hover:bg-white/[0.07] border-white/10 hover:border-white/20'
                }`}
                style={{
                    borderWidth: '1px',
                    borderStyle: 'solid',
                }}
            >
                <div className="flex items-center gap-2.5 overflow-hidden">
                    {icon && <span className="text-white/60 shrink-0">{icon}</span>}
                    <span className="text-white truncate">
                        {selectedOption ? selectedOption.label : placeholder}
                    </span>
                </div>
                <FiChevronDown
                    size={16}
                    className={`text-white/60 transition-transform duration-200 shrink-0 ${
                        isOpen ? 'rotate-180 text-[#ff4b72]' : ''
                    }`}
                />
            </button>

            {/* Floating Dropdown Menu */}
            {isOpen && (
                <div
                    className="absolute right-0 top-[calc(100%+6px)] z-50 w-full min-w-[160px] py-1.5 rounded-xl border border-white/10 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-150"
                    style={{
                        background: 'linear-gradient(135deg, #46000B, #2d0007)',
                        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)',
                    }}
                >
                    {options.map((option) => {
                        const isSelected = option.value === value;
                        return (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => {
                                    onChange(option.value);
                                    setIsOpen(false);
                                }}
                                className={`w-full px-3.5 py-2.5 flex items-center justify-between gap-3 text-xs sm:text-sm font-medium transition-colors text-left cursor-pointer border-0 outline-none ${
                                    isSelected
                                        ? 'bg-[#ff4b72]/20 text-white font-semibold'
                                        : 'text-white/80 hover:bg-white/10 hover:text-white'
                                }`}
                            >
                                <div className="flex items-center gap-2 overflow-hidden">
                                    {option.icon && <span>{option.icon}</span>}
                                    <span className="truncate">{option.label}</span>
                                </div>
                                {isSelected && (
                                    <FiCheck size={15} className="text-[#ff4b72] shrink-0" />
                                )}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default CustomSelect;
