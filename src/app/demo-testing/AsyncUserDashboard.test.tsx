import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { server } from './mocks/server';
import AsyncUserDashboard, {
  validateDashboardResponse,
  formatStatNumber,
} from './AsyncUserDashboard';

/**
 * ==================================================
 * PART A: Testing Functions (No rendering needed!)
 * ==================================================
 * Before testing the component, let's test the
 * extracted utility functions as pure unit tests.
 * No React, no DOM, just input → output.
 */
describe('Utility Functions — Pure Unit Tests', () => {
  /**
   * LEVEL 0A: validateDashboardResponse
   * A type guard that checks if API data has the right shape.
   */
  describe('validateDashboardResponse', () => {
    test('returns true for a valid response', () => {
      const valid = {
        user: { name: 'Alice', email: 'alice@test.com' },
        stats: { posts: 10, followers: 20, following: 5 },
      };
      expect(validateDashboardResponse(valid)).toBe(true);
    });

    test('returns false when user is missing', () => {
      const noUser = { stats: { posts: 0, followers: 0, following: 0 } };
      expect(validateDashboardResponse(noUser)).toBe(false);
    });

    test('returns false when stats is missing', () => {
      const noStats = { user: { name: 'Bob', email: 'bob@test.com' } };
      expect(validateDashboardResponse(noStats)).toBe(false);
    });

    test('returns false for empty object', () => {
      expect(validateDashboardResponse({})).toBe(false);
    });
  });

  /**
   * LEVEL 0B: formatStatNumber
   * Formats numbers with locale separators.
   */
  describe('formatStatNumber', () => {
    test('formats small numbers as-is', () => {
      expect(formatStatNumber(42)).toBe('42');
    });

    test('formats thousands with comma separator', () => {
      expect(formatStatNumber(1200)).toBe('1,200');
    });

    test('formats zero', () => {
      expect(formatStatNumber(0)).toBe('0');
    });

    test('formats large numbers', () => {
      expect(formatStatNumber(1000000)).toBe('1,000,000');
    });
  });
});

/**
 * ==================================================
 * PART B: Testing Async Behavior (jest.fn approach)
 * ==================================================
 * Before MSW, let's see the "manual" way to mock
 * async fetch calls using jest.fn(). This works but
 * is more boilerplate — MSW will simplify this later.
 */
describe('AsyncUserDashboard — Manual Async Mocking (jest.spyOn)', () => {
  let fetchSpy: jest.SpyInstance;

  afterEach(() => {
    // Restore original fetch after each test
    fetchSpy?.mockRestore();
  });

  test('calls fetch on mount and shows loading first', async () => {
    // Spy on fetch and mock its return value
    fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          user: { name: 'Manual Mock', email: 'mock@test.com' },
          stats: { posts: 5, followers: 10, following: 3 },
        }),
    } as Response);

    render(<AsyncUserDashboard />);

    // 1. Loading shows immediately
    expect(screen.getByTestId('loading-state')).toBeInTheDocument();

    // 2. fetch was called with our endpoint
    expect(fetchSpy).toHaveBeenCalledWith('/api/user-dashboard');

    // 3. Data appears after fetch resolves
    const name = await screen.findByTestId('user-name');
    expect(name).toHaveTextContent('Manual Mock');
  });

  test('shows error when fetch rejects (simulating network failure)', async () => {
    fetchSpy = jest.spyOn(global, 'fetch').mockRejectedValue(
      new Error('Network is down')
    );

    render(<AsyncUserDashboard />);

    const errorState = await screen.findByTestId('error-state');
    expect(errorState).toBeInTheDocument();
    expect(screen.getByTestId('error-message')).toHaveTextContent('Network is down');
  });

  test('shows error when response is not ok (manual status check)', async () => {
    fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: false,
      status: 503,
      json: () => Promise.resolve({ message: 'Service Unavailable' }),
    } as Response);

    render(<AsyncUserDashboard />);

    const errorState = await screen.findByTestId('error-state');
    expect(errorState).toBeInTheDocument();
    expect(screen.getByTestId('error-message')).toHaveTextContent('Server error: 503');
  });
});

/**
 * ==================================================
 * PART C: Testing with MSW (The Better Way!)
 * ==================================================
 * Now compare: MSW handles the mocking at the network
 * level. No manual fetch override, no cleanup hassle.
 * Just server.use() to swap responses per test.
 */
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
