import * as React from 'react';
import { User, Briefcase, Server } from 'lucide-react';
import { UserData } from '../../types/user';
import { EmployeeData } from '../../types/employee';
import { UnifiedServer } from '../../types/infrastructure';

interface Page {
    name: string;
    path: string;
    icon: React.ReactNode;
}

interface GlobalSearchResultsProps {
    query: string;
    loading: boolean;
    dataFetched: boolean;
    filteredPages: Page[];
    filteredUsers: UserData[];
    filteredEmployees: EmployeeData[];
    filteredServers: UnifiedServer[];
    hasResults: boolean | "" | 0;
    navigateTo: (path: string) => void;
}

export const GlobalSearchResults: React.FC<GlobalSearchResultsProps> = ({
    query,
    loading,
    dataFetched,
    filteredPages,
    filteredUsers,
    filteredEmployees,
    filteredServers,
    hasResults,
    navigateTo
}) => {
    return (
        <div className="absolute top-full left-0 w-full sm:w-[500px] mt-2 bg-[#1e1e2d] border border-white/[0.05] rounded-lg shadow-xl z-[100] max-h-[70vh] overflow-y-auto">
            {loading && !dataFetched ? (
                <div className="py-2">
                    <div className="px-4 py-1 text-[11px] font-bold text-[#a2a5b9] uppercase tracking-wider">Searching...</div>
                    {Array.from({ length: 4 }).map((_, idx) => (
                        <div key={`search-skel-${idx}`} className="px-4 py-3 flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-full bg-white/[0.05] animate-pulse flex-shrink-0"></div>
                                <div className="h-3 w-40 bg-white/[0.05] animate-pulse rounded"></div>
                            </div>
                            <div className="h-2 w-24 bg-white/[0.05] animate-pulse rounded ml-6"></div>
                        </div>
                    ))}
                </div>
            ) : !hasResults && query ? (
                <div className="p-4 text-center text-[#a2a5b9] text-sm">No results found for "{query}"</div>
            ) : (
                <div className="py-2">
                    {query && filteredPages.length > 0 && (
                        <div className="mb-2">
                            <div className="px-4 py-1 text-[11px] font-bold text-[#a2a5b9] uppercase tracking-wider">Pages</div>
                            {filteredPages.map(p => (
                                <div
                                    key={p.path}
                                    onClick={() => navigateTo(p.path)}
                                    className="px-4 py-2 hover:bg-white/[0.02] cursor-pointer flex items-center gap-3 text-sm text-white transition-colors"
                                >
                                    <span className="text-[#3699ff]">{p.icon}</span>
                                    {p.name}
                                </div>
                            ))}
                        </div>
                    )}

                    {filteredUsers.length > 0 && (
                        <div className="mb-2">
                            <div className="px-4 py-1 text-[11px] font-bold text-[#a2a5b9] uppercase tracking-wider">Users</div>
                            {filteredUsers.map(u => (
                                <div
                                    key={u.user_id}
                                    onClick={() => navigateTo(`/users?search=${encodeURIComponent(u.email || u.username || '')}`)}
                                    className="px-4 py-2 hover:bg-white/[0.02] cursor-pointer flex flex-col justify-center text-sm text-white transition-colors"
                                >
                                    <div className="flex items-center gap-2">
                                        <User size={14} className="text-[#1bc5bd]" />
                                        <span>{u.first_name} {u.last_name} ({u.username})</span>
                                    </div>
                                    <span className="text-xs text-[#a2a5b9] ml-6">{u.email}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {filteredEmployees.length > 0 && (
                        <div className="mb-2">
                            <div className="px-4 py-1 text-[11px] font-bold text-[#a2a5b9] uppercase tracking-wider">Employees</div>
                            {filteredEmployees.map(e => (
                                <div
                                    key={e.employee_id}
                                    onClick={() => navigateTo(`/employees?search=${e.employee_id}`)}
                                    className="px-4 py-2 hover:bg-white/[0.02] cursor-pointer flex flex-col justify-center text-sm text-white transition-colors"
                                >
                                    <div className="flex items-center gap-2">
                                        <Briefcase size={14} className="text-[#8950fc]" />
                                        <span>{e.first_name} {e.last_name}</span>
                                    </div>
                                    <span className="text-xs text-[#a2a5b9] ml-6">{e.department || e.location || 'Employee'}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {filteredServers.length > 0 && (
                        <div className="mb-2">
                            <div className="px-4 py-1 text-[11px] font-bold text-[#a2a5b9] uppercase tracking-wider">Infrastructure</div>
                            {filteredServers.map(s => (
                                <div
                                    key={s.id}
                                    onClick={() => navigateTo(`/analytics?node=${s.id}`)}
                                    className="px-4 py-2 hover:bg-white/[0.02] cursor-pointer flex flex-col justify-center text-sm text-white transition-colors"
                                >
                                    <div className="flex items-center gap-2">
                                        <Server size={14} className="text-[#ffa800]" />
                                        <span>{s.name}</span>
                                    </div>
                                    <span className="text-xs text-[#a2a5b9] ml-6">{s.id}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
