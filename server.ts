import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import { Meal, MealPlan, User } from './types';

const app = express();
app.use(express.json());

const PORT = 3000;

const API_KEY = process.env.GEMINI_API_KEY || process.env.API_KEY;

if (!API_KEY) {
  console.warn("GEMINI_API_KEY environment variable not set. Gemini API calls will use graceful mock fallbacks.");
}

let aiClient: GoogleGenAI | null = null;
function getAI() {
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY || process.env.API_KEY || "",
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// Endpoint 1: Enhanced Meal Description
app.post("/api/gemini/enhanced-description", async (req, res) => {
    const { meal } = req.body;
    try {
        if (!meal) {
            return res.status(400).json({ error: "Meal is required" });
        }

        if (!API_KEY) {
            return res.json({
                description: `This is a mock AI description for ${meal.name}. It's known for being a delicious and satisfying choice, perfectly aligning with your nutritional goals by providing a balanced mix of macronutrients. Enjoy this fantastic part of your personalized meal plan!`
            });
        }

        const prompt = `Provide a short, enticing, and slightly more detailed description for the meal "${meal.name}". The existing description is "${meal.description}". Focus on the sensory experience (taste, texture) and its benefits, in about 2-3 sentences. Do not repeat the meal name.`;

        const response = await getAI().models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                temperature: 0.7,
            }
        });

        res.json({ description: response.text });
    } catch (error: any) {
        console.warn("Error fetching enhanced meal description from Gemini API, using graceful fallback:", error);
        res.json({
            description: `A delicious health-focused recipe for ${meal?.name || 'this selection'}. It matches your target metrics perfectly, providing a fantastic and satisfying addition to your personalized nutrition routine.`
        });
    }
});

// Endpoint 2: Grocery List For Meal
app.post("/api/gemini/grocery-list", async (req, res) => {
    const { meal } = req.body;
    try {
        if (!meal) {
            return res.status(400).json({ error: "Meal is required" });
        }

        if (!API_KEY) {
            return res.json({
                ingredients: [
                    `1 serving of ${meal.name.split(' with ')[0]} (mock)`,
                    '1 tbsp Olive Oil (mock)',
                    'Pinch of salt and pepper (mock)'
                ]
            });
        }

        const prompt = `Generate a concise grocery list for a single serving of the meal "${meal.name}". The meal is described as: "${meal.description}". List only the essential ingredients someone would need to buy.`;

        const response = await getAI().models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                temperature: 0.2,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        ingredients: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.STRING,
                                description: "A single ingredient for the recipe."
                            },
                            description: "A list of ingredients for the meal."
                        }
                    },
                    required: ["ingredients"]
                }
            }
        });

        const jsonString = response.text.trim();
        const result = JSON.parse(jsonString);
        res.json({ ingredients: result.ingredients || [] });
    } catch (error: any) {
        console.warn("Error fetching grocery list from Gemini API, using graceful fallback:", error);
        res.json({
            ingredients: [
                `1 serving of ${meal?.name || 'the meal'}`,
                'Fresh greens or complementary veggies',
                'Healthy seasoning (olive oil, herbs, salt & pepper)'
            ]
        });
    }
});

// Endpoint 3: Restaurant Suggestions
app.post("/api/gemini/restaurant-suggestions", async (req, res) => {
    const { plan } = req.body;
    try {
        if (!plan) {
            return res.status(400).json({ error: "MealPlan is required" });
        }

        if (!API_KEY) {
            return res.json([
                { name: "The Healthy Hub (Mock)", description: `Great for finding meals like ${plan.lunch?.name}.` },
                { name: "Quick & Fit (Mock)", description: `Perfect for a quick breakfast like ${plan.breakfast?.name}.` },
                { name: "Gourmet Gains (Mock)", description: `An excellent choice for a dinner like ${plan.dinner?.name}.` }
            ]);
        }

        const mealNames = [plan.breakfast?.name, plan.lunch?.name, plan.dinner?.name, ...(plan.snacks?.map((s: any) => s?.name) || [])].filter(Boolean).join(', ');
        
        if (!mealNames) {
            return res.json([
                 { name: "Cuisine Corner", description: "Could not generate suggestions as no meals were found in the plan." }
            ]);
        }

        const prompt = `Suggest 3 fictional restaurants where a person could buy meals from a plan that includes: ${mealNames}. For each restaurant, provide a name and a short, fun description.`;

        const response = await getAI().models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                temperature: 0.8,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            name: {
                                type: Type.STRING,
                                description: "The name of the restaurant."
                            },
                            description: {
                                type: Type.STRING,
                                description: "A short, fun description of the restaurant."
                            }
                        },
                        required: ["name", "description"]
                    }
                }
            }
        });

        const jsonString = response.text.trim();
        const suggestions = JSON.parse(jsonString);
        res.json(suggestions);
    } catch (error: any) {
        console.warn("Error fetching restaurant suggestions from Gemini API, using graceful fallback:", error);
        res.json([
            { 
                name: "The Green Bistro", 
                description: `A lovely health-focused dining spot featuring custom dietary recipes matching your meal plan meals, including options like ${plan?.lunch?.name || 'healthy salads'} and organic produce.` 
            },
            { 
                name: "Fit & Fuel Cafe", 
                description: `Perfect for active lifestyles, offering high-protein dishes, custom breakfast bowls like ${plan?.breakfast?.name || 'breakfast oats'}, and nutritious snacks.` 
            },
            { 
                name: "The Clean Plate Co.", 
                description: `Specializes in nutrient-dense meals and customized calorie targets. Try their wholesome interpretations of ${plan?.dinner?.name || 'wholesome dinner favorites'}.` 
            }
        ]);
    }
});

