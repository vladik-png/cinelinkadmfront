import * as React from 'react';
import { useState } from 'react';
import { EmployeeData } from '../../../types/employee';

interface AddEmployeeFormProps {
    onClose: () => void;
    onAdd: (employee: Partial<EmployeeData>) => void;
}

export const AddEmployeeForm: React.FC<AddEmployeeFormProps> = ({ onClose, onAdd }) => {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        phone: '',
        email: '',
        department: 'Engineering',
        location: '',
        password: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAdd({
            first_name: formData.first_name,
            last_name: formData.last_name,
            phone: formData.phone,
            email: formData.email,
            department: formData.department,
            location: formData.location,
            password: formData.password,
            avatar_url: `https://i.pravatar.cc/150?u=${Math.random()}`,
            created_at: new Date().toISOString(),
        });
        onClose();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
            <div className="flex gap-4">
                <div className="flex flex-col gap-1.5 flex-1">
                    <label className="text-[10px] uppercase tracking-wider font-bold text-[#a2a5b9] px-1">First Name</label>
                    <input
                        type="text"
                        name="first_name"
                        required
                        value={formData.first_name}
                        onChange={handleChange}
                        className="w-full bg-[#151521] border border-white/[0.05] text-white text-sm px-4 py-2.5 rounded-xl outline-none focus:border-[#3699ff]/50 focus:bg-[#151521]/80 transition-all"
                        placeholder="John"
                    />
                </div>
                <div className="flex flex-col gap-1.5 flex-1">
                    <label className="text-[10px] uppercase tracking-wider font-bold text-[#a2a5b9] px-1">Last Name</label>
                    <input
                        type="text"
                        name="last_name"
                        required
                        value={formData.last_name}
                        onChange={handleChange}
                        className="w-full bg-[#151521] border border-white/[0.05] text-white text-sm px-4 py-2.5 rounded-xl outline-none focus:border-[#3699ff]/50 focus:bg-[#151521]/80 transition-all"
                        placeholder="Doe"
                    />
                </div>
            </div>

            <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase tracking-wider font-bold text-[#a2a5b9] px-1">Phone</label>
                <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-[#151521] border border-white/[0.05] text-white text-sm px-4 py-2.5 rounded-xl outline-none focus:border-[#3699ff]/50 focus:bg-[#151521]/80 transition-all"
                    placeholder="+1 (555) 000-0000"
                />
            </div>

            <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase tracking-wider font-bold text-[#a2a5b9] px-1">Email</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-[#151521] border border-white/[0.05] text-white text-sm px-4 py-2.5 rounded-xl outline-none focus:border-[#3699ff]/50 focus:bg-[#151521]/80 transition-all"
                    placeholder="john.doe@example.com"
                />
            </div>

            <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase tracking-wider font-bold text-[#a2a5b9] px-1">Password</label>
                <input
                    type="text"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full bg-[#151521] border border-white/[0.05] text-white text-sm px-4 py-2.5 rounded-xl outline-none focus:border-[#3699ff]/50 focus:bg-[#151521]/80 transition-all"
                    placeholder="Set password"
                />
            </div>

            <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase tracking-wider font-bold text-[#a2a5b9] px-1">Department</label>
                <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full bg-[#151521] border border-white/[0.05] text-white text-sm px-4 py-2.5 rounded-xl outline-none focus:border-[#3699ff]/50 focus:bg-[#151521]/80 transition-all appearance-none"
                >
                    <option value="Administration">Administration</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Sales">Sales</option>
                    <option value="Human Resources">Human Resources</option>
                    <option value="Support">Support</option>
                    <option value="Design">Design</option>
                </select>
            </div>

            <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase tracking-wider font-bold text-[#a2a5b9] px-1">Location</label>
                <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full bg-[#151521] border border-white/[0.05] text-white text-sm px-4 py-2.5 rounded-xl outline-none focus:border-[#3699ff]/50 focus:bg-[#151521]/80 transition-all"
                    placeholder="New York, USA"
                />
            </div>

            <div className="mt-4 flex justify-end gap-3">
                <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest text-[#a2a5b9] hover:text-white hover:bg-white/5 transition-all"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest bg-[#3699ff] text-white hover:bg-[#3699ff]/90 transition-all active:scale-95 shadow-[0_0_20px_rgba(54,153,255,0.3)]"
                >
                    Add Employee
                </button>
            </div>
        </form>
    );
};
