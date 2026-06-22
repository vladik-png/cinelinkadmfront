import * as React from 'react';
import { useState } from 'react';
import { useModerationLogic } from '../hooks/moderation/useModerationLogic';
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
    let user = usersMap[userId];
    
    // Immediately open the profile modal with cached or stub data
    if (!user) {
        user = {
            user_id: userId,
            username: `User_${userId}`,
            first_name: "User",
            last_name: String(userId),
            is_active: true
        };
    }
    setSelectedUser({ ...user });

    // Try to silently fetch the detailed profile from the backend
    try {
      const data = await getUserDetailedProfile(userId);
      const profileData = data?.results || data;
      if (profileData && Object.keys(profileData).length > 0) {
        setSelectedUser(prev => prev ? {
            ...prev,
            ...profileData,
            user_id: userId
        } : { user_id: userId, ...profileData });
      }
    } catch (err: any) {
      console.error("Background profile fetch failed:", err);
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
          onReportClick={(report) => setSelectedReport(report)}
        />

        {!reportsLoading && (
          <UsersPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}

        {selectedReport && (
          <UserReportModal
            report={selectedReport}
            targetUser={usersMap[selectedReport.user_id]}
            reporterUser={usersMap[selectedReport.from_user_id]}
            onClose={() => setSelectedReport(null)}
            onStatusChange={handleStatusChange}
            onViewProfile={handleViewProfile}
          />
        )}

        {selectedUser && (
          <UserProfileModal
            user={selectedUser}
            onClose={() => setSelectedUser(null)}
            onToggleStatus={handleToggleUserStatus}
          />
        )}
    </div>
  );
};

export default Moderation;