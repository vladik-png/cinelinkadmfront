import * as React from 'react';
import { useModerationLogic } from '../hooks/useModerationLogic';
import { UserReportsTable } from '../components/Layout/Moderation/UserReportsTable';
import { UserReportsToolbar } from '../components/Layout/Moderation/UserReportsToolbar';
import { UsersPagination } from '../components/Layout/Users/UsersPagination';

const Moderation: React.FC = () => {
  const {
    userReports,
    totalReports,
    reportsLoading,
    reportSort,
    handleSortChange,
    currentPage,
    setCurrentPage,
    totalPages,
    exportToCSV,
    searchTerm,
    setSearchTerm
  } = useModerationLogic();

  return (
    <div className="w-full min-h-screen bg-[#151521] text-[#a2a5b9] font-sans p-6 lg:p-8 flex flex-col relative z-0">
        
        <UserReportsToolbar
          total={totalReports}
          showing={userReports.length}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onExport={exportToCSV}
        />

        <UserReportsTable
          reports={userReports}
          loading={reportsLoading}
          sort={reportSort}
          onSortChange={handleSortChange}
        />

        {!reportsLoading && (
          <UsersPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
    </div>
  );
};

export default Moderation;