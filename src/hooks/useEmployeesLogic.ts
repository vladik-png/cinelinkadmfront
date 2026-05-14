import { useState, useEffect, useMemo } from 'react';
import { getEmployeesList } from '../api/userService';
import { EmployeeData, SortKey, SortDirection } from '../types/employee';

export const useEmployeesLogic = () => {
    const [employees, setEmployees] = useState<EmployeeData[]>([]);
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

    useEffect(() => {
        fetchEmployees();
    }, []);

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

    return {
        employees,
        processedEmployees,
        loading,
        searchTerm,
        setSearchTerm,
        sortConfig,
        handleSort,
        exportToCSV
    };
};