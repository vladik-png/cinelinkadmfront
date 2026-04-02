import * as React from 'react';
import { useEffect, useState, useMemo } from 'react';
import { getEmployeesList } from '../api/userService';
import { 
  ShieldCheck, Search, X, Download, MapPin, 
  ChevronDown, SlidersHorizontal, UserCircle 
} from 'lucide-react';

interface EmployeeData {
  employee_id: number;
  first_name: string;
  last_name: string;
  avatar_url: string;
  location: string;
}

const Employees: React.FC = () => {
  const [employees, setEmployees] = useState<EmployeeData[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortType, setSortType] = useState<'az' | 'za'>('az');
  const [loading, setLoading] = useState(true);

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

  const filteredEmployees = useMemo(() => {
    const list = Array.isArray(employees) ? employees : [];
    let result = list.filter(e => {
      const search = searchTerm.toLowerCase();
      return (
        (e.first_name || "").toLowerCase().includes(search) ||
        (e.last_name || "").toLowerCase().includes(search) ||
        (e.location || "").toLowerCase().includes(search)
      );
    });

    result.sort((a, b) => {
      const nameA = a.first_name || "";
      const nameB = b.first_name || "";
      return sortType === 'az' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
    });

    return result;
  }, [employees, searchTerm, sortType]);

  const exportToCSV = () => {
    if (filteredEmployees.length === 0) return;
    const delimiter = ";";
    const headers = ["ID", "Name", "Location"].join(delimiter);
    const dataRows = filteredEmployees.map(e => `${e.employee_id};${e.first_name} ${e.last_name};${e.location}`).join("\n");
    const blob = new Blob(["\uFEFF" + headers + "\n" + dataRows], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "employees_export.csv";
    link.click();
  };

  return (
    <div className="w-full flex flex-col bg-[#f8fafc] min-h-screen font-medium relative">
      <div className="bg-[#0f172a] py-4 px-10 flex justify-between items-center sticky top-0 z-50 shadow-md border-b border-slate-800">
        <div className="flex items-center gap-2">
           <ShieldCheck size={16} className="text-[#3b82f6]" />
           <h2 className="text-sm tracking-widest uppercase font-bold text-white">Staff Management System</h2>
        </div>
        <div className="relative w-72">
          <input 
            type="text" 
            placeholder="Search employees..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            className="w-full bg-slate-800/50 border border-slate-700 text-white text-[11px] px-10 py-3 rounded-xl outline-none focus:border-[#3b82f6] transition-all" 
          />
          <Search size={14} className="absolute left-3 top-3.5 text-slate-500" />
        </div>
      </div>

      <div className="p-10 w-full">
        <div className="mb-10 border-b border-slate-200 pb-8 flex justify-between items-end">
          <div>
            <h1 className="text-4xl text-slate-900 uppercase tracking-tighter font-black leading-none">Employee List</h1>
            <p className="text-slate-400 mt-2 uppercase text-[10px] tracking-[0.4em]">Active personnel: {filteredEmployees.length}</p>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={exportToCSV}
              className="flex items-center gap-3 bg-[#0f172a] border border-slate-800 text-[#3b82f6] text-[11px] font-black uppercase px-6 py-4 rounded-2xl hover:bg-slate-800 transition-all shadow-xl active:scale-95"
            >
              <Download size={14} />
              <span>Export CSV</span>
            </button>

            <div className="relative">
              <SlidersHorizontal size={12} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3b82f6]" />
              <select 
                value={sortType}
                onChange={(e) => setSortType(e.target.value as any)}
                className="appearance-none bg-[#0f172a] border border-slate-800 text-[#3b82f6] text-[11px] font-black uppercase pl-11 pr-12 py-4 rounded-2xl outline-none hover:bg-slate-800 transition-all cursor-pointer shadow-xl active:scale-95"
              >
                <option value="az">Sort: A-Z Name</option>
                <option value="za">Sort: Z-A Name</option>
              </select>
              <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#3b82f6] pointer-events-none" />
            </div>
          </div>
        </div>

        {loading ? (
           <div className="w-full py-20 text-center text-slate-400 uppercase text-xs font-black tracking-widest animate-pulse">Syncing Database...</div>
        ) : filteredEmployees.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
            {filteredEmployees.map((emp) => (
              <div key={emp.employee_id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-7 group hover:shadow-xl transition-all duration-300">
                <div className="flex items-start gap-5">
                  <img src={emp.avatar_url || 'https://via.placeholder.com/150'} className="w-16 h-16 rounded-[1.2rem] object-cover border border-slate-100 shadow-sm" alt="avatar" />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[17px] font-black text-slate-900 truncate uppercase leading-tight">{emp.first_name} {emp.last_name}</h3>
                    <div className="flex items-center gap-2 mt-3 text-[#3b82f6]">
                      <MapPin size={11} />
                      <span className="text-[10px] font-bold uppercase tracking-wider leading-none pt-0.5">{emp.location}</span>
                    </div>
                  </div>
                </div>
                <button className="w-full mt-7 py-4 bg-slate-50 text-slate-400 text-[10px] uppercase font-black rounded-xl group-hover:bg-[#0f172a] group-hover:text-white transition-all shadow-sm active:scale-95">Inspect Staff ID</button>
              </div>
            ))}
          </div>
        ) : (
          <div className="w-full py-20 text-center">
             <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300"><UserCircle size={32} /></div>
             <p className="text-slate-400 uppercase text-[10px] font-black tracking-widest">No records found. Check console for RAW DATA.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Employees;