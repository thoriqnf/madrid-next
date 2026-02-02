'use server';

import { login as authLogin, logout as authLogout, UserRole } from '@/lib/auth';
import { redirect } from 'next/navigation';

// TODO AUTH 3: Server Actions for Login/Logout
// Server actions allow us to run code on the server directly from the UI.

export async function loginAction(role: UserRole, callbackUrl: string = '/dashboard') {
  // TODO AUTH: Call the authLogin function
  // await authLogin(role);
  
  // TODO AUTH: Redirect the user to the callbackUrl
  // redirect(callbackUrl);
  
  console.log('Login Action triggered');
}

export async function logoutAction() {
  // TODO AUTH: Call the authLogout function
  // await authLogout();
  
  console.log('Logout Action triggered');
  redirect('/login');
}
