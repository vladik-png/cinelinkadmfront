import React, { ReactNode } from 'react';

interface CardProps {
    children: ReactNode;
    className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
    return (
        <section className={`bg-[#1e1e2d] border border-white/[0.05] rounded-2xl shadow-lg flex-1 overflow-hidden flex flex-col ${className}`}>
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
