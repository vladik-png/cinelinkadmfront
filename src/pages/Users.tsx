import * as React from 'react';
import { useEffect, useState, useMemo } from 'react';
import { getUsers, toggleUserAccountStatus, getUserDetailedProfile } from '../api/userService';
import { 
  Mail, ShieldCheck, Search, UserCircle, X, 
  Download, ShieldAlert, CheckCircle, BookOpen, 
  Users as UsersIcon, UserPlus, Eye, ArrowUpDown, ArrowUp, ArrowDown
} from 'lucide-react';

interface UserData {
  user_id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  created_at: string;
  avatar_url: string;
  is_active: boolean; 
  bio?: string;
  followers?: number;
  followings?: number;
  bg_img_url?: string;
}

type SortKey = 'id' | 'name' | 'email' | 'date' | 'status';
type SortDirection = 'asc' | 'desc';

const Users: React.FC = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showBlockedOnly, setShowBlockedOnly] = useState<boolean>(false);
  
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection }>({
    key: 'date',
    direction: 'desc'
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsers(); 
      if (data && data.results && Array.isArray(data.results)) {
        setUsers(data.results);
      }
    } catch (err) {
      console.error("Помилка завантаження користувачів:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleToggleStatus = async (user: UserData, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!user || !user.user_id) return;
    
    try {
      await toggleUserAccountStatus(user.user_id, user.is_active);
      
      const nextState = !user.is_active;
      
      // Оновлюємо загальний список
      setUsers(prev => prev.map(u => 
        u.user_id === user.user_id ? { ...u, is_active: nextState } : u
      ));
      
      setSelectedUser(prev => prev ? { ...prev, is_active: nextState } : null);
    } catch (err) {
      console.error("Помилка зміни статусу:", err);
    }
  };

  const handleViewProfile = async (user: UserData) => {
    if (!user.user_id) return;
    try {
      setSelectedUser(user);
      
      const data = await getUserDetailedProfile(user.user_id);

      if (data && data.results) {
        setSelectedUser(prev => {
          if (!prev) return null;
          return {
            ...prev,
            ...data.results 
          };
        });
      }
    } catch (err) {
      console.error("Не вдалося завантажити детальний профіль:", err);
    }
  };

  const handleSort = (key: SortKey) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const processedUsers = useMemo(() => {
    let result = users.filter(u => {
      const search = searchTerm.toLowerCase();
      const matchesSearch = (u.username + u.first_name + u.last_name + (u.email || '')).toLowerCase().includes(search);
      return showBlockedOnly ? (matchesSearch && !u.is_active) : matchesSearch;
    });

    result.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortConfig.key) {
        case 'id':
          aValue = a.user_id; bValue = b.user_id; break;
        case 'name':
          aValue = `${a.first_name} ${a.last_name}`.toLowerCase(); 
          bValue = `${b.first_name} ${b.last_name}`.toLowerCase(); break;
        case 'email':
          aValue = (a.email || '').toLowerCase(); 
          bValue = (b.email || '').toLowerCase(); break;
        case 'date':
          aValue = new Date(a.created_at || 0).getTime(); 
          bValue = new Date(b.created_at || 0).getTime(); break;
        case 'status':
          aValue = a.is_active ? 1 : 0; 
          bValue = b.is_active ? 1 : 0; break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [users, searchTerm, showBlockedOnly, sortConfig]);

  const exportToCSV = () => {
    const delimiter = ";";
    const headers = ["ID", "Username", "Name", "Active", "Joined"].join(delimiter);
    const dataRows = processedUsers.map(u => [
      u.user_id, 
      u.username, 
      `${u.first_name} ${u.last_name}`, 
      u.is_active ? 'Active' : 'Banned',
      u.created_at ? new Date(u.created_at).toLocaleDateString('uk-UA') : 'N/A'
    ].join(delimiter));
    
    const csvContent = "\uFEFF" + [headers, ...dataRows].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `users_directory.csv`;
    link.click();
  };

  const SortIcon = ({ columnKey }: { columnKey: SortKey }) => {
    if (sortConfig.key !== columnKey) {
      return <ArrowUpDown size={12} className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />;
    }
    return sortConfig.direction === 'asc' 
      ? <ArrowUp size={12} className="text-blue-500" /> 
      : <ArrowDown size={12} className="text-blue-500" />;
  };

  return (
    <div className="w-full flex flex-col bg-[#f8fafc] min-h-screen font-medium relative">
      <div className="bg-[#0f172a] py-4 px-10 flex justify-between items-center sticky top-0 z-40 text-white shadow-md border-b border-slate-800">
        <div className="flex items-center gap-2">
           <ShieldCheck size={16} className="text-[#3b82f6]" />
           <h2 className="text-sm tracking-widest uppercase font-bold text-white">Directory Management</h2>
        </div>
        <div className="relative w-96">
          <input 
            type="text" 
            placeholder="Search users by name, username or email..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            className="w-full bg-slate-800/50 border border-slate-700 text-white text-[11px] px-10 py-3 rounded-xl outline-none focus:border-blue-500 transition-colors" 
          />
          <Search size={14} className="absolute left-4 top-3.5 text-slate-500" />
        </div>
      </div>

      <div className="p-10 w-full text-slate-900 flex-1 flex flex-col">
        <div className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-4xl text-slate-900 uppercase font-black leading-none tracking-tight">Accounts</h1>
            <div className="flex items-center gap-3 mt-3">
              <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest">
                Total: {users.length}
              </span>
              <span className="text-slate-400 uppercase text-[10px] tracking-[0.2em] font-bold">
                Showing: {processedUsers.length} results
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-3 cursor-pointer select-none group bg-white px-4 py-2.5 rounded-2xl border border-slate-200 shadow-sm hover:border-rose-200 transition-all">
              <div onClick={() => setShowBlockedOnly(!showBlockedOnly)} className={`w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center ${showBlockedOnly ? 'bg-rose-500 border-rose-500' : 'border-slate-300'}`}>
                {showBlockedOnly && <ShieldAlert size={12} className="text-white" />}
              </div>
              <span className={`text-[10px] font-black uppercase tracking-widest ${showBlockedOnly ? 'text-rose-500' : 'text-slate-500'}`}>Blocked Only</span>
            </label>

            <button onClick={exportToCSV} className="flex items-center gap-2 bg-[#0f172a] text-[#3b82f6] text-[10px] font-black uppercase px-6 py-3.5 rounded-2xl hover:bg-slate-800 shadow-lg transition-all active:scale-95 border border-slate-800">
              <Download size={14} /> Export
            </button>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-[2rem] shadow-sm flex-1 overflow-hidden flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase tracking-widest text-slate-400 select-none">
                  <th className="py-5 px-6 font-black w-24 text-center cursor-pointer hover:bg-slate-100 transition-colors group" onClick={() => handleSort('id')}>
                    <div className="flex items-center justify-center gap-2">ID <SortIcon columnKey="id" /></div>
                  </th>
                  <th className="py-5 px-6 font-black cursor-pointer hover:bg-slate-100 transition-colors group" onClick={() => handleSort('name')}>
                    <div className="flex items-center gap-2">User Profile <SortIcon columnKey="name" /></div>
                  </th>
                  <th className="py-5 px-6 font-black cursor-pointer hover:bg-slate-100 transition-colors group" onClick={() => handleSort('email')}>
                    <div className="flex items-center gap-2">Contact Info <SortIcon columnKey="email" /></div>
                  </th>
                  <th className="py-5 px-6 font-black cursor-pointer hover:bg-slate-100 transition-colors group" onClick={() => handleSort('date')}>
                    <div className="flex items-center gap-2">Registration <SortIcon columnKey="date" /></div>
                  </th>
                  <th className="py-5 px-6 font-black text-center cursor-pointer hover:bg-slate-100 transition-colors group" onClick={() => handleSort('status')}>
                    <div className="flex items-center justify-center gap-2">Status <SortIcon columnKey="status" /></div>
                  </th>
                  <th className="py-5 px-6 font-black text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {processedUsers.map((user) => (
                  <tr 
                    key={user.user_id} 
                    onClick={() => handleViewProfile(user)}
                    className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors cursor-pointer group"
                  >
                    <td className="py-4 px-6 text-center text-slate-400 font-mono text-xs">
                      #{user.user_id}
                    </td>
                    
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <div className="relative flex-shrink-0">
                          <img src={user.avatar_url || 'https://via.placeholder.com/150'} className={`w-10 h-10 rounded-xl object-cover border ${user.is_active ? 'border-slate-200' : 'border-rose-300 opacity-70'}`} alt="avatar" />
                          {!user.is_active && <div className="absolute -top-1 -right-1 bg-rose-500 text-white p-0.5 rounded-full"><ShieldAlert size={8}/></div>}
                        </div>
                        <div className="min-w-0">
                          <h3 className={`text-sm font-black truncate uppercase ${user.is_active ? 'text-slate-900' : 'text-slate-500 line-through decoration-rose-300'}`}>
                            {user.first_name} {user.last_name}
                          </h3>
                          <p className="text-[10px] text-[#3b82f6] font-bold mt-0.5 tracking-wide">@{user.username}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2 text-slate-500">
                        <Mail size={12} className="text-slate-400" />
                        <span className="text-[11px] font-semibold truncate max-w-[200px]">{user.email || 'N/A'}</span>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <span className="text-slate-700 font-bold text-[11px]">{user.created_at ? new Date(user.created_at).toLocaleDateString('uk-UA') : 'N/A'}</span>
                        {user.created_at && (
                          <span className="text-slate-400 text-[9px] uppercase tracking-widest font-bold mt-0.5">
                            {new Date(user.created_at).toLocaleTimeString('uk-UA', {hour: '2-digit', minute:'2-digit'})}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-4 px-6 text-center">
                      <span className={`inline-flex items-center justify-center px-3 py-1 rounded-lg text-[9px] uppercase tracking-widest font-black border ${
                        user.is_active 
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                        : 'bg-rose-50 text-rose-600 border-rose-100'
                      }`}>
                        {user.is_active ? 'Active' : 'Banned'}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleViewProfile(user); }}
                          className="p-2 text-blue-500 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Inspect Profile"
                        >
                          <Eye size={16} />
                        </button>
                        
                        <button 
                          onClick={(e) => handleToggleStatus(user, e)}
                          className={`p-2 rounded-lg transition-colors ${
                            user.is_active 
                            ? 'text-rose-500 bg-rose-50 hover:bg-rose-100' 
                            : 'text-emerald-500 bg-emerald-50 hover:bg-emerald-100'
                          }`}
                          title={user.is_active ? "Ban User" : "Restore User"}
                        >
                          {user.is_active ? <ShieldAlert size={16} /> : <CheckCircle size={16} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {processedUsers.length === 0 && !loading && (
              <div className="w-full py-20 flex flex-col items-center justify-center text-slate-400">
                <UserCircle size={48} className="mb-4 opacity-20" />
                <p className="text-sm font-bold uppercase tracking-widest">No users found</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedUser(null)}>
          <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden relative" onClick={(e) => e.stopPropagation()}>
            <div 
              className="h-32 bg-[#0f172a] relative bg-cover bg-center"
              style={{ backgroundImage: selectedUser.bg_img_url ? `url(${selectedUser.bg_img_url})` : 'none' }}
            >
              <button onClick={() => setSelectedUser(null)} className="absolute top-6 right-6 p-2 text-white/50 hover:text-white bg-black/20 rounded-full backdrop-blur-sm transition-colors"><X size={20} /></button>
            </div>
            
            <div className="px-12 pb-12">
                <div className="relative -mt-16 mb-8 flex items-end gap-6">
                    <img src={selectedUser.avatar_url || 'https://via.placeholder.com/150'} className="w-32 h-32 rounded-[2.5rem] border-8 border-white shadow-xl object-cover bg-white" alt="profile" />
                    <div className="pb-2">
                        <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter leading-tight">{selectedUser.first_name} {selectedUser.last_name}</h2>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`w-2 h-2 rounded-full animate-pulse ${selectedUser.is_active ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                          <p className="text-[#3b82f6] font-bold uppercase text-[10px]">@{selectedUser.username}</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-3">
                        <UsersIcon size={16} className="text-[#3b82f6]" />
                        <div>
                            <p className="text-slate-900 font-black text-sm leading-none">{selectedUser.followers ?? 0}</p>
                            <p className="text-[8px] text-slate-400 uppercase font-black tracking-widest mt-1">Followers</p>
                        </div>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-3">
                        <UserPlus size={16} className="text-[#3b82f6]" />
                        <div>
                            <p className="text-slate-900 font-black text-sm leading-none">{selectedUser.followings ?? 0}</p>
                            <p className="text-[8px] text-slate-400 uppercase font-black tracking-widest mt-1">Following</p>
                        </div>
                    </div>
                </div>

                {selectedUser.bio && (
                  <div className="mb-6 p-5 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[9px] text-slate-400 uppercase font-black mb-2 tracking-widest flex items-center gap-2"><BookOpen size={10}/> Biography</p>
                    <p className="text-slate-600 text-xs italic font-semibold leading-relaxed">"{selectedUser.bio}"</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-6 mb-10">
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                        <p className="text-[9px] text-slate-400 uppercase font-black mb-1 tracking-widest leading-none">Email Channel</p>
                        <p className="text-slate-900 font-bold truncate text-sm mt-2">{selectedUser.email || 'N/A'}</p>
                    </div>
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                        <p className="text-[9px] text-slate-400 uppercase font-black mb-1 tracking-widest leading-none">Joined Date</p>
                        <p className="text-slate-900 font-bold truncate text-sm mt-2">{selectedUser.created_at ? new Date(selectedUser.created_at).toLocaleDateString('uk-UA') : 'N/A'}</p>
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <button onClick={() => handleToggleStatus(selectedUser)} className={`w-full py-5 rounded-2xl text-[11px] uppercase tracking-[0.4em] font-black shadow-lg transition-all active:scale-95 flex items-center justify-center gap-3 ${selectedUser.is_active ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/20' : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20'}`}>
                      {selectedUser.is_active ? <><ShieldAlert size={18} /> Ban User Account</> : <><CheckCircle size={18} /> Restore User</>}
                    </button>
                    <p className="text-center text-[9px] font-black tracking-widest mt-2 uppercase text-slate-400">
                      Current Status: {selectedUser.is_active ? <span className="text-emerald-500">Active</span> : <span className="text-rose-500">Restricted</span>}
                    </p>
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;