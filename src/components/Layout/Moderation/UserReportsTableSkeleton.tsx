import * as React from 'react';

export const UserReportsTableSkeleton: React.FC = () => {
    return (
        <>
            {Array.from({ length: 5 }).map((_, idx) => (
                <tr key={`skeleton-${idx}`} className="border-b border-white/[0.03]">
                    <td className="py-4 px-6 text-center"><div className="h-4 w-8 bg-white/[0.05] animate-pulse rounded mx-auto"></div></td>
                    <td className="py-4 px-6">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-white/[0.05] animate-pulse"></div>
                            <div className="flex flex-col gap-2">
                                <div className="h-4 w-24 bg-white/[0.05] animate-pulse rounded"></div>
                                <div className="h-3 w-16 bg-white/[0.05] animate-pulse rounded"></div>
                            </div>
                        </div>
                    </td>
                    <td className="py-4 px-6">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-white/[0.05] animate-pulse"></div>
                            <div className="flex flex-col gap-2">
                                <div className="h-4 w-24 bg-white/[0.05] animate-pulse rounded"></div>
                                <div className="h-3 w-16 bg-white/[0.05] animate-pulse rounded"></div>
                            </div>
                        </div>
                    </td>
                    <td className="py-4 px-6"><div className="h-4 w-32 bg-white/[0.05] animate-pulse rounded"></div></td>
                    <td className="py-4 px-6">
                        <div className="flex flex-col gap-2">
                            <div className="h-4 w-20 bg-white/[0.05] animate-pulse rounded"></div>
                            <div className="h-3 w-12 bg-white/[0.05] animate-pulse rounded"></div>
                        </div>
                    </td>
                    <td className="py-4 px-6 text-center"><div className="h-6 w-16 bg-white/[0.05] animate-pulse rounded mx-auto"></div></td>
                </tr>
            ))}
        </>
    );
};
