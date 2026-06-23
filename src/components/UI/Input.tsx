import React, { InputHTMLAttributes, ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: ReactNode;
    icon?: ReactNode;
    rightElement?: ReactNode;
    containerClassName?: string;
}

export const Input: React.FC<InputProps> = ({ 
    label, 
    icon, 
    rightElement, 
    containerClassName = '', 
    className = '', 
    ...props 
}) => {
    return (
        <div className={`flex flex-col gap-1.5 w-full ${containerClassName}`}>
            {label && (
                <label className="text-[10px] uppercase tracking-wider font-bold text-[#a2a5b9] px-1 flex items-center gap-2">
                    {label}
                </label>
            )}
            <div className="relative w-full">
                {icon && (
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#a2a5b9]">
                        {icon}
                    </div>
                )}
                <input
                    className={`w-full bg-[#151521] border border-white/[0.05] text-white text-sm py-3 rounded-xl outline-none focus:border-[#3699ff]/50 focus:bg-[#151521]/80 transition-all placeholder:text-[#a2a5b9]/50 ${icon ? 'pl-11' : 'pl-4'} ${rightElement ? 'pr-12' : 'pr-4'} ${className}`}
                    {...props}
                />
                {rightElement && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        {rightElement}
                    </div>
                )}
            </div>
        </div>
    );
};
