import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Mail, Phone, Calendar, MapPin, Briefcase, Hash, ShieldCheck, LogIn, Trash2 } from 'lucide-react';

interface EmployeeData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  hire_date: string;
  avatar_url: string;
  location: string;
  department_id: number;
  employee_id: number;
  last_login_at: string;
}

const Profile: React.FC = () => {
  const [emp, setEmp] = useState<EmployeeData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    const id = localStorage.getItem('employee_id');
    if (!id) return;
    try {
      const res = await api.get(`http://localhost:8080/employee/${id}`);
      if (res.data.results) setEmp(res.data.results);
    } catch (err) {
      console.error("Error loading profile", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivate = async () => {
    if (!emp) return;
    if (window.confirm("Make this employee inactive?")) {
      try {
        await api.delete(`http://localhost:8080/employee/${emp.employee_id}`);
        alert("Status updated to inactive");
      } catch (err) {
        console.error("Deactivation error", err);
      }
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) return <div className="min-h-screen bg-[#f1f5f9] flex items-center justify-center uppercase tracking-widest text-[10px] text-slate-400 font-bold">Loading Configuration...</div>;
  if (!emp) return <div className="p-10 text-center text-red-500 font-bold uppercase">Employee Not Found</div>;

  const formattedDate = new Date(emp.hire_date).toLocaleDateString('uk-UA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-[#f1f5f9] pb-20 font-medium">
      <div className="h-[200px] bg-gradient-to-r from-slate-900 via-[#0f172a] to-blue-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-500/40 via-transparent to-transparent"></div>
        <div className="max-w-7xl mx-auto px-10 pt-6 relative z-10 opacity-20 select-none">
           <h1 className="text-[6rem] font-black text-white leading-none tracking-tighter">PROFILE</h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 relative z-20 -mt-20">
        <div className="bg-white/95 backdrop-blur-xl rounded-[3.5rem] shadow-2xl p-12 lg:p-16 border border-white/50 relative overflow-hidden">
          
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-blue-100 rounded-full blur-3xl opacity-40 pointer-events-none"></div>

          <div className="flex flex-col md:flex-row gap-12 items-center mb-16 border-b border-slate-100 pb-16">
            <div className="relative group shrink-0">
              <div className="absolute -inset-1.5 bg-gradient-to-br from-blue-600 to-cyan-400 rounded-full blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
              <img 
                src={emp.avatar_url || `https://ui-avatars.com/api/?name=${emp.first_name}+${emp.last_name}&background=0D8ABC&color=fff`} 
                alt="Avatar" 
                className="relative w-52 h-52 rounded-full border-[8px] border-white shadow-2xl object-cover"
              />
              <div className="absolute bottom-2 right-2 bg-green-500 w-9 h-9 rounded-full border-[5px] border-white shadow-md flex items-center justify-center">
                <ShieldCheck size={16} className="text-white" />
              </div>
            </div>

            <div className="text-center md:text-left flex-1">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-5">
                <span className="px-4 py-1.5 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-[0.2em] rounded-lg border border-blue-100">
                  ID: {emp.employee_id}
                </span>
                <div className="flex items-center gap-2 text-slate-400 text-[11px] uppercase font-bold tracking-[0.2em]">
                  <MapPin size={14} className="text-blue-500" />
                  {emp.location}
                </div>
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-black text-slate-900 tracking-tighter leading-none uppercase">
                {emp.first_name} {emp.last_name}
              </h1>
              <p className="text-slate-400 text-sm font-bold uppercase tracking-[0.4em] mt-5">
                Cinelink System Administrator
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <InfoTile icon={<Mail />} label="Corporate Email" value={emp.email} isEmail />
            <InfoTile icon={<Phone />} label="Contact Phone" value={emp.phone} />
            <InfoTile icon={<Calendar />} label="Hire Date" value={formattedDate} isDate />
            <InfoTile icon={<Briefcase />} label="Department Unit" value={`Department #${emp.department_id}`} />
            {}
            <InfoTile icon={<LogIn />} label="Last Activity" value={emp.last_login_at || 'Never'} />
            
            {}
            <div 
              onClick={handleDeactivate}
              className="bg-rose-500 p-8 rounded-[2.2rem] flex flex-col justify-center items-center text-center group cursor-pointer hover:bg-rose-600 transition-all shadow-xl"
            >
              <div className="text-white text-2xl font-black uppercase tracking-tighter flex items-center gap-2">
                <Trash2 size={24} /> Deactivate
              </div>
              <p className="text-white/70 text-[9px] uppercase font-bold tracking-widest mt-2">Update status to inactive</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoTile: React.FC<{
  icon: React.ReactNode, 
  label: string, 
  value: string, 
  isEmail?: boolean,
  isDate?: boolean
}> = ({icon, label, value, isEmail, isDate}) => {
  return (
    <div className="bg-slate-50/50 hover:bg-white p-7 rounded-[2.2rem] border border-slate-100 transition-all duration-300 hover:shadow-xl hover:border-blue-200 group flex items-center gap-6">
      <div className="p-4 bg-white text-blue-600 rounded-2xl shadow-sm border border-slate-100 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shrink-0">
        {React.cloneElement(icon as React.ReactElement, { size: 24 })}
      </div>
      <div className="overflow-hidden">
        <p className="text-[10px] uppercase font-black text-slate-400 tracking-[0.15em] mb-1 leading-none">{label}</p>
        <p className={`font-bold text-slate-800 leading-tight ${isEmail ? 'text-[13px] break-all' : 'text-lg'} ${isDate ? 'whitespace-nowrap' : ''}`}>
          {value}
        </p>
      </div>
    </div>
  );
}

export default Profile;