import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserReport } from '../types/moderation';
import { fetchUserReportsRequest, updateUserReportStatusRequest } from '../api/moderationService';

interface ReportStoreState {
    allReports: UserReport[];
    reportsLoading: boolean;
    isInitialized: boolean;

    currentPage: number;
    reportSort: { key: keyof UserReport | ''; direction: 'asc' | 'desc' };
    searchTerm: string;

    setCurrentPage: (page: number) => void;
    setReportSort: (sort: { key: keyof UserReport | ''; direction: 'asc' | 'desc' }) => void;
    setSearchTerm: (term: string) => void;

    fetchReports: (force?: boolean) => Promise<void>;
    updateReportStatus: (reportId: number, newStatus: string) => Promise<void>;
}

export const useReportStore = create<ReportStoreState>()(
    persist(
        (set, get) => ({
            allReports: [],
            reportsLoading: false,
            isInitialized: false,

            currentPage: 1,
            reportSort: { key: '', direction: 'asc' },
            searchTerm: '',

            setCurrentPage: (page) => set({ currentPage: page }),
            setReportSort: (sort) => set({ reportSort: sort }),
            setSearchTerm: (term) => set({ searchTerm: term, currentPage: 1 }),

            fetchReports: async (force = false) => {
                const { isInitialized } = get();
                const token = localStorage.getItem('admin_token');

                if (!token) return;

                const doFetch = async () => {
                    let cursor = 0;
                    let more = true;
                    let accumulated: UserReport[] = [];

                    while (more) {
                        const data = await fetchUserReportsRequest(token, cursor, '');
                        accumulated = [...accumulated, ...data];
                        if (data.length < 50) {
                            more = false;
                        } else {
                            cursor = data[data.length - 1].report_id;
                        }
                    }
                    return accumulated;
                };

                if (isInitialized && !force) {
                    doFetch()
                        .then(data => set({ allReports: data }))
                        .catch(err => console.error("Background report fetch error:", err));
                    return;
                }

                set({ reportsLoading: true });
                try {
                    const data = await doFetch();
                    set({ allReports: data, isInitialized: true });
                } catch (err) {
                    console.error("Error fetching user reports:", err);
                } finally {
                    set({ reportsLoading: false });
                }
            },

            updateReportStatus: async (reportId: number, newStatus: string) => {
                const token = localStorage.getItem('admin_token');
                if (!token) return;
                
                await updateUserReportStatusRequest(token, reportId, newStatus);
                const currentReports = get().allReports;
                set({
                    allReports: currentReports.map(r => 
                        r.report_id === reportId ? { ...r, status: newStatus } : r
                    )
                });
            }
        }),
        {
            name: 'report-storage',
            partialize: (state) => ({ 
                allReports: state.allReports, 
                isInitialized: state.isInitialized,
                currentPage: state.currentPage,
                reportSort: state.reportSort,
                searchTerm: state.searchTerm
            }),
        }
    )
);
