"use client";

import { Product } from "./types";

// Props = data passed from parent
interface ProductListProps {
  products: Product[];
  loading: boolean;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

// ===========================================
// TODO 8: List component
// ===========================================
export default function ProductList({
  products,
  loading,
  onEdit,
  onDelete,
}: ProductListProps) {
  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Products</h2>

      {/* Show loading */}
      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : products.length === 0 ? (
        <p className="text-gray-400">No products yet. Add one!</p>
      ) : (
        /* Show table */
        <table className="w-full">
          <thead>
            <tr className="text-left text-gray-400 border-b border-gray-700">
              <th className="pb-3">ID</th>
              <th className="pb-3">Name</th>
              <th className="pb-3">Price</th>
              <th className="pb-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* Loop through products */}
            {products.map((product) => (
              <tr key={product.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                <td className="py-3 text-gray-400">#{product.id}</td>
                <td className="py-3">{product.product}</td>
                <td className="py-3 text-green-400">${parseFloat(product.price).toFixed(2)}</td>
                <td className="py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEdit(product)}
                      className="bg-yellow-600 hover:bg-yellow-700 px-3 py-1 rounded text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(product.id)}
                      className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
