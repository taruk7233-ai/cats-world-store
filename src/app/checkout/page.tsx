
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const products = [
  { id: 1, name: "Luxury Cat Collar", price: 35 },
  { id: 2, name: "Cute Cat Toy", price: 25 },
  { id: 3, name: "Premium Cat Bed", price: 89 },
  { id: 4, name: "Royal Cat Collection", price: 55 },
];

export default function CheckoutPage() {
  const [cart, setCart] = useState<Record<number, number>>({});
  const [loaded, setLoaded] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    city: "",
    district: "",
    address: "",
    payment: "COD",
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem("cats-world-cart");
      if (saved) {
        const parsed = JSON.parse(saved);

        if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
          const valid: Record<number, number> = {};

          products.forEach((p) => {
            const q = parsed[p.id];
            if (Number.isInteger(q) && q > 0 && q <= 999) {
              valid[p.id] = q;
            }
          });

          setCart(valid);
        }
      }
    } catch {
      console.error("Could not load cart");
    }

    setLoaded(true);
  }, []);

  const totalItems = Object.values(cart).reduce(
    (sum, quantity) => sum + quantity,
    0
  );

  const subtotal = products.reduce(
    (sum, p) => sum + p.price * (cart[p.id] || 0),
    0
  );

  const delivery = subtotal >= 199 ? 0 : 20;
  const total = subtotal + delivery;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (totalItems === 0) {
      alert("Your cart is empty!");
      return;
    }

    setSubmitting(true);

    try {
      const orderId =
        "CW-" + Date.now().toString().slice(-8);

      const order = {
        orderId,
        customer: form,
        items: products
          .filter((p) => cart[p.id])
          .map((p) => ({
            id: p.id,
            name: p.name,
            price: p.price,
            quantity: cart[p.id],
          })),
        subtotal,
        delivery,
        total,
        status: "Pending",
        createdAt: new Date().toISOString(),
      };

      // Temporary local confirmation only.
      // A real server/database order system will be connected next.
      localStorage.setItem(
        "cats-world-last-order",
        JSON.stringify(order)
      );

      localStorage.removeItem("cats-world-cart");

      window.location.href =
        "/order-success?order=" + encodeURIComponent(orderId);
    } catch {
      alert("Could not save your order. Please try again.");
      setSubmitting(false);
    }
  };

  if (!loaded) {
    return (
      <main className="min-h-screen bg-[#fffaf4] flex items-center justify-center">
        Loading checkout...
      </main>
    );
  }

  if (totalItems === 0) {
    return (
      <main className="min-h-screen bg-[#fffaf4] text-center px-5 py-24">
        <h1 className="font-serif text-3xl text-[#641e32]">
          Your cart is empty
        </h1>
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

      <header className="bg-[#641e32] text-white px-5 py-5">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <Link href="/" className="font-serif text-2xl font-bold">
            Cat’s World.
          </Link>
          <Link href="/cart" className="text-sm">
            ← Back to Cart
          </Link>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-5 py-12">
        <p className="text-xs tracking-[4px] text-[#a77b45]">
          COMPLETE YOUR ORDER
        </p>

        <h1 className="font-serif text-4xl text-[#641e32] mt-2 mb-8">
          Checkout
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-3 gap-8">

            <div className="md:col-span-2 bg-white border border-[#eadbd2] p-6">

              <h2 className="font-serif text-2xl text-[#641e32] mb-6">
                Delivery Information
              </h2>

              <div className="space-y-5">

                <div>
                  <label className="block text-sm mb-2">
                    Full Name *
                  </label>
                  <input
                    required
                    minLength={2}
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                    placeholder="Enter your full name"
                    className="w-full border border-[#eadbd2] p-3 outline-none focus:border-[#641e32]"
                  />
                </div>

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
                      setForm({ ...form, phone: e.target.value })
                    }
                    placeholder="05XXXXXXXX"
                    className="w-full border border-[#eadbd2] p-3 outline-none focus:border-[#641e32]"
                  />
                  <p className="text-xs text-[#987c70] mt-2">
                    Example: 05XXXXXXXX or +9665XXXXXXXX
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">

                  <div>
                    <label className="block text-sm mb-2">
                      City *
                    </label>
                    <input
                      required
                      value={form.city}
                      onChange={(e) =>
                        setForm({ ...form, city: e.target.value })
                      }
                      placeholder="e.g. Jeddah"
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
                        setForm({ ...form, district: e.target.value })
                      }
                      placeholder="Your district"
                      className="w-full border border-[#eadbd2] p-3 outline-none focus:border-[#641e32]"
                    />
                  </div>

                </div>

                <div>
                  <label className="block text-sm mb-2">
                    Full Delivery Address *
                  </label>
                  <textarea
                    required
                    minLength={10}
                    rows={4}
                    value={form.address}
                    onChange={(e) =>
                      setForm({ ...form, address: e.target.value })
                    }
                    placeholder="Building number, street, landmark..."
                    className="w-full border border-[#eadbd2] p-3 outline-none focus:border-[#641e32]"
                  />
                </div>

              </div>

              <h2 className="font-serif text-2xl text-[#641e32] mt-9 mb-5">
                Payment Method
              </h2>

              <label className="flex items-center gap-3 border border-[#641e32] p-4 cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  value="COD"
                  checked={form.payment === "COD"}
                  onChange={(e) =>
                    setForm({ ...form, payment: e.target.value })
                  }
                />
                <div>
                  <p className="font-semibold">
                    Cash on Delivery
                  </p>
                  <p className="text-xs text-[#987c70]">
                    Pay when your order arrives.
                  </p>
                </div>
              </label>

              <label className="flex items-center gap-3 border border-[#eadbd2] p-4 mt-3">
                <input
                  type="radio"
                  name="payment"
                  value="Online"
                  checked={form.payment === "Online"}
                  onChange={(e) =>
                    setForm({ ...form, payment: e.target.value })
                  }
                />
                <div>
                  <p className="font-semibold">
                    Online Payment
                  </p>
                  <p className="text-xs text-[#987c70]">
                    Coming soon. Payment gateway is not connected yet.
                  </p>
                </div>
              </label>

              {form.payment === "Online" && (
                <p className="text-sm text-red-700 mt-3">
                  Online payment is not available yet. Please select Cash on Delivery.
                </p>
              )}

              <button
                type="submit"
                disabled={submitting || form.payment !== "COD"}
                className="w-full bg-[#641e32] text-white py-4 mt-8 tracking-widest hover:bg-[#842b45] disabled:opacity-50"
              >
                {submitting ? "PROCESSING..." : "PLACE COD ORDER"}
              </button>

            </div>

            <aside className="bg-white border border-[#eadbd2] p-6 h-fit">

              <h2 className="font-serif text-2xl text-[#641e32] border-b border-[#eadbd2] pb-4">
                Order Summary
              </h2>

              {products.filter((p) => cart[p.id]).map((p) => (
                <div key={p.id} className="flex justify-between gap-3 mt-5 text-sm">
                  <span>
                    {p.name} × {cart[p.id]}
                  </span>
                  <span className="whitespace-nowrap">
                    {p.price * cart[p.id]} SAR
                  </span>
                </div>
              ))}

              <div className="flex justify-between mt-6 text-sm">
                <span>Subtotal</span>
                <span>{subtotal.toFixed(2)} SAR</span>
              </div>

              <div className="flex justify-between mt-4 text-sm">
                <span>Delivery</span>
                <span>
                  {delivery === 0 ? "FREE" : `${delivery} SAR`}
                </span>
              </div>

              <div className="border-t border-[#eadbd2] mt-5 pt-5 flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span className="text-[#641e32]">
                  {total.toFixed(2)} SAR
                </span>
              </div>

              <p className="text-xs text-[#987c70] mt-4">
                Free delivery on orders over 199 SAR.
              </p>

            </aside>

          </div>
        </form>
      </section>

      <footer className="bg-[#29171c] text-white text-center py-8">
        <p className="font-serif text-xl">Cat’s World</p>
        <p className="text-xs mt-2">PREMIUM PET STORE</p>
      </footer>

    </main>
  );
                  }
                    
