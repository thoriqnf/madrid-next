'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Check, CreditCard, Trash2, Package, User, MapPin } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// --- Types ---
interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
}

interface CartItem extends Product {
  quantity: number;
}

interface CheckoutForm {
  name: string;
  email: string;
  address: string;
}

// --- Mock Data ---
const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Neon Cyber Deck',
    price: 129.00,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=200&h=200'
  },
  {
    id: '2',
    name: 'Holographic Visor',
    price: 59.50,
    image: 'https://images.unsplash.com/photo-1535303311164-664fc9ec6532?auto=format&fit=crop&q=80&w=200&h=200'
  },
  {
    id: '3',
    name: 'Quantum Chipset',
    price: 299.99,
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=200&h=200'
  }
];

// --- Components ---

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export default function ProductCheckout() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCheckout, setIsCheckout] = useState(false);
  const [formData, setFormData] = useState<CheckoutForm>({ name: '', email: '', address: '' });
  const [errors, setErrors] = useState<Partial<CheckoutForm>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const validate = () => {
    const newErrors: Partial<CheckoutForm> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsSubmitting(false);
    setIsSuccess(true);
    setCart([]);
    setFormData({ name: '', email: '', address: '' });
  };

  if (isSuccess) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center max-w-md mx-auto shadow-2xl shadow-indigo-500/10">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <Check className="w-10 h-10 text-green-400" />
        </motion.div>
        <h2 className="text-3xl font-bold text-white mb-3">Order Confirmed!</h2>
        <p className="text-slate-400 mb-8">Your gear is being prepped for shipment. Check your neural link for updates.</p>
        <button 
          onClick={() => setIsSuccess(false)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3 px-6 rounded-xl transition-all w-full"
        >
          Back to Shop
        </button>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto items-start">
      
      {/* Product List */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <Package className="text-indigo-400" />
          Available Gear
        </h2>
        
        <div className="grid gap-4">
          {PRODUCTS.map(product => (
            <motion.div 
              key={product.id}
              whileHover={{ scale: 1.02 }}
              className="bg-slate-900/50 border border-slate-800 p-4 rounded-2xl flex items-center gap-4 group hover:border-indigo-500/50 transition-colors"
              data-testid={`product-${product.id}`}
            >
              <div className="w-20 h-20 bg-slate-800 rounded-xl overflow-hidden relative">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white">{product.name}</h3>
                <p className="text-indigo-400 font-medium">${product.price.toFixed(2)}</p>
              </div>
              <button
                onClick={() => addToCart(product)}
                className="bg-slate-800 hover:bg-indigo-600 hover:text-white text-slate-300 p-3 rounded-xl transition-colors"
                aria-label={`Add ${product.name} to cart`}
              >
                <Package className="w-5 h-5" />
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Cart & Checkout */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 lg:p-8 sticky top-6 shadow-2xl">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3 mb-6">
          <ShoppingCart className="text-indigo-400" />
          Your Cart
        </h2>

        {cart.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-slate-800 rounded-2xl">
            <p className="text-slate-500 mb-2">Your cart is empty</p>
            <p className="text-sm text-slate-600">Add some gear to get started</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {cart.map(item => (
                <div key={item.id} className="flex items-center justify-between bg-black/20 p-3 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-slate-800 rounded-lg overflow-hidden">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{item.name}</h4>
                      <p className="text-xs text-slate-400">${item.price.toFixed(2)} x {item.quantity}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="text-slate-500 hover:text-red-400 transition-colors p-2"
                    aria-label={`Remove ${item.name} from cart`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="pt-6 border-t border-slate-800">
              <div className="flex justify-between items-center mb-6">
                <span className="text-slate-400">Total</span>
                <span className="text-2xl font-bold text-white">${total.toFixed(2)}</span>
              </div>

              {!isCheckout ? (
                <button
                  onClick={() => setIsCheckout(true)}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2"
                >
                  Proceed to Checkout
                  <CreditCard className="w-5 h-5" />
                </button>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div>
                    <label htmlFor="name" className="block text-xs font-bold text-slate-400 uppercase mb-2 flex items-center gap-2">
                      <User className="w-3 h-3" /> Full Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      className={cn(
                        "w-full bg-black/30 border rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all",
                        errors.name ? "border-red-500/50 focus:border-red-500" : "border-slate-700"
                      )}
                      placeholder="Cyber Punk"
                      value={formData.name}
                      onChange={e => {
                        const val = e.target.value;
                        setFormData(prev => ({ ...prev, name: val }));
                      }}
                    />
                    {errors.name && <p className="text-red-400 text-xs mt-1 ml-1">{errors.name}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-xs font-bold text-slate-400 uppercase mb-2">Email Address</label>
                    <input
                      id="email"
                      type="email"
                      className={cn(
                        "w-full bg-black/30 border rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all",
                        errors.email ? "border-red-500/50 focus:border-red-500" : "border-slate-700"
                      )}
                      placeholder="punk@nightcity.net"
                      value={formData.email}
                      onChange={e => {
                        const val = e.target.value;
                        setFormData(prev => ({ ...prev, email: val }));
                      }}
                    />
                    {errors.email && <p className="text-red-400 text-xs mt-1 ml-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label htmlFor="address" className="block text-xs font-bold text-slate-400 uppercase mb-2 flex items-center gap-2">
                       <MapPin className="w-3 h-3" /> Shipping Address
                    </label>
                    <textarea
                      id="address"
                      className={cn(
                        "w-full bg-black/30 border rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all resize-none",
                        errors.address ? "border-red-500/50 focus:border-red-500" : "border-slate-700"
                      )}
                      rows={2}
                      placeholder="10101 Binary Blvd..."
                      value={formData.address}
                      onChange={e => {
                        const val = e.target.value;
                        setFormData(prev => ({ ...prev, address: val }));
                      }}
                    />
                    {errors.address && <p className="text-red-400 text-xs mt-1 ml-1">{errors.address}</p>}
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsCheckout(false)}
                      className="flex-1 bg-slate-800 text-slate-400 hover:text-white font-medium py-3 rounded-xl transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-[2] bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition-all transform active:scale-95 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        'Complete Order'
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
