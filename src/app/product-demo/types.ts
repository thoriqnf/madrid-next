// ===========================================
// types.ts - Read this file first!
// ===========================================

// Product = what we get from the API
export interface Product {
  id: string;
  createdAt: string;
  product: string; // the name
  price: string;
}

// FormData = what we send when creating/editing
export interface FormData {
  product: string;
  price: string;
}
