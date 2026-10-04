import React, { useState } from 'react';

interface TooltipProps {
    text: string;
    children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ text, children }) => {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <div 
            className="relative flex items-center"
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
        >
            {children}
            {isVisible && (
                <div className="absolute bottom-full mb-2 w-48 bg-gray-800 dark:bg-gray-700 text-white text-xs rounded py-2 px-3 z-10 text-center shadow-lg transition-opacity duration-300">
                    {text}
                </div>
            )}
        </div>
    );
};

export default Tooltip;