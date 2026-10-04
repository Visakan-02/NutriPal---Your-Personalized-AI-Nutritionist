import React from 'react';
import { MealPlan, User, Meal } from '../types';
import MealCard from './MealCard';

interface MealPlannerProps {
    plan: MealPlan;
    user: User;
    onReset: () => void;
}

const WhyThisMeal: React.FC<{ meal: Meal }> = ({ meal }) => (
    <div className="mt-4 p-4 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg border border-emerald-200 dark:border-emerald-700">
        <h4 className="font-bold text-emerald-700 dark:text-emerald-300">Why this {meal.category.toLowerCase()}?</h4>
        <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{meal.why}</p>
    </div>
);


const MealPlanner: React.FC<MealPlannerProps> = ({ plan, user, onReset }) => {
    const calorieProgress = (plan.totalCalories / plan.caloricNeeds) * 100;

    return (
        <div className="max-w-7xl mx-auto">
            <div className="print:hidden">
                <div className="text-center mb-8">
                     <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">Your Personalized Meal Plan</h2>
                     <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">Here is your daily nutrition guide, designed for a <span className="text-brand-primary font-semibold">{user.goal}</span> goal.</p>
                </div>

                {/* Summary Bar */}
                <div className="bg-gray-50 dark:bg-dark-card p-6 rounded-lg shadow-lg mb-8">
                    <h3 className="text-xl font-semibold mb-4 text-center">Daily Summary</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div>
                            <p className="text-2xl font-bold text-brand-primary">{plan.totalCalories.toLocaleString()}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Total Calories</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-800 dark:text-white">{plan.totalMacros.protein}g</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Protein</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-800 dark:text-white">{plan.totalMacros.carbs}g</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Carbohydrates</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-800 dark:text-white">{plan.totalMacros.fat}g</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Fat</p>
                        </div>
                    </div>
                    <div className="mt-4">
                        <div className="w-full bg-gray-200 dark:bg-dark-border rounded-full h-2.5">
                            <div className="bg-brand-primary h-2.5 rounded-full" style={{ width: `${Math.min(calorieProgress, 100)}%` }}></div>
                        </div>
                        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">
                           {plan.totalCalories} / {plan.caloricNeeds.toLocaleString()} calories consumed ({Math.round(calorieProgress)}%)
                        </p>
                    </div>
                </div>

                {/* Meal Sections */}
                <div className="space-y-8">
                    {plan.breakfast && (
                        <div>
                            <h3 className="text-2xl font-bold mb-4 border-b-2 border-gray-200 dark:border-dark-border pb-2">Breakfast</h3>
                            <div className="grid grid-cols-1">
                               <MealCard meal={plan.breakfast} />
                               <WhyThisMeal meal={plan.breakfast} />
                            </div>
                        </div>
                    )}
                    {plan.lunch && (
                        <div>
                            <h3 className="text-2xl font-bold mb-4 border-b-2 border-gray-200 dark:border-dark-border pb-2">Lunch</h3>
                            <div className="grid grid-cols-1">
                                <MealCard meal={plan.lunch} />
                                <WhyThisMeal meal={plan.lunch} />
                            </div>
                        </div>
                    )}
                    {plan.dinner && (
                        <div>
                            <h3 className="text-2xl font-bold mb-4 border-b-2 border-gray-200 dark:border-dark-border pb-2">Dinner</h3>
                            <div className="grid grid-cols-1">
                                <MealCard meal={plan.dinner} />
                                <WhyThisMeal meal={plan.dinner} />
                            </div>
                        </div>
                    )}
                     {plan.snacks && plan.snacks.length > 0 && (
                        <div>
                            <h3 className="text-2xl font-bold mb-4 border-b-2 border-gray-200 dark:border-dark-border pb-2">Snacks</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {plan.snacks.map(snack => (
                                    <div key={snack.id}>
                                        <MealCard meal={snack} />
                                        <WhyThisMeal meal={snack} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {plan.restaurants && plan.restaurants.length > 0 && (
                        <div>
                            <h3 className="text-2xl font-bold mb-4 border-b-2 border-gray-200 dark:border-dark-border pb-2">AI Restaurant Suggestions</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {plan.restaurants.map((restaurant, index) => (
                                    <div key={index} className="bg-gray-50 dark:bg-dark-card p-6 rounded-lg shadow-lg">
                                        <h4 className="text-xl font-bold text-brand-primary">{restaurant.name}</h4>
                                        <p className="text-gray-600 dark:text-gray-400 mt-2">{restaurant.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                 <div className="mt-12 flex flex-col sm:flex-row justify-center items-center gap-4">
                    <button onClick={onReset} className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-transform transform hover:scale-105">
                        Start Over
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MealPlanner;