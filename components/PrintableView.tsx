import React from 'react';
import { QRCodeSVG as QRCode } from 'qrcode.react';
import { MealPlan, User } from '../types';

interface PrintableViewProps {
    plan: MealPlan;
    user: User;
}

const PrintableView: React.FC<PrintableViewProps> = ({ plan, user }) => {
    const appUrl = window.location.href.split('#')[0]; // Get base URL without hash
    const qrValue = `${appUrl}`; // For simplicity, QR links back to the app

    const allMeals = [plan.breakfast, plan.lunch, plan.dinner, ...(plan.snacks || [])].filter(Boolean);

    return (
        <div className="bg-white text-black p-8">
            <div className="max-w-4xl mx-auto">
                <header className="flex justify-between items-center border-b-2 border-gray-200 pb-4 mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-emerald-600">NutriPal</h1>
                        <p className="text-lg text-gray-600">Your Personalized Meal Plan</p>
                    </div>
                    <QRCode value={qrValue} size={80} />
                </header>

                <section className="grid grid-cols-2 gap-8 mb-8">
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h2 className="text-xl font-semibold mb-2 text-gray-800">Your Profile</h2>
                        <ul className="space-y-1 text-gray-700">
                            <li><strong>Goal:</strong> {user.goal}</li>
                            <li><strong>Daily Calorie Target:</strong> {plan.caloricNeeds.toLocaleString()} kcal</li>
                            <li><strong>Biometrics:</strong> {user.age} yrs, {user.height} {user.unitSystem === 'Metric' ? 'cm' : 'in'}, {user.weight} {user.unitSystem === 'Metric' ? 'kg' : 'lbs'}</li>
                            <li><strong>Dietary Needs:</strong> {user.dietaryPreferences.join(', ') || 'None'}</li>
                        </ul>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h2 className="text-xl font-semibold mb-2 text-gray-800">Daily Totals</h2>
                         <ul className="space-y-1 text-gray-700">
                            <li><strong>Total Calories:</strong> {plan.totalCalories.toLocaleString()} kcal</li>
                            <li><strong>Protein:</strong> {plan.totalMacros.protein}g</li>
                            <li><strong>Carbs:</strong> {plan.totalMacros.carbs}g</li>
                            <li><strong>Fat:</strong> {plan.totalMacros.fat}g</li>
                        </ul>
                    </div>
                </section>
                
                <section className="space-y-6">
                    {allMeals.map(meal => (
                         <div key={meal.id} className="p-4 border border-gray-200 rounded-lg">
                             <h3 className="text-lg font-bold text-emerald-700">{meal.category}: <span className="text-black">{meal.name}</span></h3>
                             <p className="text-sm text-gray-600 mt-1">{meal.description}</p>
                             <p className="text-sm font-semibold text-gray-500 mt-2">
                                 {meal.calories} kcal &bull; P: {meal.macros.protein}g &bull; C: {meal.macros.carbs}g &bull; F: {meal.macros.fat}g
                             </p>
                             <p className="text-xs italic text-gray-500 mt-2"><strong>Why this meal?</strong> {meal.why}</p>
                         </div>
                    ))}
                </section>

                {plan.restaurants && plan.restaurants.length > 0 && (
                    <section className="mt-8 pt-6 border-t-2 border-gray-200">
                        <h2 className="text-2xl font-bold mb-4 text-gray-800">AI Restaurant Suggestions</h2>
                        <div className="space-y-4">
                            {plan.restaurants.map((r, index) => (
                                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                                    <h3 className="text-lg font-bold text-emerald-700">{r.name}</h3>
                                    <p className="text-sm text-gray-600 mt-1">{r.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
};

export default PrintableView;