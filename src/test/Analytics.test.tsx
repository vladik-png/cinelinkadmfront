import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import Analytics from '../pages/Analytics';
import api from '../api/axios';

vi.mock('../api/axios', () => ({
  default: {
    get: vi.fn(),
  },
}));

vi.mock('recharts', async () => {
  const OriginalRecharts = await vi.importActual('recharts');
  return {
    ...OriginalRecharts,
    ResponsiveContainer: ({ children }: any) => <div data-testid="responsive-container-mock">{children}</div>,
  };
});

const mockMetricsData = {
  data: {
    "node_alpha": {
      time: "12:00:00",
      cpu: 45,
      ram: 60,
      disk: "75.5",
      ping: 12,
      packet_loss: "0"
    },
    "node_beta": {
      time: "12:00:00",
      cpu: 80,
      ram: 90,
      disk: "40.0",
      ping: 150,
      packet_loss: "5"
    }
  }
};

describe('Analytics Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (api.get as any).mockResolvedValue(mockMetricsData);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('fetches and displays the correct active nodes count', async () => {
    render(<Analytics />);

    await waitFor(() => {
      expect(screen.getByText('2 Nodes')).toBeInTheDocument();
    });

    expect(api.get).toHaveBeenCalledWith('http://localhost:8081/system-metrics');
  });

  it('renders node telemetry data correctly in default combined mode', async () => {
    render(<Analytics />);

    await waitFor(() => {
      expect(screen.getByText('node_alpha')).toBeInTheDocument();
      expect(screen.getByText('node_beta')).toBeInTheDocument();
      expect(screen.getByText('CPU: 45%')).toBeInTheDocument();
      expect(screen.getByText('RAM: 60%')).toBeInTheDocument();
      expect(screen.getByText('PING: 12MS')).toBeInTheDocument();
    });
  });

  it('toggles view mode from combined to split on card click', async () => {
    render(<Analytics />);

    await waitFor(() => {
      expect(screen.getByText('node_alpha')).toBeInTheDocument();
    });

    expect(screen.getByText('Combined Metrics Pipeline')).toBeInTheDocument();


    const nodeHeader = screen.getByText('node_alpha');
    fireEvent.click(nodeHeader);

    await waitFor(() => {
      expect(screen.getByText('Individual Metrics Grid')).toBeInTheDocument();
    });


    const cpuTitles = screen.getAllByText('CPU Usage');
    expect(cpuTitles.length).toBeGreaterThan(0);
    
    expect(screen.getAllByText('45%')[0]).toBeInTheDocument();
  });

  it('polls API periodically using setInterval', async () => {
    vi.useFakeTimers();
    render(<Analytics />);

    expect(api.get).toHaveBeenCalledTimes(1);

    act(() => {
     vi.advanceTimersByTime(2000);
    });

   expect(api.get).toHaveBeenCalledTimes(2);
  });
});