import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useTheme } from '../contexts/ThemeContext';

const data = [
  { name: 'Weight Loss', value: 45, color: '#10B981' },
  { name: 'Muscle Gain', value: 35, color: '#3B82F6' },
  { name: 'Maintain', value: 15, color: '#F59E0B' },
  { name: 'Energy', value: 5, color: '#EF4444' },
];

const StatCard: React.FC<{ title: string; value: string; description: string }> = ({ title, value, description }) => (
    <div className="bg-gray-50 dark:bg-dark-card p-6 rounded-lg shadow-lg text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
        <p className="text-4xl font-bold text-brand-primary mt-2">{value}</p>
        <p className="text-xs text-gray-500 mt-2">{description}</p>
    </div>
);

const Dashboard: React.FC = () => {
    const { theme } = useTheme();

    const tooltipStyle = theme === 'dark' 
        ? { backgroundColor: '#1F2937', border: '1px solid #374151', color: '#E5E7EB' }
        : { backgroundColor: '#ffffff', border: '1px solid #e2e8f0', color: '#1f2937' };

    const axisColor = theme === 'dark' ? '#9CA3AF' : '#6B7280';
    
    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">Expo Live Statistics</h2>
                <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">Real-time (simulated) data from NutriPal users at the event.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard title="Total Plans Generated" value="1,284" description="Since the start of the expo" />
                <StatCard title="Average BMI" value="24.2" description="Healthy range: 18.5 - 24.9" />
                <StatCard title="Most Popular Cuisine" value="Italian" description="Followed by American and Mexican" />
            </div>

            <div className="bg-gray-50 dark:bg-dark-card p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Most Common Goals</h3>
                <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                        <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <XAxis dataKey="name" stroke={axisColor} fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke={axisColor} fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip
                                cursor={{ fill: 'rgba(110, 231, 183, 0.1)' }}
                                contentStyle={tooltipStyle}
                            />
                            <Bar dataKey="value" name="Users (%)" fill="#8884d8" radius={[4, 4, 0, 0]}>
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;