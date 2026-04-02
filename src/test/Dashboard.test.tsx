import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import Dashboard from '../pages/Dashboard';
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

globalThis.fetch = vi.fn();

const mockUsers = {
  data: {
    results: [
      { user_id: 1, first_name: 'John', username: 'johnny' },
      { user_id: 2, first_name: 'Jane', username: 'janey' },
      { user_id: 3, first_name: 'Max', username: 'maximus' },
      { user_id: 4, first_name: 'Anna', username: 'ann' }
    ]
  }
};

const mockMetrics = {
  data: {
    node_1: { cpu: 40, ram: 50, disk: "60", ping: 10 },
    node_2: { cpu: 20, ram: 30, disk: "40", ping: 12 }
  }
};

const mockEmployee = {
  data: {
    results: { location: 'Kyiv' }
  }
};

describe('Dashboard Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.setItem('employee_id', '123');

    (api.get as any).mockImplementation((url: string) => {
      if (url.includes('/users')) return Promise.resolve(mockUsers);
      if (url.includes('/system-metrics')) return Promise.resolve(mockMetrics);
      if (url.includes('/employee/')) return Promise.resolve(mockEmployee);
      return Promise.resolve({ data: {} });
    });

    (globalThis.fetch as any).mockResolvedValue({
      json: async () => ({
        current_condition: [{ temp_C: '22' }],
        nearest_area: [{ areaName: [{ value: 'Kyiv' }] }]
      })
    });
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('fetches and displays all aggregated dashboard metrics', async () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Nodes Active/i)).toBeInTheDocument();
      expect(screen.getByText('4')).toBeInTheDocument();
      expect(screen.getByText('30')).toBeInTheDocument();
      expect(screen.getByText('40')).toBeInTheDocument();
      expect(screen.getByText('50')).toBeInTheDocument();
    });
  });

  it('fetches employee location and displays weather', async () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Kyiv/i)).toBeInTheDocument();
      expect(screen.getByText('22°C')).toBeInTheDocument();
    });

    expect(globalThis.fetch).toHaveBeenCalledWith(expect.stringContaining('wttr.in/Kyiv'));
  });

  it('renders only the 3 most recent user registrations', async () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Anna')).toBeInTheDocument();
      expect(screen.getByText('Max')).toBeInTheDocument();
      expect(screen.getByText('Jane')).toBeInTheDocument();
      expect(screen.queryByText('John')).not.toBeInTheDocument();
    });
  });

  it('navigates to correct routes when interactive elements are clicked', async () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Total Users')).toBeInTheDocument();
    });

    const cpuCard = screen.getByText('Avg CPU Load').closest('div');
    fireEvent.click(cpuCard!);
    expect(mockNavigate).toHaveBeenCalledWith('/analytics');


    const viewUsersBtn = screen.getByText('View All Users').closest('button');
    fireEvent.click(viewUsersBtn!);
    expect(mockNavigate).toHaveBeenCalledWith('/users');
  });
});