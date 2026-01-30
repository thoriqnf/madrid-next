import GlassCard from "@/components/polished/GlassCard";
import { Activity, ArrowUpRight, DollarSign, Users } from "lucide-react";

// TODO 2: Enable Server-Side Rendering (SSR)
// This page should fetch fresh data on every request.
// Add the Next.js route segment config to force dynamic rendering.
// Hint: export const dynamic = 'force-dynamic'
// Documentation: https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config#dynamic

// TODO 3: Implement getAnalyticsData function
// This function should:
// 1. Simulate a database call with a 300ms delay (use Promise + setTimeout)
// 2. Return an object with: revenue, activeUsers, bounceRate, salesToday
// 3. Add Math.random() to each value to demonstrate that data changes on each request
// Example: revenue: 12450 + Math.floor(Math.random() * 5000)
async function getAnalyticsData() {
  // Your code here
  return {
    revenue: 0,
    activeUsers: 0,
    bounceRate: 0,
    salesToday: 0
  };
}

export default async function DashboardPage() {
  // TODO 4: Fetch data in the server component
  // Call getAnalyticsData() and store the result in a variable called 'data'
  // Hint: const data = await getAnalyticsData();
  const data = { revenue: 0, activeUsers: 0, bounceRate: 0, salesToday: 0 }; // Replace this line
  const timestamp = new Date().toLocaleTimeString();

  const stats = [
    { title: "Total Revenue", value: `$${data.revenue.toLocaleString()}`, icon: DollarSign, trend: "+12.5%" },
    { title: "Active Users", value: data.activeUsers, icon: Users, trend: "+4.3%" },
    { title: "Sales Today", value: data.salesToday, icon: Activity, trend: "+8.1%" },
    { title: "Bounce Rate", value: `${data.bounceRate}%`, icon: ArrowUpRight, trend: "-2.1%" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight text-zinc-100">Live Dashboard</h2>
          <p className="text-zinc-400 mt-2">Server-Side Rendered (SSR) • Data fetched at <b>{timestamp}</b></p>
        </div>
        <div className="bg-amber-500/10 text-amber-500 border border-amber-500/20 px-3 py-1 rounded-full text-xs font-mono">
          λ Dynamic Rendering
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <GlassCard key={i} delay={i * 0.1}>
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-zinc-900 rounded-md border border-zinc-800">
                <stat.icon className="h-4 w-4 text-zinc-400" />
              </div>
              <span className={stat.trend.startsWith('+') ? "text-emerald-500 text-xs font-medium" : "text-red-500 text-xs font-medium"}>
                {stat.trend}
              </span>
            </div>
            <div className="text-2xl font-bold text-zinc-100 mb-1">{stat.value}</div>
            <div className="text-sm text-zinc-500">{stat.title}</div>
          </GlassCard>
        ))}
      </div>

      <GlassCard className="h-96 flex items-center justify-center border-dashed border-zinc-800 bg-transparent shadow-none">
        <div className="text-center space-y-4">
          <Activity className="h-10 w-10 text-zinc-700 mx-auto" />
          <p className="text-zinc-500 max-w-md">
            This entire view is constructed on the server. Next.js fetches fresh data from the "Database"
            every time you refresh the page. No client-side spinners for initial data.
          </p>
        </div>
      </GlassCard>
    </div>
  );
}
