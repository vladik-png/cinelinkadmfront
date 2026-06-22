import React from 'react';

interface AvatarProps {
    src?: string | null;
    alt?: string;
    fallbackInitials?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    shape?: 'circle' | 'square';
    className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ 
    src, 
    alt = "avatar", 
    fallbackInitials = "A", 
    size = 'md', 
    shape = 'circle',
    className = '' 
}) => {
    let sizeStyles = '';
    
    switch (size) {
        case 'sm': sizeStyles = 'w-8 h-8 text-xs'; break;
        case 'md': sizeStyles = 'w-10 h-10 text-sm'; break;
        case 'lg': sizeStyles = 'w-16 h-16 text-xl'; break;
        case 'xl': sizeStyles = 'w-24 h-24 sm:w-28 sm:h-28 text-3xl border-[6px] border-[#1e1e2d] shadow-xl'; break;
        default: sizeStyles = 'w-10 h-10 text-sm'; break;
    }

    const shapeStyles = shape === 'circle' ? 'rounded-full' : 'rounded-lg';
    const baseStyles = `${shapeStyles} object-cover bg-[#151521] flex items-center justify-center shrink-0`;
    
    if (src) {
        return (
            <img 
                src={src} 
                alt={alt} 
                className={`${baseStyles} ${sizeStyles} ${className}`} 
            />
        );
    }

    return (
        <div className={`${baseStyles} ${sizeStyles} ${className}`}>
            <span className="text-[#3699ff] font-bold uppercase">
                {fallbackInitials}
            </span>
        </div>
    );
};
