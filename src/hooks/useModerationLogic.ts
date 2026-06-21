import { useState, useEffect, useMemo, useCallback } from 'react';
import { UserReport } from '../types/moderation';
import { fetchUserReportsRequest } from '../api/moderationService';

export const useModerationLogic = () => {
    const [allReports, setAllReports] = useState<UserReport[]>([]);
    const [reportsLoading, setReportsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [reportSort, setReportSort] = useState<{ key: keyof UserReport | ''; direction: 'asc' | 'desc' }>({ key: '', direction: 'asc' });
    const itemsPerPage = 20;

    const token = localStorage.getItem('admin_token');

    const fetchAllReports = useCallback(async () => {
        try {
            setReportsLoading(true);
            let cursor = 0;
            let more = true;
            let accumulated: UserReport[] = [];

            while (more) {
                // Fetch using default sort to safely paginate through all records using id > cursor
                const data = await fetchUserReportsRequest(token, cursor, '');
                accumulated = [...accumulated, ...data];
                if (data.length < 50) {
                    more = false;
                } else {
                    cursor = data[data.length - 1].report_id;
                }
            }
            setAllReports(accumulated);
        } catch (err) {
            console.error("Error fetching user reports:", err);
        } finally {
            setReportsLoading(false);
        }
    }, [token]);

    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchAllReports();
    }, [fetchAllReports]);

    const handleSortChange = (key: keyof UserReport) => {
        setReportSort(prev => ({
            key,
            direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
        }));
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
        setSearchTerm
    };
};