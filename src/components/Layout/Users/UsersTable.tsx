import * as React from 'react';
import { UserData, SortKey, SortDirection } from '../../../types/user';
import { UserCircle } from 'lucide-react';
import { UsersTableHeader } from './UsersTableHeader';
import { UsersTableRow } from './UsersTableRow';
import { UsersTableSkeleton } from './UsersTableSkeleton';
import { Card } from '../../UI/Card';

interface UsersTableProps {
    users: UserData[];
    loading: boolean;
    sortConfig: { key: SortKey; direction: SortDirection };
    onSort: (key: SortKey) => void;
    onViewProfile: (user: UserData) => void;
    onToggleStatus: (user: UserData, e?: React.MouseEvent) => void;
}

export const UsersTable: React.FC<UsersTableProps> = ({
    users,
    loading,
    sortConfig,
    onSort,
    onViewProfile,
    onToggleStatus
}) => {
    return (
        <Card className="flex-1">
            <div className="overflow-x-auto flex-1">
                <table className="w-full text-left border-collapse whitespace-nowrap">
                    <UsersTableHeader sortConfig={sortConfig} onSort={onSort} />
                    <tbody>
                        {loading && users.length === 0 ? (
                            <UsersTableSkeleton />
                        ) : (
                            users.map((user) => (
                                <UsersTableRow 
                                    key={user.user_id} 
                                    user={user} 
                                    onViewProfile={onViewProfile} 
                                    onToggleStatus={onToggleStatus} 
                                />
                            ))
                        )}
                    </tbody>
                </table>

                {users.length === 0 && !loading && (
                    <div className="w-full py-20 flex flex-col items-center justify-center text-[#a2a5b9]">
                        <UserCircle size={48} className="mb-4 opacity-20" />
                        <p className="text-sm font-medium uppercase tracking-widest">No users found</p>
                    </div>
                )}
            </div>
        </Card>
    );
};