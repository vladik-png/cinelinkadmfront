import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Users from '../pages/Users';
import api from '../api/axios';

vi.mock('../api/axios', () => ({
  default: {
    get: vi.fn(),
  },
}));

globalThis.fetch = vi.fn() as any;

(globalThis as any).URL.createObjectURL = vi.fn(() => 'mock-url');

const mockUsersList = [
  {
    user_id: 1,
    username: 'admin_user',
    first_name: 'Taras',
    last_name: 'Shevchenko',
    email: 'taras@mail.com',
    created_at: '2025-01-01T10:00:00Z',
    avatar_url: 'avatar1.jpg',
    is_active: true,
  },
  {
    user_id: 2,
    username: 'banned_dude',
    first_name: 'Bad',
    last_name: 'Guy',
    email: 'bad@mail.com',
    created_at: '2025-02-01T10:00:00Z',
    avatar_url: 'avatar2.jpg',
    is_active: false,
  }
];

describe('Users Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    (api.get as any).mockResolvedValue({
      data: { results: mockUsersList }
    });

    (globalThis.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({
        results: { bio: 'Тестова біографія', followers: 100, followings: 50 }
      })
    });
  });

  it('fetches and renders users list on mount', async () => {
    render(
      <BrowserRouter>
        <Users />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Taras Shevchenko')).toBeInTheDocument();
      expect(screen.getByText('Bad Guy')).toBeInTheDocument();
    });
    
    expect(api.get).toHaveBeenCalledWith('/users');
  });

  it('filters users by search term', async () => {
    render(
      <BrowserRouter>
        <Users />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Taras Shevchenko')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Search...');
    fireEvent.change(searchInput, { target: { value: 'Taras' } });

    expect(screen.getByText('Taras Shevchenko')).toBeInTheDocument();
    expect(screen.queryByText('Bad Guy')).not.toBeInTheDocument();
  });

  it('filters blocked users only when toggle is clicked', async () => {
    render(
      <BrowserRouter>
        <Users />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Bad Guy')).toBeInTheDocument();
    });

    const blockedText = screen.getByText('Blocked Only');
    fireEvent.click(blockedText.previousSibling as Element);

    expect(screen.getByText('Bad Guy')).toBeInTheDocument();
    expect(screen.queryByText('Taras Shevchenko')).not.toBeInTheDocument();
  });

  it('opens profile modal and fetches details on "Inspect Profile" click', async () => {
    render(
      <BrowserRouter>
        <Users />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Taras Shevchenko')).toBeInTheDocument();
    });

    const inspectButtons = screen.getAllByText('Inspect Profile');
    fireEvent.click(inspectButtons[0]);

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledWith(
        'http://localhost:8080/users/2',
        expect.objectContaining({ method: 'GET' })
      );
      expect(screen.getByText(/"Тестова біографія"/i)).toBeInTheDocument();
      expect(screen.getByText('100')).toBeInTheDocument();
    });
  });
});