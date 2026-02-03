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

  // TODO AUTH: Implement Login Logic
  // 1. Create a dummy user object based on the role (admin vs user)
  // 2. Create a session expiration (e.g., 1 day)
  // 3. Set a cookie with the user data (JSON.stringify)

export async function login(role: UserRole) {
    const user: User = {
      id: crypto.randomUUID(),
      name: role === 'admin' ? 'admin user' : 'standard user',
      role
    }
  const expires = new Date(Date.now() + 1000 * 60 * 60); // will expired in 1 hour
  const cookieStore = await cookies();

  cookieStore.set(AUTH_COOKIE, JSON.stringify(user), {
    httpOnly: true,
    expires,
    sameSite: 'lax',
    path:'/'
  })


  console.log(`[Mock Auth] Logging in as ${role}...`);
  return user;
}
  // TODO AUTH: Implement Logout Logic
  // 1. Delete the auth cookie

export async function logout() {
    const cookieStore = await cookies()
    cookieStore.delete(AUTH_COOKIE)
  
  console.log('[Mock Auth] Logging out...');
}

  // TODO AUTH: Implement Session Retrieval
  // 1. Get the cookie store
  // 2. Retrieve the AUTH_COOKIE
  // 3. Parse the JSON value and return the User object
  // 4. Return null if no cookie exists
export async function getSession(): Promise<User | null> {
   const cookieStore = await cookies()
   const token = cookieStore.get(AUTH_COOKIE) 

   if (!token) return null

   try{ 
    return JSON.parse(token.value) as User
   } catch{
    return null
   }
  
  return null;
}
