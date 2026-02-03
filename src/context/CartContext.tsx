'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

// Types are provided for you
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  cartNote: string;
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateCartNote: (note: string) => void;
  clearCart: () => void;
  total: number;
}

// TODO CONTEXT 1: Create the context
// usage: createContext<Type | undefined>(undefined)
const CartContext = undefined; 

export function CartProvider({ children }: { children: ReactNode }) {
  // TODO CONTEXT 2: Initialize state
  // You need:
  // 1. items state (CartItem array)
  // 2. cartNote state (string)
  const [items, setItems] = useState<CartItem[]>([]);
  const [cartNote, setCartNote] = useState<string>('');

  // TODO CONTEXT 3: Implement addItem
  // It should check if item exists, if so increment quantity, else add new item with quantity 1
  const addItem = (newItem: Omit<CartItem, 'quantity'>) => {
    // console.log("Implement addItem", newItem);
  };

  // TODO CONTEXT 4: Implement removeItem
  // It should filter out the item with the given id
  const removeItem = (id: string) => {
    // console.log("Implement removeItem", id);
  };

  // TODO CONTEXT 5: Implement updateCartNote
  // It should update the cartNote state
  const updateCartNote = (note: string) => {
    // console.log("Implement updateCartNote", note);
  };

  const clearCart = () => {
    setItems([]);
  };

  // TODO CONTEXT 6: Calculate total
  // Reduce items to get total price
  const total = 0;

  return (
    // <CartContext.Provider ... >
      // {children}
    // </CartContext.Provider>
    // Remove this fragment and uncomment above when Context is created
    <>{children}</> 
  );
}

export function useCart() {
  // TODO CONTEXT 7: Implement useCart hook
  // It should use useContext(CartContext) and throw error if undefined
  
  // return context;
  
  // Temporary return to prevent crash before implementation
  return {
    items: [],
    cartNote: '',
    addItem: () => {},
    removeItem: () => {},
    updateCartNote: () => {},
    clearCart: () => {},
    total: 0
  };
}
