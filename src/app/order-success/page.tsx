
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Order = {
  orderId: string;
  customer: {
    name: string;
    phone: string;
    city: string;
  };
  total: number;
  status: string;
};

export default function OrderSuccess() {
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    const savedOrder = localStorage.getItem("cats-world-last-order");

    if (savedOrder) {
      try {
        setOrder(JSON.parse(savedOrder));
      } catch {
        setOrder(null);
      }
    }
  }, []);

  return (
    <main className="min-h-screen bg-[#fffaf5] px-5 py-12 text-[#45151f]">
      <div className="mx-auto max-w-xl rounded-3xl bg-white p-8 text-center shadow-lg">
        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-4xl">
          ✓
        </div>

        <h1 className="mb-3 text-3xl font-bold">
          Thank You!
        </h1>

        <p className="mb-7 text-gray-600">
          Your order has been placed successfully.
        </p>

        {order ? (
          <div className="mb-7 rounded-2xl bg-[#fff5f0] p-5 text-left">
            <p className="mb-3 text-sm text-gray-500">
              Your Order ID
            </p>

            <p className="mb-5 text-xl font-bold">
              {order.orderId}
            </p>

            <div className="space-y-2 text-sm">
              <p>Customer: {order.customer.name}</p>
              <p>Phone: {order.customer.phone}</p>
              <p>City: {order.customer.city}</p>
              <p>
                Total:{" "}
                <strong>{order.total} SAR</strong>
              </p>
              <p>
                Status:{" "}
                <strong>{order.status}</strong>
              </p>
            </div>
          </div>
        ) : (
          <p className="mb-7 text-gray-600">
            Order details are not available in this browser.
          </p>
        )}

        <p className="mb-7 text-sm text-gray-500">
          We will contact you to confirm your order.
        </p>

        <Link
          href="/"
          className="inline-block rounded-xl bg-[#6b1e2b] px-8 py-4 font-semibold text-white transition hover:bg-[#501520]"
        >
          Continue Shopping
        </Link>
      </div>
    </main>
  );
}
