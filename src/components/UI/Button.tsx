import React, { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'danger' | 'ghost' | 'danger-outline' | 'success-outline';
    children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', className = '', children, ...props }) => {
    let baseStyles = "px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";
    
    let variantStyles = "";
    switch (variant) {
        case 'primary':
            variantStyles = "bg-[#3699ff] text-white hover:bg-[#3699ff]/90 shadow-[0_0_20px_rgba(54,153,255,0.3)]";
            break;
        case 'danger':
            variantStyles = "bg-[#f1416c] text-white hover:bg-[#f1416c]/90 shadow-[0_0_20px_rgba(241,65,108,0.3)]";
            break;
        case 'ghost':
            baseStyles = "px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all disabled:opacity-50";
            variantStyles = "text-[#a2a5b9] hover:text-white hover:bg-white/5";
            break;
        case 'danger-outline':
            baseStyles = "px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors disabled:opacity-50 cursor-pointer";
            variantStyles = "bg-[#f1416c]/10 text-[#f1416c] hover:bg-[#f1416c]/20 border border-[#f1416c]/20";
            break;
        case 'success-outline':
            baseStyles = "px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors disabled:opacity-50 cursor-pointer";
            variantStyles = "bg-[#50cd89]/10 text-[#50cd89] hover:bg-[#50cd89]/20 border border-[#50cd89]/20";
            break;
    }

    return (
        <button className={`${baseStyles} ${variantStyles} ${className}`} {...props}>
            {children}
        </button>
    );
};
