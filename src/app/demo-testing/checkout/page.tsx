import ProductCheckout from '../ProductCheckout';

export default function CheckoutPage() {
  return (
    <main className="min-h-screen bg-[#020617] py-16 px-4 sm:px-6 lg:px-8 selection:bg-indigo-500/30">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10 text-center space-y-3">
          <h1 className="text-4xl font-black text-white tracking-tight">
            E2E Checkout Demo
          </h1>
          <p className="text-slate-400 font-medium">
            Full user flow testing with <span className="text-indigo-400">React Testing Library</span>.
          </p>
        </div>
        
        <ProductCheckout />
      </div>
    </main>
  );
}
