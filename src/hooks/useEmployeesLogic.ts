import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getEmployeesList, createEmployee } from '../api/employeeService';
import { EmployeeData, SortKey, SortDirection } from '../types/employee';

export const useEmployeesLogic = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [employees, setEmployees] = useState<EmployeeData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
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
        try {
            setLoading(true);
            const token = localStorage.getItem('admin_token');
            const employeeData = {
                user_id: 3,
                first_name: newEmployee.first_name,
                last_name: newEmployee.last_name,
                avatar_url: newEmployee.avatar_url,
                location: newEmployee.location,
                is_online: false,
                phone: newEmployee.phone,
                email: newEmployee.email,
                department: newEmployee.department
            };
            
            await createEmployee(employeeData, token);
            await fetchEmployees();
        } catch (err: any) {
            console.error("Error adding employee:", err);
        } finally {
            setLoading(false);
        }
    };

    const processedEmployees = useMemo(() => {
        const list = Array.isArray(employees) ? employees : [];
        let result = list.filter(e => {
            if (e.employee_id === 0) return false;
            
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