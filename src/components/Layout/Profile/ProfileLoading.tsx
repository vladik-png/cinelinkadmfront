import * as React from 'react';

export const ProfileLoading: React.FC = () => {
    return (
        <div className="min-h-screen bg-[#151521] flex flex-col items-center justify-center">
            <div className="w-8 h-8 border-2 border-[#3699ff]/30 border-t-[#3699ff] rounded-full animate-spin mb-4"></div>
            <p className="uppercase tracking-widest text-[10px] text-[#a2a5b9] font-bold">Loading Profile...</p>
        </div>
    );
};
