import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginEmployee } from '../api/authService';

export const useLoginLogic = () => {
    const [employeeCode, setEmployeeCode] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        setError(null);
        setIsLoading(true);

        try {
            const response = await loginEmployee(employeeCode, password);

            if (response.status === 200) {
                const data = response.data.results;
                const realId = (typeof data === 'object' && data !== null) ? data.user_id : data;

                if (realId) {
                    localStorage.setItem('admin_token', 'true');
                    localStorage.setItem('employee_id', realId.toString());
                    navigate('/dashboard');
                } else {
                    console.warn("Missing ID in response:", data);
                    setError("Error processing data: ID is missing in response");
                }
            }
        } catch (err: any) {
            if (err.response) {
                const status = err.response.status;
                if (status === 401) {
                    setError('User not found');
                } else if (status === 403) {
                    setError('Wrong password');
                } else {
                    setError(`Server error: ${status}`);
                }
            } else {
                console.error("Login network/unexpected error:", err);
                setError('Failed to connect to server');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return {
        employeeCode,
        setEmployeeCode,
        password,
        setPassword,
        error,
        isLoading,
        handleLogin
    };
};