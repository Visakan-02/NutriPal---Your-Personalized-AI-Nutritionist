import React from 'react';
import { Link } from 'react-router-dom';

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
    <div className="bg-gray-50 dark:bg-dark-card/70 p-6 rounded-lg shadow-lg text-center backdrop-blur-md">
        <div className="flex items-center justify-center h-12 w-12 rounded-full bg-brand-primary/20 mx-auto mb-4">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h3>
        <p className="mt-2 text-gray-600 dark:text-gray-400">{description}</p>
    </div>
);

const WelcomeDashboard: React.FC = () => {
    return (
        <div className="max-w-5xl mx-auto space-y-12">
            <div className="text-center pt-8 pb-4">
                <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
                    Welcome to <span className="text-brand-primary">NutriPal</span>
                </h1>
                <h2 className="mt-3 max-w-md mx-auto text-xl text-gray-500 dark:text-gray-300 sm:text-2xl md:mt-5 md:max-w-3xl">
                    Your Personalized AI Nutritionist
                </h2>
                <p className="mt-5 max-w-prose mx-auto text-lg text-gray-600 dark:text-gray-400">
                    Stop guessing what to eat. Get a hyper-personalized meal plan based on your unique body, goals, and tastes. Powered by advanced AI to help you achieve optimal health.
                </p>
                <div className="mt-8">
                    <Link
                        to="/create/biometrics"
                        className="inline-block bg-brand-primary hover:bg-brand-secondary text-white font-bold text-lg py-4 px-10 rounded-full shadow-lg transition-transform transform hover:scale-105"
                    >
                        Create Your Plan Now
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <FeatureCard
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
                    title="Truly Personal Plans"
                    description="Your plan is built from scratch using your biometrics, activity level, health goals, and even your favorite cuisines."
                />
                <FeatureCard
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>}
                    title="AI-Powered Insights"
                    description="Leverage the Gemini API for enhanced meal descriptions and unique restaurant suggestions tailored to your plan."
                />
                <FeatureCard
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
                    title="Interactive Planner"
                    description="Easily swap meals, track your calories and macros in real-time, and save your favorite meals for future plans."
                />
            </div>
        </div>
    );
};

export default WelcomeDashboard;
