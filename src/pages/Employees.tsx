import * as React from 'react';
import { useState } from 'react';
import { useEmployeesLogic } from '../hooks/employees/useEmployeesLogic';
import { EmployeeData } from '../types/employee';

import { EmployeesToolbar } from '../components/Layout/Employees/EmployeesToolbar';
import { EmployeesTable } from '../components/Layout/Employees/EmployeesTable';
import { EmployeeProfileModal } from '../components/Layout/Employees/EmployeeProfileModal';
import { AddEmployeeModal } from '../components/Layout/Employees/AddEmployeeModal';
import { EmployeesPagination } from '../components/Layout/Employees/EmployeesPagination';

const Employees: React.FC = () => {
  const {
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
  } = useEmployeesLogic();

  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeData | null>(null);
  const [isAddingEmployee, setIsAddingEmployee] = useState(false);

  const handleAddEmployee = (newEmployee: Partial<EmployeeData>) => {
    addEmployee(newEmployee);
    setIsAddingEmployee(false);
  };

  return (
    <div className="w-full min-h-screen bg-[#151521] text-[#a2a5b9] font-sans p-6 lg:p-8 flex flex-col relative z-0">
      <EmployeesToolbar
        total={employees.length}
        showing={processedEmployees.length}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onExport={exportToCSV}
        onAddEmployee={() => setIsAddingEmployee(true)}
      />

      <EmployeesTable
        employees={paginatedEmployees}
        loading={loading}
        sortConfig={sortConfig}
        onSort={handleSort}
        onViewEmployee={setSelectedEmployee}
      />

      {!loading && (
        <EmployeesPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      {selectedEmployee && (
        <EmployeeProfileModal
          employee={selectedEmployee}
          onClose={() => setSelectedEmployee(null)}
        />
      )}

      {isAddingEmployee && (
        <AddEmployeeModal
          onClose={() => setIsAddingEmployee(false)}
          onAdd={handleAddEmployee}
        />
      )}
    </div>
  );
};

export default Employees;