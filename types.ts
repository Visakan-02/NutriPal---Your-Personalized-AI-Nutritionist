export enum UnitSystem {
    METRIC = 'Metric',
    IMPERIAL = 'Imperial'
}

export enum Gender {
    MALE = 'Male',
    FEMALE = 'Female',
    PREFER_NOT_TO_SAY = 'Prefer not to say'
}

export enum Goal {
    WEIGHT_LOSS = 'Weight Loss',
    MUSCLE_GAIN = 'Muscle Gain',
    MAINTAIN_WEIGHT = 'Maintain Weight',
    BOOST_ENERGY = 'Boost Energy',
    IMPROVE_SLEEP = 'Improve Sleep',
    BETTER_SKIN = 'Better Skin Health',
}

export enum ActivityLevel {
    SEDENTARY = 'Sedentary',
    LIGHTLY_ACTIVE = 'Lightly Active',
    MODERATELY_ACTIVE = 'Moderately Active',
    VERY_ACTIVE = 'Very Active',
    EXTRA_ACTIVE = 'Extra Active'
}

export type DietaryPreference = 'Vegetarian' | 'Non-Vegetarian' | 'Gluten-Free' | 'Dairy-Free' | 'Nut-Free' | 'Keto' | 'Paleo' | 'Pescatarian' | 'Low-FODMAP';

export type Cuisine = 'Italian' | 'Indian' | 'Mexican' | 'Asian' | 'American' | 'Mediterranean' | 'Japanese' | 'French' | 'Caribbean';


export interface User {
    unitSystem: UnitSystem;
    height: number;
    weight: number;
    age: number;
    gender: Gender;
    goal: Goal;
    activityLevel: ActivityLevel;
    dietaryPreferences: DietaryPreference[];
    favoriteCuisines: Cuisine[];
}

export interface Macros {
    protein: number;
    carbs: number;
    fat: number;
}

export interface Meal {
    id: number;
    name: string;
    category: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
    calories: number;
    macros: Macros;
    preferences: DietaryPreference[];
    cuisines: Cuisine[];
    goals: Goal[];
    description: string;
    why: string;
}

export interface Restaurant {
    name: string;
    description: string;
}

export interface MealPlan {
    breakfast: Meal;
    lunch: Meal;
    dinner: Meal;
    snacks: Meal[];
    totalCalories: number;
    totalMacros: Macros;
    caloricNeeds: number;
    restaurants?: Restaurant[];
}