
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type OrderItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
};

type Order = {
  orderId: string;
  customer: {
    name: string;
    phone: string;
    city: string;
    district?: string;
    address?: string;
  };
  items?: OrderItem[];
  subtotal?: number;
  delivery?: number;
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
    <main className="min-h-screen bg-[#fffaf5] px-4 py-12 text-[#45151f]">
      <div className="mx-auto max-w-xl rounded-3xl bg-white p-6 shadow-lg sm:p-8">
        <div className="text-center">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-4xl text-green-700">
            ✓
          </div>

          <h1 className="mb-3 text-3xl font-bold">
            Thank You!
          </h1>

          <p className="mb-7 text-gray-600">
            Your order has been placed successfully.
          </p>
        </div>

        {order ? (
          <div className="mb-7 space-y-5">
            <div className="rounded-2xl bg-[#fff5f0] p-5">
              <p className="mb-2 text-sm text-gray-500">
                Your Order ID
              </p>

              <p className="text-2xl font-bold">
                {order.orderId}
              </p>

              <p className="mt-3 text-sm">
                Status: <strong>{order.status}</strong>
              </p>
            </div>

            <div className="rounded-2xl border border-gray-100 p-5">
              <h2 className="mb-4 text-lg font-bold">
                Customer Information
              </h2>

              <div className="space-y-2 text-sm text-gray-700">
                <p>Name: {order.customer.name}</p>
                <p>Phone: {order.customer.phone}</p>
                <p>City: {order.customer.city}</p>

                {order.customer.district && (
                  <p>District: {order.customer.district}</p>
                )}

                {order.customer.address && (
                  <p>Address: {order.customer.address}</p>
                )}
              </div>
            </div>

            {order.items && order.items.length > 0 && (
              <div className="rounded-2xl border border-gray-100 p-5">
                <h2 className="mb-4 text-lg font-bold">
                  Order Items
                </h2>

                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between gap-3 text-sm"
                    >
                      <span>
                        {item.name} × {item.quantity}
                      </span>

                      <strong>
                        {item.price * item.quantity} SAR
                      </strong>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="rounded-2xl bg-[#fff5f0] p-5">
              {order.subtotal !== undefined && (
                <div className="mb-2 flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>{order.subtotal} SAR</span>
                </div>
              )}

              {order.delivery !== undefined && (
                <div className="mb-3 flex justify-between text-sm">
                  <span>Delivery</span>
                  <span>{order.delivery} SAR</span>
                </div>
              )}

              <div className="flex justify-between border-t border-[#e8d8d3] pt-3 text-lg font-bold">
                <span>Total</span>
                <span>{order.total} SAR</span>
              </div>
            </div>
          </div>
        ) : (
          <p className="mb-7 rounded-2xl bg-[#fff5f0] p-5 text-center text-gray-600">
            Order details are not available in this browser.
          </p>
        )}

        <p className="mb-7 text-center text-sm text-gray-500">
          We will contact you to confirm your order.
          Thank you for shopping with Cat’s World!
        </p>

        <Link
          href="/"
          className="block rounded-xl bg-[#6b1e2b] px-8 py-4 text-center font-semibold text-white transition hover:bg-[#501520]"
        >
          Continue Shopping
        </Link>
      </div>
    </main>
  );
}
