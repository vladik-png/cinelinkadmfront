import React, { ReactNode } from 'react';

interface CardProps {
    children: ReactNode;
    className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
    return (
        <section className={`glass-panel rounded-2xl shadow-lg flex-1 overflow-hidden flex flex-col transition-all duration-300 hover:border-white/10 hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)] animate-slide-up ${className}`}>
            {children}
        </section>
    );
};

interface CardHeaderProps {
    children: ReactNode;
    className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ children, className = '' }) => {
    return (
        <div className={`p-6 border-b border-white/[0.05] bg-[#151521]/50 flex justify-between items-center ${className}`}>
            {children}
        </div>
    );
};

interface CardBodyProps {
    children: ReactNode;
    className?: string;
}

export const CardBody: React.FC<CardBodyProps> = ({ children, className = '' }) => {
    return (
        <div className={`p-6 ${className}`}>
            {children}
        </div>
    );
};
