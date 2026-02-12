import AsyncUserDashboard from './AsyncUserDashboard';

export default function DemoTestingPage() {
  return (
    <main className="min-h-screen bg-[#020617] py-16 px-4 sm:px-6 lg:px-8 selection:bg-indigo-500/30">
      <div className="max-w-md mx-auto">
        <div className="mb-10 text-center space-y-3">
          <h1 className="text-4xl font-black text-white tracking-tight">
            Async Testing Demo
          </h1>
          <p className="text-slate-400 font-medium">
            Master <span className="text-indigo-400">Mock Service Worker (MSW)</span> and asynchronous rendering tests.
          </p>
          <div className="pt-4">
             <a href="/demo-testing/checkout" className="text-sm font-bold text-indigo-400 hover:text-indigo-300 underline underline-offset-4 decoration-2">
                View E2E Checkout Logic &rarr;
             </a>
          </div>
        </div>
        
        <AsyncUserDashboard />

        <div className="mt-10 p-6 bg-slate-900/50 border border-slate-800 rounded-xl backdrop-blur-sm">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-[0.2em]">
              Async Test Guide
            </h3>
          </div>
          <ul className="text-sm text-slate-400 space-y-3">
            <li className="flex items-start">
              <span className="text-indigo-500 mr-2">/</span>
              <span>Use <code className="text-indigo-300 bg-indigo-500/10 px-1.5 py-0.5 rounded">findBy*</code> for elements that appear after loading</span>
            </li>
            <li className="flex items-start">
              <span className="text-indigo-500 mr-2">/</span>
              <span>Mock network failures with <code className="text-indigo-300 bg-indigo-500/10 px-1.5 py-0.5 rounded">HttpResponse.error()</code></span>
            </li>
            <li className="flex items-start">
              <span className="text-indigo-500 mr-2">/</span>
              <span>Test server errors by overriding handlers with <code className="text-indigo-300 bg-indigo-500/10 px-1.5 py-0.5 rounded">server.use()</code></span>
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}
