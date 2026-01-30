import GlassCard from "@/components/polished/GlassCard";
import { Newspaper, Clock, RefreshCw } from "lucide-react";

// TODO 5: Enable Incremental Static Regeneration (ISR)
// This page should regenerate at most once every 60 seconds.
// Add the revalidate config to enable time-based regeneration.
// Hint: export const revalidate = 60
// Documentation: https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config#revalidate

// TODO 6: Implement getLatestNews function
// This function should:
// 1. Return an array of news objects (at least 3 items)
// 2. Each object should have: id, title, category, readTime, views
// 3. Add Math.random() to views to demonstrate regeneration over time
// Example: views: 1200 + Math.floor(Math.random() * 500)
async function getLatestNews() {
  // Your code here
  return [];
}

export default async function BlogPage() {
  // TODO 7: Fetch news data in the component
  // Call getLatestNews() and store the result in a variable called 'news'
  // Hint: const news = await getLatestNews();
  const news: any[] = []; // Replace this line
  const generatedAt = new Date().toLocaleTimeString();

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight text-zinc-100">Community Blog</h2>
          <p className="text-zinc-400 mt-2">
            Incremental Static Regeneration (ISR) • Generated at <b>{generatedAt}</b>
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="bg-amber-500/10 text-amber-500 border border-amber-500/20 px-3 py-1 rounded-full text-xs font-mono">
            ISR (60s)
          </div>
          <span className="text-[10px] text-zinc-500">Auto-regenerates in background</span>
        </div>
      </div>

      <div className="grid gap-6">
        {news.map((item, i) => (
          <GlassCard key={i} delay={i * 0.1} className="group hover:bg-zinc-800/50 transition-colors">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-medium text-blue-400 uppercase tracking-widest">{item.category}</span>
                  <span className="text-xs text-zinc-500 flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {item.readTime}
                  </span>
                </div>
                <h3 className="text-xl font-medium text-zinc-100 group-hover:text-amber-500 transition-colors">
                  {item.title}
                </h3>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-zinc-200">{item.views}</div>
                <div className="text-xs text-zinc-500">Views</div>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      <div className="p-4 rounded-lg border border-dashed border-zinc-800 text-center text-zinc-500 text-sm">
        Refresh this page. If 60 seconds haven't passed, you'll see the <b>same timestamp</b>.
        <br />
        After 60s, a refresh will trigger a background rebuild, and the <i>next</i> visitor will see new data.
      </div>
    </div>
  );
}
