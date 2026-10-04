import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, MealPlan, Restaurant } from '../../types';
import { FormAction } from '../CreatePlanFlow';
import { getRestaurantSuggestions } from '../../services/geminiService';

interface RestaurantSuggestionsPageProps {
    state: {
        plan?: MealPlan | null;
        restaurants?: Restaurant[] | null;
        [key: string]: any; // Allow other user properties
    };
    dispatch: React.Dispatch<FormAction>;
}

const RestaurantSuggestionsPage: React.FC<RestaurantSuggestionsPageProps> = ({ state, dispatch }) => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const { plan, restaurants } = state;
    const user = state as User;

    useEffect(() => {
        if (!plan) {
            // If there's no plan, something went wrong, go back to the start.
            navigate('/create/biometrics');
            return;
        }

        if (!restaurants) {
            const fetchSuggestions = async () => {
                setIsLoading(true);
                const suggestions = await getRestaurantSuggestions(plan);
                dispatch({ type: 'SET_RESTAURANTS', restaurants: suggestions });
                setIsLoading(false);
            };
            fetchSuggestions();
        }
    }, [plan, restaurants, dispatch, navigate]);

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">Step 5: Where to Eat</h2>
                <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">Based on your meal plan, here are a few AI-suggested places you might enjoy!</p>
            </div>
            
            <section className="bg-gray-50 dark:bg-dark-card p-6 rounded-lg shadow-lg min-h-[20rem] flex justify-center items-center">
                {isLoading ? (
                    <div className="text-center">
                        <svg className="animate-spin h-8 w-8 text-brand-primary mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">Our AI is finding the best spots for you...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                        {restaurants?.map((r, index) => (
                            <div key={index} className="bg-white dark:bg-dark-border p-4 rounded-lg border border-gray-200 dark:border-gray-700 h-full">
                                <h4 className="font-bold text-lg text-brand-primary">{r.name}</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{r.description}</p>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            <div className="flex justify-center items-center gap-4 mt-8">
                <Link 
                    to="/create/mealplan"
                    className="bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-800 dark:text-white font-bold py-3 px-8 rounded-full shadow-lg transition-transform transform hover:scale-105"
                >
                    Back
                </Link>
                <Link 
                    to="/create/predictor"
                    className={`inline-block font-bold py-3 px-8 rounded-full shadow-lg transition-transform transform hover:scale-105 ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-brand-primary hover:bg-brand-secondary text-white'}`}
                    onClick={(e) => isLoading && e.preventDefault()}
                    aria-disabled={isLoading}
                >
                    Next: Health Predictor
                </Link>
            </div>
        </div>
    );
};

export default RestaurantSuggestionsPage;