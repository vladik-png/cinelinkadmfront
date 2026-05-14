import { useState, useEffect } from 'react';
import { getEmployee } from '../api/userService';

export const useHeaderLogic = () => {
    const [employee, setEmployee] = useState<any>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            const empId = localStorage.getItem('employee_id');
            if (!empId) return;
            try {
                const data = await getEmployee(empId);
                if (data && data.results) {
                    setEmployee(data.results);
                }
            } catch (err) { }
        };
        fetchProfile();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('employee_id');
        window.location.href = '/';
    };

    return {
        employee,
        handleLogout
    };
};