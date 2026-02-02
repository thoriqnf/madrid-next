import { cookies } from 'next/headers';

// TODO AUTH 1: Setup Mock Authentication
// Define the name of the cookie we will use to store the session
export const AUTH_COOKIE = 'auth_token';

export type UserRole = 'admin' | 'user' | 'guest';

// Simple mock user interface
export interface User {
  id: string;
  name: string;
  role: UserRole;
}

export async function login(role: UserRole) {
  // TODO AUTH: Implement Login Logic
  // 1. Create a dummy user object based on the role (admin vs user)
  // 2. Create a session expiration (e.g., 1 day)
  // 3. Set a cookie with the user data (JSON.stringify)
  
  console.log(`[Mock Auth] Logging in as ${role}...`);
  return null;
}

export async function logout() {
  // TODO AUTH: Implement Logout Logic
  // 1. Delete the auth cookie
  
  console.log('[Mock Auth] Logging out...');
}

export async function getSession(): Promise<User | null> {
  // TODO AUTH: Implement Session Retrieval
  // 1. Get the cookie store
  // 2. Retrieve the AUTH_COOKIE
  // 3. Parse the JSON value and return the User object
  // 4. Return null if no cookie exists
  
  return null;
}
