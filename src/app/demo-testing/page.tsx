import UserProfileForm from './UserProfileForm';

export default function DemoTestingPage() {
  return (
    <main className="min-h-screen bg-[#020617] py-16 px-4 sm:px-6 lg:px-8 selection:bg-indigo-500/30">
      <div className="max-w-md mx-auto">
        <div className="mb-10 text-center space-y-3">
          <h1 className="text-4xl font-black text-white tracking-tight">
            Testing Demo
          </h1>
          <p className="text-slate-400 font-medium">
            Learn to test complex interactions with <span className="text-indigo-400">React Testing Library</span>.
          </p>
        </div>
        
        <UserProfileForm />

        <div className="mt-10 p-6 bg-slate-900/50 border border-slate-800 rounded-xl backdrop-blur-sm">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-[0.2em]">
              Interaction Guide
            </h3>
          </div>
          <ul className="text-sm text-slate-400 space-y-3">
            <li className="flex items-start">
              <span className="text-indigo-500 mr-2">/</span>
              <span>Inputs use <code className="text-indigo-300 bg-indigo-500/10 px-1.5 py-0.5 rounded">userEvent.type()</code></span>
            </li>
            <li className="flex items-start">
              <span className="text-indigo-500 mr-2">/</span>
              <span>Dropdowns use <code className="text-indigo-300 bg-indigo-500/10 px-1.5 py-0.5 rounded">selectOptions()</code></span>
            </li>
            <li className="flex items-start">
              <span className="text-indigo-500 mr-2">/</span>
              <span>Toggleables use <code className="text-indigo-300 bg-indigo-500/10 px-1.5 py-0.5 rounded">userEvent.click()</code></span>
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}
