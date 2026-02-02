import LogoutButton from '@/components/LogoutButton';
import { getSession } from '@/lib/auth';

// TODO AUTH 5: Protected Page Example
// This page is protected by the proxy.

export default async function DashboardPage() {
  // TODO AUTH: Get the real session
  const session = await getSession(); // This will return null until TODO 1 is fixed
  
  // Check if user is admin
  const isAdmin = session?.role === 'admin';

  return (
    <div className="flex min-h-screen flex-col items-center bg-zinc-950 p-8 text-white">
      <div className="w-full max-w-4xl space-y-8">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-6">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <div className="flex items-center gap-4">
            <div className="text-right">
              {/* If session is null, these will be empty */}
              <p className="font-medium text-zinc-200">{session?.name || 'Guest'}</p>
              <p className="text-xs text-zinc-500 uppercase tracking-wider">{session?.role || 'Visitor'}</p>
            </div>
            <LogoutButton />
          </div>
        </div>

        {/* Content Visible to Everyone */}
        <div className="rounded-xl bg-zinc-900 p-6 ring-1 ring-white/10">
          <h2 className="mb-4 text-xl font-semibold text-zinc-200">Public Dashboard Area</h2>
          <p className="text-zinc-400">
            Welcome! This content is visible to all logged-in users.
          </p>
        </div>

        {/* Content Visible ONLY to Admin */}
        {isAdmin && (
          <div className="rounded-xl bg-emerald-900/20 p-6 ring-1 ring-emerald-500/50">
            <div className="flex items-center gap-2 mb-4">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>
              <h2 className="text-xl font-semibold text-emerald-400">Admin Secret Area</h2>
            </div>
            <p className="text-emerald-200/80 mb-4">
              This card is only visible because you are an <strong>Admin</strong>.
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-lg bg-zinc-950/50 p-4">
                <p className="text-xs text-zinc-500">Total Revenue</p>
                <p className="text-2xl font-bold text-white">$1,234,567</p>
              </div>
              <div className="rounded-lg bg-zinc-950/50 p-4">
                <p className="text-xs text-zinc-500">Active Users</p>
                <p className="text-2xl font-bold text-white">8,942</p>
              </div>
              <div className="rounded-lg bg-zinc-950/50 p-4">
                <p className="text-xs text-zinc-500">System Status</p>
                <p className="text-lg font-bold text-emerald-400">Operational</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
