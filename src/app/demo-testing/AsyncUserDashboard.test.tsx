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
  test('validateDashboardResponse, return true if the data structure valid', ()=> {
    const data = {
      user: { name: 'revou', email: 'revou@revou.co' },
      stats: { posts: 100, followers: 9999999, following: 1 }
    }
    expect(validateDashboardResponse(data)).toBe(true)
  })
  test('validateDashboardResponse, return false if the data structure valid', ()=> {
    expect(validateDashboardResponse({})).toBe(false)
    expect(validateDashboardResponse({user: {}})).toBe(false)
  })
});

/**
 * PART 2: The "Manual" Way (The Contrast)
 * Briefly showing how to mock fetch with jest.spyOn.
 * This helps you understand why we prefer MSW later.
 */
describe('Part 2: Manual Fetch Mocking (jest.spyOn)', () => {
  let fetchSpy: jest.SpyInstance;

  afterEach(()=>{
    fetchSpy?.mockRestore()
  })
  
  test('successfully render data using a manual fetch mock', async()=>{
    fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        user: { name: 'Manual Mock', email: 'mock@test.com' },
        stats: { posts: 5, followers: 5, following: 5 },
      }),
    } as Response);

    render(<AsyncUserDashboard />)
    expect(screen.getByTestId('loading-state')).toBeInTheDocument()

    // data appear after the fetchspy complete

    const name = await screen.findByTestId('user-name')
    expect(name).toHaveTextContent('Manual Mock')
    expect(fetchSpy).toHaveBeenCalledWith('/api/user-dashboard')

  });
})

/**
 * PART 3: The "Modern" Way (Comprehensive MSW)
 * Full network control. We test everything: success, errors, and weird data.
 */
describe('Part 3: Comprehensive MSW Testing', () => {

  /**
   * LEVEL 1: Happy Path
   */
  describe('level 1: happy path', ()=> {
    test('renders users info and data from api', async()=> {
      render(<AsyncUserDashboard />)

      const name = await screen.findByTestId('user-name')
      expect(name).toHaveTextContent('John Doe')

      expect(screen.getByText('1,200')).toBeInTheDocument()
    })
  })

  /**
   * LEVEL 2: Error Handling
   */
  describe('Level 2: Error Responses', () => {
    test('show error server 500 for internal error', ()=>{
      server.use(
        http.get('/api/user-dashboard', ()=> {
          return HttpResponse.json({message: 'Error'}, {status: 500})
        })
      )
    })

    test('show error server 404 for internal error', ()=>{
      server.use(
        http.get('/api/user-dashboard', ()=> {
          return HttpResponse.json({message: 'not found'}, {status: 404})
        })
      )
    })

    test('show error server 401 for forbidden', ()=>{
      server.use(
        http.get('/api/user-dashboard', ()=> {
          return HttpResponse.json({message: 'Forbidden'}, {status: 401})
        })
      )
    })

    test('show error server down', ()=>{
      server.use(
        http.get('/api/user-dashboard', ()=> {
          return HttpResponse.error()
        })
      )
    })
  });

  /**
   * LEVEL 3: Edge Cases & Retries
   */
  describe('Level 3: Logic Edge Cases', () => {
    test('successfully retries after a network failure', async ()=>{
      const user = userEvent.setup();

      server.use(
        http.get('/api/user-dashboard', ()=> HttpResponse.error(), {once: true})
      )

      render(<AsyncUserDashboard />)
      const retryBTN = await screen.findByTestId('retry-button')
      await user.click(retryBTN)

      const dashboard = await screen.findByTestId('dashboard')
      expect(dashboard).toBeInTheDocument()
      expect(screen.getByTestId('user-name')).toHaveTextContent('John Doe')
    })

    test('successfully render correctly for zero state data / empty data', async ()=>{

      server.use(
        http.get('/api/user-dashboard', ()=> HttpResponse.json({
          user: { name: 'New user', email: 'new@test.com' },
          stats: { posts: 0, followers: 0, following: 0 },
        }))
      )

      render(<AsyncUserDashboard />)
      await screen.findByTestId('dashboard')
      expect(screen.getByTestId('user-name')).toHaveTextContent('New user')
      expect(screen.getAllByText('0')).toHaveLength(3)
    })
  });
});
