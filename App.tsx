import React, { useState, useCallback } from 'react';
import { Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom';
import CreatePlanFlow from './components/CreatePlanFlow';
import MealPlanner from './components/MealPlanner';
import Dashboard from './components/Dashboard';
import WelcomeDashboard from './components/WelcomeDashboard';
import { User, MealPlan } from './types';
import { useKioskMode } from './hooks/useKioskMode';
import ThemeToggle from './components/ThemeToggle';

const App: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [plan, setPlan] = useState<MealPlan | null>(null);
    const navigate = useNavigate();

    const handleFormSubmit = (userData: User, mealPlan: MealPlan) => {
        setUser(userData);
        setPlan(mealPlan);
        navigate('/plan');
    };

    const resetApp = useCallback(() => {
        setUser(null);
        setPlan(null);
        navigate('/create/biometrics');
    }, [navigate]);

    useKioskMode(resetApp, 120000); // 2 minutes

    return (
        <div className="min-h-screen bg-white/90 dark:bg-dark-bg/95 backdrop-blur-sm text-gray-800 dark:text-gray-100 font-sans p-4 sm:p-6 lg:p-8 transition-colors duration-300 print:p-0 print:bg-transparent dark:print:bg-transparent print:backdrop-blur-none">
            <header className="flex justify-between items-center mb-6 print:hidden">
                <Link to="/" className="flex items-center gap-2 group" aria-label="NutriPal Home">
                    <div className="p-1 bg-brand-primary/20 rounded-lg group-hover:bg-brand-primary/30 transition-colors duration-300">
                        <svg width="28" height="28" viewBox="0 0 24 24" className="text-brand-primary">
                            <path fill="currentColor" d="M12.7,21.5C8.3,21.5,5.2,18,5,14.2c-0.1-2.1,0.7-4.1,2.2-5.6c0.1-0.1,0.1-0.2,0.1-0.3c0-0.1,0-0.2-0.1-0.3c-0.1-0.1-0.2-0.1-0.3-0.1C6.7,8,6.6,8,6.5,8.1C4.2,9.9,3.1,12.8,3.4,15.8c0.3,3.4,2.8,6.2,6.2,6.7c3.4,0.4,6.4-1.4,7.8-4.2c0.1-0.2,0-0.5-0.2-0.6c-0.2-0.1-0.5,0-0.6,0.2c-1.2,2.3-3.6,3.6-6.1,3.6z M18.4,2.9C15.4,3.2,13,5.6,13,8.5c0,2.1,1.2,4.1,3.1,5c0.2,0.1,0.4,0,0.5-0.2c0.1-0.2,0-0.4-0.2-0.5c-1.6-0.8-2.6-2.4-2.6-4.2c0-2.6,2.1-4.7,4.7-4.7c1.8,0,3.3,1,4.1,2.6c0.1,0.2,0.4,0.3,0.6,0.2c0.2-0.1,0.3-0.4,0.2-0.6C21.9,4.4,20.3,2.9,18.4,2.9z"/>
                        </svg>
                    </div>
                    <span className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-gray-100 tracking-tight group-hover:text-brand-primary transition-colors duration-300">
                        NutriPal
                    </span>
                </Link>
                <nav className="flex items-center space-x-4">
                     <Link to="/create/biometrics" className="text-gray-500 dark:text-gray-300 hover:text-brand-primary transition-colors">Create Plan</Link>
                     <Link to="/dashboard" className="text-gray-500 dark:text-gray-300 hover:text-brand-primary transition-colors">Expo Stats</Link>
                     <ThemeToggle />
                </nav>
            </header>
            <main>
                <Routes>
                    <Route path="/" element={<WelcomeDashboard />} />
                    <Route path="/create/*" element={<CreatePlanFlow onSubmit={handleFormSubmit} />} />
                    <Route path="/plan" element={
                        plan && user ? (
                            <MealPlanner plan={plan} user={user} onReset={resetApp} />
                        ) : (
                            <Navigate to="/create/biometrics" replace />
                        )
                    } />
                    <Route path="/dashboard" element={<Dashboard />} />
                </Routes>
            </main>
        </div>
    );
};

export default App;