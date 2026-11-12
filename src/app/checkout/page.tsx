
"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

type CartItem = {
  id: number | string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
};

type Customer = {
  name: string;
  phone: string;
  city: string;
  district: string;
  address: string;
  payment: string;
};

export default function CheckoutPage() {
  const router = useRouter();

  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState<Customer>({
    name: "",
    phone: "",
    city: "",
    district: "",
    address: "",
    payment: "COD",
  });

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("cats-world-cart");

      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch {
      setCart([]);
    }
  }, []);

  const subtotal = cart.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  const delivery = subtotal >= 199 ? 0 : 20;
  const total = subtotal + delivery;

  const totalItems = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!cart.length) {
      setError("Your cart is empty.");
      return;
    }

    if (!supabase) {
      setError("Database connection is not configured.");
      return;
    }

    setLoading(true);

    try {
      const orderId = `CW-${Date.now()}`;

      const customer = {
        ...form,
        payment: "COD",
      };

      const order = {
        orderId,
        customer,
        items: cart,
        total,
        status: "Pending",
      };

      const { error: dbError } = await supabase
        .from("orders")
        .insert({
          order_id: orderId,
          customer,
          items: cart,
          total_items: totalItems,
          subtotal,
          delivery,
          total,
          status: "Pending",
        });

      if (dbError) {
        throw dbError;
      }

      localStorage.setItem(
        "cats-world-last-order",
        JSON.stringify(order)
      );

      localStorage.removeItem("cats-world-cart");

      router.push(
        `/order-success?order=${encodeURIComponent(orderId)}`
      );
    } catch (err) {
      console.error("Order error:", err);
      setError(
        "Order could not be placed. Please try again."
      );
      setLoading(false);
    }
  };

  const inputStyle =
    "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#7b2438] focus:ring-2 focus:ring-[#7b2438]/10";

  return (
    <main className="min-h-screen bg-[#faf7f2] px-4 py-6 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-5xl">

        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#7b2438]"
        >
          ← Cat’s World
        </Link>

        <div className="mb-7 mt-5 text-center sm:mb-10">
          <h1 className="text-3xl font-bold text-[#641d30] sm:text-4xl">
            Checkout
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Complete your information to place your order.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 items-start gap-6 lg:grid-cols-5"
        >

          {/* Customer Information */}

          <section className="space-y-5 rounded-2xl border border-[#eee4df] bg-white p-5 shadow-sm sm:p-7 lg:col-span-3">

            <div>
              <h2 className="text-xl font-bold text-[#641d30]">
                Delivery Information
              </h2>
              <p className="mt-1 text-xs text-gray-500">
                Enter your Saudi Arabia delivery details.
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Full Name *
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className={inputStyle}
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Phone Number *
              </label>
              <input
                name="phone"
                type="tel"
                inputMode="tel"
                value={form.phone}
                onChange={handleChange}
                placeholder="+966 5XXXXXXXX"
                className={inputStyle}
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  City *
                </label>
                <input
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="e.g. Madinah"
                  className={inputStyle}
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  District *
                </label>
                <input
                  name="district"
                  value={form.district}
                  onChange={handleChange}
                  placeholder="Enter district"
                  className={inputStyle}
                  required
                />
              </div>

            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Full Delivery Address *
              </label>
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Building number, street, apartment, landmark..."
                rows={4}
                className={inputStyle + " resize-y"}
                required
              />
            </div>

            <div>
              <label className="mb-3 block text-sm font-semibold text-gray-700">
                Payment Method
              </label>

              <div className="flex items-center gap-3 rounded-xl border border-[#7b2438] bg-[#faf3f3] p-4">
                <span className="text-2xl">💵</span>
                <div>
                  <p className="font-bold text-[#641d30]">
                    Cash on Delivery
                  </p>
                  <p className="text-xs text-gray-500">
                    Pay when your order arrives.
                  </p>
                </div>
                <span className="ml-auto text-lg text-[#7b2438]">
                  ✓
                </span>
              </div>
            </div>

          </section>

          {/* Order Summary */}

          <section className="rounded-2xl border border-[#eee4df] bg-white p-5 shadow-sm sm:p-7 lg:col-span-2">

            <h2 className="mb-5 text-xl font-bold text-[#641d30]">
              Order Summary
            </h2>

            {cart.length === 0 ? (
              <div className="py-6 text-center">
                <p className="text-gray-500">
                  Your cart is empty.
                </p>
                <Link
                  href="/"
                  className="mt-4 inline-block rounded-xl bg-[#7b2438] px-5 py-3 text-sm font-semibold text-white"
                >
                  Continue Shopping
                </Link>
              </div>
            ) : (
              <>
                <div className="max-h-64 space-y-4 overflow-y-auto">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-3 border-b border-gray-100 pb-4"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-gray-800">
                          {item.name}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          Qty: {item.quantity}
                        </p>
                      </div>

                      <p className="shrink-0 text-sm font-bold text-[#641d30]">
                        {(Number(item.price) * item.quantity).toFixed(2)} SAR
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 space-y-4 text-sm">

                  <div className="flex justify-between text-gray-600">
                    <span>Total Items</span>
                    <span>{totalItems}</span>
                  </div>

                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>{subtotal.toFixed(2)} SAR</span>
                  </div>

                  <div className="flex justify-between text-gray-600">
                    <span>Delivery</span>
                    <span>
                      {delivery === 0
                        ? "FREE"
                        : `${delivery.toFixed(2)} SAR`}
                    </span>
                  </div>

                  <div className="border-t border-dashed border-gray-200 pt-4">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-900">
                        Total
                      </span>
                      <span className="text-xl font-bold text-[#7b2438]">
                        {total.toFixed(2)} SAR
                      </span>
                    </div>
                  </div>

                </div>

                <p className="mt-5 rounded-xl bg-[#faf3f3] p-3 text-center text-xs text-[#7b2438]">
                  {subtotal >= 199
                    ? "🎉 You have unlocked FREE delivery!"
                    : `Add ${(199 - subtotal).toFixed(2)} SAR more for FREE delivery!`}
                </p>

                {error && (
                  <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-6 w-full rounded-xl bg-[#7b2438] px-5 py-4 text-sm font-bold text-white shadow-md transition hover:bg-[#641d30] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading
                    ? "Placing Your Order..."
                    : `Place Order · ${total.toFixed(2)} SAR`}
                </button>

                <p className="mt-4 text-center text-xs text-gray-400">
                  Secure order processing · Cash on Delivery
                </p>
              </>
            )}

          </section>

        </form>

        <p className="mt-8 text-center text-xs text-gray-400">
          © 2026 Cat’s World. All rights reserved.
        </p>

      </div>
    </main>
  );
          }
