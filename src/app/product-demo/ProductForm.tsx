"use client";

// ===========================================
// TODO 6: Form component imports
// ===========================================
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { Product, FormData } from "./types";

// Props = data passed from parent
interface ProductFormProps {
  onSubmit: (data: FormData) => void;
  editingProduct: Product | null;
  onCancel: () => void;
  isSubmitting: boolean;
}

// ===========================================
// TODO 7: Form component
// ===========================================
export default function ProductForm({
  onSubmit,
  editingProduct,
  onCancel,
  isSubmitting,
}: ProductFormProps) {
  // Setup react-hook-form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  // Fill form when editing, clear when creating
  useEffect(() => {
    if (editingProduct) {
      reset({ product: editingProduct.product, price: editingProduct.price });
    } else {
      reset({ product: "", price: "" });
    }
  }, [editingProduct, reset]);

  return (
    <div className="mb-6 bg-gray-800 rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">
        {editingProduct ? "Edit Product" : "Add New Product"}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Product name input */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">Product Name</label>
          <input
            {...register("product", { required: "Name is required" })}
            placeholder="e.g. Laptop"
            className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
          />
          {errors.product && (
            <p className="text-red-400 text-sm mt-1">{errors.product.message}</p>
          )}
        </div>

        {/* Price input */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">Price</label>
          <input
            {...register("price", { required: "Price is required" })}
            placeholder="e.g. 999"
            className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
          />
          {errors.price && (
            <p className="text-red-400 text-sm mt-1">{errors.price.message}</p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 px-6 py-2 rounded-lg"
          >
            {isSubmitting ? "Saving..." : "Save"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-600 hover:bg-gray-700 px-6 py-2 rounded-lg"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
