
"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

// Supabase connection
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

// Products
const products = [
  { id: 1, name: "Luxury Cat Collar", price: 35 },
  { id: 2, name: "Cute Cat Toy", price: 25 },
  { id: 3, name: "Premium Cat Bed", price: 89 },
  { id: 4, name: "Royal Cat Collection", price: 55 },
];

type Cart = Record<number, number>;

export default function CheckoutPage() {
  const [cart, setCart] = useState<Cart>({});
  const [loaded, setLoaded] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    phone: "",
    city: "",
    district: "",
    address: "",
    payment: "COD",
  });

  // Load cart
  useEffect(() => {
    try {
      const saved = localStorage.getItem("cats-world-cart");

      if (saved) {
        const parsed = JSON.parse(saved);

        if (
          parsed &&
          typeof parsed === "object" &&
          !Array.isArray(parsed)
        ) {
          const valid: Cart = {};

          products.forEach((product) => {
            const quantity = parsed[product.id];

            if (
              Number.isInteger(quantity) &&
              quantity > 0 &&
              quantity <= 999
            ) {
              valid[product.id] = quantity;
            }
          });

          setCart(valid);
        }
      }
    } catch (err) {
      console.error("Could not load cart:", err);
    }

    setLoaded(true);
  }, []);

  // Calculate totals
  const totalItems = Object.values(cart).reduce(
    (sum, quantity) => sum + quantity,
    0
  );

  const subtotal = products.reduce(
    (sum, product) =>
      sum + product.price * (cart[product.id] || 0),
    0
  );

  const delivery = subtotal >= 199 ? 0 : 20;
  const total = subtotal + delivery;

  // Submit order
  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setError("");

    if (submitting) return;

    if (!supabase) {
      setError(
        "Supabase connection is missing. Please check your environment variables."
      );
      return;
    }

    if (totalItems === 0) {
      setError("Your shopping cart is empty.");
      return;
    }

    if (
      !form.name.trim() ||
      !form.city.trim() ||
      !form.district.trim() ||
      !form.address.trim()
    ) {
      setError("Please complete all delivery information.");
      return;
    }

    const phonePattern =
      /^(\+9665[0-9]{8}|05[0-9]{8}|5[0-9]{8})$/;

    if (!phonePattern.test(form.phone.trim())) {
      setError("Please enter a valid Saudi mobile number.");
      return;
    }

    if (form.address.trim().length < 10) {
      setError("Please enter your complete delivery address.");
      return;
    }

    setSubmitting(true);

    try {
      const orderId =
        "CW-" + Date.now().toString().slice(-8);

      const order = {
        orderId,

        customer: {
          name: form.name.trim(),
          phone: form.phone.trim(),
          city: form.city.trim(),
          district: form.district.trim(),
          address: form.address.trim(),
          payment: "COD",
        },

        items: products
          .filter((product) => cart[product.id])
          .map((product) => ({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: cart[product.id],
            total:
              product.price * cart[product.id],
          })),

        totalItems,
        subtotal,
        delivery,
        total,
        status: "Pending",
        createdAt: new Date().toISOString(),
      };

      // Save order to Supabase
      const { error: dbError } = await supabase
        .from("orders")
        .insert({
          order_id: orderId,
          customer: order.customer,
          items: order.items,
          total_items: totalItems,
          subtotal: subtotal,
          delivery: delivery,
          total: total,
          status: "Pending",
        });

      if (dbError) {
        console.error("Supabase order error:", dbError);
        throw new Error(dbError.message);
      }

      // Save order for success page
      localStorage.setItem(
        "cats-world-last-order",
        JSON.stringify(order)
      );

      // Clear cart after successful database save
      localStorage.removeItem("cats-world-cart");

      // Go to success page
      window.location.href =
        "/order-success?order=" +
        encodeURIComponent(orderId);

    } catch (err) {
      console.error("Order submission failed:", err);

      setError(
        err instanceof Error
          ? `Order could not be saved: ${err.message}`
          : "Could not place your order. Please try again."
      );

      setSubmitting(false);
    }
  };

  // Loading
  if (!loaded) {
    return (
      <main className="min-h-screen bg-[#fffaf4] flex items-center justify-center">
        <p className="text-[#641e32]">
          Loading checkout...
        </p>
      </main>
    );
  }

  // Empty cart
  if (totalItems === 0) {
    return (
      <main className="min-h-screen bg-[#fffaf4] text-center px-5 py-24">
        <p className="text-6xl">🛍️</p>

        <h1 className="font-serif text-3xl text-[#641e32] mt-5">
          Your cart is empty
        </h1>

        <p className="text-[#987c70] mt-3">
          Add some products before checking out.
        </p>

        <Link
          href="/"
          className="inline-block mt-6 bg-[#641e32] text-white px-8 py-4"
        >
          SHOP NOW
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fffaf4] text-[#30221f]">

      {/* Top bar */}
      <div className="bg-[#641e32] text-white text-center py-2 text-xs tracking-widest">
        CAT’S WORLD • PREMIUM PET STORE
      </div>

      {/* Header */}
      <header className="bg-[#641e32] text-white px-5 py-5">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <Link
            href="/"
            className="font-serif text-2xl font-bold"
          >
            Cat’s World.
          </Link>

          <Link href="/cart" className="text-sm">
            ← Back to Cart
          </Link>
        </div>
      </header>

      {/* Checkout */}
      <section className="max-w-5xl mx-auto px-5 py-12">

        <p className="text-xs tracking-[4px] text-[#a77b45]">
          COMPLETE YOUR ORDER
        </p>

        <h1 className="font-serif text-4xl text-[#641e32] mt-2 mb-8">
          Checkout
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-3 gap-8">

            {/* Customer information */}
            <div className="md:col-span-2 bg-white border border-[#eadbd2] p-6">

              <h2 className="font-serif text-2xl text-[#641e32] mb-6">
                Delivery Information
              </h2>

              <div className="space-y-5">

                {/* Name */}
                <div>
                  <label className="block text-sm mb-2">
                    Full Name *
                  </label>

                  <input
                    required
                    minLength={2}
                    maxLength={100}
                    value={form.name}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        name: e.target.value,
                      })
                    }
                    placeholder="Enter your full name"
                    className="w-full border border-[#eadbd2] p-3 outline-none focus:border-[#641e32]"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm mb-2">
                    Saudi Mobile Number *
                  </label>

                  <input
                    required
                    type="tel"
                    inputMode="tel"
                    pattern="(\+9665[0-9]{8}|05[0-9]{8}|5[0-9]{8})"
                    value={form.phone}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        phone: e.target.value,
                      })
                    }
                    placeholder="05XXXXXXXX"
                    className="w-full border border-[#eadbd2] p-3 outline-none focus:border-[#641e32]"
                  />

                  <p className="text-xs text-[#987c70] mt-2">
                    Example: 05XXXXXXXX or +9665XXXXXXXX
                  </p>
                </div>

                {/* City and District */}
                <div className="grid md:grid-cols-2 gap-4">

                  <div>
                    <label className="block text-sm mb-2">
                      City *
                    </label>

                    <input
                      required
                      value={form.city}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          city: e.target.value,
                        })
                      }
                      placeholder="e.g. Madinah"
                      className="w-full border border-[#eadbd2] p-3 outline-none focus:border-[#641e32]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-2">
                      District *
                    </label>

                    <input
                      required
                      value={form.district}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          district: e.target.value,
                        })
                      }
                      placeholder="Your district"
                      className="w-full border border-[#eadbd2] p-3 outline-none focus:border-[#641e32]"
                    />
                  </div>

                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm mb-2">
                    Full Delivery Address *
                  </label>

                  <textarea
                    required
                    minLength={10}
                    maxLength={500}
                    rows={4}
                    value={form.address}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        address: e.target.value,
                      })
                    }
                    placeholder="Building number, street, landmark..."
                    className="w-full border border-[#eadbd2] p-3 outline-none focus:border-[#641e32]"
                  />
                </div>

              </div>

              {/* Payment */}
              <h2 className="font-serif text-2xl text-[#641e32] mt-9 mb-5">
                Payment Method
              </h2>

              <div className="border border-[#641e32] p-4">
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    checked={true}
                    readOnly
                    name="payment"
                  />

                  <div>
                    <p className="font-semibold">
                      Cash on Delivery
                    </p>

                    <p className="text-xs text-[#987c70]">
                      Pay when your order arrives.
                    </p>
                  </div>
                </div>
              </div>

              <div className="border border-[#eadbd2] bg-[#fffaf4] p-4 mt-3">
                <p className="font-semibold text-sm">
                  Online Payment
                </p>

                <p className="text-xs text-[#987c70] mt-1">
                  Online payment will be available soon.
                </p>
              </div>

              {/* Error */}
              {error && (
                <div
                  role="alert"
                  className="bg-red-50 border border-red-200 text-red-700 p-4 mt-6 text-sm break-words"
                >
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#641e32] text-white py-4 mt-8 tracking-widest hover:bg-[#842b45] disabled:opacity-50"
              >
                {submitting
                  ? "PROCESSING..."
                  : "PLACE COD ORDER →"}
              </button>

              <p className="text-xs text-center text-[#987c70] mt-4">
                Secure your order with Cash on Delivery.
              </p>

            </div>

            {/* Order Summary */}
            <aside className="bg-white border border-[#eadbd2] p-6 h-fit">

              <h2 className="font-serif text-2xl text-[#641e32] border-b border-[#eadbd2] pb-4">
                Order Summary
              </h2>

              {products
                .filter((product) => cart[product.id])
                .map((product) => (
                  <div
                    key={product.id}
                    className="flex justify-between gap-3 mt-5 text-sm"
                  >
                    <span>
                      {product.name} × {cart[product.id]}
                    </span>

                    <span className="whitespace-nowrap">
                      {(
                        product.price * cart[product.id]
                      ).toFixed(2)} SAR
                    </span>
                  </div>
                ))}

              <div className="flex justify-between mt-6 text-sm">
                <span>Items</span>
                <span>{totalItems}</span>
              </div>

              <div className="flex justify-between mt-4 text-sm">
                <span>Subtotal</span>
                <span>{subtotal.toFixed(2)} SAR</span>
              </div>

              <div className="flex justify-between mt-4 text-sm">
                <span>Delivery</span>

                <span className="text-[#641e32] font-semibold">
                  {delivery === 0
                    ? "FREE"
                    : `${delivery.toFixed(2)} SAR`}
                </span>
              </div>

              <div className="border-t border-[#eadbd2] mt-5 pt-5 flex justify-between font-semibold text-lg">
                <span>Total</span>

                <span className="text-[#641e32]">
                  {total.toFixed(2)} SAR
                </span>
              </div>

              <p className="text-xs text-[#987c70] mt-4">
                Free delivery on orders of 199 SAR or more.
              </p>

              <Link
                href="/cart"
                className="block text-center border border-[#641e32] text-[#641e32] py-3 mt-6 text-sm"
              >
                EDIT CART
              </Link>

            </aside>

          </div>
        </form>
      </section>

      {/* Footer */}
      <footer className="bg-[#29171c] text-white text-center py-8">
        <p className="font-serif text-xl">
          Cat’s World
        </p>

        <p className="text-xs mt-2 tracking-widest">
          PREMIUM PET STORE
        </p>

        <p className="text-xs mt-3 text-[#c9b4b0]">
          © 2026 Cat’s World. All rights reserved.
        </p>
      </footer>

    </main>
  );
        }
                  
