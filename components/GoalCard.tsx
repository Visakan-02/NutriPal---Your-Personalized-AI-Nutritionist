import React from 'react';

interface GoalCardProps {
    title: string;
    description: string;
    isSelected: boolean;
    onClick: () => void;
}

const GoalCard: React.FC<GoalCardProps> = ({ title, description, isSelected, onClick }) => {
    return (
        <div
            onClick={onClick}
            className={`cursor-pointer p-4 rounded-lg border-2 transition-all duration-200 h-full flex flex-col justify-center ${
                isSelected 
                ? 'bg-brand-primary/20 border-brand-primary shadow-lg' 
                : 'bg-gray-50 dark:bg-dark-card border-gray-200 dark:border-dark-border hover:border-brand-secondary'
            }`}
        >
            <h4 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{description}</p>
        </div>
    );
};

export default GoalCard;