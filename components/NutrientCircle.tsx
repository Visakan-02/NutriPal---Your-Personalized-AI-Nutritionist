import React from 'react';

interface NutrientCircleProps {
    percentage: number;
    label: string;
    color: string;
}

const NutrientCircle: React.FC<NutrientCircleProps> = ({ percentage, label, color }) => {
    const radius = 22;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div className="flex flex-col items-center text-center w-20">
            <div className="relative w-14 h-14">
                <svg className="w-full h-full transform -rotate-90">
                    <circle
                        className="text-gray-200 dark:text-dark-border"
                        strokeWidth="4"
                        stroke="currentColor"
                        fill="transparent"
                        r={radius}
                        cx="28"
                        cy="28"
                    />
                    <circle
                        className={color}
                        strokeWidth="4"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r={radius}
                        cx="28"
                        cy="28"
                    />
                </svg>
                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-sm font-bold text-gray-800 dark:text-white">
                    {Math.round(percentage)}%
                </span>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">{label}</span>
        </div>
    );
};

export default NutrientCircle;
