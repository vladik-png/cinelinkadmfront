import React, { useEffect, useState } from 'react';
import { getEmployeeProfile, deactivateEmployee } from '../api/profileService';
import { Mail, Phone, Calendar, MapPin, Briefcase, ShieldCheck, LogIn, Trash2, Hexagon } from 'lucide-react';

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
  //created_at: string;
}

const formatDate = (dateString?: string) => {
  if (!dateString) return 'N/A';
  try {
    let fixedString = dateString.trim().replace(' ', 'T');
    const date = new Date(fixedString);
    if (isNaN(date.getTime())) {
      const simpleDate = dateString.split(' ')[0];
      if (simpleDate.includes('-')) {
        const [y, m, d] = simpleDate.split('-');
        return `${d}.${m}.${y}`;
      }
      return 'N/A';
    }
    return date.toLocaleDateString('uk-UA', { day: '2-digit', month: '2-digit', year: 'numeric' });
  } catch {
    return 'N/A';
  }
};

const Profile: React.FC = () => {
  const [emp, setEmp] = useState<EmployeeData | null>(null);
  const [loading, setLoading] = useState(true);

const fetchProfile = async () => {
  const id = localStorage.getItem('employee_id');
  if (!id) return;
  try {
    const data = await getEmployeeProfile(id);
    if (data.results) {
      console.log("Profile:", data.results);
      setEmp(data.results);
    }
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
        await deactivateEmployee(emp.employee_id);
        alert("Status updated to inactive");
      } catch (err) {
        console.error("Deactivation error", err);
      }
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#151521] flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#3699ff]/30 border-t-[#3699ff] rounded-full animate-spin mb-4"></div>
        <p className="uppercase tracking-widest text-[10px] text-[#a2a5b9] font-bold">Loading Profile...</p>
      </div>
    );
  }

  if (!emp) {
    return (
      <div className="min-h-screen bg-[#151521] flex items-center justify-center">
        <div className="bg-[#1e1e2d] p-10 rounded-2xl border border-white/[0.05] text-center">
          <Trash2 size={40} className="text-[#f64e60] mx-auto mb-4 opacity-50" />
          <p className="text-[#f64e60] font-bold uppercase tracking-widest text-sm">Employee Not Found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#151521] text-[#a2a5b9] font-sans p-6 lg:p-8 flex flex-col relative z-0">
      
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">My Profile</h1>
        <p className="text-[#a2a5b9] text-sm">Manage your personal information and system preferences.</p>
      </div>

      <div className="bg-[#1e1e2d] rounded-2xl border border-white/[0.05] overflow-hidden shadow-lg max-w-6xl">
        
        <div className="h-48 bg-[#151521] relative border-b border-white/[0.05] overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-[#3699ff]/40 via-transparent to-transparent"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none">
             <Hexagon size={200} className="text-[#3699ff] fill-[#3699ff]" />
          </div>
        </div>

        <div className="px-8 pb-12">
          <div className="relative -mt-16 mb-10 flex flex-col md:flex-row gap-6 md:items-end">
            <div className="relative inline-block">
              <img 
                src={emp.avatar_url || `https://ui-avatars.com/api/?name=${emp.first_name}+${emp.last_name}&background=151521&color=3699ff`} 
                alt="Avatar" 
                className="w-32 h-32 rounded-2xl border-4 border-[#1e1e2d] bg-[#151521] object-cover shadow-xl relative z-10"
              />
              <div className="absolute -bottom-2 -right-2 bg-[#1bc5bd] w-8 h-8 rounded-lg border-4 border-[#1e1e2d] flex items-center justify-center z-20">
                <ShieldCheck size={14} className="text-[#1e1e2d]" />
              </div>
            </div>

            <div className="pb-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="px-2.5 py-1 bg-[#3699ff]/10 text-[#3699ff] text-[10px] font-bold uppercase tracking-widest rounded border border-[#3699ff]/20">
                  ID: {emp.employee_id}
                </span>
                <span className="flex items-center gap-1.5 text-xs text-[#a2a5b9] font-medium">
                  <MapPin size={12} className="text-[#f64e60]" />
                  {emp.location || 'Unknown Location'}
                </span>
              </div>
              <h2 className="text-3xl font-bold text-white tracking-wide uppercase">
                {emp.first_name} {emp.last_name}
              </h2>
              <p className="text-[#3699ff] text-xs font-semibold uppercase tracking-widest mt-1">
                System Administrator
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            <InfoTile icon={<Mail />} label="Corporate Email" value={emp.email} />
            <InfoTile icon={<Phone />} label="Contact Phone" value={emp.phone || 'Not specified'} />
            <InfoTile icon={<Calendar />} label="Hire Date" value={formatDate(emp.hire_date)} />
            <InfoTile icon={<Briefcase />} label="Department Unit" value={`Department #${emp.department_id || '0'}`} />
            <InfoTile icon={<LogIn />} label="Last Activity" value={formatDate(emp.last_login_at)} />
            <InfoTile icon={<LogIn />} label="Created At" value={formatDate(emp.created_at)} />
          </div>

          <div className="pt-8 border-t border-white/[0.05]">
            <h3 className="text-sm font-semibold text-white mb-4">Danger Zone</h3>
            <button 
              onClick={handleDeactivate}
              className="flex items-center gap-2 px-6 py-3 bg-[#f64e60]/10 hover:bg-[#f64e60]/20 text-[#f64e60] border border-[#f64e60]/20 rounded-xl transition-all duration-300 font-bold text-xs uppercase tracking-widest"
            >
              <Trash2 size={16} /> 
              Deactivate Account
            </button>
            <p className="text-xs text-[#a2a5b9] mt-2">
              Deactivating this account will immediately revoke all system access.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

const InfoTile: React.FC<{
  icon: React.ReactNode, 
  label: string, 
  value: string
}> = ({icon, label, value}) => {
  return (
    <div className="bg-[#151521] p-5 rounded-xl border border-white/[0.02] flex items-start gap-4 group hover:border-white/[0.08] transition-colors">
      <div className="p-3 bg-[#3699ff]/10 text-[#3699ff] rounded-lg border border-[#3699ff]/20 shrink-0 group-hover:scale-110 transition-transform duration-300">
        {React.cloneElement(icon as any, { size: 18 })}
      </div>
      <div className="overflow-hidden">
        <p className="text-[10px] uppercase font-bold text-[#a2a5b9] tracking-widest mb-1">{label}</p>
        <p className="font-semibold text-white text-sm truncate">
          {value}
        </p>
      </div>
    </div>
  );
}

export default Profile;