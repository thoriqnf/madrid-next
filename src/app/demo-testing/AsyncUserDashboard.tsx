'use client';

import React, { useState, useEffect } from 'react';

interface UserData {
  user: { name: string; email: string };
  stats: { posts: number; followers: number; following: number };
}

/**
 * Validates that the API response has the expected shape.
 * Exported so we can unit test this logic independently.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function validateDashboardResponse(json: any): json is UserData {
  return !!json.user && !!json.stats;
}

/**
 * Formats a number for display (e.g. 1200 → "1,200").
 * Exported so we can unit test this logic independently.
 */
export function formatStatNumber(value: number): string {
  return value.toLocaleString();
}

export default function AsyncUserDashboard() {
  const [data, setData] = useState<UserData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/user-dashboard');

      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }

      const json = await res.json();

      // Validate response shape
      if (!validateDashboardResponse(json)) {
        throw new Error('Invalid response format');
      }

      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div data-testid="loading-state" className="p-8 bg-slate-900 border border-slate-800 rounded-xl animate-pulse">
        <div className="flex items-center space-x-3">
          <div className="w-5 h-5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div data-testid="error-state" className="p-8 bg-slate-900 border border-red-500/30 rounded-xl">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-red-500/20 rounded-full">
            <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-red-400 font-semibold">Failed to load dashboard</p>
        </div>
        <p data-testid="error-message" className="text-slate-500 text-sm mb-4">{error}</p>
        <button
          onClick={fetchDashboard}
          data-testid="retry-button"
          className="px-4 py-2 bg-red-600/20 text-red-400 border border-red-500/30 rounded-lg text-sm font-medium hover:bg-red-600/30 transition-all"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div data-testid="dashboard" className="p-8 bg-slate-900 border border-slate-800 rounded-xl space-y-6">
      {/* User Info */}
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 rounded-full bg-indigo-500 flex items-center justify-center">
          <span className="text-white font-bold text-lg">{data.user.name.charAt(0)}</span>
        </div>
        <div>
          <h2 data-testid="user-name" className="text-xl font-bold text-slate-100">{data.user.name}</h2>
          <p data-testid="user-email" className="text-sm text-slate-500">{data.user.email}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Posts', value: data.stats.posts, color: 'text-indigo-400' },
          { label: 'Followers', value: data.stats.followers, color: 'text-indigo-400' },
          { label: 'Following', value: data.stats.following, color: 'text-indigo-400' },
        ].map((stat) => (
          <div key={stat.label} className="p-4 bg-slate-800/50 rounded-lg text-center border border-slate-700/50">
            <p className={`text-2xl font-bold ${stat.color}`}>{formatStatNumber(stat.value)}</p>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mt-1">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
