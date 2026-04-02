import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Profile from '../pages/Profile';
import api from '../api/axios';

vi.mock('../api/axios', () => ({
  default: {
    get: vi.fn(),
    delete: vi.fn(),
  },
}));

const mockEmployee = {
  first_name: 'Vladyslav',
  last_name: 'Semotiuk',
  email: 'vladyslav@cinelink.com',
  phone: '+380 99 111 22 33',
  hire_date: '2025-09-01T10:00:00Z',
  avatar_url: '',
  location: 'Kolomyia',
  department_id: 3,
  employee_id: 42,
  last_login_at: '2026-03-24T15:30:00Z'
};

describe('Profile Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    
    vi.stubGlobal('confirm', vi.fn());
    vi.stubGlobal('alert', vi.fn());
  });

  it('shows loading state initially', () => {
    (api.get as any).mockImplementation(() => new Promise(() => {}));
    localStorage.setItem('employee_id', '42');

    render(<Profile />);
    
    expect(screen.getByText(/Loading Configuration/i)).toBeInTheDocument();
  });

  it('fetches and displays employee profile correctly', async () => {
    (api.get as any).mockResolvedValueOnce({
      data: { results: mockEmployee }
    });
    localStorage.setItem('employee_id', '42');

    render(<Profile />);

    await waitFor(() => {
      expect(screen.getByText('Vladyslav Semotiuk')).toBeInTheDocument();
      expect(screen.getByText('Kolomyia')).toBeInTheDocument();
      expect(screen.getByText('vladyslav@cinelink.com')).toBeInTheDocument();
      expect(screen.getByText('ID: 42')).toBeInTheDocument();
      expect(screen.getByText('Department #3')).toBeInTheDocument();
    });

    expect(api.get).toHaveBeenCalledWith('http://localhost:8080/employee/42');
  });

  it('shows error message when employee is not found or API fails', async () => {
    (api.get as any).mockRejectedValueOnce(new Error('Network Error'));
    localStorage.setItem('employee_id', '999');

    render(<Profile />);

    await waitFor(() => {
      expect(screen.getByText('Employee Not Found')).toBeInTheDocument();
    });
  });

  it('handles account deactivation when user confirms', async () => {
    (api.get as any).mockResolvedValueOnce({
      data: { results: mockEmployee }
    });
    localStorage.setItem('employee_id', '42');

    render(<Profile />);

    await waitFor(() => {
      expect(screen.getByText('Vladyslav Semotiuk')).toBeInTheDocument();
    });

    vi.mocked(window.confirm).mockReturnValueOnce(true);
    
    (api.delete as any).mockResolvedValueOnce({ status: 200 });

    const deactivateButton = screen.getByText('Deactivate');
    fireEvent.click(deactivateButton);

    await waitFor(() => {
      expect(window.confirm).toHaveBeenCalledWith('Make this employee inactive?');
      expect(api.delete).toHaveBeenCalledWith('http://localhost:8080/employee/42');
      expect(window.alert).toHaveBeenCalledWith('Status updated to inactive');
    });
  });

  it('does not deactivate if user cancels confirmation dialog', async () => {
    (api.get as any).mockResolvedValueOnce({
      data: { results: mockEmployee }
    });
    localStorage.setItem('employee_id', '42');

    render(<Profile />);

    await waitFor(() => {
      expect(screen.getByText('Vladyslav Semotiuk')).toBeInTheDocument();
    });

    vi.mocked(window.confirm).mockReturnValueOnce(false);

    const deactivateButton = screen.getByText('Deactivate');
    fireEvent.click(deactivateButton);

    expect(window.confirm).toHaveBeenCalled();
    expect(api.delete).not.toHaveBeenCalled();
    expect(window.alert).not.toHaveBeenCalled();
  });
});