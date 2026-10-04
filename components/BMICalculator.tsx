import React, { useMemo } from 'react';
import { User } from '../types';
import { calculateBMI } from '../services/nutritionService';

interface BMICalculatorProps {
    user: Partial<User>;
}

const BMICalculator: React.FC<BMICalculatorProps> = ({ user }) => {
    const { bmi, category } = useMemo(() => {
        if (user.height && user.weight && user.unitSystem) {
            return calculateBMI(user as User);
        }
        return { bmi: 0, category: 'N/A' };
    }, [user]);

    const getBarColor = () => {
        if (category === 'Underweight' || category === 'Obesity') return 'bg-red-500';
        if (category === 'Overweight') return 'bg-yellow-500';
        if (category === 'Normal weight') return 'bg-green-500';
        return 'bg-gray-400 dark:bg-gray-500';
    };

    const getProgress = () => {
        if (bmi === 0) return 0;
        // Clamp BMI for visualization purposes
        const clampedBmi = Math.max(15, Math.min(35, bmi));
        // Normalize between 0 and 100
        return ((clampedBmi - 15) / (35 - 15)) * 100;
    };


    return (
        <div className="bg-gray-50 dark:bg-dark-card p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Your BMI</h3>
            <div className="flex items-end justify-center space-x-2 mb-4">
                <span className="text-5xl font-bold text-brand-primary">{bmi > 0 ? bmi : '--'}</span>
                <span className="text-lg text-gray-500 dark:text-gray-400 font-medium pb-1">{category}</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-dark-border rounded-full h-2.5">
                 <div className={`${getBarColor()} h-2.5 rounded-full transition-all duration-500`} style={{ width: `${getProgress()}%` }}></div>
            </div>
             <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span>18.5</span>
                <span>25</span>
                <span>30</span>
            </div>
        </div>
    );
};

export default BMICalculator;