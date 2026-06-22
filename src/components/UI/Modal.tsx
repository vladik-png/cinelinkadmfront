import React, { ReactNode } from 'react';

interface ModalProps {
    isOpen?: boolean;
    onClose: () => void;
    children: ReactNode;
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';
    className?: string;
}

export const Modal: React.FC<ModalProps> = ({ 
    isOpen = true, 
    onClose, 
    children, 
    maxWidth = 'lg',
    className = ''
}) => {
    if (!isOpen) return null;

    let maxWidthClass = '';
    switch (maxWidth) {
        case 'sm': maxWidthClass = 'max-w-sm'; break;
        case 'md': maxWidthClass = 'max-w-md'; break;
        case 'lg': maxWidthClass = 'max-w-lg'; break;
        case 'xl': maxWidthClass = 'max-w-xl'; break;
        case '2xl': maxWidthClass = 'max-w-2xl'; break;
        case '3xl': maxWidthClass = 'max-w-3xl'; break;
        case '4xl': maxWidthClass = 'max-w-4xl'; break;
        case '5xl': maxWidthClass = 'max-w-5xl'; break;
        default: maxWidthClass = 'max-w-lg'; break;
    }

    return (
        <div 
            className={`fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-[#151521]/80 backdrop-blur-sm ${className}`} 
            onClick={onClose}
        >
            <div 
                className={`bg-[#1e1e2d] border border-white/[0.05] w-full ${maxWidthClass} max-h-[90vh] overflow-y-auto rounded-[2rem] shadow-2xl relative`} 
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </div>
        </div>
    );
};
