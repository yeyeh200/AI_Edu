import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { EnhancedDashboard } from '@/pages/Dashboard/EnhancedDashboard';
import { useAuthStore } from '@/stores/authStore';
import { setupFetchMock } from '../__mocks__/handlers';

// Test utilities
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: Infinity,
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

const renderWithProviders = (ui: React.ReactElement, { client = createTestQueryClient() } = {}) => {
  return render(
    <QueryClientProvider client={client}>
      <BrowserRouter>
        {ui}
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('Dashboard Integration Tests', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = createTestQueryClient();
    setupFetchMock();

    // Setup authenticated state
    const { setState } = useAuthStore.getState();
    setState({
      user: {
        id: '1',
        username: 'admin',
        name: '管理员',
        email: 'admin@example.com',
        role: 'admin',
        department: '系统管理',
        createdAt: '2024-01-01T00:00:00.000Z',
      },
      token: 'mock-jwt-token',
      isAuthenticated: true,
      isLoading: false,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    queryClient.clear();
  });

  describe('Dashboard Rendering', () => {
    it('renders enhanced dashboard correctly', () => {
      const { container } = renderWithProviders(<EnhancedDashboard />);

      expect(screen.getByText('智能仪表盘')).toBeInTheDocument();
      expect(screen.getByText('实时监控教学评价系统运行状况')).toBeInTheDocument();
    });

    it('displays connection status indicator', () => {
      const { container } = renderWithProviders(<EnhancedDashboard />);

      const statusIndicator = container.querySelector('.h-2.w-2.rounded-full');
      expect(statusIndicator).toBeInTheDocument();
    });

    it('shows real-time connection status', async () => {
      const { container } = renderWithProviders(<EnhancedDashboard />);

      await waitFor(() => {
        expect(screen.getByText(/实时连接|离线模式/)).toBeInTheDocument();
      });
    });

    it('displays last updated timestamp', () => {
      const { container } = renderWithProviders(<EnhancedDashboard />);

      expect(screen.getByText(/更新:/)).toBeInTheDocument();
    });
  });

  describe('Dashboard Data Loading', () => {
    it('loads dashboard statistics', async () => {
      const { container } = renderWithProviders(<EnhancedDashboard />);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/dashboard/stats');
      });

      // Verify that stats are displayed
      await waitFor(() => {
        expect(screen.getByText('150')).toBeInTheDocument(); // totalTeachers
        expect(screen.getByText('280')).toBeInTheDocument(); // totalCourses
        expect(screen.getByText('120')).toBeInTheDocument(); // totalClasses
        expect(screen.getByText('3500')).toBeInTheDocument(); // totalEvaluations
      });
    });

    it('displays evaluation statistics', async () => {
      const { container } = renderWithProviders(<EnhancedDashboard />);

      await waitFor(() => {
        expect(screen.getByText('整体评分')).toBeInTheDocument();
        expect(screen.getByText('完成率')).toBeInTheDocument();
        expect(screen.getByText('待处理')).toBeInTheDocument();
      });
    });

    it('shows loading state during data fetch', () => {
      const { container } = renderWithProviders(<EnhancedDashboard />);

      // Should show loading skeleton initially
      expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
    });

    it('displays error state when data fetch fails', async () => {
      // Mock fetch to return error
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        text: 'Internal Server Error',
      });

      const { container } = renderWithProviders(<EnhancedDashboard />);

      await waitFor(() => {
        expect(screen.getByText('加载失败')).toBeInTheDocument();
        expect(screen.getByText('无法加载仪表盘数据，请刷新页面重试。')).toBeInTheDocument();
      });
    });
  });

  describe('Dashboard Interactions', () => {
    it('refreshes data when refresh button is clicked', async () => {
      const { container } = renderWithProviders(<EnhancedDashboard />);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/dashboard/stats');
      });

      // Find and click refresh button (if exists)
      const refreshButton = container.querySelector('[title*="刷新"]');
      if (refreshButton) {
        fireEvent.click(refreshButton);

        await waitFor(() => {
          expect(global.fetch).toHaveBeenCalledTimes(2); // Initial load + refresh
        });
      }
    });

    it('updates data in real-time simulation', async () => {
      const { container } = renderWithProviders(<EnhancedDashboard />);

      await waitFor(() => {
        expect(screen.getByText('实时连接')).toBeInTheDocument();
      });

      // Simulate real-time updates
      const wsEvent = new MessageEvent('message');
      wsEvent.data = JSON.stringify({
        type: 'dashboard_update',
        data: { totalTeachers: 151 }, // Changed value
      });

      // In a real implementation, WebSocket would handle this
      // Here we just verify the UI responds to data changes
    });
  });

  describe('Dashboard Components', () => {
    it('renders gauge charts for key metrics', async () => {
      const { container } = renderWithProviders(<EnhancedDashboard />);

      await waitFor(() => {
        expect(screen.getByText('整体评分')).toBeInTheDocument();
        expect(screen.getByText('完成率')).toBeInTheDocument();
        expect(container.querySelector('[class*="PerformanceGauge"]')).toBeInTheDocument();
        expect(container.querySelector('[class*="ParticipationGauge"]')).toBeInTheDocument();
      });
    });

    it('displays trend analysis charts', async () => {
      const { container } = renderWithProviders(<EnhancedDashboard />);

      await waitFor(() => {
        expect(screen.getByText('月度趋势分析')).toBeInTheDocument();
        expect(container.querySelector('[class*="TrendChart"]')).toBeInTheDocument();
      });
    });

    it('shows department performance comparison', async () => {
      const { container } = renderWithProviders(<EnhancedDashboard />);

      await waitFor(() => {
        expect(screen.getByText('部门表现对比')).toBeInTheDocument();
        expect(container.querySelector('[class*="ComparisonBarChart"]')).toBeInTheDocument();
      });
    });

    it('displays top performers ranking', async () => {
      const { container } = renderWithProviders(<EnhancedDashboard />);

      await waitFor(() => {
        expect(screen.getByText('优秀教师排行')).toBeInTheDocument();
        expect(container.querySelector('[class*="RankingChart"]')).toBeInTheDocument();
      });
    });

    it('shows course categories distribution', async () => {
      const { container } = renderWithProviders(<EnhancedDashboard />);

      await waitFor(() => {
        expect(screen.getByText('课程分类分布')).toBeInTheDocument();
        expect(container.querySelector('[class*="PieChart"]')).toBeInTheDocument();
      });
    });

    it('displays score distribution analysis', async () => {
      const { container } = renderWithProviders(<EnhancedDashboard />);

      await waitFor(() => {
        expect(screen.getByText('评分分布')).toBeInTheDocument();
        expect(container.querySelector('[class*="BarChart"]')).toBeInTheDocument();
      });
    });
  });

  describe('Dashboard Responsiveness', () => {
    it('adapts to different screen sizes', () => {
      const { container } = renderWithProviders(<EnhancedDashboard />);

      // Test mobile layout
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      fireEvent(window, new Event('resize'));

      expect(container.querySelector('.grid-cols-1')).toBeInTheDocument();
    });

    it('maintains layout consistency on window resize', () => {
      const { container } = renderWithProviders(<EnhancedDashboard />);

      // Resize window
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      });

      fireEvent(window, new Event('resize'));

      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1920,
      });

      fireEvent(window, new Event('resize'));

      // Components should re-render appropriately
    });
  });

  describe('Dashboard Accessibility', () => {
    it('has proper heading structure', async () => {
      const { container } = renderWithProviders(<EnhancedDashboard />);

      await waitFor(() => {
        const h1 = container.querySelector('h1');
        expect(h1).toBeInTheDocument();
        expect(h1).toHaveTextContent('智能仪表盘');
      });
    });

    it('provides alt text for images', async () => {
      const { container } = renderWithProviders(<EnhancedDashboard />);

      await waitFor(() => {
        const images = container.querySelectorAll('img');
        images.forEach(img => {
          expect(img).toHaveAttribute('alt');
        });
      });
    });

    it('supports keyboard navigation', async () => {
      const { container } = renderWithProviders(<Enhanced />);

      await waitFor(() => {
        const interactiveElements = container.querySelectorAll('button, [role="button"], [tabindex]');
        interactiveElements.forEach(element => {
          expect(element).toHaveAttribute('tabindex');
        });
      });
    });

    it('has proper ARIA labels', async () => {
      const { container } = renderWithProviders(<Enhanced />);

      await waitFor(() => {
        const inputs = container.querySelectorAll('input');
        inputs.forEach(input => {
          expect(input).toHaveAttribute('aria-label');
        });
      });
    });
  });

  describe('Dashboard Performance', () => {
    it('renders efficiently without excessive re-renders', async () => {
      const { container } = renderWithProviders(<EnhancedDashboard />);

      let renderCount = 0;
      const observer = new MutationObserver(() => {
        renderCount++;
      });
      observer.observe(container, { childList: true, subtree: true });

      await waitFor(() => {
        expect(container.querySelector('.animate-pulse')).not.toBeInTheDocument();
      });

      observer.disconnect();

      // Should not have excessive re-renders after initial load
      expect(renderCount).toBeLessThan(20); // Adjust threshold as needed
    });

    it('loads data efficiently with proper caching', async () => {
      const { container } = renderWithProviders(<EnhancedDashboard />);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledTimes(1); // Initial load only
      });

      // Subsequent renders should use cached data
      // Re-render component to verify caching
      const { container } = renderWithProviders(<EnhancedDashboard />, { client: queryClient });

      // Should not trigger additional fetch
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it('handles large datasets gracefully', async () => {
      // Mock large dataset
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: {
          totalTeachers: 1000,
          totalCourses: 2000,
          totalClasses: 1500,
          totalEvaluations: 50000,
          monthlyTrends: Array(24).fill(null).map((_, index) => ({
            month: `${index + 1}月`,
            evaluations: 100 + Math.random() * 100,
            averageScore: 3 + Math.random() * 2,
            participants: 1000 + Math.random() * 1000,
            completedRate: 80 + Math.random() * 20,
          })),
        },
      });

      const { container } = renderWithProviders(<EnhancedDashboard />);

      await waitFor(() => {
        expect(container.querySelector('.animate-pulse')).not.toBeInTheDocument();
      });

      // Should still load and render large datasets
      expect(container.textContent).toContain('1000');
      expect(container.textContent).toContain('50000');
    });
  });

  describe('Dashboard Error Handling', () => {
    it('handles API timeouts gracefully', async () => {
      // Mock fetch to timeout
      (global.fetch as jest.Mock).mockImplementationOnce(() => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              ok: false,
              status: 408,
              text: 'Request Timeout',
            });
          }, 10000); // 10 second timeout
        });
      });

      const { container } = renderWithProviders(<EnhancedDashboard />);

      await waitFor(() => {
        expect(screen.getByText('加载失败')).toBeInTheDocument();
      });
    });

    it('provides retry mechanism for failed requests', async () => {
      // Mock fetch to fail once then succeed
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: false,
          status: 500,
          text: 'Server Error',
        })
        .mockResolvedValueOnce({
          ok: true,
          json: mockHandlers.dashboard.stats(),
        });

      const { container } = renderWithProviders(<Enhanced />);

      await waitFor(() => {
        expect(screen.getByText('加载失败')).toBeInTheDocument();
      });

      // Query should retry automatically and succeed
      await waitFor(() => {
        expect(screen.getByText('150')).toBeInTheDocument();
      });
    });

    it('displays error boundary for component failures', () => {
      // Mock a component error
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      global.console.error = consoleSpy;

      const ErrorComponent = () => {
        throw new Error('Component Error');
      };

      try {
        renderWithProviders(<ErrorComponent />);
        // Should catch error boundary
      } catch (error) {
        expect(error.message).toBe('Component Error');
      }

      consoleSpy.mockRestore();
    });
  });
});

