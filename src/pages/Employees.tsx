import * as React from 'react';
import { useEffect, useState, useMemo } from 'react';
import { getEmployeesList } from '../api/userService';
import { 
  ShieldCheck, Search, X, Download, MapPin, 
  UserCircle, Eye, ArrowUpDown, ArrowUp, ArrowDown, Building2, Hash, Hexagon
} from 'lucide-react';

interface EmployeeData {
  employee_id: number;
  first_name: string;
  last_name: string;
  avatar_url: string;
  location: string;
  created_at: string;
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
    try {
      setLoading(true);
      const responseData = await getEmployeesList();

      if (responseData && responseData.results && Array.isArray(responseData.results)) {
        setEmployees(responseData.results);
      } else if (Array.isArray(responseData)) {
        setEmployees(responseData);
      } else if (responseData && Array.isArray(responseData.data)) {
        setEmployees(responseData.data);
      }
    } catch (err: any) {
      console.error("API Error:", err);
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
    link.download = `staff_directory.csv`;
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

  const SortIcon = ({ columnKey }: { columnKey: SortKey }) => {
    if (sortConfig.key !== columnKey) {
      return <ArrowUpDown size={12} className="text-[#a2a5b9] opacity-0 group-hover:opacity-100 transition-opacity" />;
    }
    return sortConfig.direction === 'asc' 
      ? <ArrowUp size={12} className="text-[#3699ff]" /> 
      : <ArrowDown size={12} className="text-[#3699ff]" />;
  };

  return (
    <div className="w-full flex flex-col bg-[#151521] min-h-screen font-sans text-[#a2a5b9] relative">
      <div className="bg-[#1e1e2d] py-4 px-8 flex justify-between items-center sticky top-0 z-40 shadow-sm border-b border-white/[0.05]">
        <div className="flex items-center gap-3">
           <div className="p-2 bg-[#3699ff]/10 rounded-lg border border-[#3699ff]/20">
             <ShieldCheck size={18} className="text-[#3699ff]" />
           </div>
           <h2 className="text-xs tracking-[0.2em] uppercase font-bold text-white">Staff Management</h2>
        </div>
        <div className="relative w-96">
          <input 
            type="text" 
            placeholder="Search staff by name, ID or location..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            className="w-full bg-[#151521] border border-white/[0.05] text-white text-xs px-10 py-2.5 rounded-xl outline-none focus:border-[#3699ff]/50 focus:bg-[#151521]/80 transition-all placeholder-[#a2a5b9]/50" 
          />
          <Search size={14} className="absolute left-4 top-3 text-[#a2a5b9]" />
        </div>
      </div>

      <div className="p-8 w-full flex-1 flex flex-col max-w-7xl mx-auto">
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-3xl text-white uppercase font-bold leading-none tracking-wide">Personnel</h1>
            <div className="flex items-center gap-3 mt-3">
              <span className="bg-[#3699ff]/10 text-[#3699ff] border border-[#3699ff]/20 px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest">
                Total: {employees.length}
              </span>
              <span className="text-[#a2a5b9] uppercase text-[10px] tracking-widest font-semibold">
                Showing: {processedEmployees.length} results
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={exportToCSV} 
              className="flex items-center gap-2 bg-[#1e1e2d] text-[#3699ff] text-[10px] font-bold uppercase tracking-widest px-6 py-3 rounded-xl hover:bg-white/[0.02] border border-white/[0.05] transition-all active:scale-95"
            >
              <Download size={14} /> Export CSV
            </button>
          </div>
        </div>

        <div className="bg-[#1e1e2d] border border-white/[0.05] rounded-2xl shadow-lg flex-1 overflow-hidden flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#151521]/50 border-b border-white/[0.05] text-[10px] uppercase tracking-widest text-[#a2a5b9] select-none">
                  <th 
                    className="py-5 px-6 font-bold w-24 text-center cursor-pointer hover:bg-white/[0.02] transition-colors group"
                    onClick={() => handleSort('id')}
                  >
                    <div className="flex items-center justify-center gap-2">ID <SortIcon columnKey="id" /></div>
                  </th>
                  <th 
                    className="py-5 px-6 font-bold cursor-pointer hover:bg-white/[0.02] transition-colors group"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center gap-2">Staff Profile <SortIcon columnKey="name" /></div>
                  </th>
                  <th 
                    className="py-5 px-6 font-bold cursor-pointer hover:bg-white/[0.02] transition-colors group"
                    onClick={() => handleSort('location')}
                  >
                    <div className="flex items-center gap-2">Location <SortIcon columnKey="location" /></div>
                  </th>
                  <th className="py-5 px-6 font-bold text-right">Actions</th>
                </tr>
              </thead>
              
              <tbody className="text-sm">
                {processedEmployees.map((emp) => (
                  <tr 
                    key={emp.employee_id} 
                    onClick={() => setSelectedEmployee(emp)}
                    className="border-b border-white/[0.02] hover:bg-white/[0.02] transition-colors cursor-pointer group"
                  >
                    <td className="py-4 px-6 text-center text-[#a2a5b9] text-xs font-semibold">
                      #{emp.employee_id}
                    </td>
                    
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <img 
                          src={emp.avatar_url || 'https://via.placeholder.com/150'} 
                          className="w-10 h-10 rounded-xl object-cover border border-white/[0.05] bg-[#151521]" 
                          alt="avatar" 
                        />
                        <div className="min-w-0">
                          <h3 className="text-sm font-bold text-white truncate uppercase tracking-wide">
                            {emp.first_name} {emp.last_name}
                          </h3>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2 text-[#a2a5b9]">
                        <MapPin size={14} className="text-[#3699ff]" />
                        <span className="text-[11px] font-semibold uppercase tracking-widest">{emp.location || 'Unknown Location'}</span>
                      </div>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={(e) => { e.stopPropagation(); setSelectedEmployee(emp); }}
                          className="p-2 text-[#3699ff] bg-[#3699ff]/10 hover:bg-[#3699ff]/20 rounded-lg transition-colors border border-[#3699ff]/20"
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
               <div className="w-full py-20 flex flex-col items-center justify-center">
                 <div className="w-6 h-6 border-2 border-[#3699ff]/30 border-t-[#3699ff] rounded-full animate-spin mb-4"></div>
                 <p className="text-[#a2a5b9] uppercase text-[10px] font-bold tracking-widest">Syncing Database...</p>
               </div>
            )}

            {processedEmployees.length === 0 && !loading && (
              <div className="w-full py-20 flex flex-col items-center justify-center text-[#a2a5b9]">
                <UserCircle size={48} className="mb-4 opacity-20" />
                <p className="text-sm font-bold uppercase tracking-widest">No staff found matching criteria</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedEmployee && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#151521]/80 backdrop-blur-sm" onClick={() => setSelectedEmployee(null)}>
          <div className="bg-[#1e1e2d] border border-white/[0.05] w-full max-w-2xl rounded-[2rem] shadow-2xl overflow-hidden relative" onClick={(e) => e.stopPropagation()}>
            <div 
              className="h-32 bg-[#151521] relative bg-cover bg-center border-b border-white/[0.05]"
              style={{ backgroundImage: selectedEmployee.bg_img_url ? `url(${selectedEmployee.bg_img_url})` : 'none' }}
            >
              {!selectedEmployee.bg_img_url && (
                <div className="absolute inset-0 flex items-center justify-center opacity-10">
                  <Hexagon size={80} className="text-[#3699ff] fill-[#3699ff]" />
                </div>
              )}
              <button 
                onClick={() => setSelectedEmployee(null)} 
                className="absolute top-4 right-4 p-2 text-[#a2a5b9] hover:text-white bg-[#151521]/50 border border-white/[0.05] rounded-full backdrop-blur-md transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="px-10 pb-10">
                <div className="relative -mt-12 mb-8 flex items-end gap-5">
                    <img 
                      src={selectedEmployee.avatar_url || 'https://via.placeholder.com/150'} 
                      className="w-28 h-28 rounded-full border-[6px] border-[#1e1e2d] shadow-xl object-cover bg-[#151521]" 
                      alt="profile" 
                    />
                    <div className="pb-1">
                        <h2 className="text-2xl font-bold text-white uppercase tracking-wide leading-tight">
                          {selectedEmployee.first_name} {selectedEmployee.last_name}
                        </h2>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="w-2 h-2 rounded-full bg-[#1bc5bd] shadow-[0_0_8px_rgba(27,197,189,0.5)]"></span>
                          <p className="text-[#1bc5bd] font-bold uppercase text-[10px] tracking-widest">Active Member</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-5 mb-8">
                    <div className="bg-[#151521] p-5 rounded-xl border border-white/[0.02]">
                        <p className="text-[10px] text-[#a2a5b9] uppercase font-bold mb-1 tracking-widest flex items-center gap-2 leading-none">
                          <Building2 size={12} className="text-[#3699ff]" /> Base Location
                        </p>
                        <p className="text-white font-semibold truncate text-sm mt-2">{selectedEmployee.location || 'Unknown'}</p>
                    </div>
                    <div className="bg-[#151521] p-5 rounded-xl border border-white/[0.02]">
                        <p className="text-[10px] text-[#a2a5b9] uppercase font-bold mb-1 tracking-widest flex items-center gap-2 leading-none">
                          <Hash size={12} className="text-[#3699ff]" /> Staff ID Number
                        </p>
                        <p className="text-white font-semibold truncate text-sm mt-2">#{selectedEmployee.employee_id}</p>
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <button 
                      onClick={() => setSelectedEmployee(null)} 
                      className="w-full py-4 rounded-xl text-[10px] uppercase tracking-widest font-bold transition-all active:scale-95 flex items-center justify-center gap-2 bg-[#3699ff]/10 hover:bg-[#3699ff]/20 text-[#3699ff] border border-[#3699ff]/20"
                    >
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