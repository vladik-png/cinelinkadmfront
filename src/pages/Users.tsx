import * as React from 'react';
import { useEffect, useState, useMemo } from 'react';
import { getUsers, toggleUserAccountStatus, getUserDetailedProfile } from '../api/userService';
import { 
  Mail, Search, UserCircle, X, 
  Download, ShieldAlert, CheckCircle, BookOpen, 
  Users as UsersIcon, UserPlus, ArrowUpDown, ArrowUp, ArrowDown
} from 'lucide-react';

interface UserData {
  user_id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  joined_at: string;
  avatar_url: string;
  is_active: boolean; 
  bio?: string;
  followers?: number;
  followings?: number;
  bg_img_url?: string;
}

type SortKey = 'id' | 'name' | 'email' | 'date' | 'status';
type SortDirection = 'asc' | 'desc';

const formatDate = (dateString?: string) => {
  if (!dateString) return { date: 'N/A', time: '' };
  
  try {
    let fixedString = dateString.trim().replace(' ', 'T');
    const date = new Date(fixedString);
    if (isNaN(date.getTime())) {
      const simpleDate = dateString.split(' ')[0];
      if (simpleDate.includes('-')) {
        const [y, m, d] = simpleDate.split('-');
        return { date: `${d}.${m}.${y}`, time: '' };
      }
      return { date: 'N/A', time: '' };
    }
    
    return {
      date: date.toLocaleDateString('uk-UA', { day: '2-digit', month: '2-digit', year: 'numeric' }),
      time: date.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' })
    };
  } catch (err) {
    return { date: 'N/A', time: '' };
  }
};

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
        console.log("Data verification:", data.results[0]);
        setUsers(data.results);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleToggleStatus = async (user: UserData, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!user || !user.user_id) return;
    
    try {
      const token = localStorage.getItem('admin_token') || ''; 
      await toggleUserAccountStatus(user.user_id, user.is_active, token);
      const nextState = !user.is_active;
      
      setUsers(prev => prev.map(u => 
        u.user_id === user.user_id ? { ...u, is_active: nextState } : u
      ));
      
      setSelectedUser(prev => prev ? { ...prev, is_active: nextState } : null);
    } catch (err) {
      console.error("Error changing status:", err);
    }
  };

  const handleViewProfile = async (user: UserData) => {
    if (!user.user_id) return;
    try {
      setSelectedUser(user);
      const token = localStorage.getItem('admin_token') || '';
      const data = await getUserDetailedProfile(user.user_id, token);
      if (data && data.results) {
        setSelectedUser(prev => {
          if (!prev) return null;
          return { ...prev, ...data.results };
        });
      }
    } catch (err) {
      console.error("Error loading detailed profile:", err);
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
        case 'id': aValue = a.user_id; bValue = b.user_id; break;
        case 'name': aValue = `${a.first_name} ${a.last_name}`.toLowerCase(); bValue = `${b.first_name} ${b.last_name}`.toLowerCase(); break;
        case 'email': aValue = (a.email || '').toLowerCase(); bValue = (b.email || '').toLowerCase(); break;
        case 'date': aValue = new Date(a.joined_at || 0).getTime(); bValue = new Date(b.joined_at || 0).getTime(); break;
        case 'status': aValue = a.is_active ? 1 : 0; bValue = b.is_active ? 1 : 0; break;
        default: return 0;
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
      u.user_id, u.username, `${u.first_name} ${u.last_name}`, 
      u.is_active ? 'Active' : 'Banned',
      formatDate(u.joined_at).date
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
      return <ArrowUpDown size={14} className="text-white/[0.2] group-hover:text-white/[0.5] transition-opacity" />;
    }
    return sortConfig.direction === 'asc' 
      ? <ArrowUp size={14} className="text-[#3699ff]" /> 
      : <ArrowDown size={14} className="text-[#3699ff]" />;
  };

  return (
    <div className="w-full min-h-screen bg-[#151521] text-[#a2a5b9] font-sans p-6 lg:p-8 flex flex-col relative z-0">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1 uppercase tracking-tight">Accounts</h1>
          <div className="flex items-center gap-3 text-[11px] font-bold tracking-widest uppercase">
            <span className="bg-[#3699ff]/10 text-[#3699ff] px-2.5 py-1 rounded border border-[#3699ff]/20">Total: {users.length}</span>
            <span className="text-[#a2a5b9]">Showing: {processedUsers.length}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-80">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a2a5b9]" />
            <input 
              type="text" 
              placeholder="Search by name, username or email..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              className="w-full bg-[#1e1e2d] border border-white/[0.05] text-white text-sm pl-10 pr-4 py-2.5 rounded-xl outline-none focus:border-[#3699ff]/50 transition-colors placeholder:text-[#a2a5b9]/50" 
            />
          </div>

          <button 
            onClick={() => setShowBlockedOnly(!showBlockedOnly)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all ${
              showBlockedOnly 
              ? 'bg-[#f64e60]/10 border-[#f64e60]/20 text-[#f64e60]' 
              : 'bg-[#1e1e2d] border-white/[0.05] text-[#a2a5b9] hover:bg-white/[0.02] hover:text-white'
            }`}
          >
            <ShieldAlert size={14} className={showBlockedOnly ? 'text-[#f64e60]' : 'text-[#a2a5b9]'} />
            Blocked Only
          </button>

          <button 
            onClick={exportToCSV} 
            className="flex items-center gap-2 bg-[#1e1e2d] border border-white/[0.05] hover:bg-white/[0.05] text-white text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-xl transition-all"
          >
            <Download size={14} /> Export
          </button>
        </div>
      </div>

      <div className="bg-[#1e1e2d] rounded-2xl border border-white/[0.05] flex-1 overflow-hidden flex flex-col shadow-lg">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-white/[0.02] border-b border-white/[0.05] text-[10px] font-bold uppercase tracking-widest text-[#a2a5b9] select-none">
                <th className="py-5 px-6 w-24 cursor-pointer hover:text-white hover:bg-white/[0.02] transition-colors group" onClick={() => handleSort('id')}>
                  <div className="flex items-center justify-center gap-2">ID <SortIcon columnKey="id" /></div>
                </th>
                <th className="py-5 px-6 cursor-pointer hover:text-white hover:bg-white/[0.02] transition-colors group" onClick={() => handleSort('name')}>
                  <div className="flex items-center gap-2">User Profile <SortIcon columnKey="name" /></div>
                </th>
                <th className="py-5 px-6 cursor-pointer hover:text-white hover:bg-white/[0.02] transition-colors group" onClick={() => handleSort('email')}>
                  <div className="flex items-center gap-2">Contact Info <SortIcon columnKey="email" /></div>
                </th>
                <th className="py-5 px-6 cursor-pointer hover:text-white hover:bg-white/[0.02] transition-colors group" onClick={() => handleSort('date')}>
                  <div className="flex items-center gap-2">Registration <SortIcon columnKey="date" /></div>
                </th>
                <th className="py-5 px-6 cursor-pointer hover:text-white hover:bg-white/[0.02] transition-colors group text-center" onClick={() => handleSort('status')}>
                  <div className="flex items-center justify-center gap-2">Status <SortIcon columnKey="status" /></div>
                </th>
                <th className="py-5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            
            <tbody>
              {processedUsers.map((user) => {
                const { date, time } = formatDate(user.joined_at);
                
                return (
                <tr 
                  key={user.user_id} 
                  onClick={() => handleViewProfile(user)}
                  className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors cursor-pointer group"
                >
                  <td className="py-4 px-6 text-center text-[#a2a5b9] font-mono text-xs">
                    #{user.user_id}
                  </td>
                  
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-4">
                      <div className="relative flex-shrink-0">
                        {user.avatar_url ? (
                           <img src={user.avatar_url} className={`w-10 h-10 rounded-lg object-cover border ${user.is_active ? 'border-white/[0.1]' : 'border-[#f64e60]/50 opacity-70'}`} alt="avatar" />
                        ) : (
                           <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold border ${user.is_active ? 'bg-white/[0.05] border-white/[0.1] text-white' : 'bg-[#f64e60]/10 border-[#f64e60]/30 text-[#f64e60]'}`}>
                             {user.first_name?.[0] || 'U'}
                           </div>
                        )}
                        {!user.is_active && <div className="absolute -top-1.5 -right-1.5 bg-[#f64e60] text-white p-0.5 rounded-full border-2 border-[#1e1e2d]"><ShieldAlert size={10}/></div>}
                      </div>
                      <div className="min-w-0">
                        <h3 className={`text-sm font-bold uppercase tracking-wide truncate transition-colors ${user.is_active ? 'text-white group-hover:text-[#3699ff]' : 'text-[#a2a5b9] line-through decoration-[#f64e60]/50'}`}>
                          {user.first_name} {user.last_name}
                        </h3>
                        <p className="text-[10px] text-[#3699ff] font-semibold mt-0.5 tracking-wider">@{user.username}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2 text-[#a2a5b9] group-hover:text-white transition-colors">
                      <Mail size={14} className="text-[#a2a5b9]" />
                      <span className="text-xs font-medium truncate max-w-[200px]">{user.email || 'N/A'}</span>
                    </div>
                  </td>

                  <td className="py-4 px-6">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-white">{date}</span>
                      {time && (
                        <span className="text-[10px] font-semibold text-[#a2a5b9] mt-0.5 tracking-wider">
                          {time}
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="py-4 px-6 text-center">
                    <span className={`inline-flex items-center justify-center px-2.5 py-1.5 rounded text-[9px] font-black uppercase tracking-widest border ${
                      user.is_active 
                      ? 'bg-[#1bc5bd]/10 text-[#1bc5bd] border-[#1bc5bd]/20' 
                      : 'bg-[#f64e60]/10 text-[#f64e60] border-[#f64e60]/20'
                    }`}>
                      {user.is_active ? 'Active' : 'Banned'}
                    </span>
                  </td>

                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={(e) => handleToggleStatus(user, e)}
                        className={`p-2 rounded-md transition-colors ${
                          user.is_active 
                          ? 'text-[#f64e60] bg-[#f64e60]/10 hover:bg-[#f64e60]/20' 
                          : 'text-[#1bc5bd] bg-[#1bc5bd]/10 hover:bg-[#1bc5bd]/20'
                        }`}
                        title={user.is_active ? "Ban User" : "Restore User"}
                      >
                        {user.is_active ? <ShieldAlert size={16} /> : <CheckCircle size={16} />}
                      </button>
                    </div>
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
          
          {/* Empty State */}
          {processedUsers.length === 0 && !loading && (
            <div className="w-full py-20 flex flex-col items-center justify-center text-[#a2a5b9]">
              <UserCircle size={48} className="mb-4 opacity-20" />
              <p className="text-sm font-medium uppercase tracking-widest">No users found</p>
            </div>
          )}
        </div>
      </div>

      {selectedUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-[#151521]/80 backdrop-blur-sm" onClick={() => setSelectedUser(null)}>
          <div className="bg-[#1e1e2d] w-full max-w-2xl rounded-[2rem] shadow-2xl border border-white/[0.05] overflow-hidden relative" onClick={(e) => e.stopPropagation()}>
            
            <div 
              className="h-32 bg-[#151521] relative bg-cover bg-center border-b border-white/[0.05]"
              style={{ backgroundImage: selectedUser.bg_img_url ? `url(${selectedUser.bg_img_url})` : 'none' }}
            >
              <button 
                onClick={() => setSelectedUser(null)} 
                className="absolute top-4 right-4 p-2 text-white/50 hover:text-white bg-black/40 rounded-lg backdrop-blur-sm transition-colors border border-white/[0.1]"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="px-8 pb-8">
              
              <div className="relative -mt-12 mb-8 flex items-end gap-6">
                <div className="relative">
                  <img src={selectedUser.avatar_url || 'https://via.placeholder.com/150'} className="w-24 h-24 rounded-2xl border-4 border-[#1e1e2d] shadow-xl object-cover bg-[#151521]" alt="profile" />
                  <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-4 border-[#1e1e2d] ${selectedUser.is_active ? 'bg-[#1bc5bd]' : 'bg-[#f64e60]'}`}></div>
                </div>
                <div className="pb-1">
                    <h2 className="text-2xl font-black text-white tracking-wide uppercase">{selectedUser.first_name} {selectedUser.last_name}</h2>
                    <p className="text-[#3699ff] font-bold text-xs mt-1 uppercase tracking-widest">@{selectedUser.username}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-[#151521] p-4 rounded-xl border border-white/[0.02] flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#3699ff]/10 flex items-center justify-center text-[#3699ff]">
                    <UsersIcon size={18} />
                  </div>
                  <div>
                      <p className="text-white font-bold text-lg leading-none mb-1">{selectedUser.followers ?? 0}</p>
                      <p className="text-[10px] text-[#a2a5b9] font-bold uppercase tracking-widest">Followers</p>
                  </div>
                </div>
                <div className="bg-[#151521] p-4 rounded-xl border border-white/[0.02] flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#3699ff]/10 flex items-center justify-center text-[#3699ff]">
                    <UserPlus size={18} />
                  </div>
                  <div>
                      <p className="text-white font-bold text-lg leading-none mb-1">{selectedUser.followings ?? 0}</p>
                      <p className="text-[10px] text-[#a2a5b9] font-bold uppercase tracking-widest">Following</p>
                  </div>
                </div>
              </div>

              {selectedUser.bio && (
                <div className="mb-6 p-5 bg-[#151521] rounded-xl border border-white/[0.02]">
                  <p className="text-[10px] text-[#a2a5b9] uppercase font-bold tracking-widest mb-2 flex items-center gap-2">
                    <BookOpen size={14}/> Biography
                  </p>
                  <p className="text-white text-sm leading-relaxed italic border-l-2 border-[#3699ff]/30 pl-3">"{selectedUser.bio}"</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="bg-[#151521] p-5 rounded-xl border border-white/[0.02]">
                  <p className="text-[10px] text-[#a2a5b9] uppercase font-bold tracking-widest mb-2">Email Address</p>
                  <p className="text-white font-bold truncate text-sm">
                    {selectedUser.email || 'N/A'}
                  </p>
                </div>
                <div className="bg-[#151521] p-5 rounded-xl border border-white/[0.02]">
                  <p className="text-[10px] text-[#a2a5b9] uppercase font-bold tracking-widest mb-2">Registration Date</p>
                  <p className="text-white font-bold truncate text-sm">
                    {formatDate(selectedUser.joined_at).date}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-6 border-t border-white/[0.05]">
                <button 
                  onClick={() => handleToggleStatus(selectedUser)} 
                  className={`w-full py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${
                    selectedUser.is_active 
                    ? 'bg-[#f64e60] hover:bg-rose-600 text-white shadow-[0_4px_12px_rgba(246,78,96,0.2)]' 
                    : 'bg-[#1bc5bd] hover:bg-emerald-500 text-white shadow-[0_4px_12px_rgba(27,197,189,0.2)]'
                  }`}
                >
                  {selectedUser.is_active ? <><ShieldAlert size={16} /> Ban User Account</> : <><CheckCircle size={16} /> Restore User Access</>}
                </button>
                <p className="text-center text-[10px] font-bold tracking-widest uppercase text-[#a2a5b9] mt-2">
                  Current Status: {selectedUser.is_active ? <span className="text-[#1bc5bd]">Active</span> : <span className="text-[#f64e60]">Restricted</span>}
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