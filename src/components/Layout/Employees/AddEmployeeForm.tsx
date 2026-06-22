import * as React from 'react';
import { useState } from 'react';
import { EmployeeData } from '../../../types/employee';
import { Input } from '../../UI/Input';
import { Select } from '../../UI/Select';
import { Button } from '../../UI/Button';

interface AddEmployeeFormProps {
    onClose: () => void;
    onAdd: (employee: Partial<EmployeeData>) => void;
}

export const AddEmployeeForm: React.FC<AddEmployeeFormProps> = ({ onClose, onAdd }) => {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        phone: '',
        email: '',
        department: 'Engineering',
        location: '',
        password: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAdd({
            first_name: formData.first_name,
            last_name: formData.last_name,
            phone: formData.phone,
            email: formData.email,
            department: formData.department,
            location: formData.location,
            password: formData.password,
            avatar_url: `https://i.pravatar.cc/150?u=${Math.random()}`,
            created_at: new Date().toISOString(),
        });
        onClose();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
            <div className="flex gap-4">
                <Input
                    label="First Name"
                    name="first_name"
                    required
                    value={formData.first_name}
                    onChange={handleChange}
                    placeholder="John"
                    containerClassName="flex-1"
                />
                <Input
                    label="Last Name"
                    name="last_name"
                    required
                    value={formData.last_name}
                    onChange={handleChange}
                    placeholder="Doe"
                    containerClassName="flex-1"
                />
            </div>

            <Input
                label="Phone"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (555) 000-0000"
            />

            <Input
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john.doe@example.com"
            />

            <Input
                label="Password"
                type="text"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="Set password"
            />

            <Select
                label="Department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                options={[
                    { value: 'Administration', label: 'Administration' },
                    { value: 'Engineering', label: 'Engineering' },
                    { value: 'Marketing', label: 'Marketing' },
                    { value: 'Sales', label: 'Sales' },
                    { value: 'Human Resources', label: 'Human Resources' },
                    { value: 'Support', label: 'Support' },
                    { value: 'Design', label: 'Design' }
                ]}
            />

            <Input
                label="Location"
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="New York, USA"
            />

            <div className="mt-4 flex justify-end gap-3">
                <Button type="button" variant="ghost" onClick={onClose}>
                    Cancel
                </Button>
                <Button type="submit" variant="primary">
                    Add Employee
                </Button>
            </div>
        </form>
    );
};
