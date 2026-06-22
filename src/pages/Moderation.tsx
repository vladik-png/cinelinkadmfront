import * as React from 'react';
import { useState } from 'react';
import { useModerationLogic } from '../hooks/useModerationLogic';
import { UserReportsTable } from '../components/Layout/Moderation/UserReportsTable';
import { UserReportsToolbar } from '../components/Layout/Moderation/UserReportsToolbar';
import { UsersPagination } from '../components/Layout/Users/UsersPagination';
import { UserProfileModal } from '../components/Layout/Users/UserProfileModal';
import { UserReportModal } from '../components/Layout/Moderation/UserReportModal';
import { UserData } from '../types/user';
import { UserReport } from '../types/moderation';
import { getUserDetailedProfile, toggleUserAccountStatus } from '../api/userService';

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
    setSearchTerm,
    usersMap,
    handleStatusChange
  } = useModerationLogic();

  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [selectedReport, setSelectedReport] = useState<UserReport | null>(null);

  const handleViewProfile = async (userId: number) => {
    try {
      const data = await getUserDetailedProfile(userId);
      const profileData = data?.results || data;
      if (profileData) {
        setSelectedUser({
            user_id: userId,
            ...profileData
        });
      }
    } catch (err: any) {
      console.error(err);
      if (err.response?.status === 404) {
        alert(`User ${userId} not found or has been deleted from the database.`);
      } else {
        alert(`Failed to load profile for User ${userId}.`);
      }
    }
  };

  const handleToggleUserStatus = async (user: UserData) => {
    try {
      const nextState = !user.is_active;
      await toggleUserAccountStatus(user.user_id, user.is_active);
      setSelectedUser(prev => prev && prev.user_id === user.user_id ? { ...prev, is_active: nextState } : prev);
    } catch (err) {
      console.error(err);
    }
  };

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
          usersMap={usersMap}
          loading={reportsLoading}
          sort={reportSort}
          onSortChange={handleSortChange}
          onViewProfile={handleViewProfile}
          onReportClick={(report) => setSelectedReport(report)}
        />

        {!reportsLoading && (
          <UsersPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}

        {selectedUser && (
          <UserProfileModal
            user={selectedUser}
            onClose={() => setSelectedUser(null)}
            onToggleStatus={handleToggleUserStatus}
          />
        )}

        {selectedReport && (
          <UserReportModal
            report={selectedReport}
            targetUser={usersMap[selectedReport.user_id]}
            reporterUser={usersMap[selectedReport.from_user_id]}
            onClose={() => setSelectedReport(null)}
            onStatusChange={handleStatusChange}
          />
        )}
    </div>
  );
};

export default Moderation;