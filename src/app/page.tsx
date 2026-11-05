
"use client";

import { useState } from "react";

const products = [
  {
    id: 1,
    name: "Luxury Cat Collar",
    category: "Accessories",
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

export default function Home() {
  const [cart, setCart] = useState(0);
  const [menu, setMenu] = useState(false);

  return (
    <main className="min-h-screen bg-[#fffaf4] text-[#30221f]">
      <div className="bg-[#641e32] text-white text-center py-2 text-xs tracking-wider">
        FREE DELIVERY ON ORDERS OVER 199 SAR
      </div>

      <header className="sticky top-0 z-50 bg-[#fffaf4]/95 backdrop-blur border-b border-[#eadbd2]">
        <div className="max-w-7xl mx-auto px-5 py-4 flex items-center justify-between">
          <a href="#" className="text-2xl font-serif font-bold text-[#641e32]">
            Cat’s World<span className="text-[#c69b59]">.</span>
            <p className="text-[9px] tracking-[4px] text-[#987c70] text-center">
              PREMIUM PET STORE
            </p>
          </a>

          <nav className="hidden md:flex gap-8 text-sm">
            <a href="#" className="hover:text-[#9b435a]">Home</a>
            <a href="#shop" className="hover:text-[#9b435a]">Shop</a>
            <a href="#categories" className="hover:text-[#9b435a]">Categories</a>
            <a href="#about" className="hover:text-[#9b435a]">About Us</a>
          </nav>

          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold">SAR</span>
            <button className="relative text-xl" aria-label="Shopping cart">
              🛍️
              <span className="absolute -top-2 -right-3 bg-[#641e32] text-white rounded-full text-[10px] w-5 h-5 flex items-center justify-center">
                {cart}
              </span>
            </button>
            <button
              onClick={() => setMenu(!menu)}
              className="md:hidden text-2xl"
              aria-label="Toggle menu"
            >
              ☰
            </button>
          </div>
        </div>
        {menu && (
          <nav className="md:hidden flex flex-col gap-4 px-6 pb-5 text-sm">
            <a href="#" onClick={() => setMenu(false)}>Home</a>
            <a href="#shop" onClick={() => setMenu(false)}>Shop</a>
            <a href="#categories" onClick={() => setMenu(false)}>Categories</a>
            <a href="#about" onClick={() => setMenu(false)}>About Us</a>
          </nav>
        )}
      </header>

      <section className="max-w-7xl mx-auto px-5 py-12 md:py-20 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <p className="text-[#a77b45] tracking-[4px] text-xs font-bold mb-5">
            WELCOME TO CAT’S WORLD
          </p>
          <h1 className="font-serif text-5xl md:text-7xl leading-tight text-[#641e32]">
            Love Your Cat.
            <br />
            Spoil Them <span className="italic text-[#b78d57]">More.</span>
          </h1>
          <p className="mt-6 text-[#806e67] leading-7 max-w-md">
            Discover beautiful accessories, adorable toys and premium
            essentials made for your beloved furry friends.
          </p>
          <a
            href="#shop"
            className="inline-block mt-8 bg-[#641e32] text-white px-9 py-4 text-sm tracking-widest hover:bg-[#842b45] transition"
          >
            SHOP COLLECTION →
          </a>
          <p className="mt-7 text-xs text-[#987c70]">
            ✦ PREMIUM QUALITY &nbsp; ✦ MADE FOR CAT LOVERS
          </p>
        </div>

        <div className="relative">
          <div className="absolute -inset-3 border border-[#c9a878] rounded-t-full rounded-b-[45%]" />
          <img
            src="https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=1000"
            alt="Beautiful cat"
            className="relative w-full h-[420px] md:h-[540px] object-cover rounded-t-full rounded-b-[45%]"
          />
          <div className="absolute bottom-7 left-0 bg-[#fffaf4] px-6 py-4 shadow-lg">
            <p className="font-serif text-[#641e32] text-xl">For the love of cats</p>
            <p className="text-xs text-[#987c70]">A world full of happiness.</p>
          </div>
        </div>
      </section>

      <section id="categories" className="bg-[#f4eae1] py-14">
        <div className="max-w-7xl mx-auto px-5">
          <div className="text-center mb-10">
            <p className="text-[#a77b45] text-xs tracking-[4px]">EXPLORE</p>
            <h2 className="font-serif text-3xl md:text-4xl text-[#641e32] mt-2">
              Shop By Category
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              ["🐱", "Collars"],
              ["🧸", "Toys"],
              ["👕", "Clothing"],
              ["✨", "Accessories"],
            ].map(([emoji, name]) => (
              <a href="#shop" key={name} className="bg-[#fffaf4] p-7 text-center hover:-translate-y-1 transition shadow-sm">
                <span className="text-4xl">{emoji}</span>
                <h3 className="font-serif text-lg text-[#641e32] mt-3">{name}</h3>
                <p className="text-xs text-[#987c70] mt-1">Explore Collection →</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section id="shop" className="max-w-7xl mx-auto px-5 py-16">
        <div className="flex justify-between items-end mb-9">
          <div>
            <p className="text-[#a77b45] text-xs tracking-[4px]">OUR SELECTION</p>
            <h2 className="font-serif text-3xl md:text-4xl text-[#641e32] mt-2">
              Best Sellers
            </h2>
          </div>
          <span className="text-xs text-[#987c70]">CURATED FOR YOUR CAT</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {products.map((product) => (
            <article key={product.id} className="group">
              <div className="overflow-hidden bg-[#f4eae1]">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-44 md:h-64 object-cover group-hover:scale-105 transition duration-500"
                />
              </div>
              <p className="text-[10px] tracking-widest text-[#a77b45] mt-4">
                {product.category.toUpperCase()}
              </p>
              <h3 className="font-serif text-base md:text-lg mt-1">{product.name}</h3>
              <div className="flex items-center justify-between mt-3">
                <span className="font-semibold text-[#641e32]">{product.price} SAR</span>
                <button
                  onClick={() => setCart((count) => count + 1)}
                  className="bg-[#641e32] text-white text-xs px-3 py-2 hover:bg-[#842b45]"
                >
                  + Add
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="about" className="bg-[#641e32] text-white text-center py-16 px-5">
        <p className="text-[#d7b57e] tracking-[4px] text-xs">OUR PROMISE</p>
        <h2 className="font-serif text-3xl md:text-4xl mt-4">
          A Little More Love, Every Day.
        </h2>
        <p className="text-sm text-[#eadbd2] max-w-lg mx-auto mt-5 leading-7">
          At Cat’s World, we believe every cat deserves comfort, happiness
          and a little luxury.
        </p>
      </section>

      <footer className="bg-[#29171c] text-[#eadbd2] py-9 px-5 text-center">
        <h2 className="font-serif text-2xl text-white">Cat’s World</h2>
        <p className="text-xs tracking-widest mt-2">PREMIUM PET STORE</p>
        <p className="text-xs mt-6">© 2026 Cat’s World. All rights reserved.</p>
      </footer>
    </main>
  );
}
