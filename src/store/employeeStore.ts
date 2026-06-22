import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getEmployeesList, createEmployee as createEmployeeApi } from '../api/employeeService';
import { EmployeeData } from '../types/employee';
import { parseEmployeeResponse } from '../utils/dataAdapters';

interface EmployeeStoreState {
    employees: EmployeeData[];
    loading: boolean;
    isInitialized: boolean;
    fetchEmployees: (force?: boolean) => Promise<void>;
    addEmployee: (newEmployee: Partial<EmployeeData>) => Promise<boolean>;
}

export const useEmployeeStore = create<EmployeeStoreState>()(
    persist(
        (set, get) => ({
            employees: [],
            loading: false,
            isInitialized: false,

            fetchEmployees: async (force = false) => {
                const { isInitialized } = get();
                
                if (isInitialized && !force) {
                    getEmployeesList()
                        .then((responseData) => {
                            set({ employees: parseEmployeeResponse(responseData) });
                        })
                        .catch((err) => console.error("API Background Refetch Error:", err));
                    return;
                }

                set({ loading: true });
                try {
                    const responseData = await getEmployeesList();
                    set({ employees: parseEmployeeResponse(responseData), isInitialized: true });
                } catch (err: unknown) {
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
                        password: newEmployee.password || '',
                        avatar_url: newEmployee.avatar_url || `https://i.pravatar.cc/150?u=${Math.random()}`,
                        location: newEmployee.location || 'Unknown',
                        role: newEmployee.department === 'Administration' ? 1 : 2
                    };

                    const createdResponse = await createEmployeeApi(employeeData);
                    // Handle various response wrappers
                    const createdData = (createdResponse as any)?.results || createdResponse || {};

                    const newEmployeeData: EmployeeData = {
                        employee_id: createdData.employee_id || Date.now(),
                        first_name: createdData.first_name || employeeData.first_name,
                        last_name: createdData.last_name || employeeData.last_name,
                        avatar_url: createdData.avatar_url || newEmployee.avatar_url || `https://i.pravatar.cc/150?u=${encodeURIComponent(employeeData.first_name || 'user')}`,
                        location: createdData.location || newEmployee.location || 'Not specified',
                        created_at: createdData.created_at || new Date().toISOString(),
                        phone: createdData.phone || employeeData.phone,
                        email: createdData.email || employeeData.email,
                        department: newEmployee.department || '',
                        _react_key: createdData.employee_id || Date.now().toString()
                    };

                    const currentEmployees = get().employees;
                    set({ employees: [newEmployeeData, ...currentEmployees] });
                    
                    // Trigger a silent background refetch
                    get().fetchEmployees();
                    return true;
                } catch (err: unknown) {
                    console.error("Error adding employee:", err);
                    return false;
                } finally {
                    set({ loading: false });
                }
            }
        }),
        {
            name: 'employee-storage',
            partialize: (state) => ({ employees: state.employees, isInitialized: state.isInitialized }),
        }
    )
);
