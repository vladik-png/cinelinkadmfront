import * as React from 'react';
import { useEffect, useState, useMemo } from 'react';
import { getEmployeesList } from '../api/userService';
import { 
  ShieldCheck, Search, X, Download, MapPin, 
  UserCircle, Eye, ArrowUpDown, ArrowUp, ArrowDown, Building2
} from 'lucide-react';

interface EmployeeData {
  employee_id: number;
  first_name: string;
  last_name: string;
  avatar_url: string;
  location: string;
  created_at:	string;
  bg_img_url?: string;
}

type SortKey = 'id' | 'name' | 'location';
type SortDirection = 'asc' | 'desc';

const Employees: React.FC = () => {
  const [employees, setEmployees] = useState<EmployeeData[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection }>({
    key: 'id',
    direction: 'asc'
  });

  const fetchEmployees = async () => {
    console.log("--- Спроба завантаження працівників ---");
    try {
      setLoading(true);
      const responseData = await getEmployeesList();
      console.log("RAW DATA:", JSON.stringify(responseData, null, 2));

      if (responseData && responseData.results && Array.isArray(responseData.results)) {
        setEmployees(responseData.results);
      } else if (Array.isArray(responseData)) {
        setEmployees(responseData);
      } else if (responseData && Array.isArray(responseData.data)) {
        setEmployees(responseData.data);
      } else {
        console.error("API повернуло дані, але масив не знайдено.");
      }
    } catch (err: any) {
      console.error("Помилка API:", err.response?.status, err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEmployees(); }, []);

  const exportToCSV = () => {
    if (processedEmployees.length === 0) return;
    const delimiter = ";";
    const headers = ["ID", "Name", "Location"].join(delimiter);
    const dataRows = processedEmployees.map(e => [
      e.employee_id,
      `${e.first_name} ${e.last_name}`,
      e.location
    ].join(delimiter));
    
    const csvContent = "\uFEFF" + [headers, ...dataRows].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `employees_directory.csv`;
    link.click();
  };

  const handleSort = (key: SortKey) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const processedEmployees = useMemo(() => {
    const list = Array.isArray(employees) ? employees : [];
    let result = list.filter(e => {
      const search = searchTerm.toLowerCase();
      return (
        (e.first_name || "").toLowerCase().includes(search) ||
        (e.last_name || "").toLowerCase().includes(search) ||
        (e.location || "").toLowerCase().includes(search) ||
        e.employee_id.toString().includes(search)
      );
    });

    result.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortConfig.key) {
        case 'id':
          aValue = a.employee_id; bValue = b.employee_id; break;
        case 'name':
          aValue = `${a.first_name} ${a.last_name}`.toLowerCase(); 
          bValue = `${b.first_name} ${b.last_name}`.toLowerCase(); break;
        case 'location':
          aValue = (a.location || '').toLowerCase(); 
          bValue = (b.location || '').toLowerCase(); break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [employees, searchTerm, sortConfig]);

  // Допоміжний компонент для відмальовки іконки сортування
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
      {/* Top Header */}
      <div className="bg-[#0f172a] py-4 px-10 flex justify-between items-center sticky top-0 z-40 text-white shadow-md border-b border-slate-800">
        <div className="flex items-center gap-2">
           <ShieldCheck size={16} className="text-[#3b82f6]" />
           <h2 className="text-sm tracking-widest uppercase font-bold text-white">Staff Management System</h2>
        </div>
        <div className="relative w-96">
          <input 
            type="text" 
            placeholder="Search staff by name, ID or location..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            className="w-full bg-slate-800/50 border border-slate-700 text-white text-[11px] px-10 py-3 rounded-xl outline-none focus:border-blue-500 transition-colors" 
          />
          <Search size={14} className="absolute left-4 top-3.5 text-slate-500" />
        </div>
      </div>

      <div className="p-10 w-full text-slate-900 flex-1 flex flex-col">
        {/* Main Header Controls */}
        <div className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-4xl text-slate-900 uppercase font-black leading-none tracking-tight">Personnel</h1>
            <div className="flex items-center gap-3 mt-3">
              <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest">
                Total: {employees.length}
              </span>
              <span className="text-slate-400 uppercase text-[10px] tracking-[0.2em] font-bold">
                Showing: {processedEmployees.length} results
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={exportToCSV} className="flex items-center gap-2 bg-[#0f172a] text-[#3b82f6] text-[10px] font-black uppercase px-6 py-3.5 rounded-2xl hover:bg-slate-800 shadow-lg transition-all active:scale-95 border border-slate-800">
              <Download size={14} /> Export CSV
            </button>
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white border border-slate-200 rounded-[2rem] shadow-sm flex-1 overflow-hidden flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase tracking-widest text-slate-400 select-none">
                  <th 
                    className="py-5 px-6 font-black w-24 text-center cursor-pointer hover:bg-slate-100 transition-colors group"
                    onClick={() => handleSort('id')}
                  >
                    <div className="flex items-center justify-center gap-2">ID <SortIcon columnKey="id" /></div>
                  </th>
                  <th 
                    className="py-5 px-6 font-black cursor-pointer hover:bg-slate-100 transition-colors group"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center gap-2">Staff Profile <SortIcon columnKey="name" /></div>
                  </th>
                  <th 
                    className="py-5 px-6 font-black cursor-pointer hover:bg-slate-100 transition-colors group"
                    onClick={() => handleSort('location')}
                  >
                    <div className="flex items-center gap-2">Location <SortIcon columnKey="location" /></div>
                  </th>
                  <th className="py-5 px-6 font-black text-right">Actions</th>
                </tr>
              </thead>
              
              <tbody className="text-sm">
                {processedEmployees.map((emp) => (
                  <tr 
                    key={emp.employee_id} 
                    onClick={() => setSelectedEmployee(emp)}
                    className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors cursor-pointer group"
                  >
                    <td className="py-4 px-6 text-center text-slate-400 font-mono text-xs">
                      #{emp.employee_id}
                    </td>
                    
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <img 
                          src={emp.avatar_url || 'https://via.placeholder.com/150'} 
                          className="w-10 h-10 rounded-xl object-cover border border-slate-200" 
                          alt="avatar" 
                        />
                        <div className="min-w-0">
                          <h3 className="text-sm font-black text-slate-900 truncate uppercase">
                            {emp.first_name} {emp.last_name}
                          </h3>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2 text-slate-500">
                        <MapPin size={12} className="text-[#3b82f6]" />
                        <span className="text-[11px] font-bold uppercase tracking-wider">{emp.location || 'Unknown Location'}</span>
                      </div>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={(e) => { e.stopPropagation(); setSelectedEmployee(emp); }}
                          className="p-2 text-blue-500 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Inspect Staff Profile"
                        >
                          <Eye size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {loading && processedEmployees.length === 0 && (
               <div className="w-full py-20 text-center text-slate-400 uppercase text-xs font-black tracking-widest animate-pulse">
                 Syncing Database...
               </div>
            )}

            {processedEmployees.length === 0 && !loading && (
              <div className="w-full py-20 flex flex-col items-center justify-center text-slate-400">
                <UserCircle size={48} className="mb-4 opacity-20" />
                <p className="text-sm font-bold uppercase tracking-widest">No staff found matching criteria</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Profile Modal */}
      {selectedEmployee && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedEmployee(null)}>
          <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden relative" onClick={(e) => e.stopPropagation()}>
            <div 
              className="h-32 bg-[#0f172a] relative bg-cover bg-center"
              style={{ backgroundImage: selectedEmployee.bg_img_url ? `url(${selectedEmployee.bg_img_url})` : 'none' }}
            >
              <button onClick={() => setSelectedEmployee(null)} className="absolute top-6 right-6 p-2 text-white/50 hover:text-white bg-black/20 rounded-full backdrop-blur-sm transition-colors"><X size={20} /></button>
            </div>
            
            <div className="px-12 pb-12">
                <div className="relative -mt-16 mb-8 flex items-end gap-6">
                    <img src={selectedEmployee.avatar_url || 'https://via.placeholder.com/150'} className="w-32 h-32 rounded-[2.5rem] border-8 border-white shadow-xl object-cover bg-white" alt="profile" />
                    <div className="pb-2">
                        <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter leading-tight">
                          {selectedEmployee.first_name} {selectedEmployee.last_name}
                        </h2>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                          <p className="text-[#3b82f6] font-bold uppercase text-[10px] tracking-widest">Active Staff Member</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-10">
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                        <p className="text-[9px] text-slate-400 uppercase font-black mb-1 tracking-widest flex items-center gap-1.5 leading-none">
                          <Building2 size={10} /> Base Location
                        </p>
                        <p className="text-slate-900 font-bold truncate text-sm mt-2">{selectedEmployee.location || 'N/A'}</p>
                    </div>
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                        <p className="text-[9px] text-slate-400 uppercase font-black mb-1 tracking-widest flex items-center gap-1.5 leading-none">
                          <ShieldCheck size={10} /> Staff ID Number
                        </p>
                        <p className="text-slate-900 font-bold font-mono truncate text-sm mt-2">#{selectedEmployee.employee_id}</p>
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <button onClick={() => setSelectedEmployee(null)} className="w-full py-5 rounded-2xl text-[11px] uppercase tracking-[0.4em] font-black shadow-lg transition-all active:scale-95 flex items-center justify-center gap-3 bg-slate-900 hover:bg-slate-800 text-white">
                      Close Inspection
                    </button>
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Employees;