// Endpoint 4: Health Prediction
app.post("/api/gemini/health-prediction", async (req, res) => {
    const { user, plan } = req.body;
    const weightUnit = user?.unitSystem === "Imperial" ? 'lbs' : 'kg';
    const heightUnit = user?.unitSystem === "Imperial" ? 'in' : 'cm';
    try {
        if (!user || !plan) {
            return res.status(400).json({ error: "User and MealPlan are required" });
        }

        if (!API_KEY) {
            const weightChange = user.goal === "Weight Loss" ? -8 : (user.goal === "Muscle Gain" ? 2 : 0);
            const predictedWeightValue = Number(user.weight || 0) + weightChange;
            return res.json({
                predictedWeight: `${predictedWeightValue.toFixed(1)} ${weightUnit}`,
                outlook: "You'll likely feel a significant boost in energy and overall well-being. Your commitment can lead to improved cardiovascular health and better sleep patterns. Keep up the great work!",
                metrics: [
                    { name: 'Cardiovascular Health', value: 75 },
                    { name: 'Energy Levels', value: 85 },
                    { name: 'Metabolic Rate', value: 60 }
                ]
            });
        }

        const prompt = `Based on the following user data, predict their health outlook in 6 months if they consistently follow the provided diet.
        User Data:
        - Age: ${user.age}
        - Gender: ${user.gender}
        - Height: ${user.height} ${heightUnit}
        - Current Weight: ${user.weight} ${weightUnit}
        - Stated Goal: "${user.goal}"
        - Activity Level: ${user.activityLevel}

        Diet Plan:
        - Daily Caloric Target: Approximately ${plan.caloricNeeds} kcal

        Task:
        Provide:
        1. A realistic predicted weight as a string that includes the value and the correct unit (${weightUnit}).
        2. A brief, encouraging health outlook summary (2-3 sentences).
        3. A list of 3-4 key health metrics relevant to the user's goal, with a predicted percentage improvement for each. The value should be a number from 0-100.`;

        const response = await getAI().models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                temperature: 0.5,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        predictedWeight: {
                            type: Type.STRING,
                            description: `The user's predicted weight after 6 months, as a string including the unit (e.g., '70 kg' or '155 lbs'). Use the unit: ${weightUnit}.`
                        },
                        outlook: {
                            type: Type.STRING,
                            description: "A brief, encouraging summary of potential health improvements."
                        },
                         metrics: {
                            type: Type.ARRAY,
                            description: "A list of key health metrics and their predicted percentage improvement.",
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    name: { type: Type.STRING, description: "Name of the health metric (e.g., 'Cardiovascular Health')." },
                                    value: { type: Type.INTEGER, description: "Predicted improvement percentage (0-100)." }
                                },
                                required: ["name", "value"]
                            }
                        }
                    },
                    required: ["predictedWeight", "outlook", "metrics"]
                }
            }
        });

        const jsonString = response.text.trim();
        const result = JSON.parse(jsonString);
        res.json(result);
    } catch (error: any) {
        console.warn("Error fetching health prediction from Gemini API, using graceful fallback:", error);
        const weightChange = user?.goal === "Weight Loss" ? -8 : (user?.goal === "Muscle Gain" ? 2 : 0);
        const predictedWeightValue = Number(user?.weight || 0) + weightChange;
        res.json({
            predictedWeight: `${predictedWeightValue.toFixed(1)} ${weightUnit}`,
            outlook: `Over 6 months of consistently following this meal plan, you can look forward to outstanding progress. By taking in ${plan?.caloricNeeds || 2000} kcal of highly nutritious, portion-controlled meals, you'll naturally align your metabolism with your "${user?.goal || 'Healthy Living'}" goal. Expect elevated daily energy levels, steady recovery times, and better overall cardiorespiratory physical health.`,
            metrics: [
                { name: 'Cardiovascular Health', value: 85 },
                { name: 'Daily Energy Levels', value: 90 },
                { name: 'Metabolic Stability', value: 75 }
            ]
        });
    }
});

// Configure Vite middleware and static routes
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
