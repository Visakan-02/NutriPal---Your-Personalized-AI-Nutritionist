import React from 'react';
import { Link } from 'react-router-dom';
import { User } from '../../types';
import { FormAction } from '../CreatePlanFlow';
import { GOALS } from '../../constants';
import GoalCard from '../GoalCard';

interface GoalsPageProps {
    user: Partial<User>;
    dispatch: React.Dispatch<FormAction>;
}

const GoalsPage: React.FC<GoalsPageProps> = ({ user, dispatch }) => {
    const handleFieldChange = (field: keyof User, value: any) => {
        dispatch({ type: 'SET_FIELD', field, value });
    };

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">Step 2: Your Goal</h2>
                <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">What is the primary goal you want to achieve?</p>
            </div>
            
            <section className="bg-gray-50 dark:bg-dark-card p-6 rounded-lg shadow-lg">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {GOALS.map(goal => (
                        <GoalCard 
                            key={goal.id} 
                            title={goal.title} 
                            description={goal.description}
                            isSelected={user.goal === goal.id} 
                            onClick={() => handleFieldChange('goal', goal.id)} 
                        />
                    ))}
                </div>
            </section>

            <div className="flex justify-center items-center gap-4 mt-8">
                <Link 
                    to="/create/biometrics"
                    className="bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-800 dark:text-white font-bold py-3 px-8 rounded-full shadow-lg transition-transform transform hover:scale-105"
                >
                    Back
                </Link>
                <Link 
                    to="/create/preferences"
                    className="bg-brand-primary hover:bg-brand-secondary text-white font-bold py-3 px-8 rounded-full shadow-lg transition-transform transform hover:scale-105"
                >
                    Next: Your Preferences
                </Link>
            </div>
        </div>
    );
};

export default GoalsPage;
