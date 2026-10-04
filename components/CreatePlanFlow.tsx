import React, { useReducer, Reducer } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { User, UnitSystem, Gender, Goal, ActivityLevel, MealPlan, Restaurant } from '../types';
import BiometricsPage from './form-pages/BiometricsPage';
import GoalsPage from './form-pages/GoalsPage';
import PreferencesPage from './form-pages/PreferencesPage';
import MealPlanPreviewPage from './form-pages/MealPlanPreviewPage';
import RestaurantSuggestionsPage from './form-pages/RestaurantSuggestionsPage';
import FutureHealthPredictorPage from './form-pages/FutureHealthPredictorPage';

type Prediction = { 
    predictedWeight: string; 
    outlook: string;
    metrics: { name: string, value: number }[];
};

type FormState = Partial<User> & {
    plan?: MealPlan | null;
    restaurants?: Restaurant[] | null;
    prediction?: Prediction | null;
};

export type FormAction =
    | { type: 'SET_FIELD'; field: keyof User; value: any }
    | { type: 'TOGGLE_ARRAY_ITEM'; field: 'dietaryPreferences' | 'favoriteCuisines'; value: string }
    | { type: 'SET_PLAN'; plan: MealPlan }
    | { type: 'SET_RESTAURANTS'; restaurants: Restaurant[] }
    | { type: 'SET_PREDICTION'; prediction: Prediction };

const formReducer: Reducer<FormState, FormAction> = (state, action) => {
    switch (action.type) {
        case 'SET_FIELD':
            return { ...state, [action.field]: action.value };
        case 'TOGGLE_ARRAY_ITEM':
            const currentArray = state[action.field] as string[] || [];
            const isPresent = currentArray.includes(action.value);
            const newArray = isPresent
                ? currentArray.filter(item => item !== action.value)
                : [...currentArray, action.value];
            return { ...state, [action.field]: newArray };
        case 'SET_PLAN':
            return { ...state, plan: action.plan };
        case 'SET_RESTAURANTS':
            // Also attach restaurants to the plan
            const updatedPlan = state.plan ? { ...state.plan, restaurants: action.restaurants } : state.plan;
            return { ...state, restaurants: action.restaurants, plan: updatedPlan };
        case 'SET_PREDICTION':
            return { ...state, prediction: action.prediction };
        default:
            return state;
    }
};

const initialState: FormState = {
    unitSystem: UnitSystem.METRIC,
    height: 180,
    weight: 75,
    age: 30,
    gender: Gender.MALE,
    goal: Goal.MAINTAIN_WEIGHT,
    activityLevel: ActivityLevel.MODERATELY_ACTIVE,
    dietaryPreferences: [],
    favoriteCuisines: [],
    plan: null,
    restaurants: null,
    prediction: null,
};

const Stepper: React.FC = () => {
    const location = useLocation();
    const steps = ['biometrics', 'goals', 'preferences', 'mealplan', 'restaurants', 'predictor'];
    const currentPath = location.pathname.split('/').pop() || '';
    const currentStepIndex = steps.indexOf(currentPath);
    
    const stepLabels: { [key: string]: string } = {
        biometrics: 'Biometrics',
        goals: 'Goals',
        preferences: 'Preferences',
        mealplan: 'Plan Preview',
        restaurants: 'Restaurants',
        predictor: 'Health Outlook'
    };


    return (
        <div className="flex items-center w-full max-w-5xl mx-auto mb-10">
            {steps.map((step, index) => (
                <React.Fragment key={step}>
                    <div className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-colors ${index <= currentStepIndex ? 'bg-brand-primary text-white' : 'bg-gray-200 dark:bg-dark-border text-gray-500 dark:text-gray-400'}`}>
                            {index + 1}
                        </div>
                        <p className={`mt-2 text-sm text-center font-medium ${index <= currentStepIndex ? 'text-gray-800 dark:text-white' : 'text-gray-400'}`}>{stepLabels[step]}</p>
                    </div>
                    {index < steps.length - 1 && <div className={`flex-1 h-1 mx-2 transition-colors ${index < currentStepIndex ? 'bg-brand-primary' : 'bg-gray-200 dark:bg-dark-border'}`}></div>}
                </React.Fragment>
            ))}
        </div>
    );
};


interface CreatePlanFlowProps {
    onSubmit: (user: User, plan: MealPlan) => void;
}

const CreatePlanFlow: React.FC<CreatePlanFlowProps> = ({ onSubmit }) => {
    const [state, dispatch] = useReducer(formReducer, initialState);
    
    return (
        <div className="max-w-4xl mx-auto">
             <Stepper />
             <Routes>
                 <Route path="/" element={<Navigate to="biometrics" replace />} />
                 <Route path="biometrics" element={<BiometricsPage user={state} dispatch={dispatch} />} />
                 <Route path="goals" element={<GoalsPage user={state} dispatch={dispatch} />} />
                 <Route path="preferences" element={<PreferencesPage user={state} dispatch={dispatch} />} />
                 <Route path="mealplan" element={<MealPlanPreviewPage state={state} />} />
                 <Route path="restaurants" element={<RestaurantSuggestionsPage state={state} dispatch={dispatch} />} />
                 <Route path="predictor" element={<FutureHealthPredictorPage state={state} dispatch={dispatch} onSubmit={onSubmit} />} />
             </Routes>
        </div>
    );
};

export default CreatePlanFlow;