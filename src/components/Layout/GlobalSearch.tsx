import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, User, Briefcase, Server, FileText, X } from 'lucide-react';
import { getUsers, getEmployeesList } from '../../api/userService';
import { getInfrastructureData } from '../../api/infraService';
import { UserData } from '../../types/user';
import { EmployeeData } from '../../types/employee';
import { UnifiedServer } from '../../types/infrastructure';

const PAGES = [
  { name: 'Dashboard', path: '/dashboard', icon: <FileText size={16} /> },
  { name: 'Users', path: '/users', icon: <User size={16} /> },
  { name: 'Employees', path: '/employees', icon: <Briefcase size={16} /> },
  { name: 'Infrastructure', path: '/infrastructure', icon: <Server size={16} /> },
  { name: 'Analytics', path: '/analytics', icon: <FileText size={16} /> },
  { name: 'Terminal', path: '/terminal', icon: <FileText size={16} /> },
  { name: 'Moderation', path: '/moderation', icon: <FileText size={16} /> },
  { name: 'Messages', path: '/messages', icon: <FileText size={16} /> },
  { name: 'Profile', path: '/profile', icon: <User size={16} /> },
];

export const GlobalSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const [users, setUsers] = useState<UserData[]>([]);
  const [employees, setEmployees] = useState<EmployeeData[]>([]);
  const [servers, setServers] = useState<UnifiedServer[]>([]);
  const [dataFetched, setDataFetched] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchGlobalData = async () => {
    if (dataFetched) return;
    setLoading(true);
    try {
      const [usersRes, employeesRes, infraRes] = await Promise.allSettled([
        getUsers(),
        getEmployeesList(),
        getInfrastructureData()
      ]);

      if (usersRes.status === 'fulfilled') {
        const data = usersRes.value;
        if (data && data.results && Array.isArray(data.results.data)) setUsers(data.results.data);
        else if (data && Array.isArray(data.results)) setUsers(data.results);
        else if (Array.isArray(data)) setUsers(data);
      }

      if (employeesRes.status === 'fulfilled') {
        const data = employeesRes.value;
        if (data && data.results && Array.isArray(data.results)) setEmployees(data.results);
        else if (Array.isArray(data)) setEmployees(data);
        else if (data && Array.isArray(data.data)) setEmployees(data.data);
      }

      if (infraRes.status === 'fulfilled') {
         // AWS instances
         const instances = infraRes.value.instances || [];
         const mapped = instances.map((inst: any) => {
             const nameTag = inst.Tags?.find((t: any) => t.Key === 'Name');
             return {
                 id: inst.InstanceId,
                 name: nameTag ? nameTag.Value : 'Unnamed Node',
                 type: 'AWS'
             } as UnifiedServer;
         });
         setServers(mapped);
      }
      setDataFetched(true);
    } catch (err) {
      console.error('Error fetching global search data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFocus = () => {
    setIsOpen(true);
    fetchGlobalData();
  };

  const closeAndClear = () => {
    setIsOpen(false);
    setQuery('');
  };

  const navigateTo = (path: string) => {
    navigate(path);
    closeAndClear();
  };

  const searchLower = query.toLowerCase();

  const filteredPages = PAGES.filter(p => p.name.toLowerCase().includes(searchLower)).slice(0, 5);
  
  const filteredUsers = query ? users.filter(u => 
    (u.username || '').toLowerCase().includes(searchLower) ||
    (u.first_name || '').toLowerCase().includes(searchLower) ||
    (u.last_name || '').toLowerCase().includes(searchLower) ||
    (u.email || '').toLowerCase().includes(searchLower)
  ).slice(0, 5) : [];

  const filteredEmployees = query ? employees.filter(e => 
    (e.first_name || '').toLowerCase().includes(searchLower) ||
    (e.last_name || '').toLowerCase().includes(searchLower)
  ).slice(0, 5) : [];

  const filteredServers = query ? servers.filter(s => 
    (s.name || '').toLowerCase().includes(searchLower) ||
    (s.id || '').toLowerCase().includes(searchLower)
  ).slice(0, 5) : [];

  const hasResults = query && (filteredPages.length > 0 || filteredUsers.length > 0 || filteredEmployees.length > 0 || filteredServers.length > 0);

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a2a5b9]" size={18} />
      <input
        type="text"
        placeholder="Global Search..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setIsOpen(true);
        }}
        onFocus={handleFocus}
        className="w-full bg-[#151521] text-sm text-white rounded-lg pl-10 pr-10 py-2 outline-none border border-white/[0.05] focus:border-[#3699ff]/50 transition-colors placeholder:text-[#a2a5b9]/50"
      />
      {query && (
        <X 
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a2a5b9] cursor-pointer hover:text-white" 
          size={16} 
          onClick={() => {
            setQuery('');
            setIsOpen(false);
          }}
        />
      )}

      {isOpen && (query || loading) && (
        <div className="absolute top-full left-0 w-[500px] mt-2 bg-[#1e1e2d] border border-white/[0.05] rounded-lg shadow-xl z-[100] max-h-[70vh] overflow-y-auto">
          {loading && !dataFetched ? (
            <div className="p-4 text-center text-[#a2a5b9] text-sm">Loading search data...</div>
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
      )}
    </div>
  );
};
