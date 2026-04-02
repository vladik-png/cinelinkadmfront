import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import Infrastructure from '../pages/Infrastructure';
import axios from 'axios';

vi.mock('axios');

const mockRegionData = {
  data: { region: 'eu-central-1' }
};

const mockInstancesData = {
  data: [
    {
      Instances: [
        {
          InstanceId: 'i-0011223344',
          State: { Name: 'running' },
          Tags: [{ Key: 'Name', Value: 'Production DB' }]
        },
        {
          InstanceId: 'i-5566778899',
          State: { Name: 'stopped' },
          Tags: [{ Key: 'Name', Value: 'Staging Server' }]
        }
      ]
    }
  ]
};

describe('Infrastructure Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    vi.stubGlobal('alert', vi.fn());

    (axios.get as any).mockImplementation((url: string) => {
      if (url.endsWith('/info')) {
        return Promise.resolve(mockRegionData);
      }
      if (url.endsWith(':8082/')) {
        return Promise.resolve(mockInstancesData);
      }
      return Promise.resolve({ data: { success: true } });
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('fetches and displays EC2 instances and region', async () => {
    render(<Infrastructure />);

    await waitFor(() => {
      expect(screen.getByText('EU-CENTRAL-1')).toBeInTheDocument();
      expect(screen.getByText('Production DB')).toBeInTheDocument();
      expect(screen.getByText('Staging Server')).toBeInTheDocument();
      expect(screen.getByText('i-0011223344')).toBeInTheDocument();
    });

    expect(axios.get).toHaveBeenCalledWith('http://localhost:8082/');
    expect(axios.get).toHaveBeenCalledWith('http://localhost:8082/info');
  });

  it('disables buttons correctly based on instance state', async () => {
    render(<Infrastructure />);

    await waitFor(() => {
      expect(screen.getByText('Production DB')).toBeInTheDocument();
    });

    const startButtons = screen.getAllByRole('button', { name: /Start/i });
    const stopButtons = screen.getAllByRole('button', { name: /Stop/i });

    expect(startButtons[0]).toBeDisabled();
    expect(stopButtons[0]).not.toBeDisabled();

    expect(startButtons[1]).not.toBeDisabled();
    expect(stopButtons[1]).toBeDisabled();
  });

  it('handles power actions (start/stop) correctly', async () => {
    render(<Infrastructure />);

    await waitFor(() => {
      expect(screen.getByText('Staging Server')).toBeInTheDocument();
    });

    const startButtons = screen.getAllByRole('button', { name: /Start/i });
    fireEvent.click(startButtons[1]);

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith('http://localhost:8082/start', {
        params: { id: 'i-5566778899' }
      });
    });
  });

  it('handles API errors gracefully during power actions', async () => {
    render(<Infrastructure />);

    await waitFor(() => {
      expect(screen.getByText('Staging Server')).toBeInTheDocument();
    });

    (axios.get as any).mockRejectedValueOnce(new Error('Network Error'));

    const startButtons = screen.getAllByRole('button', { name: /Start/i });
    fireEvent.click(startButtons[1]);

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Не вдалося виконати дію: Network Error');
    });
  });
});