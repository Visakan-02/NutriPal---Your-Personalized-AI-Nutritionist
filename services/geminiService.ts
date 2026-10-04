import { Meal, MealPlan, Restaurant, User } from '../types';

export const getEnhancedMealDescription = async (meal: Meal): Promise<string> => {
    try {
        const response = await fetch("/api/gemini/enhanced-description", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ meal })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data.description || "Could not load enhanced description. Please try again.";
    } catch (error) {
        console.error("Error fetching enhanced meal description:", error);
        return "Could not load enhanced description. Please try again.";
    }
};

export const getGroceryListForMeal = async (meal: Meal): Promise<string[]> => {
    try {
        const response = await fetch("/api/gemini/grocery-list", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ meal })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data.ingredients || ["Could not load grocery list due to an error."];
    } catch (error) {
        console.error("Error fetching grocery list:", error);
        return ["Could not load grocery list due to an error."];
    }
};

export const getRestaurantSuggestions = async (plan: MealPlan): Promise<Restaurant[]> => {
    try {
        const response = await fetch("/api/gemini/restaurant-suggestions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ plan })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const suggestions = await response.json();
        return suggestions;
    } catch (error) {
        console.error("Error fetching restaurant suggestions:", error);
        return [
            { name: "Cuisine Corner", description: "Could not load suggestions due to an error. Please try again." }
        ];
    }
};

export const getHealthPrediction = async (user: User, plan: MealPlan): Promise<{ predictedWeight: string; outlook: string; metrics: { name: string; value: number }[] }> => {
    try {
        const response = await fetch("/api/gemini/health-prediction", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ user, plan })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error fetching health prediction:", error);
        return {
            predictedWeight: "N/A",
            outlook: "Could not generate a prediction due to an error. Please try again later.",
            metrics: []
        };
    }
};
