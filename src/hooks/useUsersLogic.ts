import { useState, useEffect, useMemo } from 'react';
import { getUsers, toggleUserAccountStatus } from '../api/userService';
import { UserData, SortKey, SortDirection } from '../types/user';
import { formatDate } from '../utils/dateHelpers';

export const useUsersLogic = () => {
    const [users, setUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [showBlockedOnly, setShowBlockedOnly] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 20;

    const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection }>({
        key: 'date',
        direction: 'desc'
    });

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const data = await getUsers();

            if (data && data.results && Array.isArray(data.results.data)) {
                setUsers(data.results.data);
            }
            else if (data && Array.isArray(data.results)) {
                setUsers(data.results);
            }
            else if (Array.isArray(data)) {
                setUsers(data);
            } else {
                console.warn("Unexpected API response format:", data);
                setUsers([]);
            }
        } catch (err) {
            console.error("Error fetching users:", err);
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchUsers(); }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, showBlockedOnly, sortConfig]);

    const handleToggleStatus = async (user: UserData) => {
        if (!user || !user.user_id) return;

        try {
            const token = localStorage.getItem('admin_token') || '';
            await toggleUserAccountStatus(user.user_id, user.is_active, token);
            const nextState = !user.is_active;

            setUsers(prev => prev.map(u =>
                u.user_id === user.user_id ? { ...u, is_active: nextState } : u
            ));

            return nextState;
        } catch (err) {
            console.error("Error changing status:", err);
            throw err;
        }
    };

    const handleSort = (key: SortKey) => {
        setSortConfig(prev => ({
            key,
            direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    const processedUsers = useMemo(() => {
        let result = users.filter(u => {
            const search = searchTerm.toLowerCase();
            const searchString = (
                (u.user_id?.toString() || '') + ' ' +
                (u.username || '') + ' ' +
                (u.first_name || '') + ' ' +
                (u.last_name || '') + ' ' +
                (u.email || '')
            ).toLowerCase();
            
            const matchesSearch = searchString.includes(search);
            return showBlockedOnly ? (matchesSearch && !u.is_active) : matchesSearch;
        });

        result.sort((a, b) => {
            let aValue: any, bValue: any;

            switch (sortConfig.key) {
                case 'id': aValue = a.user_id; bValue = b.user_id; break;
                case 'name': aValue = `${a.first_name} ${a.last_name}`.toLowerCase(); bValue = `${b.first_name} ${b.last_name}`.toLowerCase(); break;
                case 'email': aValue = (a.email || '').toLowerCase(); bValue = (b.email || '').toLowerCase(); break;
                case 'date': aValue = new Date(a.created_at || 0).getTime(); bValue = new Date(b.created_at || 0).getTime(); break;
                case 'status': aValue = a.is_active ? 1 : 0; bValue = b.is_active ? 1 : 0; break;
                default: return 0;
            }

            if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });

        return result;
    }, [users, searchTerm, showBlockedOnly, sortConfig]);

    const paginatedUsers = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return processedUsers.slice(startIndex, startIndex + itemsPerPage);
    }, [processedUsers, currentPage]);

    const totalPages = Math.ceil(processedUsers.length / itemsPerPage);

    const exportToCSV = () => {
        const delimiter = ";";
        const headers = ["ID", "Username", "Name", "Active", "Joined"].join(delimiter);
        const dataRows = processedUsers.map(u => [
            u.user_id, u.username, `${u.first_name} ${u.last_name}`,
            u.is_active ? 'Active' : 'Banned',
            formatDate(u.created_at).date
        ].join(delimiter));

        const csvContent = "\uFEFF" + [headers, ...dataRows].join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `users_directory.csv`;
        link.click();
    };

    return {
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
    };
};