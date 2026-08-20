interface ToastProps {
    message: string;
}

export function Toast({ message }: ToastProps) {
    if (!message) return null;

    return (
        <div 
            className="fixed top-6 right-6 z-[1000] p-4 rounded-xl flex items-center gap-3 shadow-2xl border"
            style={{
                background: '#23090a',
                borderColor: 'rgba(255, 255, 255, 0.1)',
            }}
        >
            <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center text-[#10b981] font-bold shrink-0">
                ✓
            </div>
            <span className="text-white text-sm font-medium">{message}</span>
        </div>
    );
}

export default Toast;
