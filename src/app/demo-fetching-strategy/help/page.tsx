import GlassCard from "@/components/polished/GlassCard";
import { HelpCircle, ChevronRight, Zap } from "lucide-react";

// TODO 1: Enable Static Site Generation (SSG)
// This page should be built once at build time and served to all users.
// Add the Next.js route segment config to force static rendering.
// Hint: export const dynamic = 'force-static'
// Documentation: https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config#dynamic

const faqs = [
  {
    q: "How does Static Site Generation (SSG) work?",
    a: "Next.js renders this page at build time. The HTML is generated once and served to every user instantly via CDN. It's the fastest method but data can get stale."
  },
  {
    q: "Can I use dynamic data in SSG?",
    a: "Yes, but only if you know all the possible parameters at build time (using generateStaticParams). Otherwise, the data is frozen at the time of the build."
  },
  {
    q: "What is the difference between SSG and ISR?",
    a: "SSG never updates until you redeploy. ISR (Incremental Static Regeneration) allows you to update static pages after a timeout without a full rebuild."
  },
  {
    q: "Why does this page feel so fast?",
    a: "Because there is no database computation happening right now. You are downloading a simple HTML file that was prepared days/hours ago."
  }
];

export default function HelpPage() {
  const builtAt = new Date().toLocaleTimeString();

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight text-zinc-100">Help Center</h2>
          <p className="text-zinc-400 mt-2">Static Site Generation (SSG) • Built at <b>{builtAt}</b> (Simulated Build Time)</p>
        </div>
        <div className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-3 py-1 rounded-full text-xs font-mono">
          ● Static Prerendering
        </div>
      </div>

      <div className="grid gap-4">
        {faqs.map((faq, i) => (
          <GlassCard key={i} delay={i * 0.1} className="group cursor-pointer hover:border-zinc-700">
            <h3 className="flex items-center gap-3 text-lg font-medium text-zinc-100 group-hover:text-blue-400 transition-colors">
              <HelpCircle className="h-5 w-5 text-zinc-500 group-hover:text-blue-400" />
              {faq.q}
            </h3>
            <p className="mt-2 text-zinc-400 pl-8 leading-relaxed">
              {faq.a}
            </p>
          </GlassCard>
        ))}
      </div>

      <GlassCard className="bg-blue-500/5 border-blue-500/10">
        <div className="flex items-start gap-4">
          <Zap className="h-6 w-6 text-blue-500 mt-1" />
          <div>
            <h4 className="text-zinc-100 font-medium">Performance Tip</h4>
            <p className="text-zinc-400 text-sm mt-1">
              Use SSG for marketing pages, documentation, and blog posts that don't change often.
              The Time-to-First-Byte (TTFB) is near instant.
            </p>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
