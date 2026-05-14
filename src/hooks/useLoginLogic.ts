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
        console.log("1. Form submitted, preventDefault executed. Starting login process...");

        setError(null);
        setIsLoading(true);

        try {
            console.log("2. Sending request to server with data:", { login: employeeCode, password: password });

            const response = await loginEmployee(employeeCode, password);

            console.log("3. Response from server received:", response);

            if (response.status === 200) {
                const data = response.data.results;
                const realId = (typeof data === 'object' && data !== null) ? data.user_id : data;

                if (realId) {
                    console.log("4. Success! Received ID:", realId);
                    localStorage.setItem('admin_token', 'true');
                    localStorage.setItem('employee_id', realId.toString());
                    navigate('/dashboard');
                } else {
                    console.warn("4. ID is missing. Here's what was received:", data);
                    setError("Error processing data: ID is missing  in response");
                }
            }
        } catch (err: any) {
            console.error("3. Error:", err);

            if (err.response) {
                const status = err.response.status;
                console.log("Error status:", status);
                if (status === 401) {
                    setError('User not found');
                } else if (status === 403) {
                    setError('Wrong password');
                } else {
                    setError(`Server error: ${status}`);
                }
            } else {
                console.log("Error without response, likely network issue:", err);
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