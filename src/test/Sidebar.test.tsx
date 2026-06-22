import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Sidebar from '../components/Layout/Core/Sidebar';

describe('Sidebar Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all navigation links with correct text when not collapsed', () => {
    render(
      <BrowserRouter>
        <Sidebar isCollapsed={false} toggleSidebar={vi.fn()} />
      </BrowserRouter>
    );

    expect(screen.getByText('Cinelink')).toBeInTheDocument();
    expect(screen.getByText('Admin Panel')).toBeInTheDocument();
    expect(screen.getByText('Main Menu')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Users')).toBeInTheDocument();
    expect(screen.getByText('Employees')).toBeInTheDocument();
    expect(screen.getByText('Moderation')).toBeInTheDocument();
    expect(screen.getByText('AWS Server')).toBeInTheDocument();
    expect(screen.getByText('Analytics')).toBeInTheDocument();
    expect(screen.getByText('Terminal')).toBeInTheDocument();
    expect(screen.getByText('cinelink © 2026')).toBeInTheDocument();
  });

  it('hides text and shows titles when collapsed', () => {
    render(
      <BrowserRouter>
        <Sidebar isCollapsed={true} toggleSidebar={vi.fn()} />
      </BrowserRouter>
    );

    expect(screen.queryByText('Cinelink')).not.toBeInTheDocument();
    expect(screen.queryByText('Admin Panel')).not.toBeInTheDocument();
    expect(screen.queryByText('Main Menu')).not.toBeInTheDocument();
    expect(screen.queryByText('cinelink © 2026')).not.toBeInTheDocument();
    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
    expect(screen.queryByText('Users')).not.toBeInTheDocument();
    const links = screen.getAllByRole('link');
    expect(links.length).toBe(7);
    expect(links[0]).toHaveAttribute('title', 'Dashboard');
  });

  it('calls toggleSidebar when the toggle button is clicked', () => {
    const toggleMock = vi.fn();
    render(
      <BrowserRouter>
        <Sidebar isCollapsed={false} toggleSidebar={toggleMock} />
      </BrowserRouter>
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(toggleMock).toHaveBeenCalledTimes(1);
  });

  it('highlights the active link based on current route', () => {
    render(
      <MemoryRouter initialEntries={['/users']}>
        <Sidebar isCollapsed={false} toggleSidebar={vi.fn()} />
      </MemoryRouter>
    );

    const usersLink = screen.getByRole('link', { name: /users/i });
    expect(usersLink.className).toContain('bg-[#3699ff]/10');
    expect(usersLink.className).toContain('text-[#3699ff]'); 
    const dashboardLink = screen.getByRole('link', { name: /dashboard/i });
    expect(dashboardLink.className).not.toContain('bg-[#3699ff]/10');
  });
});
