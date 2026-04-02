import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Employees from '../pages/Employees';
import api from '../api/axios';

vi.mock('../api/axios', () => ({
  default: {
    get: vi.fn(),
  },
}));

globalThis.URL.createObjectURL = vi.fn(() => 'mock-csv-url');

const mockEmployees = [
  {
    employee_id: 1,
    first_name: 'Anton',
    last_name: 'Boyko',
    avatar_url: '',
    location: 'Kyiv'
  },
  {
    employee_id: 2,
    first_name: 'Zahar',
    last_name: 'Shevchuk',
    avatar_url: '',
    location: 'Lviv'
  },
  {
    employee_id: 3,
    first_name: 'Maria',
    last_name: 'Koval',
    avatar_url: '',
    location: 'Odesa'
  }
];

describe('Employees Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    (api.get as any).mockResolvedValue({
      data: { results: mockEmployees }
    });
  });

  it('fetches and displays employees on mount', async () => {
    render(<Employees />);

    expect(screen.getByText('Syncing Database...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Anton Boyko')).toBeInTheDocument();
      expect(screen.getByText('Zahar Shevchuk')).toBeInTheDocument();
      expect(screen.getByText('Maria Koval')).toBeInTheDocument();
      expect(screen.getByText('Active personnel: 3')).toBeInTheDocument();
    });

    expect(api.get).toHaveBeenCalledWith('http://localhost:8080/employee');
  });

  it('filters employees by search term (name or location)', async () => {
    render(<Employees />);

    await waitFor(() => {
      expect(screen.getByText('Anton Boyko')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Search employees...');

    fireEvent.change(searchInput, { target: { value: 'maria' } });
    expect(screen.getByText('Maria Koval')).toBeInTheDocument();
    expect(screen.queryByText('Anton Boyko')).not.toBeInTheDocument();

    fireEvent.change(searchInput, { target: { value: 'lviv' } });
    expect(screen.getByText('Zahar Shevchuk')).toBeInTheDocument();
    expect(screen.queryByText('Maria Koval')).not.toBeInTheDocument();
  });

  it('sorts employees A-Z and Z-A correctly', async () => {
    render(<Employees />);

    await waitFor(() => {
      expect(screen.getByText('Anton Boyko')).toBeInTheDocument();
    });


    let names = screen.getAllByRole('heading', { level: 3 }).map(h => h.textContent);
    expect(names[0]).toBe('Anton Boyko');
    expect(names[2]).toBe('Zahar Shevchuk');

    const sortSelect = screen.getByDisplayValue('Sort: A-Z Name');
    fireEvent.change(sortSelect, { target: { value: 'za' } });

    names = screen.getAllByRole('heading', { level: 3 }).map(h => h.textContent);
    expect(names[0]).toBe('Zahar Shevchuk');
    expect(names[2]).toBe('Anton Boyko');
  });

  it('handles CSV export when export button is clicked', async () => {
    render(<Employees />);

    await waitFor(() => {
      expect(screen.getByText('Anton Boyko')).toBeInTheDocument();
    });

    const exportBtn = screen.getByText('Export CSV');
    fireEvent.click(exportBtn);

    expect(globalThis.URL.createObjectURL).toHaveBeenCalledTimes(1);
    
    const blobArg = (globalThis.URL.createObjectURL as any).mock.calls[0][0];
    expect(blobArg).toBeInstanceOf(Blob);
  });

  it('shows empty state message when no data is returned', async () => {
    (api.get as any).mockResolvedValueOnce({
      data: { results: [] }
    });

    render(<Employees />);

    await waitFor(() => {
      expect(screen.getByText(/No records found/i)).toBeInTheDocument();
    });
  });
});