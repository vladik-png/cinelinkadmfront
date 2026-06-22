import React, { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    containerClassName?: string;
}

export const Input: React.FC<InputProps> = ({ label, containerClassName = '', className = '', ...props }) => {
    return (
        <div className={`flex flex-col gap-1.5 ${containerClassName}`}>
            {label && (
                <label className="text-[10px] uppercase tracking-wider font-bold text-[#a2a5b9] px-1">
                    {label}
                </label>
            )}
            <input
                className={`w-full bg-[#151521] border border-white/[0.05] text-white text-sm px-4 py-2.5 rounded-xl outline-none focus:border-[#3699ff]/50 focus:bg-[#151521]/80 transition-all ${className}`}
                {...props}
            />
        </div>
    );
};
