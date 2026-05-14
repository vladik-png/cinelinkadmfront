import * as React from 'react';
import { useState } from 'react';
import { useEmployeesLogic } from '../hooks/useEmployeesLogic';
import { EmployeeData } from '../types/employee';

import { EmployeesTopBar } from '../components/Layout/Employees/EmployeesTopBar';
import { EmployeesHeader } from '../components/Layout/Employees/EmployeesHeader';
import { EmployeesTable } from '../components/Layout/Employees/EmployeesTable';
import { EmployeeProfileModal } from '../components/Layout/Employees/EmployeeProfileModal';

const Employees: React.FC = () => {
  const {
    employees,
    processedEmployees,
    loading,
    searchTerm,
    setSearchTerm,
    sortConfig,
    handleSort,
    exportToCSV
  } = useEmployeesLogic();

  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeData | null>(null);

  return (
    <div className="w-full flex flex-col bg-[#151521] min-h-screen font-sans text-[#a2a5b9] relative">

      <EmployeesTopBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      <div className="p-8 w-full flex-1 flex flex-col max-w-7xl mx-auto">

        <EmployeesHeader
          total={employees.length}
          showing={processedEmployees.length}
          onExport={exportToCSV}
        />

        <EmployeesTable
          employees={processedEmployees}
          loading={loading}
          sortConfig={sortConfig}
          onSort={handleSort}
          onViewEmployee={setSelectedEmployee}
        />

      </div>

      {selectedEmployee && (
        <EmployeeProfileModal
          employee={selectedEmployee}
          onClose={() => setSelectedEmployee(null)}
        />
      )}

    </div>
  );
};

export default Employees;