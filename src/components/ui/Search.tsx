import { FiSearch } from 'react-icons/fi';

interface SearchProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
    inputClassName?: string;
    iconColor?: string;
}

export function Search({ value, onChange, placeholder = 'Search...', className = '', inputClassName = '', iconColor = '' }: SearchProps) {
    return (
        <div className={`relative w-full sm:max-w-md ${className}`}>
            <FiSearch className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${iconColor || 'text-white/40'}`} size={18} />
            <input 
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className={inputClassName || "w-full pl-10 pr-4 h-11 bg-white/[0.03] border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#ff4b72] transition-colors"}
            />
        </div>
    );
}

export default Search;
