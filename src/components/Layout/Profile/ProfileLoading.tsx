import * as React from 'react';
import { Spinner } from '../../UI/Spinner';

export const ProfileLoading: React.FC = () => {
    return (
        <div className="min-h-screen bg-[#151521] flex flex-col items-center justify-center">
            <Spinner size="lg" className="mb-4" />
            <p className="uppercase tracking-widest text-[10px] text-[#a2a5b9] font-bold">Loading Profile...</p>
        </div>
    );
};
