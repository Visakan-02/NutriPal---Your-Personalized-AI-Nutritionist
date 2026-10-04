import React from 'react';

interface AbstractArtProps {
    seed: number;
    className?: string;
}

// Simple pseudo-random number generator to ensure the art is deterministic for each meal
const pseudoRandom = (seed: number) => {
    let x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
};

const AbstractArt: React.FC<AbstractArtProps> = ({ seed, className }) => {
    const colors = ['#10B981', '#059669', '#3B82F6', '#F59E0B', '#EF4444', '#6366F1'];

    const color1 = colors[Math.floor(pseudoRandom(seed * 1.1) * colors.length)];
    const color2 = colors[Math.floor(pseudoRandom(seed * 1.2) * colors.length)];
    const color3 = colors[Math.floor(pseudoRandom(seed * 1.3) * colors.length)];
    const angle = Math.floor(pseudoRandom(seed * 1.4) * 360);

    const gradientId = `gradient-${seed}`;
    const patternId = `pattern-${seed}`;

    return (
        <div className={className}>
            <svg width="100%" height="100%" className="w-full h-full">
                <defs>
                    <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%" gradientTransform={`rotate(${angle} 0.5 0.5)`}>
                        <stop offset="0%" stopColor={color1} stopOpacity="0.4" />
                        <stop offset="100%" stopColor={color2} stopOpacity="0.7" />
                    </linearGradient>
                    <pattern id={patternId} x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                        <circle cx="10" cy="10" r={`${pseudoRandom(seed * 1.5) * 2 + 1}`} fill={color3} fillOpacity="0.5" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill={`url(#${gradientId})`} />
                <rect width="100%" height="100%" fill={`url(#${patternId})`} />
            </svg>
        </div>
    );
};

export default AbstractArt;
