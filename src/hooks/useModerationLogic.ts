import { useMemo, useEffect } from 'react';
import { UserReport } from '../types/moderation';
import { useUserStore } from '../store/userStore';
import { useReportStore } from '../store/reportStore';

export const useModerationLogic = () => {
    const { 
        allReports, 
        reportsLoading, 
        currentPage, setCurrentPage, 
        reportSort, setReportSort, 
        searchTerm, setSearchTerm, 
        fetchReports, 
        updateReportStatus 
    } = useReportStore();

    const itemsPerPage = 20;

    const { users, fetchUsers } = useUserStore();

    const usersMap = useMemo(() => {
        const map: Record<number, any> = {};
        users.forEach(u => {
            map[u.user_id] = u;
        });
        return map;
    }, [users]);

    useEffect(() => {
        if (users.length === 0) {
            fetchUsers();
        }
        fetchReports();
    }, [users.length, fetchUsers, fetchReports]);

    const handleSortChange = (key: keyof UserReport) => {
        setReportSort({
            key,
            direction: reportSort.key === key && reportSort.direction === 'asc' ? 'desc' : 'asc'
        });
        setCurrentPage(1);
    };

    const processedReports = useMemo(() => {
        let result = allReports.filter(r => {
            const search = searchTerm.toLowerCase();
            const searchString = (
                (r.report_id?.toString() || '') + ' ' +
                (r.user_id?.toString() || '') + ' ' +
                (r.from_user_id?.toString() || '') + ' ' +
                (r.topic || '') + ' ' +
                (r.status || '')
            ).toLowerCase();
            return searchString.includes(search);
        });

        if (reportSort.key) {
            result.sort((a, b) => {
                const aValue = a[reportSort.key as keyof UserReport];
                const bValue = b[reportSort.key as keyof UserReport];

                if (aValue < bValue) return reportSort.direction === 'asc' ? -1 : 1;
                if (aValue > bValue) return reportSort.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }
        return result;
    }, [allReports, reportSort, searchTerm]);

    const paginatedReports = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return processedReports.slice(startIndex, startIndex + itemsPerPage);
    }, [processedReports, currentPage]);

    const totalPages = Math.ceil(processedReports.length / itemsPerPage);

    const exportToCSV = () => {
        const delimiter = ";";
        const headers = ["Report ID", "User ID", "From User ID", "Topic", "Status", "Created At"].join(delimiter);
        const dataRows = processedReports.map(r => [
            r.report_id,
            r.user_id,
            r.from_user_id,
            r.topic,
            r.status,
            new Date(r.created_at).toLocaleString()
        ].join(delimiter));

        const csvContent = "\uFEFF" + [headers, ...dataRows].join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `user_reports.csv`;
        link.click();
    };

    const handleStatusChange = async (reportId: number, newStatus: string) => {
        try {
            await updateReportStatus(reportId, newStatus);
        } catch (err) {
            console.error("Failed to update status", err);
            alert("Failed to update report status");
        }
    };

    return {
        userReports: paginatedReports,
        totalReports: processedReports.length,
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
    };
};