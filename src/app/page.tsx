
"use client";

import { useState } from "react";

const products = [
  { id: 1, name: "Luxury Cat Collar", category: "Accessories", price: 35, image: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=600" },
  { id: 2, name: "Cute Cat Toy", category: "Toys", price: 25, image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600" },
  { id: 3, name: "Premium Cat Bed", category: "Accessories", price: 89, image: "https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=600" },
  { id: 4, name: "Royal Cat Collection", category: "Clothing", price: 55, image: "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=600" },
];

export default function Home() {
  const [cart, setCart] = useState<Record<number, number>>({});
  const [showCart, setShowCart] = useState(false);

  const addToCart = (id: number) => {
    setCart((old) => ({ ...old, [id]: (old[id] || 0) + 1 }));
  };

  const changeQuantity = (id: number, amount: number) => {
    setCart((old) => {
      const next = { ...old };
      const quantity = (next[id] || 0) + amount;
      if (quantity <= 0) delete next[id];
      else next[id] = quantity;
      return next;
    });
  };

  const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);
  const totalPrice = products.reduce(
    (sum, p) => sum + p.price * (cart[p.id] || 0), 0
  );

  return (
    <main className="min-h-screen bg-[#fffaf4] text-[#30221f]">
      <div className="bg-[#641e32] text-white text-center py-2 text-xs tracking-wider">
        FREE DELIVERY ON ORDERS OVER 199 SAR
      </div>

      <header className="sticky top-0 z-40 bg-[#fffaf4]/95 border-b border-[#eadbd2]">
        <div className="max-w-7xl mx-auto px-5 py-4 flex justify-between items-center">
          <a href="#" className="text-2xl font-serif font-bold text-[#641e32]">
            Cat’s World<span className="text-[#c69b59]">.</span>
            <p className="text-[9px] tracking-[4px] text-[#987c70] text-center">PREMIUM PET STORE</p>
          </a>
          <nav className="hidden md:flex gap-8 text-sm">
            <a href="#">Home</a>
            <a href="#shop">Shop</a>
            <a href="#categories">Categories</a>
            <a href="#about">About Us</a>
          </nav>
          <button onClick={() => setShowCart(true)} className="relative text-2xl" aria-label="Open shopping cart">
            🛍️
            <span className="absolute -top-2 -right-3 bg-[#641e32] text-white rounded-full text-[10px] w-5 h-5 flex items-center justify-center">
              {totalItems}
            </span>
          </button>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-5 py-12 md:py-20 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <p className="text-[#a77b45] tracking-[4px] text-xs font-bold mb-5">WELCOME TO CAT’S WORLD</p>
          <h1 className="font-serif text-5xl md:text-7xl leading-tight text-[#641e32]">
            Love Your Cat.<br />
            Spoil Them <span className="italic text-[#b78d57]">More.</span>
          </h1>
          <p className="mt-6 text-[#806e67] leading-7 max-w-md">
            Discover beautiful accessories, adorable toys and premium essentials for your beloved furry friends.
          </p>
          <a href="#shop" className="inline-block mt-8 bg-[#641e32] text-white px-9 py-4 text-sm tracking-widest">
            SHOP COLLECTION →
          </a>
        </div>
        <img
          src="https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=1000"
          alt="Beautiful cat"
          className="w-full h-[420px] md:h-[520px] object-cover rounded-t-full rounded-b-[45%]"
        />
      </section>

      <section id="categories" className="bg-[#f4eae1] py-14">
        <div className="max-w-7xl mx-auto px-5">
          <h2 className="font-serif text-3xl text-center text-[#641e32] mb-9">Shop By Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {["🐱 Collars", "🧸 Toys", "👕 Clothing", "✨ Accessories"].map((name) => (
              <a href="#shop" key={name} className="bg-[#fffaf4] p-7 text-center text-[#641e32] font-serif text-lg">
                {name}
              </a>
            ))}
          </div>
        </div>
      </section>

      <section id="shop" className="max-w-7xl mx-auto px-5 py-16">
        <p className="text-xs tracking-[4px] text-[#a77b45]">OUR SELECTION</p>
        <h2 className="font-serif text-3xl text-[#641e32] mt-2 mb-9">Best Sellers</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {products.map((p) => (
            <article key={p.id}>
              <img src={p.image} alt={p.name} className="w-full h-44 md:h-64 object-cover" />
              <p className="text-[10px] tracking-widest text-[#a77b45] mt-4">{p.category.toUpperCase()}</p>
              <h3 className="font-serif text-lg mt-1">{p.name}</h3>
              <div className="flex justify-between items-center mt-3">
                <b className="text-[#641e32]">{p.price} SAR</b>
                <button onClick={() => addToCart(p.id)} className="bg-[#641e32] text-white text-xs px-3 py-2">
                  + Add
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="about" className="bg-[#641e32] text-white text-center py-16 px-5">
        <p className="text-[#d7b57e] tracking-[4px] text-xs">OUR PROMISE</p>
        <h2 className="font-serif text-3xl mt-4">A Little More Love, Every Day.</h2>
        <p className="text-sm text-[#eadbd2] mt-5">Premium accessories for your beloved cats.</p>
      </section>

      <footer className="bg-[#29171c] text-[#eadbd2] py-9 text-center">
        <h2 className="font-serif text-2xl text-white">Cat’s World</h2>
        <p className="text-xs mt-3">© 2026 Cat’s World. All rights reserved.</p>
      </footer>

      {showCart && (
        <div className="fixed inset-0 z-50 bg-black/50" onClick={() => setShowCart(false)}>
          <div
            className="absolute right-0 top-0 h-full w-full max-w-md bg-[#fffaf4] p-6 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b border-[#eadbd2] pb-5">
              <h2 className="font-serif text-2xl text-[#641e32]">Your Shopping Bag</h2>
              <button onClick={() => setShowCart(false)} className="text-2xl">×</button>
            </div>

            {totalItems === 0 ? (
              <div className="text-center py-20">
                <p className="text-5xl">🛍️</p>
                <p className="font-serif text-xl mt-5">Your bag is empty</p>
                <button onClick={() => setShowCart(false)} className="mt-5 bg-[#641e32] text-white px-6 py-3">
                  Continue Shopping
                </button>
              </div>
            ) : (
              <>
                <div className="py-5 space-y-5">
                  {products.filter((p) => cart[p.id]).map((p) => (
                    <div key={p.id} className="flex gap-4 items-center">
                      <img src={p.image} alt={p.name} className="w-20 h-20 object-cover" />
                      <div className="flex-1">
                        <h3 className="font-serif">{p.name}</h3>
                        <p className="text-[#641e32] font-semibold">{p.price} SAR</p>
                        <div className="flex items-center gap-4 mt-2">
                          <button onClick={() => changeQuantity(p.id, -1)} className="border px-3">−</button>
                          <span>{cart[p.id]}</span>
                          <button onClick={() => changeQuantity(p.id, 1)} className="border px-3">+</button>
                          <button onClick={() => changeQuantity(p.id, -cart[p.id])} className="text-xs text-red-700">Remove</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-[#eadbd2] pt-5">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Subtotal</span>
                    <span>{totalPrice.toFixed(2)} SAR</span>
                  </div>
                  <p className="text-xs text-[#987c70] mt-2">Delivery charges calculated at checkout.</p>
                  <button
                    onClick={() => alert("Checkout integration is coming next!")}
                    className="w-full bg-[#641e32] text-white py-4 mt-6 tracking-widest"
                  >
                    PROCEED TO CHECKOUT
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
                }
