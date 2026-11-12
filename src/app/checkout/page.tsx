
"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

const CART_KEY = "cats-world-cart";
const ORDER_KEY = "cats-world-last-order";

type CartItem = {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  quantity: number;
};

export default function CheckoutPage() {
  const router = useRouter();

  const [cart, setCart] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("Madinah");
  const [district, setDistrict] = useState("");
  const [address, setAddress] = useState("");
  const [payment, setPayment] = useState("COD");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(CART_KEY);

      if (saved) {
        const parsed = JSON.parse(saved);

        const items = Array.isArray(parsed)
          ? parsed
          : Object.entries(parsed).map(([id, quantity]) => {
              const product = [
                { id: 1, name: "Luxury Cat Collar", category: "Collars", price: 35, image: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=600" },
                { id: 2, name: "Cute Cat Toy", category: "Toys", price: 25, image: "https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=600" },
                { id: 3, name: "Premium Cat Bed", category: "Beds", price: 89, image: "https://images.unsplash.com/photo-1511044568932-338cba0ad803?w=600" },
                { id: 4, name: "Royal Cat Collection", category: "Accessories", price: 55, image: "https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=600" },
              ].find((p) => p.id === Number(id));

              return product
                ? { ...product, quantity: Number(quantity) }
                : null;
            }).filter(Boolean);

        setCart(
          items.map((item: any) => ({
            ...item,
            quantity: Number(item.quantity || 1),
          }))
        );
      }
    } catch (e) {
      console.error("Cart loading error:", e);
    }

    setLoaded(true);
  }, []);

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const totalItems = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const update = (
    setter: (value: string) => void,
    value: string
  ) => setter(value);

  const placeOrder = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL ||
        !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      setError("Supabase environment variables are missing.");
      return;
    }

    if (!cart.length) {
      setError("Your cart is empty.");
      return;
    }

    if (!/^(05\d{8}|5\d{8}|\+9665\d{8}|009665\d{8})$/.test(
      phone.replace(/[\s-]/g, "")
    )) {
      setError("Enter a valid Saudi mobile number.");
      return;
    }

    if (!name.trim() || !city.trim() || !district.trim() || !address.trim()) {
      setError("Please complete all delivery information.");
      return;
    }

    if (payment !== "COD") {
      setError("Online payment is coming soon. Please select Cash on Delivery.");
      return;
    }

    setLoading(true);

    try {
      const orderId =
        "CW-" + Date.now().toString().slice(-9);

      const order = {
        order_id: orderId,
        customer: {
          name: name.trim(),
          phone: phone.trim(),
          city: city.trim(),
          district: district.trim(),
          address: address.trim(),
          paymentMethod: "Cash on Delivery",
        },
        items: cart,
        total_items: totalItems,
        subtotal,
        delivery: 0,
        total: subtotal,
        status: "Pending",
      };

      const { error: dbError } = await supabase
        .from("orders")
        .insert([order]);

      if (dbError) {
        throw new Error(
          `Supabase Error: ${dbError.message} | Code: ${dbError.code} | Details: ${dbError.details || "None"}`
        );
      }

      localStorage.setItem(
        ORDER_KEY,
        JSON.stringify({
          orderId,
          customer: order.customer,
          items: cart,
          totalItems,
          subtotal,
          delivery: 0,
          total: subtotal,
          status: "Pending",
        })
      );

      localStorage.removeItem(CART_KEY);

      router.push(
        `/order-success?order=${encodeURIComponent(orderId)}`
      );
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error ? err.message : "Order failed."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!loaded) {
    return (
      <main className="min-h-screen bg-[#fffaf5] flex items-center justify-center">
        Loading Checkout...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fffaf5] text-[#35151f]">
      <header className="bg-[#711b36] text-white text-center py-7">
        <h1 className="text-3xl font-bold">Cat&apos;s World</h1>
        <p className="text-sm mt-2 text-pink-100">
          Premium Cat Accessories
        </p>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-[#711b36] mb-7">
          Checkout
        </h2>

        {!cart.length ? (
          <div className="bg-white p-8 rounded-2xl text-center">
            <h3 className="text-xl font-bold">Your Cart Is Empty</h3>
            <button
              onClick={() => router.push("/")}
              className="mt-5 bg-[#711b36] text-white px-6 py-3 rounded-xl"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <form
            onSubmit={placeOrder}
            className="grid grid-cols-1 lg:grid-cols-3 gap-7"
          >
            <div className="lg:col-span-2 space-y-7">
              <section className="bg-white p-5 sm:p-7 rounded-2xl shadow-sm">
                <h3 className="text-xl font-bold text-[#711b36] mb-6">
                  Delivery Information
                </h3>

                <div className="space-y-4">
                  <input
                    required
                    value={name}
                    onChange={(e) => update(setName, e.target.value)}
                    placeholder="Full Name"
                    className="w-full border p-3 rounded-xl"
                  />

                  <input
                    required
                    type="tel"
                    value={phone}
                    onChange={(e) => update(setPhone, e.target.value)}
                    placeholder="Saudi Mobile: 05XXXXXXXX"
                    className="w-full border p-3 rounded-xl"
                  />

                  <input
                    required
                    value={city}
                    onChange={(e) => update(setCity, e.target.value)}
                    placeholder="City"
                    className="w-full border p-3 rounded-xl"
                  />

                  <input
                    required
                    value={district}
                    onChange={(e) => update(setDistrict, e.target.value)}
                    placeholder="District"
                    className="w-full border p-3 rounded-xl"
                  />

                  <textarea
                    required
                    rows={4}
                    value={address}
                    onChange={(e) => update(setAddress, e.target.value)}
                    placeholder="Complete Delivery Address"
                    className="w-full border p-3 rounded-xl"
                  />
                </div>
              </section>

              <section className="bg-white p-5 sm:p-7 rounded-2xl shadow-sm">
                <h3 className="text-xl font-bold text-[#711b36] mb-5">
                  Payment Method
                </h3>

                <label className="flex gap-3 items-center border-2 border-[#711b36] bg-[#fff8fa] rounded-xl p-4">
                  <input
                    type="radio"
                    checked={payment === "COD"}
                    onChange={() => setPayment("COD")}
                  />
                  <span className="font-semibold">
                    Cash on Delivery
                  </span>
                  <span>💵</span>
                </label>

                <div className="mt-4 border rounded-xl p-4 opacity-70">
                  <p className="font-bold">Online Payment</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Mada • Visa • Mastercard
                  </p>
                  <span className="inline-block mt-3 bg-gray-100 px-3 py-2 rounded-lg text-xs font-bold">
                    Coming Soon
                  </span>
                </div>
              </section>
            </div>

            <aside className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm h-fit">
              <h3 className="text-xl font-bold text-[#711b36] mb-5">
                Order Summary
              </h3>

              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-3 items-center">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-xl"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{item.name}</p>
                      <p className="text-xs text-gray-500">
                        Qty: {item.quantity}
                      </p>
                      <p className="font-bold text-[#711b36]">
                        {(item.price * item.quantity).toFixed(2)} SAR
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <hr className="my-5" />

              <div className="flex justify-between mb-3">
                <span>Items ({totalItems})</span>
                <span>{subtotal.toFixed(2)} SAR</span>
              </div>

              <div className="flex justify-between mb-3">
                <span>Delivery</span>
                <span>To be confirmed</span>
              </div>

              <hr className="my-5" />

              <div className="flex justify-between font-bold text-xl">
                <span>Total</span>
                <span className="text-[#711b36]">
                  {subtotal.toFixed(2)} SAR
                </span>
              </div>

              <p className="text-xs text-gray-500 mt-2">
                Delivery charges will be confirmed separately.
              </p>

              {error && (
                <div className="mt-5 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm break-words">
                  <strong>Order Error:</strong>
                  <p className="mt-1">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-6 bg-[#711b36] hover:bg-[#551126] text-white font-bold py-4 rounded-xl disabled:opacity-50"
              >
                {loading ? "Placing Order..." : "Place Order"}
              </button>
            </aside>
          </form>
        )}
      </div>

      <footer className="bg-[#711b36] text-white text-center py-6 mt-10">
        © 2026 Cat&apos;s World. All Rights Reserved.
      </footer>
    </main>
  );
                      }
