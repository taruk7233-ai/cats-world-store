
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

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

export default function CartPage() {
  const [cart, setCart] = useState<Record<number, number>>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("cats-world-cart");

      if (saved) {
        const parsed = JSON.parse(saved);
        const validCart: Record<number, number> = {};

        products.forEach((product) => {
          const quantity = parsed?.[product.id];

          if (Number.isInteger(quantity) && quantity > 0 && quantity <= 999) {
            validCart[product.id] = quantity;
          }
        });

        setCart(validCart);
      }
    } catch {
      console.error("Could not load cart");
    }

    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem("cats-world-cart", JSON.stringify(cart));
    }
  }, [cart, loaded]);

  const changeQuantity = (id: number, amount: number) => {
    setCart((old) => {
      const next = { ...old };
      const quantity = (next[id] || 0) + amount;

      if (quantity <= 0) {
        delete next[id];
      } else {
        next[id] = quantity;
      }

      return next;
    });
  };

  const totalItems = Object.values(cart).reduce(
    (sum, quantity) => sum + quantity,
    0
  );

  const subtotal = products.reduce(
    (sum, product) => sum + product.price * (cart[product.id] || 0),
    0
  );

  if (!loaded) {
    return (
      <main className="min-h-screen bg-[#fffaf4] flex items-center justify-center">
        <p className="text-[#641e32]">Loading your shopping bag...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fffaf4] text-[#30221f]">
      <div className="bg-[#641e32] text-white text-center py-2 text-xs tracking-widest">
        CAT’S WORLD • PREMIUM PET STORE
      </div>

      <header className="border-b border-[#eadbd2] px-5 py-5">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-serif font-bold text-[#641e32]">
            Cat’s World<span className="text-[#c69b59]">.</span>
          </Link>
          <Link href="/" className="text-sm text-[#641e32]">
            ← Continue Shopping
          </Link>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-5 py-12">
        <p className="text-xs tracking-[4px] text-[#a77b45]">
          YOUR COLLECTION
        </p>

        <h1 className="font-serif text-4xl text-[#641e32] mt-2 mb-8">
          Shopping Cart
        </h1>

        {totalItems === 0 ? (
          <div className="bg-white border border-[#eadbd2] text-center py-20 px-5">
            <p className="text-6xl">🛍️</p>
            <h2 className="font-serif text-2xl mt-5">
              Your bag is empty
            </h2>
            <p className="text-sm text-[#987c70] mt-3">
              Discover something special for your furry friend.
            </p>
            <Link
              href="/"
              className="inline-block mt-7 bg-[#641e32] text-white px-8 py-4 text-sm tracking-widest"
            >
              EXPLORE PRODUCTS
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white border border-[#eadbd2] p-5 md:p-7">
              <div className="flex justify-between border-b border-[#eadbd2] pb-4 mb-5">
                <h2 className="font-serif text-xl text-[#641e32]">
                  Your Products
                </h2>
                <span className="text-sm text-[#987c70]">
                  {totalItems} Items
                </span>
              </div>

              <div className="space-y-6">
                {products.filter((p) => cart[p.id]).map((product) => (
                  <div
                    key={product.id}
                    className="flex gap-4 border-b border-[#eadbd2] pb-6"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-24 h-24 md:w-32 md:h-32 object-cover"
                    />

                    <div className="flex-1">
                      <p className="text-[10px] tracking-widest text-[#a77b45]">
                        {product.category.toUpperCase()}
                      </p>

                      <h3 className="font-serif text-base md:text-lg mt-1">
                        {product.name}
                      </h3>

                      <p className="text-[#641e32] font-semibold mt-2">
                        {product.price} SAR
                      </p>

                      <div className="flex items-center gap-3 mt-4">
                        <button
                          onClick={() => changeQuantity(product.id, -1)}
                          className="border border-[#d8c5b9] px-3 py-1"
                        >
                          −
                        </button>

                        <span>{cart[product.id]}</span>

                        <button
                          onClick={() => changeQuantity(product.id, 1)}
                          className="border border-[#d8c5b9] px-3 py-1"
                        >
                          +
                        </button>

                        <button
                          onClick={() => changeQuantity(product.id, -cart[product.id])}
                          className="text-xs text-red-700 ml-3"
                        >
                          Remove
                        </button>
                      </div>
                    </div>

                    <div className="font-semibold text-[#641e32] text-sm">
                      {(product.price * cart[product.id]).toFixed(2)} SAR
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <aside className="bg-white border border-[#eadbd2] p-6 h-fit">
              <h2 className="font-serif text-2xl text-[#641e32] border-b border-[#eadbd2] pb-4">
                Order Summary
              </h2>

              <div className="flex justify-between mt-6 text-sm">
                <span>Items ({totalItems})</span>
                <span>{subtotal.toFixed(2)} SAR</span>
              </div>

              <div className="flex justify-between mt-4 text-sm">
                <span>Delivery</span>
                <span className="text-[#987c70]">At checkout</span>
              </div>

              <div className="border-t border-[#eadbd2] mt-6 pt-5 flex justify-between font-semibold text-lg">
                <span>Subtotal</span>
                <span className="text-[#641e32]">
                  {subtotal.toFixed(2)} SAR
                </span>
              </div>

              <p className="text-xs text-[#987c70] mt-3">
                Final delivery charges will be calculated at checkout.
              </p>

              <button
                onClick={() => alert("Checkout system is coming in the next step!")}
                className="w-full bg-[#641e32] hover:bg-[#842b45] text-white py-4 mt-7 text-sm tracking-widest"
              >
                PROCEED TO CHECKOUT →
              </button>

              <Link
                href="/"
                className="block text-center border border-[#641e32] text-[#641e32] py-3 mt-3 text-sm"
              >
                CONTINUE SHOPPING
              </Link>
            </aside>
          </div>
        )}
      </section>

      <footer className="bg-[#29171c] text-[#eadbd2] text-center py-8 mt-16">
        <p className="font-serif text-xl text-white">Cat’s World</p>
        <p className="text-xs mt-3">
          © 2026 Cat’s World. All rights reserved.
        </p>
      </footer>
    </main>
  );
              }
