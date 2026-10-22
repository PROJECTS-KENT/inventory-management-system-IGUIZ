import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getOrder } from "../services/account";

export default function OrderDetails() {
  const { id } = useParams();

  const [order, setOrder] = useState<any>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrder();
  }, []);

  async function loadOrder() {
    try {
      const data = await getOrder(id!);
      setOrder(data.order ?? data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl">
        Loading order...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Order not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">

      <div className="bg-blue-600 text-white py-8">

        <div className="max-w-5xl mx-auto px-6 flex justify-between items-center">

          <div>

            <h1 className="text-4xl font-bold">
              Order Details
            </h1>

            <p className="text-blue-100">
              {order.reference}
            </p>

          </div>

          <Link
            to="/customer/profile"
            className="bg-white text-blue-600 px-5 py-3 rounded-lg font-semibold"
          >
            Back
          </Link>

        </div>

      </div>

      <div className="max-w-5xl mx-auto p-6">

        <div className="bg-white rounded-xl shadow p-6 mb-6">

          <h2 className="text-2xl font-bold mb-4">
            Customer Information
          </h2>

          <p>
            <strong>Name:</strong>{" "}
            {order.customerName}
          </p>

          <p>
            <strong>Email:</strong>{" "}
            {order.email}
          </p>

          <p>
            <strong>Phone:</strong>{" "}
            {order.phone}
          </p>

          <p>
            <strong>Address:</strong>{" "}
            {order.address},{" "}
            {order.city},{" "}
            {order.province},{" "}
            {order.zip}
          </p>

        </div>

        <div className="bg-white rounded-xl shadow p-6 mb-6">

          <h2 className="text-2xl font-bold mb-4">
            Order Information
          </h2>

          <p>
            <strong>Status:</strong>{" "}
            <span className="font-semibold text-blue-600">
              {order.status}
            </span>
          </p>

          <p>
            <strong>Reference:</strong>{" "}
            {order.reference}
          </p>

          <p>
            <strong>Date:</strong>{" "}
            {new Date(
              order.createdAt
            ).toLocaleString()}
          </p>

        </div>

        <div className="bg-white rounded-xl shadow p-6">

          <h2 className="text-2xl font-bold mb-6">
            Ordered Items
          </h2>

          <div className="space-y-5">

            {order.items.map((item: any) => (

              <div
                key={item.id}
                className="flex justify-between border-b pb-4"
              >

                <div>

                  <h3 className="font-bold">
                    {item.product.name}
                  </h3>

                  <p className="text-gray-500">
                    Quantity: {item.quantity}
                  </p>

                </div>

                <div className="font-bold">
                  PHP{" "}
                  {(
                    item.price *
                    item.quantity
                  ).toLocaleString()}
                </div>

              </div>

            ))}

          </div>

          <div className="border-t mt-6 pt-6 flex justify-between text-2xl font-bold">

            <span>Total</span>

            <span>
              PHP {order.total.toLocaleString()}
            </span>

          </div>

        </div>

      </div>

    </div>
  );
}