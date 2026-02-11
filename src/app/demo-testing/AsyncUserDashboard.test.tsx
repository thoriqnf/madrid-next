import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { server } from './mocks/server';
import AsyncUserDashboard from './AsyncUserDashboard';

describe('AsyncUserDashboard — MSW API Mocking Tutorial', () => {
  /**
   * =============================================
   * LEVEL 1: Happy Path — Default MSW Handler
   * =============================================
   * The mock server returns a successful response
   * automatically (defined in handlers.ts).
   * We just render and wait for data to appear.
   */
  describe('Level 1: Happy Path (default handler)', () => {
    test('shows loading state initially, then renders user data', async () => {
      render(<AsyncUserDashboard />);

      // Loading shows up first
      expect(screen.getByTestId('loading-state')).toBeInTheDocument();

      // Wait for data to appear
      const userName = await screen.findByTestId('user-name');
      expect(userName).toHaveTextContent('John Doe');
      expect(screen.getByTestId('user-email')).toHaveTextContent('john@example.com');
    });

    test('renders all stat values correctly', async () => {
      render(<AsyncUserDashboard />);

      await screen.findByTestId('dashboard');

      expect(screen.getByText('42')).toBeInTheDocument();
      expect(screen.getByText('1,200')).toBeInTheDocument();
      expect(screen.getByText('350')).toBeInTheDocument();
    });
  });

  /**
   * =============================================
   * LEVEL 2: Server Errors (500, 404, etc.)
   * =============================================
   * We use server.use() to OVERRIDE the default handler
   * with one that returns an error status code.
   * This override is reset after each test via afterEach().
   */
  describe('Level 2: Server Errors', () => {
    test('shows error state on 500 Internal Server Error', async () => {
      // Override: return 500
      server.use(
        http.get('/api/user-dashboard', () => {
          return HttpResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
          );
        })
      );

      render(<AsyncUserDashboard />);

      const errorState = await screen.findByTestId('error-state');
      expect(errorState).toBeInTheDocument();
      expect(screen.getByTestId('error-message')).toHaveTextContent('Server error: 500');
    });

    test('shows error state on 404 Not Found', async () => {
      server.use(
        http.get('/api/user-dashboard', () => {
          return HttpResponse.json(
            { message: 'Not Found' },
            { status: 404 }
          );
        })
      );

      render(<AsyncUserDashboard />);

      const errorState = await screen.findByTestId('error-state');
      expect(errorState).toBeInTheDocument();
      expect(screen.getByTestId('error-message')).toHaveTextContent('Server error: 404');
    });
  });

  /**
   * =============================================
   * LEVEL 3: Network Errors
   * =============================================
   * HttpResponse.error() simulates a network failure
   * (like no internet, DNS failure, CORS block).
   * The fetch() call itself throws — no status code.
   */
  describe('Level 3: Network Errors', () => {
    test('shows error state when the network fails entirely', async () => {
      server.use(
        http.get('/api/user-dashboard', () => {
          return HttpResponse.error();
        })
      );

      render(<AsyncUserDashboard />);

      const errorState = await screen.findByTestId('error-state');
      expect(errorState).toBeInTheDocument();
      expect(screen.getByTestId('error-message')).toHaveTextContent(/failed to fetch/i);
    });

    test('shows retry button on network error, and retrying works', async () => {
      const user = userEvent.setup();

      // First call: network error
      server.use(
        http.get('/api/user-dashboard', () => {
          return HttpResponse.error();
        }, { once: true })
      );

      render(<AsyncUserDashboard />);

      // Wait for error state
      const retryButton = await screen.findByTestId('retry-button');
      expect(retryButton).toBeInTheDocument();

      // Click retry — the once:true handler is consumed,
      // so the default happy-path handler will respond now
      await user.click(retryButton);

      // Should show dashboard after retry
      const dashboard = await screen.findByTestId('dashboard');
      expect(dashboard).toBeInTheDocument();
      expect(screen.getByTestId('user-name')).toHaveTextContent('John Doe');
    });
  });

  /**
   * =============================================
   * LEVEL 4: Invalid / Empty Responses
   * =============================================
   * The API returns 200 OK, but the data is missing
   * or has an unexpected shape.
   * This tests our client-side validation logic.
   */
  describe('Level 4: Invalid & Empty Responses', () => {
    test('shows error when response is missing user field', async () => {
      server.use(
        http.get('/api/user-dashboard', () => {
          return HttpResponse.json({
            stats: { posts: 0, followers: 0, following: 0 },
            // user field is missing!
          });
        })
      );

      render(<AsyncUserDashboard />);

      const errorState = await screen.findByTestId('error-state');
      expect(errorState).toBeInTheDocument();
      expect(screen.getByTestId('error-message')).toHaveTextContent('Invalid response format');
    });

    test('shows error when response is completely empty', async () => {
      server.use(
        http.get('/api/user-dashboard', () => {
          return HttpResponse.json({});
        })
      );

      render(<AsyncUserDashboard />);

      const errorState = await screen.findByTestId('error-state');
      expect(errorState).toBeInTheDocument();
      expect(screen.getByTestId('error-message')).toHaveTextContent('Invalid response format');
    });

    test('handles empty stats gracefully with valid user', async () => {
      server.use(
        http.get('/api/user-dashboard', () => {
          return HttpResponse.json({
            user: { name: 'Empty User', email: 'empty@test.com' },
            stats: { posts: 0, followers: 0, following: 0 },
          });
        })
      );

      render(<AsyncUserDashboard />);

      await screen.findByTestId('dashboard');
      expect(screen.getByTestId('user-name')).toHaveTextContent('Empty User');
      // All stats should show 0
      const zeros = screen.getAllByText('0');
      expect(zeros).toHaveLength(3);
    });
  });
});
