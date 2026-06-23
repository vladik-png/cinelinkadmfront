import React from 'react';

interface SpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    color?: 'white' | 'primary';
    className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({ size = 'md', color = 'primary', className = '' }) => {
    let sizeClass = 'w-4 h-4 border-2';
    if (size === 'md') sizeClass = 'w-6 h-6 border-2';
    if (size === 'lg') sizeClass = 'w-8 h-8 border-[3px]';

    let colorClass = 'border-[#3699ff]/30 border-t-[#3699ff]';
    if (color === 'white') {
        colorClass = 'border-white/30 border-t-white';
    }

    return (
        <div className={`${sizeClass} ${colorClass} rounded-full animate-spin ${className}`}></div>
    );
};
