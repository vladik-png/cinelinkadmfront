import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Sidebar from '../components/Layout/Sidebar';
import api from '../api/axios';

vi.mock('../api/axios', () => ({
  default: {
    get: vi.fn(),
  },
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockEmployeeData = {
  data: {
    results: {
      first_name: 'Vladyslav',
      last_name: 'Semotiuk',
      avatar_url: '',
      location: 'Kolomyia',
      employee_id: 1,
    }
  }
};

describe('Sidebar Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('renders all navigation links correctly', () => {
    render(
      <BrowserRouter>
        <Sidebar />
      </BrowserRouter>
    );

    expect(screen.getByText(/Cinelink/i)).toBeInTheDocument();
    expect(screen.getByText(/Admin Panel/i)).toBeInTheDocument();

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Users')).toBeInTheDocument();
    expect(screen.getByText('Employees')).toBeInTheDocument();
    expect(screen.getByText('Moderation')).toBeInTheDocument();
    expect(screen.getByText('AWS Server')).toBeInTheDocument();
    expect(screen.getByText('Analytics')).toBeInTheDocument();
  });

  it('fetches and displays employee profile if ID is in localStorage', async () => {
    localStorage.setItem('employee_id', '1');
    (api.get as any).mockResolvedValueOnce(mockEmployeeData);

    render(
      <BrowserRouter>
        <Sidebar />
      </BrowserRouter>
    );

    expect(api.get).toHaveBeenCalledWith('http://localhost:8080/employee/1');

    await waitFor(() => {
      expect(screen.getByText('Vladyslav Semotiuk')).toBeInTheDocument();
    });
  });

  it('handles logout correctly', () => {
    localStorage.setItem('admin_token', 'true');
    localStorage.setItem('employee_id', '123');

    render(
      <BrowserRouter>
        <Sidebar />
      </BrowserRouter>
    );

    const logoutBtn = screen.getByText(/Sign Out/i).closest('button');
    fireEvent.click(logoutBtn!);

    expect(localStorage.getItem('admin_token')).toBeNull();
    expect(localStorage.getItem('employee_id')).toBeNull();

    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});