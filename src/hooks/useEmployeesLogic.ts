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
            
            const departmentMap: Record<string, number> = {
                'Engineering': 1,
                'Marketing': 2,
                'Sales': 3,
                'Human Resources': 4,
                'Support': 5,
                'Design': 6,
                'Administration': 7
            };

            const employeeData = {
                first_name: newEmployee.first_name || '',
                last_name: newEmployee.last_name || '',
                phone: newEmployee.phone || '',
                email: newEmployee.email || '',
                department_id: departmentMap[newEmployee.department as string] || 1,
                location: newEmployee.location || '',
                avatar_url: newEmployee.avatar_url || '',
                created_at: newEmployee.created_at || new Date().toISOString(),
                role: 'administrator',
                password: "password123"
            };

            console.log('Adding employee with data:', employeeData);

            const createdEmployee = await createEmployee(employeeData);

            if (createdEmployee) {
                const newEmployeeData: EmployeeData = {
                    employee_id: createdEmployee.employee_id || Date.now(),
                    first_name: createdEmployee.first_name || employeeData.first_name,
                    last_name: createdEmployee.last_name || employeeData.last_name,
                    avatar_url: createdEmployee.avatar_url || newEmployee.avatar_url || '',
                    location: createdEmployee.location || newEmployee.location || '',
                    created_at: createdEmployee.created_at || new Date().toISOString(),
                    phone: createdEmployee.phone || employeeData.phone,
                    email: createdEmployee.email || employeeData.email,
                    department: newEmployee.department || ''
                };

                setEmployees(prev => [newEmployeeData, ...prev]);
                console.log('New employee added to list:', newEmployeeData);
            } else {
                await fetchEmployees();
            }
        } catch (err: any) {
            console.error("Error adding employee:", err);
            await fetchEmployees();
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