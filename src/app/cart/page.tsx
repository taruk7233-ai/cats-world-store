
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

          if (
            Number.isInteger(quantity) &&
            quantity > 0 &&
            quantity <= 999
          ) {
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
      } else if (quantity <= 999) {
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
    (sum, product) =>
      sum + product.price * (cart[product.id] || 0),
    0
  );

  if (!loaded) {
    return (
      <main className="min-h-screen bg-[#fffaf4] flex items-center justify-center">
        <p className="text-[#641e32]">
          Loading your shopping bag...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fffaf4] text-[#30221f] overflow-x-hidden">

      {/* Top Bar */}
      <div className="bg-[#641e32] text-white text-center py-2 px-2 text-[10px] sm:text-xs tracking-[2px]">
        CAT’S WORLD • PREMIUM PET STORE
      </div>

      {/* Header */}
      <header className="border-b border-[#eadbd2] px-4 sm:px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center gap-3">
          <Link
            href="/"
            className="text-xl sm:text-2xl font-serif font-bold text-[#641e32] whitespace-nowrap"
          >
            Cat’s World<span className="text-[#c69b59]">.</span>
          </Link>

          <Link
            href="/"
            className="text-xs sm:text-sm text-[#641e32] hover:underline"
          >
            ← Continue Shopping
          </Link>
        </div>
      </header>

      {/* Cart Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">

        <p className="text-[10px] sm:text-xs tracking-[3px] text-[#a77b45]">
          YOUR COLLECTION
        </p>

        <div className="flex justify-between items-end gap-3 mb-7">
          <h1 className="font-serif text-3xl sm:text-4xl text-[#641e32] mt-2">
            Shopping Cart
          </h1>

          {totalItems > 0 && (
            <span className="text-xs sm:text-sm text-[#987c70] pb-1">
              {totalItems} Items
            </span>
          )}
        </div>

        {/* Empty Cart */}
        {totalItems === 0 ? (
          <div className="bg-white border border-[#eadbd2] rounded-sm text-center py-16 sm:py-20 px-5">
            <p className="text-5xl sm:text-6xl">🛍️</p>

            <h2 className="font-serif text-2xl mt-5 text-[#641e32]">
              Your bag is empty
            </h2>

            <p className="text-sm text-[#987c70] mt-3">
              Discover something special for your furry friend.
            </p>

            <Link
              href="/"
              className="inline-block mt-7 bg-[#641e32] text-white px-7 sm:px-8 py-4 text-xs sm:text-sm tracking-widest"
            >
              EXPLORE PRODUCTS
            </Link>
          </div>
        ) : (

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">

            {/* Products */}
            <div className="lg:col-span-2 bg-white border border-[#eadbd2] p-4 sm:p-6 md:p-7">

              <div className="flex justify-between items-center border-b border-[#eadbd2] pb-4 mb-5">
                <h2 className="font-serif text-lg sm:text-xl text-[#641e32]">
                  Your Products
                </h2>

                <span className="text-xs sm:text-sm text-[#987c70]">
                  {totalItems} Items
                </span>
              </div>

              <div className="space-y-5">

                {products
                  .filter((product) => cart[product.id])
                  .map((product) => (

                    <div
                      key={product.id}
                      className="border-b border-[#eadbd2] pb-5 last:border-0 last:pb-0"
                    >

                      {/* Product Information */}
                      <div className="flex gap-3 sm:gap-5 items-start">

                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 object-cover flex-shrink-0 rounded-sm bg-[#fffaf4]"
                        />

                        <div className="flex-1 min-w-0">

                          <p className="text-[9px] sm:text-[10px] tracking-[2px] text-[#a77b45]">
                            {product.category.toUpperCase()}
                          </p>

                          <h3 className="font-serif text-base sm:text-lg text-[#30221f] mt-1 break-words">
                            {product.name}
                          </h3>

                          <p className="text-[#641e32] font-semibold text-sm sm:text-base mt-2">
                            {product.price.toFixed(2)} SAR
                          </p>

                          {/* Quantity Controls */}
                          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-4">

                            <div className="flex items-center border border-[#d8c5b9]">

                              <button
                                type="button"
                                aria-label="Decrease quantity"
                                onClick={() =>
                                  changeQuantity(product.id, -1)
                                }
                                className="w-10 h-10 text-lg text-[#641e32] hover:bg-[#fff4ed]"
                              >
                                −
                              </button>

                              <span className="min-w-9 text-center text-sm font-medium">
                                {cart[product.id]}
                              </span>

                              <button
                                type="button"
                                aria-label="Increase quantity"
                                onClick={() =>
                                  changeQuantity(product.id, 1)
                                }
                                disabled={cart[product.id] >= 999}
                                className="w-10 h-10 text-lg text-[#641e32] hover:bg-[#fff4ed] disabled:opacity-40"
                              >
                                +
                              </button>

                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                changeQuantity(
                                  product.id,
                                  -cart[product.id]
                                )
                              }
                              className="text-xs text-red-700 hover:underline px-2 py-2"
                            >
                              Remove
                            </button>

                          </div>
                        </div>

                      </div>

                      {/* Product Total */}
                      <div className="flex justify-between items-center mt-4 bg-[#fffaf4] px-3 py-3">
                        <span className="text-xs text-[#987c70]">
                          Item Total
                        </span>

                        <span className="font-semibold text-sm text-[#641e32]">
                          {(product.price * cart[product.id]).toFixed(2)} SAR
                        </span>
                      </div>

                    </div>

                  ))}

              </div>
            </div>

            {/* Order Summary */}
            <aside className="bg-white border border-[#eadbd2] p-5 sm:p-6 lg:sticky lg:top-5">

              <h2 className="font-serif text-xl sm:text-2xl text-[#641e32] border-b border-[#eadbd2] pb-4">
                Order Summary
              </h2>

              <div className="flex justify-between mt-6 text-sm gap-3">
                <span>Items ({totalItems})</span>
                <span className="font-medium">
                  {subtotal.toFixed(2)} SAR
                </span>
              </div>

              <div className="flex justify-between mt-4 text-sm gap-3">
                <span>Delivery</span>
                <span className="text-[#987c70] text-right">
                  Calculated at checkout
                </span>
              </div>

              <div className="border-t border-[#eadbd2] mt-6 pt-5 flex justify-between font-semibold text-base sm:text-lg gap-3">
                <span>Subtotal</span>
                <span className="text-[#641e32] whitespace-nowrap">
                  {subtotal.toFixed(2)} SAR
                </span>
              </div>

              <p className="text-xs text-[#987c70] mt-3 leading-relaxed">
                Final delivery charges will be calculated at checkout.
              </p>

              <Link
                href="/checkout"
                className="flex items-center justify-center w-full bg-[#641e32] hover:bg-[#842b45] text-white min-h-14 px-3 py-4 mt-7 text-xs sm:text-sm tracking-wider text-center transition-colors"
              >
                PROCEED TO CHECKOUT →
              </Link>

              <Link
                href="/"
                className="flex items-center justify-center w-full border border-[#641e32] text-[#641e32] min-h-12 py-3 mt-3 text-xs sm:text-sm hover:bg-[#fffaf4]"
              >
                CONTINUE SHOPPING
              </Link>

              <p className="text-center text-[10px] text-[#987c70] mt-5">
                Thank you for shopping with Cat’s World.
              </p>

            </aside>

          </div>
        )}

      </section>

      {/* Footer */}
      <footer className="bg-[#29171c] text-[#eadbd2] text-center py-8 mt-10 sm:mt-16 px-4">

        <p className="font-serif text-xl text-white">
          Cat’s World
        </p>

        <p className="text-[10px] sm:text-xs mt-3">
          © 2026 Cat’s World. All rights reserved.
        </p>

      </footer>

    </main>
  );
                      }
