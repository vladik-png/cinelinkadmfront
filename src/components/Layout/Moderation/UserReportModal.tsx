import * as React from 'react';
import { UserReport } from '../../../types/moderation';
import { formatDate } from '../../../utils/dateHelpers';
import { UserReportModalHeader } from './UserReportModalHeader';
import { UserReportModalDetails } from './UserReportModalDetails';

interface UserReportModalProps {
    report: UserReport;
    targetUser?: any;
    reporterUser?: any;
    onClose: () => void;
    onStatusChange: (reportId: number, status: string) => Promise<void>;
    onViewProfile: (userId: number) => void;
}

export const UserReportModal: React.FC<UserReportModalProps> = ({ report, targetUser, reporterUser, onClose, onStatusChange, onViewProfile }) => {
    const [loading, setLoading] = React.useState(false);
    const { date, time } = formatDate(report.created_at);

    const handleStatusUpdate = async (status: string) => {
        setLoading(true);
        await onStatusChange(report.report_id, status);
        setLoading(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-[#151521]/80 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-[#1e1e2d] border border-white/[0.05] w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-[2rem] shadow-2xl relative" onClick={(e) => e.stopPropagation()}>
                
                <UserReportModalHeader reportId={report.report_id} onClose={onClose} />

                <UserReportModalDetails 
                    report={report} 
                    targetUser={targetUser} 
                    reporterUser={reporterUser} 
                    date={date} 
                    time={time} 
                    onViewProfile={onViewProfile} 
                />

                <div className="p-4 sm:p-6 border-t border-white/[0.05] bg-[#151521]/30 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-3">
                    <p className="text-xs font-semibold text-[#a2a5b9] w-full sm:w-auto text-center sm:text-left">Update Status:</p>
                    <div className="flex gap-2 w-full sm:w-auto">
                        <button
                            disabled={loading || report.status?.toLowerCase() === 'rejected'}
                            onClick={() => handleStatusUpdate('Rejected')}
                            className="flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors bg-[#f1416c]/10 text-[#f1416c] hover:bg-[#f1416c]/20 border border-[#f1416c]/20 disabled:opacity-50 cursor-pointer"
                        >
                            Reject
                        </button>
                        <button
                            disabled={loading || report.status?.toLowerCase() === 'approved'}
                            onClick={() => handleStatusUpdate('Approved')}
                            className="flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors bg-[#50cd89]/10 text-[#50cd89] hover:bg-[#50cd89]/20 border border-[#50cd89]/20 disabled:opacity-50 cursor-pointer"
                        >
                            Approve
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};
