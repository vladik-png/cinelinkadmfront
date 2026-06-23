import React, { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'danger' | 'ghost' | 'danger-outline' | 'success-outline';
    children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', className = '', children, ...props }) => {
    let baseStyles = "px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300 active:scale-95 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 relative overflow-hidden";
    
    let variantStyles = "";
    switch (variant) {
        case 'primary':
            variantStyles = "bg-gradient-to-r from-[#3699ff] to-[#2f88e6] text-white hover:shadow-[0_0_25px_rgba(54,153,255,0.5)]";
            break;
        case 'danger':
            variantStyles = "bg-gradient-to-r from-[#f1416c] to-[#d83a60] text-white hover:shadow-[0_0_25px_rgba(241,65,108,0.5)]";
            break;
        case 'ghost':
            baseStyles = "px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300 disabled:opacity-50";
            variantStyles = "text-[#a2a5b9] hover:text-white hover:bg-white/10 backdrop-blur-sm";
            break;
        case 'danger-outline':
            baseStyles = "px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all duration-300 disabled:opacity-50 cursor-pointer hover:scale-[1.02]";
            variantStyles = "bg-[#f1416c]/10 text-[#f1416c] hover:bg-[#f1416c]/20 border border-[#f1416c]/20 hover:shadow-[0_0_15px_rgba(241,65,108,0.3)]";
            break;
        case 'success-outline':
            baseStyles = "px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all duration-300 disabled:opacity-50 cursor-pointer hover:scale-[1.02]";
            variantStyles = "bg-[#50cd89]/10 text-[#50cd89] hover:bg-[#50cd89]/20 border border-[#50cd89]/20 hover:shadow-[0_0_15px_rgba(80,205,137,0.3)]";
            break;
    }

    return (
        <button className={`${baseStyles} ${variantStyles} ${className}`} {...props}>
            {children}
        </button>
    );
};
