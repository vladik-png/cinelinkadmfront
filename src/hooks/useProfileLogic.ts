import { useEffect, useState } from 'react';
import { getEmployeeProfile, deactivateEmployee } from '../api/profileService';
import { EmployeeData } from '../types/profile';

export const useProfileLogic = () => {
    const [emp, setEmp] = useState<EmployeeData | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchProfile = async () => {
        const id = localStorage.getItem('employee_id');
        if (!id) {
            setLoading(false);
            return;
        }

        try {
            const data = await getEmployeeProfile(id);
            if (data.results) {
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

    return {
        emp,
        loading,
        handleDeactivate
    };
};