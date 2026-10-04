import React, { useState } from 'react';
import { Meal } from '../types';
import { getEnhancedMealDescription, getGroceryListForMeal } from '../services/geminiService';
import Tooltip from './Tooltip';
import { useFavorites } from '../hooks/useFavorites';
import HeartIcon from './icons/HeartIcon';
import AbstractArt from './AbstractArt';
import NutrientCircle from './NutrientCircle';

interface MealCardProps {
    meal: Meal;
}

const MealCard: React.FC<MealCardProps> = ({ meal }) => {
    const [enhancedDesc, setEnhancedDesc] = useState('');
    const [isLoadingDesc, setIsLoadingDesc] = useState(false);
    const [groceryList, setGroceryList] = useState<string[] | null>(null);
    const [isLoadingGroceries, setIsLoadingGroceries] = useState(false);
    const { isFavorite, toggleFavorite } = useFavorites();
    const isMealFavorite = isFavorite(meal.id);
    
    const fetchEnhancedDescription = async () => {
        if(enhancedDesc) return;
        setIsLoadingDesc(true);
        const desc = await getEnhancedMealDescription(meal);
        setEnhancedDesc(desc);
        setIsLoadingDesc(false);
    }

    const fetchGroceryList = async () => {
        if (groceryList) {
            setGroceryList(null); // Hide if already visible
            return;
        }
        setIsLoadingGroceries(true);
        const list = await getGroceryListForMeal(meal);
        setGroceryList(list);
        setIsLoadingGroceries(false);
    };

    const proteinCals = meal.macros.protein * 4;
    const carbsCals = meal.macros.carbs * 4;
    const fatCals = meal.macros.fat * 9;
    const totalMacroCals = proteinCals + carbsCals + fatCals;

    const proteinPercent = totalMacroCals > 0 ? (proteinCals / totalMacroCals) * 100 : 0;
    const carbsPercent = totalMacroCals > 0 ? (carbsCals / totalMacroCals) * 100 : 0;
    const fatPercent = totalMacroCals > 0 ? (fatCals / totalMacroCals) * 100 : 0;
    
    return (
        <div className="bg-gray-50 dark:bg-dark-card rounded-lg shadow-lg overflow-hidden flex flex-col">
            <div className="relative">
                <AbstractArt seed={meal.id} className="w-full h-40" />
                 <div className="absolute top-2 right-2 flex space-x-2">
                    <Tooltip text={isMealFavorite ? 'Remove from Favorites' : 'Add to Favorites'}>
                        <button 
                            onClick={() => toggleFavorite(meal.id)}
                            className={`bg-black/50 text-white rounded-full p-2 hover:bg-brand-primary transition-colors ${isMealFavorite ? 'text-red-500' : ''}`}
                            aria-label={isMealFavorite ? 'Remove from favorites' : 'Add to favorites'}
                        >
                           <HeartIcon isFavorite={isMealFavorite} />
                        </button>
                    </Tooltip>
                    <Tooltip text={meal.why}>
                        <button className="bg-black/50 text-white rounded-full p-2 hover:bg-brand-primary transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </button>
                    </Tooltip>
                 </div>
            </div>
            <div className="p-4 flex-grow flex flex-col">
                <h4 className="text-xl font-bold text-gray-900 dark:text-white">{meal.name}</h4>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 flex-grow">{meal.description}</p>
                
                <div className="mt-4">
                    <button onClick={fetchEnhancedDescription} disabled={isLoadingDesc} className="text-sm text-brand-primary hover:text-brand-secondary disabled:opacity-50 disabled:cursor-wait">
                        {isLoadingDesc ? 'AI is thinking...' : (enhancedDesc ? 'View AI Insight' : 'Get AI Insight ✨')}
                    </button>
                    {enhancedDesc && <p className="text-sm italic text-gray-400 dark:text-gray-300 mt-2 bg-gray-100 dark:bg-dark-border/50 p-2 rounded-md">{enhancedDesc}</p>}
                </div>

                <div className="mt-4">
                    <button onClick={fetchGroceryList} disabled={isLoadingGroceries} className="text-sm text-brand-primary hover:text-brand-secondary disabled:opacity-50 disabled:cursor-wait">
                        {isLoadingGroceries ? 'AI is fetching...' : (groceryList ? 'Hide Groceries' : 'View Groceries 🛒')}
                    </button>
                    {groceryList && (
                        <div className="mt-2 bg-gray-100 dark:bg-dark-border/50 p-3 rounded-md">
                            <h5 className="font-semibold text-sm text-gray-800 dark:text-gray-200 mb-1">Grocery List</h5>
                            <ul className="text-sm text-gray-600 dark:text-gray-300 list-disc list-inside space-y-1">
                                {groceryList.map((item, index) => (
                                    <li key={index}>{item}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

            </div>
            <div className="px-4 pb-4">
                 <div className="flex justify-around items-start text-center text-sm mt-4 border-t border-gray-200 dark:border-dark-border pt-4">
                    <div className="flex flex-col items-center text-center w-20 pt-2">
                        <span className="font-bold text-xl text-brand-primary">{meal.calories}</span>
                        <span className="block text-xs text-gray-500 dark:text-gray-400 mt-1">Calories</span>
                    </div>
                    <NutrientCircle percentage={proteinPercent} label="Protein" color="text-blue-500" />
                    <NutrientCircle percentage={carbsPercent} label="Carbs" color="text-green-500" />
                    <NutrientCircle percentage={fatPercent} label="Fat" color="text-orange-500" />
                </div>
            </div>
        </div>
    );
};

export default MealCard;