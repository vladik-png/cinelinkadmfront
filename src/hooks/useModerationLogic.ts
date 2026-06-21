import { useState, useEffect, useCallback } from 'react';
import { UserReport } from '../types/moderation';
import { fetchUserReportsRequest } from '../api/moderationService';

export const useModerationLogic = () => {
    const [userReports, setUserReports] = useState<UserReport[]>([]);
    const [reportsLoading, setReportsLoading] = useState(false);
    const [reportCursor, setReportCursor] = useState(0);
    const [reportSort, setReportSort] = useState('');
    const [hasMoreReports, setHasMoreReports] = useState(true);

    const token = localStorage.getItem('admin_token');

    const fetchReports = useCallback(async (cursor: number = 0, sort: string = reportSort, isLoadMore: boolean = false) => {
        try {
            setReportsLoading(true);
            const data = await fetchUserReportsRequest(token, cursor, sort);
            if (data.length < 50) {
                setHasMoreReports(false);
            } else {
                setHasMoreReports(true);
            }
            if (isLoadMore) {
                setUserReports(prev => [...prev, ...data]);
            } else {
                setUserReports(data);
            }
            if (data.length > 0) {
                setReportCursor(data[data.length - 1].report_id);
            }
        } catch (err) {
            console.error("Error fetching user reports:", err);
        } finally {
            setReportsLoading(false);
        }
    }, [token, reportSort]);

    useEffect(() => {
        fetchReports(0, reportSort, false);
    }, []);

    const handleSortChange = (newSort: string) => {
        setReportSort(newSort);
        setReportCursor(0);
        setHasMoreReports(true);
        fetchReports(0, newSort, false);
    };

    const loadMoreReports = () => {
        if (!hasMoreReports || reportsLoading) return;
        fetchReports(reportCursor, reportSort, true);
    };

    return {
        userReports,
        reportsLoading,
        reportSort,
        handleSortChange,
        loadMoreReports,
        hasMoreReports
    };
};