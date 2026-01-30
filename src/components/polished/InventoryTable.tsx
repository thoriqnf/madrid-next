"use client";

import { useState } from "react";
import useSWR from "swr";
import { Plus, Trash2, Search, RefreshCw, Layers } from "lucide-react";
import GlassCard from "@/components/polished/GlassCard";
import GlassModal from "@/components/polished/GlassModal";
import type { DemoProduct } from "@/lib/demo-db";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function InventoryTable() {
  // TODO 8: Set up client-side data fetching with SWR
  // Import and use the useSWR hook to fetch from '/api/demo-products'
  // You'll need: data, error, isLoading, and mutate from the hook
  // Hint: const { data, error, isLoading, mutate } = useSWR<DemoProduct[]>('/api/demo-products', fetcher)
  const data: DemoProduct[] = [];
  const error = null;
  const isLoading = false;
  const mutate = () => { };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // TODO 9: Implement handleDelete function
  // This function should:
  // 1. Show a confirmation dialog (use window.confirm)
  // 2. Perform optimistic update: immediately remove item from UI using mutate()
  // 3. Call DELETE API endpoint: fetch(`/api/demo-products?id=${id}`, { method: 'DELETE' })
  // 4. Revalidate data with mutate() to sync with server
  async function handleDelete(id: number) {
    // Your code here
  }

  // TODO 10: Implement handleSubmit function
  // This function should:
  // 1. Prevent default form submission with e.preventDefault()
  // 2. Extract form data using FormData
  // 3. Create newProduct object with: name, price, stock, category, status
  // 4. POST to '/api/demo-products' with JSON body
  // 5. Close modal, reset submitting state, and revalidate with mutate()
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    // Your code here
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-2xl font-semibold text-zinc-100">Inventory</h2>
            <div className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded text-[10px] font-mono">CSR</div>
          </div>
          <p className="text-zinc-400 text-sm">Client-Side Fetched • Interactive CRUD</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="glass-button px-4 py-2 rounded-lg flex items-center gap-2 text-white"
        >
          <Plus className="h-4 w-4" /> Add Product
        </button>
      </div>

      <GlassCard className="p-0 overflow-hidden">
        {/* TODO 11: Handle loading and error states */}
        {/* Show skeleton loader while isLoading is true */}
        {/* Show error message if error exists */}
        {/* Otherwise, show the table with data */}
        {isLoading ? (
          <div className="p-8 space-y-4 animate-pulse">
            {[1, 2, 3].map(i => <div key={i} className="h-12 bg-zinc-800/50 rounded-lg" />)}
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-400">Failed to load inventory.</div>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-900 text-zinc-400 border-b border-zinc-800">
                <tr>
                  <th className="px-6 py-4 font-medium">Product Name</th>
                  <th className="px-6 py-4 font-medium">Category</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Price</th>
                  <th className="px-6 py-4 font-medium text-right">Stock</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {data?.map((product) => (
                  <tr key={product.id} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-zinc-200">{product.name}</td>
                    <td className="px-6 py-4 text-zinc-500">
                      <span className="flex items-center gap-2">
                        <Layers className="h-3 w-3 opacity-50" /> {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${product.status === 'In Stock' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                        product.status === 'Low Stock' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                          'bg-red-500/10 text-red-500 border-red-500/20'
                        }`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-zinc-300 font-mono">${product.price}</td>
                    <td className="px-6 py-4 text-right text-zinc-500">{product.stock}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-zinc-500 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>

      <GlassModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Product"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-white/60 mb-1 block">Name</label>
            <input name="name" required className="glass-input w-full" placeholder="e.g. Quantum Mouse" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-white/60 mb-1 block">Category</label>
              <select name="category" className="glass-input w-full bg-slate-900 border-white/10">
                <option>Hardware</option>
                <option>Accessories</option>
                <option>Wearables</option>
                <option>Displays</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-white/60 mb-1 block">Stock</label>
              <input name="stock" type="number" required className="glass-input w-full" placeholder="0" />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-white/60 mb-1 block">Price ($)</label>
            <input name="price" type="number" step="0.01" required className="glass-input w-full" placeholder="0.00" />
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-lg text-white/60 hover:text-white text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Add Product'}
            </button>
          </div>
        </form>
      </GlassModal>
    </div>
  );
}
