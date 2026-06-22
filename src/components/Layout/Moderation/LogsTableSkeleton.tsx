import * as React from 'react';

export const LogsTableSkeleton: React.FC = () => {
    return (
        <>
            {Array.from({ length: 5 }).map((_, idx) => (
                <tr key={`skeleton-${idx}`} className="border-b border-white/[0.02]">
                    <td className="py-4 px-6">
                        <div className="flex flex-col gap-2">
                            <div className="h-4 w-20 bg-white/[0.05] animate-pulse rounded"></div>
                            <div className="h-3 w-12 bg-white/[0.05] animate-pulse rounded"></div>
                        </div>
                    </td>
                    <td className="py-4 px-6">
                        <div className="h-6 w-24 bg-white/[0.05] animate-pulse rounded"></div>
                    </td>
                    <td className="py-4 px-6">
                        <div className="flex flex-col gap-2">
                            <div className="h-3 w-16 bg-white/[0.05] animate-pulse rounded"></div>
                            <div className="h-4 w-32 bg-white/[0.05] animate-pulse rounded"></div>
                        </div>
                    </td>
                    <td className="py-4 px-6">
                        <div className="h-6 w-16 bg-white/[0.05] animate-pulse rounded"></div>
                    </td>
                    <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded bg-white/[0.05] animate-pulse"></div>
                            <div className="h-4 w-64 bg-white/[0.05] animate-pulse rounded"></div>
                        </div>
                    </td>
                    <td className="py-4 px-6"></td>
                </tr>
            ))}
        </>
    );
};
