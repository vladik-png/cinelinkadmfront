import * as React from 'react';
import { Trash2 } from 'lucide-react';

export const ProfileError: React.FC = () => {
    return (
        <div className="min-h-screen bg-[#151521] flex items-center justify-center">
            <div className="bg-[#1e1e2d] p-10 rounded-2xl border border-white/[0.05] text-center">
                <Trash2 size={40} className="text-[#f64e60] mx-auto mb-4 opacity-50" />
                <p className="text-[#f64e60] font-bold uppercase tracking-widest text-sm">Employee Not Found</p>
            </div>
        </div>
    );
};
