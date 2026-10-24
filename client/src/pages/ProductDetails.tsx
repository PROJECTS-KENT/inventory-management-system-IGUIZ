
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getProduct,
  getProductPerformance,
} from "../services/product";

import PageHeader from "../components/PageHeader";
import Card from "../components/Card";
import { SERVER_URL } from "../services/api";

interface Transaction {
  id: string;
  type: string;
  quantity: number;
  remarks: string;
  createdAt: string;
  user?: {
    name: string;
  };
}

interface Product {
  id: string;
  name: string;
  sku: string;
  description: string;
  image?: string;
  price: number;
  quantity: number;
  category: {
    name: string;
  };
  supplier: {
    name: string;
  };
  transactions: Transaction[];
}

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [performance, setPerformance] = useState<any>(null);

  useEffect(() => {
    if (id) {
      loadProduct(id);
    }
  }, [id]);

  async function loadProduct(productId: string) {
    try {
      const productData = await getProduct(productId);
      setProduct(productData);

      const performanceData =
        await getProductPerformance(productId);

      setPerformance(performanceData);
    } catch (error) {
      console.error("Failed to load product details:", error);
    }
  }

  if (!product) {
    return (
      <div className="p-10 text-center text-xl">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <PageHeader
        title="Product Details"
        subtitle="View product information"
      />

      {/* Product Information */}
      <Card>
       <div className="grid gap-8 md:grid-cols-2">
  <div className="flex justify-center">
    {product.image ? (
      <img
        src={
          product.image.startsWith("https://") ||
          product.image.startsWith("http://")
            ? product.image
            : `${SERVER_URL}/uploads/products/${product.image}`
        }
        alt={product.name}
        onError={(event) => {
          event.currentTarget.style.display = "none";
        }}
        className="h-72 w-72 rounded-xl border object-cover"
      />
    ) : (
      <div className="flex h-72 w-72 items-center justify-center rounded-xl bg-gray-200">
        No Image
      </div>
    )}
  </div>

          <div className="space-y-4">
            <h2 className="text-3xl font-bold">
              {product.name}
            </h2>

            <p>
              <strong>SKU:</strong> {product.sku}
            </p>

            <p>
              <strong>Category:</strong>{" "}
              {product.category?.name || "N/A"}
            </p>

            <p>
              <strong>Supplier:</strong>{" "}
              {product.supplier?.name || "N/A"}
            </p>

            <p>
              <strong>Price:</strong> ₱
              {product.price.toLocaleString()}
            </p>

            <p>
              <strong>Stock:</strong> {product.quantity}
            </p>

            <div>
              <strong>Description</strong>
              <p className="mt-2 text-gray-600">
                {product.description || "No description."}
              </p>
            </div>

            <button
              onClick={() => navigate("/products")}
              className="rounded-lg bg-blue-600 px-5 py-3 text-white hover:bg-blue-700"
            >
              Back
            </button>
          </div>
        </div>
      </Card>

      {/* Product Performance */}
      <Card className="mt-8">
        <h2 className="mb-6 text-2xl font-bold">
          Product Performance
        </h2>

        {performance && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="rounded-xl bg-blue-50 p-6 shadow">
              <p className="text-gray-500">
                Current Stock
              </p>
              <h2 className="mt-2 text-5xl font-bold text-blue-600">
                {performance.currentStock}
              </h2>
            </div>

            <div className="rounded-xl bg-green-50 p-6 shadow">
              <p className="text-gray-500">
                Times Ordered
              </p>
              <h2 className="mt-2 text-5xl font-bold text-green-600">
                {performance.timesOrdered}
              </h2>
            </div>

            <div className="rounded-xl bg-purple-50 p-6 shadow">
              <p className="text-gray-500">
                Units Sold
              </p>
              <h2 className="mt-2 text-5xl font-bold text-purple-600">
                {performance.unitsSold}
              </h2>
            </div>
          </div>
        )}
      </Card>

      {/* Inventory History */}
      <Card className="mt-8">
        <h2 className="mb-5 text-2xl font-bold">
          Inventory History
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-center">Type</th>
                <th className="p-3 text-center">Qty</th>
                <th className="p-3 text-center">User</th>
                <th className="p-3 text-center">Remarks</th>
              </tr>
            </thead>

            <tbody>
              {!product.transactions ||
              product.transactions.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="p-5 text-center"
                  >
                    No transactions found.
                  </td>
                </tr>
              ) : (
                product.transactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="border-t"
                  >
                    <td className="p-3">
                      {new Date(
                        transaction.createdAt
                      ).toLocaleString()}
                    </td>

                    <td className="p-3 text-center">
                      <span
                        className={`rounded-full px-3 py-1 text-white ${
                          transaction.type === "IN"
                            ? "bg-green-600"
                            : "bg-red-600"
                        }`}
                      >
                        {transaction.type}
                      </span>
                    </td>

                    <td className="p-3 text-center">
                      {transaction.quantity}
                    </td>

                    <td className="p-3 text-center">
                      {transaction.user?.name || "-"}
                    </td>

                    <td className="p-3 text-center">
                      {transaction.remarks || "-"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
