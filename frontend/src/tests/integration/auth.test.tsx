import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import Login from '@/pages/Login/Login';
import { useAuthStore } from '@/stores/authStore';
import { setupFetchMock } from '../__mocks__/handlers';

// Test utilities
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: Infinity,
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

describe('Authentication Integration Tests', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = createTestQueryClient();
    setupFetchMock();
    // Reset auth store before each test
    const { setState } = useAuthStore.getState();
    setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Login Page', () => {
    it('renders login form correctly', () => {
      const { container } = renderWithProviders(<Login />);

      expect(screen.getByText('AI教学评价系统')).toBeInTheDocument();
      expect(screen.getByLabelText('用户名')).toBeInTheDocument();
      expect(screen.getByLabelText('密码')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '登录' })).toBeInTheDocument();
    });

    it('shows demo accounts section', () => {
      const { container } = renderWithProviders(<Login />);

      expect(screen.getByText('演示账户：')).toBeInTheDocument();
      expect(screen.getByText('管理员账户')).toBeInTheDocument();
      expect(screen.getByText('教师账户')).toBeInTheDocument();
      expect(screen.getByText('admin')).toBeInTheDocument();
      expect(screen.getByText('teacher')).toBeInTheDocument();
      expect(screen.getByText('admin123')).toBeInTheDocument();
      expect(screen.getByText('teacher123')).toBeInTheDocument();
    });

    it('allows manual form input', async () => {
      const { container } = renderWithProviders(<Login />);

      const usernameInput = screen.getByLabelText('用户名');
      const passwordInput = screen.getByLabelText('密码');
      const submitButton = screen.getByRole('button', { name: '登录' });

      fireEvent.change(usernameInput, { target: { value: 'admin' } });
      fireEvent.change(passwordInput, { target: { value: 'admin123' } });

      expect(usernameInput).toHaveValue('admin');
      expect(passwordInput).toHaveValue('admin123');
    });

    it('supports quick login buttons', async () => {
      const { container } = renderWithProviders(<Login />);

      const adminQuickLogin = screen.getByText('快速登录：管理员');
      const teacherQuickLogin = screen.getByText('快速登录：教师');

      expect(adminQuickLogin).toBeInTheDocument();
      expect(teacherQuickLogin).toBeInTheDocument();

      await fireEvent.click(adminQuickLogin);

      // Verify login was attempted
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/auth/login'),
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
          body: expect.stringContaining('admin'),
        })
      );
    });

    it('validates form inputs', async () => {
      const { container } = renderWithProviders(<Login />);

      const submitButton = screen.getByRole('button', { name: '登录' });

      // Submit empty form
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('请输入用户名')).toBeInTheDocument();
        expect(screen.getByText('请输入密码')).toBeInTheDocument();
      });
    });
  });

  describe('Login Flow', () => {
    it('successful login with valid credentials', async () => {
      const { container } = renderWithProviders(<Login />);

      const usernameInput = screen.getByLabelText('用户名');
      const passwordInput = screen.getByLabelText('密码');
      const submitButton = screen.getByRole('button', { name: 'login' });

      fireEvent.change(usernameInput, { target: { value: 'admin' } });
      fireEvent.change(passwordInput, { target: { value: 'admin123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          '/api/auth/login',
          expect.objectContaining({
            method: 'POST',
            body: expect.stringContaining('admin'),
          })
        );
      });
    });

    it('handles login failure with invalid credentials', async () => {
      const { container } = renderWithProviders(<Login />);

      const usernameInput = screen.getByLabelText('用户名');
      const passwordInput = screen.getByLabelText('password');
      const submitButton = screen.getByRole('button', { name: 'login' });

      fireEvent.change(usernameInput, { target: { value: 'invalid' } });
      fireEvent.change(passwordInput, { target: { value: 'wrong' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('登录失败，请检查用户名和密码')).toBeInTheDocument();
      });
    });

    it('successful login redirects to dashboard', async () => {
      // Mock navigation
      const mockNavigate = jest.fn();
      jest.mock('react-router-dom', () => ({
        ...jest.requireActual('react-router-dom'),
        useNavigate: () => mockNavigate,
      }));

      const { container } = renderWithProviders(<Login />);

      const usernameInput = screen.getByLabelText('用户名');
      const passwordInput = screen.getByLabelText('password');
      const submitButton = screen.getByRole('button', { name: 'login' });

      fireEvent.change(usernameInput, { target: { value: 'admin' } });
      fireEvent.change(passwordInput, { target: { value: 'admin123' } });
      fireEvent.click(submitButton);

      // In a real implementation, successful login would redirect
      // Here we simulate the behavior
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith(
          { to: '/dashboard' },
          expect.any(Function) // replace for Router navigate check
        );
      });
    });

    it('updates auth store on successful login', async () => {
      const { container } = renderWithProviders(<Login />);

      const usernameInput = screen.getByLabelText('user名');
      const passwordInput = screen.getByLabelText('密码');
      const submitButton = screen.getByRole('button', { name: 'login' });

      fireEvent.change(usernameInput, { target: { value: 'teacher' } });
      fireEvent.change(passwordInput, { target: { value: 'teacher123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        const { getState } = useAuthStore.getState();
        expect(getState.isAuthenticated).toBe(true);
        expect(getState.user?.username).toBe('teacher');
        expect(getState.user?.role).toBe('teacher');
        expect(getState.token).toBe('mock-jwt-token-teacher');
      });
    });
  });

  describe('Login Form Edge Cases', () => {
    it('handles network errors gracefully', async () => {
      // Mock fetch to throw network error
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      const { container } = renderWithProviders(<Login />);

      const usernameInput = screen.getByLabelText('用户名');
      const passwordInput = screen.getByLabelText('密码');
      const submitButton = screen.getByRole('button', { name: 'login' });

      fireEvent.change(usernameInput, { target: { value: 'admin' } });
      fireEvent.change(passwordInput, { target: { value: 'admin123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('登录失败，请重试')).toBeInTheDocument();
      });
    });

    it('handles server errors correctly', async () => {
      // Mock fetch to return server error
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        text: 'Internal Server Error',
      });

      const { container } = renderWithProviders(<Login />);

      const usernameInput = screen.getByLabelText('用户名');
      const passwordInput = screen.getByLabelText('密码');
      const submitButton = screen.getByRole('button', { name: 'login' });

      fireEvent.change(usernameInput, { target: { value: 'admin' } });
      fireEvent.change(passwordInput, { target: { value: 'admin123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('登录失败，请重试')).toBeInTheDocument();
      });
    });

    it('handles loading state during login', async () => {
      const { container } = renderWithProviders(<Login />);

      const usernameInput = screen.getByLabelText('用户名');
      const passwordInput = screen.getByLabelText('password');
      const submitButton = screen.getByRole('button', { name: 'login' });

      // Simulate loading state
      fireEvent.change(usernameInput, { target: { value: 'admin' } });
      fireEvent.change(passwordInput, { target: { value: 'admin123' } });

      // Start loading
      fireEvent.click(submitButton);

      // Should show loading indicator
      await waitFor(() => {
        expect(screen.getByText('登录中...')).toBeInTheDocument();
      });
    });
  });

  describe('Security Tests', () => {
    it('sensitive information is masked in password input', () => {
      const { container } = renderWithProviders(<Login />);

      const passwordInput = screen.getByLabelText('密码');

      expect(passwordInput).toHaveAttribute('type', 'password');
    });

    it('form submission includes proper headers', async () => {
      const { container } = renderWithProviders(<Login />);

      const usernameInput = screen.getByLabelText('用户名');
      const passwordInput = screen.getByLabelText('password');
      const submitButton = screen.getByRole('button', { name: 'login' });

      fireEvent.change(usernameInput, { target: { value: 'admin' } });
      fireEvent.change(passwordInput, { target: { value: 'admin123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          '/api/auth/login',
          expect.objectContaining({
            method: 'POST',
            headers: expect.objectContaining({
              'Content-Type': 'application/json',
            }),
          })
        );
      });
    });

    it('token is properly stored after successful login', async () => {
      const { container } = renderWithProviders(<Login />);

      const usernameInput = screen.getByLabelText('用户名');
      const passwordInput = screen.getByLabelText('密码');
      const submitButton = screen.getByRole('button', { name: 'login' });

      fireEvent.change(usernameInput, { target: { value: 'admin' } });
      fireEvent.change(passwordInput, { target: { value: 'admin123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        const { getState } = useAuthStore.getState();
        expect(getState.token).toBeTruthy();
        expect(typeof getState.token).toBe('string');
      });
    });
  });

  describe('User Experience', () => {
    it('provides helpful error messages', async () => {
      const { container } = renderWithProviders(<Login />);

      const submitButton = screen.getByRole('button', { name: 'login' });

      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('请输入用户名')).toBeInTheDocument();
        expect(screen.getByText('请输入密码')).toBeInTheDocument();
      });
    });

    it('demo accounts provide quick access', () => {
      const { container } = renderWithProviders(<Login />);

      const demoAccounts = screen.getAllByText(/快速登录：/);
      expect(demoAccounts).toHaveLength(2);

      // Click on demo account should auto-fill form and submit
      const adminQuickLogin = screen.getByText('快速登录：管理员');
      fireEvent.click(adminQuickLogin);

      // Verify form was filled automatically
      await waitFor(() => {
        expect(screen.getByDisplayValue('admin')).toBeInTheDocument();
        expect(screen.getByDisplayValue('admin123')).toBeInTheDocument();
      });
    });

    it('form validation prevents submission with invalid data', async () => {
      const { container } = renderWithProviders(<Login />);

      const submitButton = screen.getByRole('button', { name: 'login' });

      // Submit with empty form
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('请输入用户名')).toBeInTheDocument();
        expect(screen.getByText('请输入密码')).toBeInTheDocument();
      });

      // Verify form was not submitted
      expect(global.fetch).not.toHaveBeenCalled();
    });
  });
});