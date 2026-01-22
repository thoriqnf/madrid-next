"use client";

// ===========================================
// TODO 1: Imports
// ===========================================
import axios from "axios";
import { useEffect, useState } from "react";
import { Product, FormData } from "./types";
import ProductForm from "./ProductForm";
import ProductList from "./ProductList";

// ===========================================
// TODO 2: API URL
// ===========================================
const API_URL = "https://64ca45bd700d50e3c7049e2f.mockapi.io/product";

export default function ProductDemoPage() {
  // ===========================================
  // TODO 3: State
  // ===========================================
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // ===========================================
  // TODO 4: Fetch products on page load
  // ===========================================
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL);
      setProducts(response.data);
    } catch (error) {
      console.error("Failed to fetch:", error);
      alert("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  // ===========================================
  // TODO 5: CRUD functions
  // ===========================================

  // CREATE - add new product
  const createProduct = async (data: FormData) => {
    try {
      setSubmitting(true);
      const response = await axios.post(API_URL, data);
      setProducts([...products, response.data]);
      setShowForm(false);
      alert("Product added!");
    } catch (error) {
      console.error("Failed to create:", error);
      alert("Failed to add product");
    } finally {
      setSubmitting(false);
    }
  };

  // UPDATE - edit existing product
  const updateProduct = async (data: FormData) => {
    if (!editingProduct) return;

    try {
      setSubmitting(true);
      const response = await axios.put(`${API_URL}/${editingProduct.id}`, data);
      setProducts(products.map((p) => (p.id === editingProduct.id ? response.data : p)));
      setShowForm(false);
      setEditingProduct(null);
      alert("Product updated!");
    } catch (error) {
      console.error("Failed to update:", error);
      alert("Failed to update product");
    } finally {
      setSubmitting(false);
    }
  };

  // DELETE - remove product
  const deleteProduct = async (id: string) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      await axios.delete(`${API_URL}/${id}`);
      setProducts(products.filter((p) => p.id !== id));
      alert("Product deleted!");
    } catch (error) {
      console.error("Failed to delete:", error);
      alert("Failed to delete product");
    }
  };

  // ===========================================
  // Handlers
  // ===========================================
  const handleSubmit = (data: FormData) => {
    if (editingProduct) {
      updateProduct(data);
    } else {
      createProduct(data);
    }
  };

  const handleAddNew = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  // ===========================================
  // Render
  // ===========================================
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <h1 className="text-3xl font-bold mb-2">Product Demo</h1>
        <p className="text-gray-400 mb-6">CRUD with Next.js + Axios + React Hook Form</p>

        {/* Add button - hide when form is open */}
        {!showForm && (
          <button
            onClick={handleAddNew}
            className="mb-6 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
          >
            + Add Product
          </button>
        )}

        {/* Form - show/hide based on state */}
        {showForm && (
          <ProductForm
            onSubmit={handleSubmit}
            editingProduct={editingProduct}
            onCancel={handleCancel}
            isSubmitting={submitting}
          />
        )}

        {/* Product list */}
        <ProductList
          products={products}
          loading={loading}
          onEdit={handleEdit}
          onDelete={deleteProduct}
        />
      </div>
    </div>
  );
}
