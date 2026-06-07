import { create } from 'zustand';
import { getEmployeesList, createEmployee as createEmployeeApi } from '../api/employeeService';
import { EmployeeData } from '../types/employee';

interface EmployeeStoreState {
    employees: EmployeeData[];
    loading: boolean;
    isInitialized: boolean;
    fetchEmployees: (force?: boolean) => Promise<void>;
    addEmployee: (newEmployee: Partial<EmployeeData>) => Promise<boolean>;
}

export const useEmployeeStore = create<EmployeeStoreState>((set, get) => ({
    employees: [],
    loading: false,
    isInitialized: false,

    fetchEmployees: async (force = false) => {
        const { isInitialized } = get();
        
        if (isInitialized && !force) {
            getEmployeesList()
                .then((responseData) => {
                    let fetchedList: any[] = [];
                    if (responseData && responseData.results && Array.isArray(responseData.results)) {
                        fetchedList = responseData.results;
                    } else if (Array.isArray(responseData)) {
                        fetchedList = responseData;
                    } else if (responseData && Array.isArray(responseData.data)) {
                        fetchedList = responseData.data;
                    }
                    
                    const listWithKeys = fetchedList.map((item, index) => ({
                        ...item,
                        _react_key: item.employee_id || item.id || `fallback-${index}-${Math.random()}`
                    }));
                    set({ employees: listWithKeys });
                })
                .catch((err) => console.error("API Background Refetch Error:", err));
            return;
        }

        set({ loading: true });
        try {
            const responseData = await getEmployeesList();

            let fetchedList: any[] = [];
            if (responseData && responseData.results && Array.isArray(responseData.results)) {
                fetchedList = responseData.results;
            } else if (Array.isArray(responseData)) {
                fetchedList = responseData;
            } else if (responseData && Array.isArray(responseData.data)) {
                fetchedList = responseData.data;
            }
            
            const listWithKeys = fetchedList.map((item, index) => ({
                ...item,
                _react_key: item.employee_id || item.id || `fallback-${index}-${Math.random()}`
            }));
            
            set({ employees: listWithKeys, isInitialized: true });
        } catch (err: any) {
            console.error("API Error:", err);
        } finally {
            set({ loading: false });
        }
    },

    addEmployee: async (newEmployee: Partial<EmployeeData>) => {
        set({ loading: true });
        try {
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
                password: newEmployee.password || ''
            };

            const createdResponse = await createEmployeeApi(employeeData);
            const createdData = createdResponse?.results || createdResponse || {};

            const newEmployeeData: EmployeeData = {
                employee_id: createdData.employee_id || Date.now(),
                first_name: createdData.first_name || employeeData.first_name,
                last_name: createdData.last_name || employeeData.last_name,
                avatar_url: createdData.avatar_url || newEmployee.avatar_url || `https://i.pravatar.cc/150?u=${Math.random()}`,
                location: createdData.location || newEmployee.location || 'Not specified',
                created_at: createdData.created_at || new Date().toISOString(),
                phone: createdData.phone || employeeData.phone,
                email: createdData.email || employeeData.email,
                department: newEmployee.department || '',
                _react_key: createdData.employee_id || Date.now().toString()
            };

            const currentEmployees = get().employees;
            set({ employees: [newEmployeeData, ...currentEmployees] });
            
            get().fetchEmployees(true);
            return true;
        } catch (err: any) {
            console.error("Error adding employee:", err);
            get().fetchEmployees(true);
            return false;
        } finally {
            set({ loading: false });
        }
    }
}));