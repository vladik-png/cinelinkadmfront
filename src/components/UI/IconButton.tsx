import React, { ButtonHTMLAttributes } from 'react';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'ghost' | 'danger' | 'primary' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    children: React.ReactNode;
}

export const IconButton: React.FC<IconButtonProps> = ({ 
    variant = 'ghost', 
    size = 'md', 
    className = '', 
    children, 
    ...props 
}) => {
    let baseStyles = "flex items-center justify-center transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";
    
    let sizeStyles = "";
    switch (size) {
        case 'sm':
            sizeStyles = "p-1 rounded-lg";
            break;
        case 'md':
            sizeStyles = "p-2 rounded-lg";
            break;
        case 'lg':
            sizeStyles = "p-2.5 rounded-xl";
            break;
    }
    
    let variantStyles = "";
    switch (variant) {
        case 'ghost':
            variantStyles = "hover:bg-white/[0.1] text-[#a2a5b9] hover:text-white";
            break;
        case 'danger':
            variantStyles = "hover:bg-white/[0.1] text-[#a2a5b9] hover:text-[#f64e60]";
            break;
        case 'primary':
            variantStyles = "text-[#a2a5b9] hover:text-[#3699ff] hover:bg-[#3699ff]/10";
            break;
        case 'outline':
            variantStyles = "border border-white/[0.05] bg-[#151521] text-[#a2a5b9] hover:text-white hover:border-[#3699ff]/50";
            break;
    }

    return (
        <button className={`${baseStyles} ${sizeStyles} ${variantStyles} ${className}`} {...props}>
            {children}
        </button>
    );
};
