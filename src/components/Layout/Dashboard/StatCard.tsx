import * as React from 'react';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    colorClass: string;
    bgClass: string;
    onClick: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon, colorClass, bgClass, onClick }) => {
    return (
        <div
            onClick={onClick}
            className="bg-[#1e1e2d] rounded-xl p-6 border border-white/[0.05] flex items-center justify-between cursor-pointer hover:border-white/[0.15] hover:-translate-y-1 hover:shadow-lg hover:shadow-black/20 transition-all duration-300 group"
        >
            <div>
                <p className="text-sm font-medium text-[#a2a5b9] mb-1 group-hover:text-white transition-colors">{title}</p>
                <h3 className="text-2xl font-bold text-white">{value}</h3>
            </div>
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${bgClass} ${colorClass} group-hover:scale-110 transition-transform duration-300`}>
                {icon}
            </div>
        </div>
    );
};