import React, { ReactNode } from 'react';

interface BadgeProps {
    variant?: 'success' | 'danger' | 'warning' | 'info' | 'default';
    children: ReactNode;
    className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ variant = 'default', children, className = '' }) => {
    let variantStyles = "";
    
    switch (variant) {
        case 'success':
            variantStyles = "bg-[#1bc5bd]/10 text-[#1bc5bd] border border-[#1bc5bd]/20";
            break;
        case 'danger':
            variantStyles = "bg-[#f1416c]/10 text-[#f1416c] border border-[#f1416c]/20";
            break;
        case 'warning':
            variantStyles = "bg-[#ffa800]/10 text-[#ffa800] border border-[#ffa800]/20";
            break;
        case 'info':
            variantStyles = "bg-[#8950fc]/10 text-[#8950fc] border border-[#8950fc]/20";
            break;
        case 'default':
        default:
            variantStyles = "bg-[#a2a5b9]/10 text-[#a2a5b9] border border-[#a2a5b9]/20";
            break;
    }

    return (
        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest inline-block ${variantStyles} ${className}`}>
            {children}
        </span>
    );
};
