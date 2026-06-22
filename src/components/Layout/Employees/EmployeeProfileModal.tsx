import * as React from 'react';
import { EmployeeData } from '../../../types/employee';
import { EmployeeProfileHeader } from './EmployeeProfileHeader';
import { EmployeeProfileDetails } from './EmployeeProfileDetails';

import { Modal } from '../../UI/Modal';

interface EmployeeProfileModalProps {
    employee: EmployeeData;
    onClose: () => void;
}

export const EmployeeProfileModal: React.FC<EmployeeProfileModalProps> = ({ employee, onClose }) => {
    return (
        <Modal onClose={onClose} maxWidth="2xl">
            <EmployeeProfileHeader employee={employee} onClose={onClose} />
            <div className="px-4 sm:px-10 pb-4 sm:pb-10">
                <EmployeeProfileDetails employee={employee} onClose={onClose} />
            </div>
        </Modal>
    );
};