import * as React from 'react';
import { UserReport } from '../../../types/moderation';
import { formatDate } from '../../../utils/dateHelpers';
import { UserReportModalHeader } from './UserReportModalHeader';
import { UserReportModalDetails } from './UserReportModalDetails';
import { Button } from '../../UI/Button';
import { Modal } from '../../UI/Modal';

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
        <Modal onClose={onClose} maxWidth="lg">
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
                    <Button
                        variant="danger-outline"
                        disabled={loading || report.status?.toLowerCase() === 'rejected'}
                        onClick={() => handleStatusUpdate('Rejected')}
                        className="flex-1 sm:flex-none"
                    >
                        Reject
                    </Button>
                    <Button
                        variant="success-outline"
                        disabled={loading || report.status?.toLowerCase() === 'approved'}
                        onClick={() => handleStatusUpdate('Approved')}
                        className="flex-1 sm:flex-none"
                    >
                        Approve
                    </Button>
                </div>
            </div>
        </Modal>
    );
};
