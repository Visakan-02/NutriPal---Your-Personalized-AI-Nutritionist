import React from 'react';
import { Link } from 'react-router-dom';
import { User, UnitSystem, Gender, ActivityLevel } from '../../types';
import { FormAction } from '../CreatePlanFlow';
import { ACTIVITY_LEVELS } from '../../constants';
import Tooltip from '../Tooltip';
import InfoIcon from '../icons/InfoIcon';
import BMICalculator from '../BMICalculator';

interface BiometricsPageProps {
    user: Partial<User>;
    dispatch: React.Dispatch<FormAction>;
}

const BiometricsPage: React.FC<BiometricsPageProps> = ({ user, dispatch }) => {
    const handleFieldChange = (field: keyof User, value: any) => {
        dispatch({ type: 'SET_FIELD', field, value });
    };

    const heightLabel = user.unitSystem === UnitSystem.METRIC ? 'cm' : 'in';
    const weightLabel = user.unitSystem === UnitSystem.METRIC ? 'kg' : 'lbs';

    const canProceed = user.height && user.weight && user.age && user.height > 0 && user.weight > 0 && user.age > 0;

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">Step 1: About You</h2>
                <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">Let's start with the basics to understand your body.</p>
            </div>
            
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                {/* Left Column: Biometrics */}
                <div className="bg-gray-50 dark:bg-dark-card p-6 rounded-lg shadow-lg space-y-6">
                     {/* Unit System */}
                    <div>
                        <div className="flex items-center bg-gray-200 dark:bg-dark-border rounded-lg p-1">
                            <button type="button" onClick={() => handleFieldChange('unitSystem', UnitSystem.METRIC)} className={`w-1/2 py-2 text-sm font-medium rounded-md transition-colors ${user.unitSystem === UnitSystem.METRIC ? 'bg-brand-primary text-white' : 'text-gray-700 dark:text-gray-300'}`}>Metric</button>
                            <button type="button" onClick={() => handleFieldChange('unitSystem', UnitSystem.IMPERIAL)} className={`w-1/2 py-2 text-sm font-medium rounded-md transition-colors ${user.unitSystem === UnitSystem.IMPERIAL ? 'bg-brand-primary text-white' : 'text-gray-700 dark:text-gray-300'}`}>Imperial</button>
                        </div>
                    </div>

                    {/* Height & Weight */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="height" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Height ({heightLabel})</label>
                            <input type="number" id="height" value={user.height || ''} onChange={e => handleFieldChange('height', parseInt(e.target.value))} className="mt-1 w-full bg-gray-100 dark:bg-dark-border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 text-gray-900 dark:text-white focus:ring-brand-primary focus:border-brand-primary" required />
                        </div>
                        <div>
                            <label htmlFor="weight" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Weight ({weightLabel})</label>
                            <input type="number" id="weight" value={user.weight || ''} onChange={e => handleFieldChange('weight', parseInt(e.target.value))} className="mt-1 w-full bg-gray-100 dark:bg-dark-border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 text-gray-900 dark:text-white focus:ring-brand-primary focus:border-brand-primary" required />
                        </div>
                    </div>

                    {/* Age & Gender */}
                    <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label htmlFor="age" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Age</label>
                            <input type="number" id="age" value={user.age || ''} onChange={e => handleFieldChange('age', parseInt(e.target.value))} className="mt-1 w-full bg-gray-100 dark:bg-dark-border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 text-gray-900 dark:text-white focus:ring-brand-primary focus:border-brand-primary" required />
                        </div>
                        <div>
                            <label htmlFor="gender" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Gender</label>
                            <select id="gender" value={user.gender} onChange={e => handleFieldChange('gender', e.target.value as Gender)} className="mt-1 w-full bg-gray-100 dark:bg-dark-border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 text-gray-900 dark:text-white focus:ring-brand-primary focus:border-brand-primary">
                                {Object.values(Gender).map(g => <option key={g} value={g}>{g}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Activity Level */}
                    <div>
                         <label htmlFor="activityLevel" className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            <span>Activity Level</span>
                            <Tooltip text={ACTIVITY_LEVELS.find(l => l.id === user.activityLevel)?.description || ''}>
                                <InfoIcon className="w-4 h-4 text-gray-400" />
                            </Tooltip>
                        </label>
                        <select id="activityLevel" value={user.activityLevel} onChange={e => handleFieldChange('activityLevel', e.target.value as ActivityLevel)} className="mt-1 w-full bg-gray-100 dark:bg-dark-border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 text-gray-900 dark:text-white focus:ring-brand-primary focus:border-brand-primary">
                           {ACTIVITY_LEVELS.map(level => <option key={level.id} value={level.id}>{level.name}</option>)}
                        </select>
                    </div>
                </div>
                {/* Right Column: BMI */}
                <BMICalculator user={user} />
            </section>

            <div className="text-center mt-8">
                <Link 
                    to="/create/goals"
                    className={`inline-block font-bold py-3 px-8 rounded-full shadow-lg transition-transform transform hover:scale-105 ${canProceed ? 'bg-brand-primary hover:bg-brand-secondary text-white' : 'bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed'}`}
                    onClick={(e) => !canProceed && e.preventDefault()}
                    aria-disabled={!canProceed}
                >
                    Next: Set Your Goal
                </Link>
            </div>
        </div>
    );
};

export default BiometricsPage;