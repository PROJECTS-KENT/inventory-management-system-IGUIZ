import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getProduct,
  getProductPerformance,
} from "../services/product";

import PageHeader from "../components/PageHeader";
import Card from "../components/Card";

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

  async function loadProduct(id: string) {
    try {
      const productData = await getProduct(id);
      setProduct(productData);

      const performanceData = await getProductPerformance(id);
      setPerformance(performanceData);
    } catch (error) {
      console.error(error);
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

        <div className="grid md:grid-cols-2 gap-8">

          <div className="flex justify-center">

            {product.image ? (

              <img
                src={`http://localhost:5000/uploads/products/${product.image}`}
                alt={product.name}
                className="w-72 h-72 rounded-xl object-cover border"
              />

            ) : (

              <div className="w-72 h-72 bg-gray-200 rounded-xl flex items-center justify-center">
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
              {product.category.name}
            </p>

            <p>
              <strong>Supplier:</strong>{" "}
              {product.supplier.name}
            </p>

            <p>
              <strong>Price:</strong> ₱
              {product.price.toLocaleString()}
            </p>

            <p>
              <strong>Stock:</strong>{" "}
              {product.quantity}
            </p>

            <div>

              <strong>Description</strong>

              <p className="mt-2 text-gray-600">
                {product.description || "No description."}
              </p>

            </div>

            <button
              onClick={() => navigate("/products")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg"
            >
              Back
            </button>

          </div>

        </div>

      </Card>

            {/* Product Performance */}

      <Card className="mt-8">

        <h2 className="text-2xl font-bold mb-6">
          Product Performance
        </h2>

        {performance && (

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            <div className="bg-blue-50 rounded-xl p-6 shadow">

              <p className="text-gray-500">
                Current Stock
              </p>

              <h2 className="text-5xl font-bold text-blue-600 mt-2">
                {performance.currentStock}
              </h2>

            </div>

            <div className="bg-green-50 rounded-xl p-6 shadow">

              <p className="text-gray-500">
                Times Ordered
              </p>

              <h2 className="text-5xl font-bold text-green-600 mt-2">
                {performance.timesOrdered}
              </h2>

            </div>

            <div className="bg-purple-50 rounded-xl p-6 shadow">

              <p className="text-gray-500">
                Units Sold
              </p>

              <h2 className="text-5xl font-bold text-purple-600 mt-2">
                {performance.unitsSold}
              </h2>

            </div>

          </div>

        )}

      </Card>

      {/* Inventory History */}

      <Card className="mt-8">

        <h2 className="text-2xl font-bold mb-5">
          Inventory History
        </h2>

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>

              <th className="p-3 text-left">
                Date
              </th>

              <th className="p-3 text-center">
                Type
              </th>

              <th className="p-3 text-center">
                Qty
              </th>

              <th className="p-3 text-center">
                User
              </th>

              <th className="p-3 text-center">
                Remarks
              </th>

            </tr>

          </thead>

          <tbody>

            {product.transactions.length === 0 ? (

              <tr>

                <td
                  colSpan={5}
                  className="text-center p-5"
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
                      className={`px-3 py-1 rounded-full text-white ${
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
                    {transaction.user?.name}
                  </td>

                  <td className="p-3 text-center">
                    {transaction.remarks || "-"}
                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </Card>

    </div>
  );
}