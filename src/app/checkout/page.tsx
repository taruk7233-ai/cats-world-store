
"use client";

import { useEffect, useState, type FormEvent, type ChangeEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

const products = [
  {
    id: 1,
    name: "Luxury Cat Collar",
    category: "Collars",
    price: 35,
    image: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=600",
  },
  {
    id: 2,
    name: "Cute Cat Toy",
    category: "Toys",
    price: 25,
    image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600",
  },
  {
    id: 3,
    name: "Premium Cat Bed",
    category: "Accessories",
    price: 89,
    image: "https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=600",
  },
  {
    id: 4,
    name: "Royal Cat Collection",
    category: "Clothing",
    price: 55,
    image: "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=600",
  },
];

type CartItem = {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  quantity: number;
};

type Customer = {
  name: string;
  phone: string;
  city: string;
  district: string;
  address: string;
};

export default function CheckoutPage() {
  const router = useRouter();

  const [cart, setCart] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState<Customer>({
    name: "",
    phone: "",
    city: "",
    district: "",
    address: "",
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem("cats-world-cart");

      if (saved) {
        const parsed = JSON.parse(saved);

        const items = products
          .filter((product) => {
            const quantity = parsed?.[product.id];
            return (
              Number.isInteger(quantity) &&
              quantity > 0 &&
              quantity <= 999
            );
          })
          .map((product) => ({
            ...product,
            quantity: parsed[product.id],
          }));

        setCart(items);
      }
    } catch (err) {
      console.error("Cart loading error:", err);
    }

    setLoaded(true);
  }, []);

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const delivery = subtotal >= 199 ? 0 : 20;
  const total = subtotal + delivery;

  const totalItems = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((old) => ({
      ...old,
      [e.target.name]: e.target.value,
    }));
  };

  const inputStyle =
    "w-full rounded-xl border border-[#eadbd2] bg-white px-4 py-3.5 text-sm text-gray-900 outline-none focus:border-[#7b2438] focus:ring-2 focus:ring-[#7b2438]/10";

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!cart.length) {
      setError("Your shopping cart is empty.");
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

  if (!loaded) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#fffaf4]">
        <p className="text-[#641e32]">
          Loading Checkout...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fffaf4] px-4 py-6 sm:px-6 sm:py-10 text-[#30221f]">
      <div className="mx-auto max-w-5xl">

        <header className="flex justify-between items-center gap-3 mb-8">
          <Link
            href="/"
            className="text-xl font-serif font-bold text-[#641e32]"
          >
            Cat’s World.
          </Link>

          <Link
            href="/cart"
            className="text-sm text-[#641e32]"
          >
            ← Back to Cart
          </Link>
        </header>

        <div className="text-center mb-8">
          <p className="text-xs tracking-[3px] text-[#a77b45]">
            ALMOST THERE
          </p>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#641e32] mt-2">
            Checkout
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Complete your delivery information.
          </p>
        </div>

        {cart.length === 0 ? (
          <div className="bg-white border border-[#eadbd2] rounded-2xl p-8 text-center">
            <p className="text-4xl">🛍️</p>
            <h2 className="text-xl font-serif text-[#641e32] mt-4">
              Your cart is empty
            </h2>
            <Link
              href="/"
              className="inline-block mt-5 bg-[#641e32] text-white px-7 py-3 rounded-xl"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start"
          >
            {/* Customer Information */}

            <section className="lg:col-span-3 bg-white border border-[#eadbd2] rounded-2xl p-5 sm:p-7 space-y-5 shadow-sm">

              <div>
                <h2 className="text-xl font-serif font-bold text-[#641e32]">
                  Delivery Information
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Where should we deliver your order?
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
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
                <label className="block text-sm font-semibold mb-2">
                  Saudi Mobile Number *
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    City *
                  </label>
                  <input
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    placeholder="Madinah"
                    className={inputStyle}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    District *
                  </label>
                  <input
                    name="district"
                    value={form.district}
                    onChange={handleChange}
                    placeholder="Your district"
                    className={inputStyle}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Full Delivery Address *
                </label>
                <textarea
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Building number, street, apartment and landmark..."
                  rows={4}
                  className={inputStyle + " resize-y"}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Payment Method
                </label>

                <div className="flex items-center gap-3 rounded-xl border border-[#641e32] bg-[#fffaf4] p-4">
                  <span className="text-2xl">💵</span>
                  <div>
                    <p className="font-bold text-[#641e32]">
                      Cash on Delivery
                    </p>
                    <p className="text-xs text-gray-500">
                      Pay when your order arrives.
                    </p>
                  </div>
                  <span className="ml-auto text-[#641e32] text-xl">
                    ✓
                  </span>
                </div>
              </div>

            </section>

            {/* Order Summary */}

            <section className="lg:col-span-2 bg-white border border-[#eadbd2] rounded-2xl p-5 sm:p-7 shadow-sm">

              <h2 className="text-xl font-serif font-bold text-[#641e32] mb-5">
                Order Summary
              </h2>

              <div className="max-h-64 overflow-y-auto space-y-4">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 border-b border-[#eadbd2] pb-4"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-14 h-14 rounded-lg object-cover"
                    />

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Qty: {item.quantity}
                      </p>
                    </div>

                    <p className="text-sm font-bold text-[#641e32] whitespace-nowrap">
                      {(item.price * item.quantity).toFixed(2)} SAR
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-4 mt-6 text-sm">

                <div className="flex justify-between">
                  <span className="text-gray-500">
                    Total Items
                  </span>
                  <span>{totalItems}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">
                    Subtotal
                  </span>
                  <span>{subtotal.toFixed(2)} SAR</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">
                    Delivery
                  </span>
                  <span>
                    {delivery === 0
                      ? "FREE"
                      : `${delivery.toFixed(2)} SAR`}
                  </span>
                </div>

                <div className="border-t border-dashed border-[#eadbd2] pt-4 flex justify-between items-center">
                  <span className="font-bold">Total</span>
                  <span className="text-xl font-bold text-[#641e32]">
                    {total.toFixed(2)} SAR
                  </span>
                </div>

              </div>

              <p className="mt-5 rounded-xl bg-[#fffaf4] p-3 text-center text-xs text-[#641e32]">
                {delivery === 0
                  ? "🎉 FREE delivery unlocked!"
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
                className="w-full min-h-14 mt-6 rounded-xl bg-[#641e32] hover:bg-[#842b45] text-white font-bold text-sm transition disabled:opacity-60"
              >
                {loading
                  ? "Placing Your Order..."
                  : `PLACE ORDER · ${total.toFixed(2)} SAR`}
              </button>

              <p className="text-center text-xs text-gray-400 mt-4">
                Cash on Delivery · Cat’s World
              </p>

            </section>
          </form>
        )}

        <footer className="text-center text-xs text-gray-400 mt-10">
          © 2026 Cat’s World. All rights reserved.
        </footer>

      </div>
    </main>
  );
                    }
