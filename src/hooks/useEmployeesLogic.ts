import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useEmployeeStore } from '../store/employeeStore';
import { EmployeeData, SortKey, SortDirection } from '../types/employee';

export const useEmployeesLogic = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const { employees, loading, fetchEmployees, addEmployee: storeAddEmployee } = useEmployeeStore();
    
    const [searchTerm, setSearchTerm] = useState<string>(searchParams.get('search') || '');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 20;

    useEffect(() => {
        const s = searchParams.get('search');
        if (s !== null && s !== searchTerm) {
            setSearchTerm(s);
        }
    }, [searchParams]);

    const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection }>({
        key: 'id',
        direction: 'asc'
    });

    useEffect(() => {
        fetchEmployees();
    }, [fetchEmployees]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, sortConfig]);

    const handleSort = (key: SortKey) => {
        setSortConfig(prev => ({
            key,
            direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    const addEmployee = async (newEmployee: Partial<EmployeeData>) => {
        const success = await storeAddEmployee(newEmployee);
        if (success) {
            setSortConfig({ key: 'id', direction: 'desc' });
            setCurrentPage(1);
        }
    };

    const processedEmployees = useMemo(() => {
        const list = Array.isArray(employees) ? employees : [];
        
        let result = list.filter(e => {
            const search = searchTerm?.toLowerCase().trim();
            
            if (!search) return true;

            return (
                (e.first_name || "").toLowerCase().includes(search) ||
                (e.last_name || "").toLowerCase().includes(search) ||
                (e.location || "").toLowerCase().includes(search) ||
                (e.employee_id ? e.employee_id.toString().includes(search) : false) ||
                (e as any).id?.toString().includes(search)
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

    const paginatedEmployees = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return processedEmployees.slice(startIndex, startIndex + itemsPerPage);
    }, [processedEmployees, currentPage]);

    const totalPages = Math.ceil(processedEmployees.length / itemsPerPage);

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
        paginatedEmployees,
        currentPage,
        setCurrentPage,
        totalPages,
        loading,
        searchTerm,
        setSearchTerm,
        sortConfig,
        handleSort,
        exportToCSV,
        addEmployee
    };
};