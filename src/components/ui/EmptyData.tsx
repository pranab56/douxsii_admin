import React from 'react';

interface EmptyDataProps {
    message?: string;
}

export const EmptyData: React.FC<EmptyDataProps> = ({ message = 'No data found.' }) => {
    return (
        <div className="py-16 text-center text-white/50 text-base font-medium">
            {message}
        </div>
    );
};

export default EmptyData;
