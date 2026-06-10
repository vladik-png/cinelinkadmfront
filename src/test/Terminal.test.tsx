
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Terminal from '../pages/Terminal';
import { BrowserRouter } from 'react-router-dom';

vi.mock('../hooks/useTerminalLogic', () => ({
  useTerminalLogic: () => ({
    credentials: { host: '', port: 22, username: '', password: '' },
    setCredentials: vi.fn(),
    showPassword: false,
    setShowPassword: vi.fn(),
    savedNodes: [],
    sessions: [],
    activeTabId: 'new',
    setActiveTabId: vi.fn(),
    startConnection: vi.fn(),
    removeSavedNode: vi.fn(),
    closeSession: vi.fn()
  })
}));

describe('Terminal Component', () => {
  it('renders web terminal title', () => {
    render(
      <BrowserRouter>
        <Terminal />
      </BrowserRouter>
    );
    expect(screen.getByText(/Web Terminal/i)).toBeInTheDocument();
  });
});
  