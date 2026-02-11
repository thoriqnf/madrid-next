import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { server } from './mocks/server';
import AsyncUserDashboard, {
  validateDashboardResponse,
  formatStatNumber,
} from './AsyncUserDashboard';

/**
 * ==================================================
 * 💡 THE TESTING CHEAT SHEET Asynchornous
 * ==================================================
 * 1. The Pure Logic Rule:
 *    If a function just transforms data (like formatStatNumber), 
 *    test it ALONE. Don't waste time rendering a UI for it.
 * 
 * 2. The Network Rule:
 *    Don't mock the component's internal code. Mock the "World" 
 *    around it (the API). This is what MSW does.
 * 
 * 3. findBy vs getBy:
 *    - getBy: Use for things that are ALREADY there (like Loading).
 *    - findBy: Use for things that take TIME to appear (like API data).
 * ==================================================
 */

/**
 * PART 1: Pure Business Logic (Unit Tests)
 * No React, no DOM, no setup. Just testing functions.
 */
describe('Part 1: Pure Logic Unit Tests', () => {
  describe('validateDashboardResponse()', () => {
    test('✅ returns true for valid data shape', () => {
      const valid = {
        user: { name: 'Alice', email: 'alice@test.com' },
        stats: { posts: 10, followers: 20, following: 5 },
      };
      expect(validateDashboardResponse(valid)).toBe(true);
    });

    test('❌ returns false for missing fields', () => {
      expect(validateDashboardResponse({})).toBe(false);
      expect(validateDashboardResponse({ user: {} })).toBe(false);
    });
  });

  describe('formatStatNumber()', () => {
    test('adds commas to large numbers correctly', () => {
      expect(formatStatNumber(1200)).toBe('1,200');
      expect(formatStatNumber(1000000)).toBe('1,000,000');
      expect(formatStatNumber(0)).toBe('0');
    });
  });
});

/**
 * PART 2: The "Manual" Way (The Contrast)
 * Briefly showing how to mock fetch with jest.spyOn.
 * This helps you understand why we prefer MSW later.
 */
describe('Part 2: Manual Fetch Mocking (jest.spyOn)', () => {
  let fetchSpy: jest.SpyInstance;

  afterEach(() => {
    fetchSpy?.mockRestore();
  });

  test('successfully renders data using a manual fetch mock', async () => {
    fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        user: { name: 'Manual Mock', email: 'mock@test.com' },
        stats: { posts: 5, followers: 5, following: 5 },
      }),
    } as Response);

    render(<AsyncUserDashboard />);
    
    // Shows loading state immediately
    expect(screen.getByTestId('loading-state')).toBeInTheDocument();

    // Data appears after resolution
    const name = await screen.findByTestId('user-name');
    expect(name).toHaveTextContent('Manual Mock');
    expect(fetchSpy).toHaveBeenCalledWith('/api/user-dashboard');
  });
});

/**
 * PART 3: The "Modern" Way (Comprehensive MSW)
 * Full network control. We test everything: success, errors, and weird data.
 */
describe('Part 3: Comprehensive MSW Testing', () => {

  /**
   * LEVEL 1: Happy Path
   */
  describe('Level 1: Happy Path', () => {
    test('renders user info and formatted stats from API', async () => {
      render(<AsyncUserDashboard />);

      // Find by name (default handler returns John Doe)
      const name = await screen.findByTestId('user-name');
      expect(name).toHaveTextContent('John Doe');
      
      // Verification of formatting (default followers is 1200)
      expect(screen.getByText('1,200')).toBeInTheDocument();
    });
  });

  /**
   * LEVEL 2: Error Handling
   */
  describe('Level 2: Error Responses', () => {
    test('shows "Server error: 500" for internal errors', async () => {
      server.use(
        http.get('/api/user-dashboard', () => {
          return HttpResponse.json({ message: 'Error' }, { status: 500 });
        })
      );

      render(<AsyncUserDashboard />);
      const error = await screen.findByTestId('error-message');
      expect(error).toHaveTextContent('Server error: 500');
    });

    test('shows "Server error: 404" for not found entries', async () => {
      server.use(
        http.get('/api/user-dashboard', () => {
          return HttpResponse.json({ message: 'Not Found' }, { status: 404 });
        })
      );

      render(<AsyncUserDashboard />);
      const error = await screen.findByTestId('error-message');
      expect(error).toHaveTextContent('Server error: 404');
    });

    test('handles total network breakdown (Offline)', async () => {
      server.use(
        http.get('/api/user-dashboard', () => HttpResponse.error())
      );

      render(<AsyncUserDashboard />);
      const error = await screen.findByTestId('error-message');
      expect(error).toHaveTextContent(/failed to fetch/i);
      expect(screen.getByTestId('retry-button')).toBeInTheDocument();
    });
  });

  /**
   * LEVEL 3: Edge Cases & Retries
   */
  describe('Level 3: Logic Edge Cases', () => {
    test('successfully retries after a network failure', async () => {
      const user = userEvent.setup();

      // Fail once, then it will auto-fallback to the default happy handler
      server.use(
        http.get('/api/user-dashboard', () => HttpResponse.error(), { once: true })
      );

      render(<AsyncUserDashboard />);
      
      const retryBtn = await screen.findByTestId('retry-button');
      await user.click(retryBtn);

      const dashboard = await screen.findByTestId('dashboard');
      expect(dashboard).toBeInTheDocument();
      expect(screen.getByTestId('user-name')).toHaveTextContent('John Doe');
    });

    test('shows error UI for broken/empty JSON data', async () => {
      server.use(
        http.get('/api/user-dashboard', () => HttpResponse.json({ stats: {} })) // missing user
      );

      render(<AsyncUserDashboard />);
      const error = await screen.findByTestId('error-message');
      expect(error).toHaveTextContent('Invalid response format');
    });

    test('renders correctly for "Zero-State" data (valid but empty stats)', async () => {
      server.use(
        http.get('/api/user-dashboard', () => HttpResponse.json({
          user: { name: 'New User', email: 'new@test.com' },
          stats: { posts: 0, followers: 0, following: 0 },
        }))
      );

      render(<AsyncUserDashboard />);
      await screen.findByTestId('dashboard');
      expect(screen.getByTestId('user-name')).toHaveTextContent('New User');
      // All three stats should show 0
      expect(screen.getAllByText('0')).toHaveLength(3);
    });
  });
});
