import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Login from '../pages/Login';
import api from '../api/axios';

vi.mock('../api/axios', () => ({
  default: {
    post: vi.fn(),
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

describe('Login Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('renders correctly', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    expect(screen.getByText(/Terminal Access/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText('XXXX')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Authorize Entry/i })).toBeInTheDocument();
  });

  it('updates input values on user type', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    const loginInput = screen.getByPlaceholderText('XXXX') as HTMLInputElement;
    const passwordInput = screen.getByPlaceholderText('••••••••') as HTMLInputElement;

    fireEvent.change(loginInput, { target: { value: 'admin' } });
    fireEvent.change(passwordInput, { target: { value: '12345' } });

    expect(loginInput.value).toBe('admin');
    expect(passwordInput.value).toBe('12345');
  });

  it('handles successful login and redirects to dashboard', async () => {
    (api.post as any).mockResolvedValueOnce({
      status: 200,
      data: {
        results: { user_id: 123 }
      }
    });

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('XXXX'), { target: { value: 'admin' } });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'password' } });

    fireEvent.click(screen.getByRole('button', { name: /Authorize Entry/i }));

    await waitFor(() => {
      expect(localStorage.getItem('admin_token')).toBe('true');
      expect(localStorage.getItem('employee_id')).toBe('123');
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('displays error message on 401 status', async () => {
    (api.post as any).mockRejectedValueOnce({
      response: { status: 401 }
    });

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('XXXX'), { target: { value: 'wrong_user' } });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'wrong_pass' } });
    fireEvent.click(screen.getByRole('button', { name: /Authorize Entry/i }));

    await waitFor(() => {
      expect(screen.getByText('Користувача не знайдено')).toBeInTheDocument();
    });
    
    expect(mockNavigate).not.toHaveBeenCalled();
    expect(localStorage.getItem('admin_token')).toBeNull();
  });
});