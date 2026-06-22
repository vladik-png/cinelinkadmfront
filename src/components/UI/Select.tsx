import React, { SelectHTMLAttributes } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    containerClassName?: string;
    options: { value: string | number; label: string }[];
}

export const Select: React.FC<SelectProps> = ({ label, options, containerClassName = '', className = '', ...props }) => {
    return (
        <div className={`flex flex-col gap-1.5 ${containerClassName}`}>
            {label && (
                <label className="text-[10px] uppercase tracking-wider font-bold text-[#a2a5b9] px-1">
                    {label}
                </label>
            )}
            <select
                className={`w-full bg-[#151521] border border-white/[0.05] text-white text-sm px-4 py-2.5 rounded-xl outline-none focus:border-[#3699ff]/50 focus:bg-[#151521]/80 transition-all appearance-none ${className}`}
                {...props}
            >
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
        </div>
    );
};
