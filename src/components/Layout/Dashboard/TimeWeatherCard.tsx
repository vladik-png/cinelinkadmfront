import * as React from 'react';
import { Clock, MapPin, ThermometerSun } from 'lucide-react';
import { WeatherInfo } from '../../../types/dashboard';

interface TimeWeatherCardProps {
    time: string;
    location?: string;
    weather: WeatherInfo | null;
}

export const TimeWeatherCard: React.FC<TimeWeatherCardProps> = ({ time, location, weather }) => {
    return (
        <div className="lg:col-span-4 bg-[#1e1e2d] rounded-xl p-8 border border-white/[0.05] flex flex-col justify-center">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <p className="text-sm font-semibold text-[#a2a5b9] mb-1">Local Time</p>
                    <div className="flex items-center gap-2 text-2xl font-bold text-white">
                        <Clock size={20} className="text-[#ffa800]" />
                        {time}
                    </div>
                </div>
            </div>

            <div className="pt-5 border-t border-white/[0.05] flex justify-between items-center">
                <div>
                    <p className="text-[10px] font-bold text-[#f64e60] uppercase tracking-widest mb-1 flex items-center gap-1">
                        <MapPin size={12} className="text-[#f64e60]" />
                        {location || "Locating..."}
                    </p>
                    <p className="text-xl font-bold text-white">
                        {weather ? `${weather.temp}°C` : "--°C"}
                    </p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-white/[0.03] flex items-center justify-center text-[#1bc5bd]">
                    <ThermometerSun size={24} />
                </div>
            </div>
        </div>
    );
};