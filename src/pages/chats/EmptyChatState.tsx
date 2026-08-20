import { FiSend } from 'react-icons/fi';

export const EmptyChatState = () => {
    return (
        <div 
            className="flex-1 flex flex-col items-center justify-center text-center p-8 rounded-2xl"
            style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)'
            }}
        >
            <div 
                className="w-16 h-16 rounded-full flex items-center justify-center mb-4 text-[#ff4b72]"
                style={{
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.08)'
                }}
            >
                <FiSend size={28} />
            </div>
            <h3 className="font-semibold text-lg text-white">No Conversation Selected</h3>
            <p className="text-sm text-white/40 max-w-sm mt-1">
                Choose a user ticket from the list on the left to review message history and respond.
            </p>
        </div>
    );
};

export default EmptyChatState;
