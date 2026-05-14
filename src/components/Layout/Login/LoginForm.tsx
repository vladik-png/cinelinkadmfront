import * as React from 'react';
import { Hexagon, User, Lock } from 'lucide-react';

interface LoginFormProps {
    employeeCode: string;
    setEmployeeCode: (value: string) => void;
    password: string;
    setPassword: (value: string) => void;
    error: string | null;
    isLoading: boolean;
    onSubmit: (e: React.FormEvent) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
    employeeCode,
    setEmployeeCode,
    password,
    setPassword,
    error,
    isLoading,
    onSubmit
}) => {
    return (
        <div className="max-w-md w-full bg-[#1e1e2d] rounded-2xl p-10 shadow-2xl border border-white/[0.05] relative z-10 backdrop-blur-sm">
            <div className="text-center mb-10">
                <div className="w-16 h-16 bg-[#3699ff]/10 border border-[#3699ff]/20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(54,153,255,0.15)]">
                    <Hexagon size={32} className="text-[#3699ff] fill-[#3699ff]/20" />
                </div>
                <h2 className="text-2xl font-bold text-white tracking-wide">Cinelink Admin</h2>
            </div>

            <form onSubmit={onSubmit} className="space-y-6">
                <div>
                    <label className="text-xs font-semibold text-[#a2a5b9] uppercase tracking-wider mb-2 block">
                        Employee Code
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <User size={18} className="text-[#a2a5b9]" />
                        </div>
                        <input
                            type="text"
                            required
                            className="w-full pl-11 pr-4 py-3.5 bg-[#151521] border border-white/[0.05] rounded-xl text-white focus:border-[#3699ff] focus:ring-1 focus:ring-[#3699ff] outline-none transition-all placeholder:text-white/[0.2] font-mono"
                            placeholder="e.g. 0000"
                            value={employeeCode}
                            onChange={(e) => setEmployeeCode(e.target.value)}
                        />
                    </div>
                </div>

                <div>
                    <label className="text-xs font-semibold text-[#a2a5b9] uppercase tracking-wider mb-2 block">
                        Security Password
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Lock size={18} className="text-[#a2a5b9]" />
                        </div>
                        <input
                            type="password"
                            required
                            className="w-full pl-11 pr-4 py-3.5 bg-[#151521] border border-white/[0.05] rounded-xl text-white focus:border-[#3699ff] focus:ring-1 focus:ring-[#3699ff] outline-none transition-all placeholder:text-white/[0.2]"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                </div>

                {error && (
                    <div className="bg-[#f64e60]/10 border border-[#f64e60]/20 p-4 rounded-xl flex items-center gap-3 animate-pulse">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#f64e60]"></div>
                        <p className="text-[#f64e60] text-sm font-semibold tracking-wide">
                            {error}
                        </p>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full mt-4 bg-[#3699ff] hover:bg-[#2884e0] text-white font-bold py-4 rounded-xl text-sm tracking-wide transition-all duration-300 shadow-[0_4px_12px_rgba(54,153,255,0.25)] hover:shadow-[0_6px_20px_rgba(54,153,255,0.4)] ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-0.5'}`}
                >
                    {isLoading ? (
                        <span className="flex items-center justify-center gap-2">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Authenticating...
                        </span>
                    ) : (
                        'Authorize Entry'
                    )}
                </button>
            </form>

            <div className="mt-8 text-center text-[10px] text-white/[0.2] font-semibold uppercase tracking-widest">
                Cinelink Core v2.1
            </div>
        </div>
    );
};