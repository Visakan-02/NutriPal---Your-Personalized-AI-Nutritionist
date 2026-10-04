import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MealPlan, Meal } from '../../types';

interface MealPlanPreviewPageProps {
    state: {
        plan?: MealPlan | null;
    };
}

const MealPreviewCard: React.FC<{ meal: Meal }> = ({ meal }) => (
    <div className="bg-white dark:bg-dark-border p-4 rounded-lg border border-gray-200 dark:border-gray-700 space-y-2">
        <h4 className="font-bold text-lg text-brand-primary">{meal.category}: <span className="text-gray-900 dark:text-white">{meal.name}</span></h4>
        <p className="text-sm text-gray-600 dark:text-gray-300">{meal.description}</p>
        <div className="text-xs font-semibold text-gray-500 dark:text-gray-400">
            {meal.calories} kcal &bull; P: {meal.macros.protein}g &bull; C: {meal.macros.carbs}g &bull; F: {meal.macros.fat}g
        </div>
        <div className="pt-2 mt-2 border-t border-gray-200 dark:border-gray-600">
            <p className="text-xs italic text-gray-500 dark:text-gray-400"><strong className="font-semibold">Why this meal?</strong> {meal.why}</p>
        </div>
    </div>
);

const MealPlanPreviewPage: React.FC<MealPlanPreviewPageProps> = ({ state }) => {
    const navigate = useNavigate();
    const { plan } = state;

    React.useEffect(() => {
        if (!plan) {
            navigate('/create/preferences');
        }
    }, [plan, navigate]);

    if (!plan) {
        return null; // or a loading/error state
    }
    
    const allMeals = [plan.breakfast, plan.lunch, plan.dinner, ...(plan.snacks || [])].filter(Boolean);

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">Step 4: Your Meal Plan Preview</h2>
                <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">Here's your personalized plan. You can go back to adjust preferences if needed.</p>
            </div>
            
            <section className="bg-gray-50 dark:bg-dark-card p-6 rounded-lg shadow-lg space-y-4">
                {allMeals.map(meal => (
                    <MealPreviewCard key={meal.id} meal={meal} />
                ))}
            </section>

            <div className="flex justify-center items-center gap-4 mt-8">
                <Link 
                    to="/create/preferences"
                    className="bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-800 dark:text-white font-bold py-3 px-8 rounded-full shadow-lg transition-transform transform hover:scale-105"
                >
                    Back
                </Link>
                <Link 
                    to="/create/restaurants"
                    className="bg-brand-primary hover:bg-brand-secondary text-white font-bold py-3 px-8 rounded-full shadow-lg transition-transform transform hover:scale-105"
                >
                    Next: Suggest Restaurants
                </Link>
            </div>
        </div>
    );
};

export default MealPlanPreviewPage;
