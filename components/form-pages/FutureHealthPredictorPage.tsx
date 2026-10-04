import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, MealPlan } from '../../types';
import { FormAction } from '../CreatePlanFlow';
import { getHealthPrediction } from '../../services/geminiService';

type Prediction = { 
    predictedWeight: string; 
    outlook: string;
    metrics: { name: string, value: number }[];
};

interface FutureHealthPredictorPageProps {
    state: {
        plan?: MealPlan | null;
        prediction?: Prediction | null;
        [key: string]: any; // Allow other user properties
    };
    dispatch: React.Dispatch<FormAction>;
    onSubmit: (user: User, plan: MealPlan) => void;
}

const FutureHealthPredictorPage: React.FC<FutureHealthPredictorPageProps> = ({ state, dispatch, onSubmit }) => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const { plan, prediction } = state;
    const user = state as User;

    useEffect(() => {
        if (!plan) {
            // If there's no plan, something went wrong, go back.
            navigate('/create/biometrics');
            return;
        }

        if (!prediction) {
            const fetchPrediction = async () => {
                setIsLoading(true);
                const healthPrediction = await getHealthPrediction(user, plan);
                dispatch({ type: 'SET_PREDICTION', prediction: healthPrediction });
                setIsLoading(false);
            };
            fetchPrediction();
        }
    }, [plan, prediction, user, dispatch, navigate]);

    const handleFinishSubmit = () => {
        // The plan in state already has restaurants attached. We don't need to add the prediction to it.
        onSubmit(user, plan as MealPlan);
    }

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">Step 6: Your 6-Month Health Outlook</h2>
                <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">Here's what our AI predicts for your health if you follow this plan consistently.</p>
            </div>
            
            <section className="bg-gray-50 dark:bg-dark-card p-6 rounded-lg shadow-lg min-h-[20rem] flex justify-center items-center">
                {isLoading ? (
                    <div className="text-center">
                        <svg className="animate-spin h-8 w-8 text-brand-primary mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">Our AI is predicting your future...</p>
                    </div>
                ) : (
                    <div className="text-center space-y-6 max-w-lg mx-auto w-full">
                        <div>
                            <p className="text-sm uppercase text-gray-500 dark:text-gray-400 tracking-wider">Predicted Weight</p>
                            <p className="text-5xl font-bold text-brand-primary">{prediction?.predictedWeight || '...'}</p>
                        </div>

                        {prediction?.metrics && prediction.metrics.length > 0 && (
                             <div className="w-full">
                                <p className="text-sm uppercase text-gray-500 dark:text-gray-400 tracking-wider mb-2">Key Metric Improvements</p>
                                <div className="space-y-3 text-left">
                                    {prediction.metrics.map(metric => (
                                        <div key={metric.name}>
                                            <div className="flex justify-between mb-1">
                                                <span className="text-base font-medium text-gray-700 dark:text-gray-300">{metric.name}</span>
                                                <span className="text-sm font-medium text-brand-primary">{metric.value}%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-dark-border">
                                                <div className="bg-brand-primary h-2.5 rounded-full" style={{ width: `${metric.value}%` }}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                       
                        <div>
                            <p className="text-sm uppercase text-gray-500 dark:text-gray-400 tracking-wider">Health Outlook</p>
                             <p className="text-md text-gray-700 dark:text-gray-300 mt-2">{prediction?.outlook || '...'}</p>
                        </div>
                    </div>
                )}
            </section>
             <p className="text-center text-xs text-gray-400 dark:text-gray-500 px-4">
                Disclaimer: This is an AI-generated prediction based on the provided data. It is for informational purposes only and is not a substitute for professional medical advice.
            </p>

            <div className="flex justify-center items-center gap-4 mt-8">
                <Link 
                    to="/create/restaurants"
                    className="bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-800 dark:text-white font-bold py-3 px-8 rounded-full shadow-lg transition-transform transform hover:scale-105"
                >
                    Back
                </Link>
                <button 
                    onClick={handleFinishSubmit}
                    disabled={isLoading}
                    className="bg-brand-primary hover:bg-brand-secondary text-white font-bold py-3 px-8 rounded-full shadow-lg transition-transform transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    Finish & View Plan
                </button>
            </div>
        </div>
    );
};

export default FutureHealthPredictorPage;