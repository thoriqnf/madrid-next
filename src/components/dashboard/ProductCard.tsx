'use client';

import React from 'react';
// import { useCart } from '@/context/CartContext';
import { Plus, ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  description: string;
  color: string;
}

export default function ProductCard({ id, name, price, description, color }: ProductCardProps) {
  // TODO CONTEXT 9: Connect to Cart Context
  // const { addItem } = useCart();

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="group relative overflow-hidden rounded-2xl bg-zinc-900 p-1 ring-1 ring-white/10 transition-all hover:ring-white/20"
    >
      <div className="flex flex-col h-full rounded-[14px] bg-zinc-950 p-5">
        <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${color} bg-opacity-20`}>
          <ShoppingCart className={`h-6 w-6 text-opacity-100 ${color.replace('bg-', 'text-')}`} />
        </div>
        
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-zinc-100">{name}</h3>
          <p className="mt-1 text-sm text-zinc-500">{description}</p>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <span className="text-xl font-bold text-white">${price}</span>
          <button
            // TODO CONTEXT 9: Implement onClick to add item
            // onClick={() => addItem({ id, name, price })}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 text-zinc-950 transition-transform hover:scale-110 active:scale-95"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
