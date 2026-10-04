import { User, UnitSystem, Gender, Goal, ActivityLevel, MealPlan, Meal, Macros, DietaryPreference } from '../types';
import { MEALS, ACTIVITY_LEVELS } from '../constants';

const convertToMetric = (user: User) => {
    let weightInKg = user.weight;
    let heightInCm = user.height;

    if (user.unitSystem === UnitSystem.IMPERIAL) {
        weightInKg = user.weight * 0.453592;
        heightInCm = user.height * 2.54;
    }
    return { weightInKg, heightInCm };
};

export const calculateBMI = (user: User): { bmi: number, category: string } => {
    const { weightInKg, heightInCm } = convertToMetric(user);
    if (heightInCm === 0) return { bmi: 0, category: 'N/A' };
    
    const heightInM = heightInCm / 100;
    const bmi = weightInKg / (heightInM * heightInM);

    let category = '';
    if (bmi < 18.5) category = 'Underweight';
    else if (bmi >= 18.5 && bmi < 24.9) category = 'Normal weight';
    else if (bmi >= 25 && bmi < 29.9) category = 'Overweight';
    else category = 'Obesity';

    return { bmi: parseFloat(bmi.toFixed(1)), category };
};

const calculateBMR = (user: User): number => {
    const { weightInKg, heightInCm } = convertToMetric(user);
    const { age, gender } = user;

    if (gender === Gender.FEMALE) {
        return 10 * weightInKg + 6.25 * heightInCm - 5 * age - 161;
    }
    // Male or Prefer not to say
    return 10 * weightInKg + 6.25 * heightInCm - 5 * age + 5;
};

export const calculateDailyCalories = (user: User): number => {
    const bmr = calculateBMR(user);
    const activity = ACTIVITY_LEVELS.find(level => level.id === user.activityLevel);
    const activityMultiplier = activity ? activity.multiplier : 1.2;
    const maintenanceCalories = bmr * activityMultiplier;

    let goalAdjustment = 0;
    switch (user.goal) {
        case Goal.WEIGHT_LOSS:
            goalAdjustment = -500; // Calorie deficit
            break;
        case Goal.MUSCLE_GAIN:
            goalAdjustment = 300; // Calorie surplus
            break;
        default:
            break;
    }
    return Math.round(maintenanceCalories + goalAdjustment);
};


const filterMeals = (user: User): Meal[] => {
    return MEALS.filter(meal => {
        // 'Non-Vegetarian' is not a restriction, so we filter it out from the checks.
        // The absence of 'Vegetarian' is what allows non-veg meals.
        const restrictivePreferences = user.dietaryPreferences.filter(p => p !== 'Non-Vegetarian');

        const preferenceMatch = restrictivePreferences.every(pref => meal.preferences.includes(pref));
        const cuisineMatch = user.favoriteCuisines.length === 0 || user.favoriteCuisines.some(cuisine => meal.cuisines.includes(cuisine));
        const goalMatch = meal.goals.includes(user.goal);
        
        return preferenceMatch && cuisineMatch && goalMatch;
    });
};

const findBestMeal = (meals: Meal[], targetCalories: number, existingIds: Set<number>): Meal | null => {
    const availableMeals = meals.filter(m => !existingIds.has(m.id));
    if (availableMeals.length === 0) return null;
    
    // Find the meal with the closest calorie count to the target
    return availableMeals.reduce((best, current) => {
        const bestDiff = Math.abs(best.calories - targetCalories);
        const currentDiff = Math.abs(current.calories - targetCalories);
        return currentDiff < bestDiff ? current : best;
    });
};

export const generatePlan = (user: User): MealPlan => {
    const caloricNeeds = calculateDailyCalories(user);
    const availableMeals = filterMeals(user);

    const mealCategories: ('Breakfast' | 'Lunch' | 'Dinner')[] = ['Breakfast', 'Lunch', 'Dinner'];
    const calorieDistribution = { Breakfast: 0.25, Lunch: 0.35, Dinner: 0.30, Snack: 0.10 };
    
    let plan: Partial<MealPlan> = { snacks: [] };
    let usedMealIds = new Set<number>();

    mealCategories.forEach(category => {
        const targetCalories = caloricNeeds * calorieDistribution[category];
        const categoryMeals = availableMeals.filter(m => m.category === category);
        const meal = findBestMeal(categoryMeals, targetCalories, usedMealIds);
        
        if (meal) {
            plan[category.toLowerCase() as 'breakfast' | 'lunch' | 'dinner'] = meal;
            usedMealIds.add(meal.id);
        } else {
             // Fallback: pick a random meal from the category if no good match
            const fallbackMeal = categoryMeals.find(m => !usedMealIds.has(m.id)) || MEALS.find(m => m.category === category)!;
            plan[category.toLowerCase() as 'breakfast' | 'lunch' | 'dinner'] = fallbackMeal;
            usedMealIds.add(fallbackMeal.id);
        }
    });

    const currentCalories = (plan.breakfast?.calories || 0) + (plan.lunch?.calories || 0) + (plan.dinner?.calories || 0);
    const remainingCaloriesForSnacks = caloricNeeds - currentCalories;
    const snackMeals = availableMeals.filter(m => m.category === 'Snack');
    
    if (remainingCaloriesForSnacks > 100 && snackMeals.length > 0) {
        const snack = findBestMeal(snackMeals, remainingCaloriesForSnacks, usedMealIds);
        if(snack) {
            plan.snacks = [snack];
            usedMealIds.add(snack.id);
        }
    }
    
    const finalPlan = plan as { breakfast: Meal, lunch: Meal, dinner: Meal, snacks: Meal[] };

    const totalMacros: Macros = { protein: 0, carbs: 0, fat: 0 };
    let totalCalories = 0;

    [finalPlan.breakfast, finalPlan.lunch, finalPlan.dinner, ...finalPlan.snacks].forEach(meal => {
        if(meal) {
            totalCalories += meal.calories;
            totalMacros.protein += meal.macros.protein;
            totalMacros.carbs += meal.macros.carbs;
            totalMacros.fat += meal.macros.fat;
        }
    });

    return { ...finalPlan, totalCalories, totalMacros, caloricNeeds };
};