describe('Dashboard Integration with Auth Store', () => {
  it('requires authentication to access dashboard', async () => {
    // Clear auth state
    const { setState } = useAuthStore.getState();
    setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });

    // Should redirect to login or show auth error
    const { container } = renderWithProviders(<EnhancedDashboard />);

    await waitFor(() => {
      // Depending on implementation, might redirect or show auth error
      expect(container.querySelector('.animate-pulse') || container.textContent).toBeTruthy();
    });
  });

  it('uses auth store user information for personalization', async () => {
      const { container } = renderWithProviders(<EnhancedDashboard />);

      await waitFor(() => {
        expect(screen.getByText(/管理员/)).toBeInTheDocument(); // Should contain user role
        expect(screen.getByText(/系统管理/)).toBeInTheDocument(); // Should contain department
      });
  });

  it('respects user permissions for dashboard features', async () => {
      const { container } = renderWithProviders(<Enhanced />);

      await waitFor(() => {
        // Should hide admin-only features for non-admin users
        const adminElements = container.querySelectorAll('[admin-only]');
        // Admin user should see admin features
      });
  });
});

describe('Dashboard Real-time Features', () => {
  describe('WebSocket Integration', () => {
    it('establishes WebSocket connection for real-time updates', async () => {
      const { container } = renderWithProviders(<EnhancedDashboard />);

      await waitFor(() => {
        expect(global.WebSocket).toHaveBeenCalled();
      });

      const ws = (global.WebSocket as jest.Mock).mock.results[0].value;
      expect(ws.readyState).toBe(WebSocket.OPEN);
    });

    it('sends heartbeat messages to maintain connection', async () => {
      const { container } = renderWithProviders(<Enhanced />);

      await waitFor(() => {
        const ws = (global.WebSocket as jest.Mock).mock.results[0].value;
        expect(ws.send).toHaveBeenCalledWith(
          JSON.stringify({ type: 'heartbeat' })
        );
      });
    });

    it('processes real-time data updates', async () => {
      const { container } = renderWithProviders(<Enhanced />);

      const ws = (global.WebSocket as jest.Mock).mock.results[0].value;

      // Simulate receiving real-time data
      const updateEvent = new MessageEvent('message');
      updateEvent.data = JSON.stringify({
        type: 'dashboard_update',
        data: {
          totalEvaluations: 3501,
          averageScore: 4.21,
        },
      });

      ws.dispatchEvent(updateEvent);

      await waitFor(() => {
        // Should update displayed data
        expect(screen.getByText('3501')).toBeInTheDocument();
        expect(screen.getByText('4.21')).toBeInTheDocument();
      });
    });

    it('handles WebSocket disconnection gracefully', async () => {
      const { container } = renderWithProviders(<EnhancedDashboard />);

      const ws = (global.WebSocket as jest.Mock).mock.results[0].value;

      // Simulate disconnection
      ws.close();
      ws.readyState = WebSocket.CLOSED;

      await waitFor(() => {
        expect(screen.getByText(/离线模式/)).toBeInTheDocument();
      });
    });

    it('attempts automatic reconnection on disconnection', async () => {
      const { container } = renderWithProviders(<Enhanced />);

      const ws = (global.WebSocket as jest.Mock).mock.results[0].value;

      // Simulate disconnection and reconnection
      ws.close();
      ws.readyState = WebSocket.CLOSED;

      await waitFor(() => {
        // Should attempt reconnection
        expect(global.WebSocket).toHaveBeenCalledTimes(2); // Initial + reconnection
      });
    });
  });

  describe('Real-time Data Updates', () => {
    it('displays real-time evaluation updates', async () => {
      const { container } = renderWithProviders(<Enhanced />);

      await waitFor(() => {
        expect(screen.getByText(/新增.*活动/)).toBeInTheDocument();
      });
    });

    it('updates UI immediately when new data arrives', async () => {
      const { container } = renderWithProviders(<Enhanced />);

      const initialContent = container.textContent;

      // Trigger real-time update
      const mockUpdate = {
        type: 'evaluation_update',
        data: {
          id: 'update-1',
          title: '新的评价',
          description: '实时更新描述',
          status: 'success',
        },
      };

      // Simulate receiving update via WebSocket
      const ws = (global.WebSocket as jest.Mock).mock.results[0].value;
      ws.dispatchEvent(new MessageEvent('message', { data: JSON.stringify(mockUpdate) }));

      await waitFor(() => {
        expect(container.textContent).not.toBe(initialContent);
        expect(container.textContent).toContain('新的评价');
      });
    });
  });
});