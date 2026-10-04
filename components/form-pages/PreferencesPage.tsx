import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User } from '../../types';
import { FormAction } from '../CreatePlanFlow';
import { DIETARY_PREFERENCES, CUISINES } from '../../constants';
import { generatePlan } from '../../services/nutritionService';

interface PreferencesPageProps {
    user: Partial<User>;
    dispatch: React.Dispatch<FormAction>;
}

const PreferencesPage: React.FC<PreferencesPageProps> = ({ user, dispatch }) => {
    const navigate = useNavigate();

    const handleCheckboxChange = (field: 'dietaryPreferences' | 'favoriteCuisines', value: string) => {
        dispatch({ type: 'TOGGLE_ARRAY_ITEM', field, value });
    };

    const handleGeneratePlan = (e: React.FormEvent) => {
        e.preventDefault();
        const plan = generatePlan(user as User);
        dispatch({ type: 'SET_PLAN', plan });
        navigate('/create/mealplan');
    };

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">Step 3: Your Preferences</h2>
                <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">Finally, tell us about your food preferences and favorite cuisines.</p>
            </div>
            
            <form onSubmit={handleGeneratePlan} className="space-y-10">
                 <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="bg-gray-50 dark:bg-dark-card p-6 rounded-lg shadow-lg">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Dietary Preferences</h3>
                        <div className="grid grid-cols-2 gap-3">
                           {DIETARY_PREFERENCES.map(pref => (
                                <label key={pref} className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                                    <input type="checkbox" checked={user.dietaryPreferences?.includes(pref)} onChange={() => handleCheckboxChange('dietaryPreferences', pref)} className="rounded text-brand-primary focus:ring-brand-secondary bg-gray-200 dark:bg-dark-border" />
                                    <span>{pref}</span>
                                 </label>
                            ))}
                        </div>
                     </div>
                     <div className="bg-gray-50 dark:bg-dark-card p-6 rounded-lg shadow-lg">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Favorite Cuisines</h3>
                        <div className="grid grid-cols-2 gap-3">
                           {CUISINES.map(cuisine => (
                                <label key={cuisine} className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                                    <input type="checkbox" checked={user.favoriteCuisines?.includes(cuisine)} onChange={() => handleCheckboxChange('favoriteCuisines', cuisine)} className="rounded text-brand-primary focus:ring-brand-secondary bg-gray-200 dark:bg-dark-border" />
                                    <span>{cuisine}</span>
                                </label>
                            ))}
                        </div>
                     </div>
                 </section>

                <div className="flex justify-center items-center gap-4 mt-8">
                    <Link 
                        to="/create/goals"
                        className="bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-800 dark:text-white font-bold py-3 px-8 rounded-full shadow-lg transition-transform transform hover:scale-105"
                    >
                        Back
                    </Link>
                    <button type="submit" className="bg-brand-primary hover:bg-brand-secondary text-white font-bold py-3 px-8 rounded-full shadow-lg transition-transform transform hover:scale-105">
                        Generate My Plan
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PreferencesPage;