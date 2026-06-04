import * as React from 'react';
import { useState } from 'react';
import { useUsersLogic } from '../hooks/useUsersLogic';
import { UserData } from '../types/user';
import { getUserDetailedProfile } from '../api/userService';
import { UsersToolbar } from '../components/Layout/Users/UsersToolbar';
import { UsersTable } from '../components/Layout/Users/UsersTable';
import { UserProfileModal } from '../components/Layout/Users/UserProfileModal';
import { UsersPagination } from '../components/Layout/Users/UsersPagination';

const Users: React.FC = () => {
  const {
    users,
    processedUsers,
    paginatedUsers,
    currentPage,
    setCurrentPage,
    totalPages,
    loading,
    searchTerm,
    setSearchTerm,
    showBlockedOnly,
    setShowBlockedOnly,
    sortConfig,
    handleSort,
    handleToggleStatus,
    exportToCSV
  } = useUsersLogic();

  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);

  const handleViewProfile = async (user: UserData) => {
    setSelectedUser(user);
    try {
      const data = await getUserDetailedProfile(user.user_id);
      const profileData = data?.results || data;
      if (profileData) {
        setSelectedUser(prev => {
          if (!prev) return null;
          return { 
            ...prev, 
            ...profileData,
            user_id: prev.user_id,
            is_active: prev.is_active
          };
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const onToggleUserStatus = async (user: UserData, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      const nextState = await handleToggleStatus(user);
      if (nextState !== undefined) {
        setSelectedUser(prev => prev && prev.user_id === user.user_id ? { ...prev, is_active: nextState } : prev);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#151521] text-[#a2a5b9] font-sans p-6 lg:p-8 flex flex-col relative z-0">
      <UsersToolbar
        total={users.length}
        showing={processedUsers.length}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        showBlockedOnly={showBlockedOnly}
        setShowBlockedOnly={setShowBlockedOnly}
        onExport={exportToCSV}
      />

      <UsersTable
        users={paginatedUsers}
        loading={loading}
        sortConfig={sortConfig}
        onSort={handleSort}
        onViewProfile={handleViewProfile}
        onToggleStatus={onToggleUserStatus}
      />

      {!loading && (
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
          onToggleStatus={(user: UserData) => onToggleUserStatus(user)}
        />
      )}
    </div>
  );
};

export default Users;