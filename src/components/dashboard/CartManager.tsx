'use client';

import React from 'react';
// import { useCart } from '@/context/CartContext';
import { ShoppingBag, Trash2, StickyNote } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CartManager() {
  // TODO CONTEXT 10: Connect to Cart Context
  // const { items, cartNote, updateCartNote, removeItem, total, clearCart } = useCart();
  
  // MOCK DATA for Starter
  const items: any[] = [];
  const cartNote = "";
  const total = 0;
  const updateCartNote = (note: string) => {};
  const removeItem = (id: string) => {};
  const clearCart = () => {};

  return (
    <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-6 shadow-2xl overflow-hidden relative">
      <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
        <ShoppingBag size={120} />
      </div>

      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
          <ShoppingBag className="h-5 w-5 text-blue-400" />
        </div>
        <h2 className="text-xl font-bold text-zinc-100">Your Cart</h2>
      </div>

      <div className="space-y-4 mb-8">
        <AnimatePresence mode="popLayout">
          {items.length === 0 ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-zinc-500 italic py-4"
            >
              Your cart is empty. Add some products!
            </motion.p>
          ) : (
            // Only uncomment this when items are available from context
            items.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center justify-between group"
              >
                <div>
                  <p className="font-medium text-zinc-200">{item.name}</p>
                  <p className="text-sm text-zinc-500">
                    ${item.price} x {item.quantity}
                  </p>
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="p-2 text-zinc-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {items.length > 0 && (
        <div className="border-t border-zinc-800 pt-4 mb-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-zinc-400">Total</span>
            <span className="text-2xl font-bold text-white">${total}</span>
          </div>
          <button
            onClick={clearCart}
            className="w-full py-2 text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Context Input - Admin can input the context here */}
      <div className="mt-6 pt-6 border-t border-zinc-800">
        <div className="flex items-center gap-2 mb-3">
          <StickyNote className="h-4 w-4 text-amber-400" />
          <label htmlFor="cart-note" className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">
            Admin Cart Note (Context)
          </label>
        </div>
        <textarea
          id="cart-note"
          value={cartNote}
          onChange={(e) => updateCartNote(e.target.value)}
          placeholder="Enter a note for this cart session... (This is shared via React Context)"
          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all placeholder:text-zinc-700 h-24 resize-none"
        />
        {cartNote && (
          <p className="mt-2 text-[10px] text-amber-500/70 italic">
            Note: This text is being stored in the global Cart Context state.
          </p>
        )}
      </div>
    </div>
  );
}
