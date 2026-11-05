
"use client";

import { useState, useEffect } from "react";

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

export default function Home() {
  const [cart, setCart] = useState<Record<number, number>>({});
  const [cartLoaded, setCartLoaded] = useState(false);
  const [addedProduct, setAddedProduct] = useState<number | null>(null);
  const [toast, setToast] = useState("");
  const [search, setSearch] = useState("");

  // Load saved cart
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("cats-world-cart");

      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);

        if (
          parsedCart &&
          typeof parsedCart === "object" &&
          !Array.isArray(parsedCart)
        ) {
          const validCart: Record<number, number> = {};

          products.forEach((product) => {
            const quantity = parsedCart[product.id];

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
      }
    } catch {
      console.error("Could not load saved cart");
    }

    setCartLoaded(true);
  }, []);

  // Save cart automatically
  useEffect(() => {
    if (!cartLoaded) return;

    try {
      localStorage.setItem("cats-world-cart", JSON.stringify(cart));
    } catch {
      console.error("Could not save cart");
    }
  }, [cart, cartLoaded]);

  // Add product
  const addToCart = (id: number) => {
    setCart((old) => ({
      ...old,
      [id]: (old[id] || 0) + 1,
    }));

    setAddedProduct(id);
    setToast("✓ Product added to your cart!");

    setTimeout(() => {
      setAddedProduct((current) =>
        current === id ? null : current
      );
      setToast("");
    }, 1800);
  };

  // Cart count
  const totalItems = Object.values(cart).reduce(
    (sum, quantity) => sum + quantity,
    0
  );

  // Search
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-[#fffaf4] text-[#30221f]">

      {/* Announcement */}
      <div className="bg-[#641e32] text-white text-center py-2 text-xs tracking-widest">
        FREE DELIVERY ON ORDERS OVER 199 SAR
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#fffaf4]/95 backdrop-blur border-b border-[#eadbd2]">
        <div className="max-w-7xl mx-auto px-5 py-4 flex justify-between items-center">

          <a href="/" className="text-2xl font-serif font-bold text-[#641e32]">
            Cat’s World<span className="text-[#c69b59]">.</span>
            <p className="text-[9px] tracking-[4px] text-[#987c70] text-center">
              PREMIUM PET STORE
            </p>
          </a>

          <nav className="hidden md:flex gap-8 text-sm">
            <a href="/">Home</a>
            <a href="#shop">Shop</a>
            <a href="#categories">Categories</a>
            <a href="#about">About Us</a>
          </nav>

          {/* Cart Page Link */}
          <a
            href="/cart"
            className="relative text-2xl"
            aria-label="Open shopping cart"
          >
            🛍️

            <span className="absolute -top-2 -right-3 bg-[#641e32] text-white rounded-full text-[10px] w-5 h-5 flex items-center justify-center">
              {cartLoaded ? totalItems : 0}
            </span>
          </a>

        </div>
      </header>

      {/* Hero */}
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
            essentials for your beloved furry friends.
          </p>

          <a
            href="#shop"
            className="inline-block mt-8 bg-[#641e32] text-white px-9 py-4 text-sm tracking-widest hover:bg-[#842b45] transition"
          >
            SHOP COLLECTION →
          </a>

          <p className="mt-7 text-xs text-[#987c70]">
            ✦ PREMIUM QUALITY ✦ MADE FOR CAT LOVERS
          </p>
        </div>

        <img
          src="https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=1000"
          alt="Beautiful cat"
          className="w-full h-[420px] md:h-[520px] object-cover rounded-t-full rounded-b-[45%]"
        />

      </section>

      {/* Categories */}
      <section id="categories" className="bg-[#f4eae1] py-14">
        <div className="max-w-7xl mx-auto px-5">

          <div className="text-center mb-10">
            <p className="text-[#a77b45] text-xs tracking-[4px]">
              EXPLORE
            </p>

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
              <a
                href="#shop"
                key={name}
                className="bg-[#fffaf4] p-7 text-center hover:-translate-y-1 transition shadow-sm"
              >
                <span className="text-4xl">{emoji}</span>

                <h3 className="font-serif text-lg text-[#641e32] mt-3">
                  {name}
                </h3>

                <p className="text-xs text-[#987c70] mt-1">
                  Explore Collection →
                </p>
              </a>
            ))}
          </div>

        </div>
      </section>

      {/* Products */}
      <section id="shop" className="max-w-7xl mx-auto px-5 py-16">

        <div className="flex flex-col md:flex-row justify-between gap-5 mb-9">

          <div>
            <p className="text-[#a77b45] text-xs tracking-[4px]">
              OUR SELECTION
            </p>

            <h2 className="font-serif text-3xl md:text-4xl text-[#641e32] mt-2">
              Best Sellers
            </h2>
          </div>

          <input
            type="search"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-[#eadbd2] bg-white px-4 py-3 outline-none focus:border-[#641e32] w-full md:w-64"
          />

        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">

          {filteredProducts.map((product) => (
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

              <h3 className="font-serif text-base md:text-lg mt-1">
                {product.name}
              </h3>

              <div className="flex items-center justify-between gap-2 mt-3">

                <span className="font-semibold text-[#641e32]">
                  {product.price} SAR
                </span>

                <button
                  onClick={() => addToCart(product.id)}
                  className={`text-xs px-3 py-2 transition ${
                    addedProduct === product.id
                      ? "bg-green-700 text-white"
                      : "bg-[#641e32] text-white hover:bg-[#842b45]"
                  }`}
                >
                  {addedProduct === product.id ? "✓ Added" : "+ Add"}
                </button>

              </div>

            </article>
          ))}

        </div>

        {filteredProducts.length === 0 && (
          <p className="text-center py-12 text-[#987c70]">
            No products found.
          </p>
        )}

      </section>

      {/* About */}
      <section
        id="about"
        className="bg-[#641e32] text-white text-center py-16 px-5"
      >

        <p className="text-[#d7b57e] tracking-[4px] text-xs">
          OUR PROMISE
        </p>

        <h2 className="font-serif text-3xl md:text-4xl mt-4">
          A Little More Love, Every Day.
        </h2>

        <p className="text-sm text-[#eadbd2] max-w-lg mx-auto mt-5 leading-7">
          At Cat’s World, we believe every cat deserves comfort,
          happiness and a little luxury.
        </p>

      </section>

      {/* Footer */}
      <footer className="bg-[#29171c] text-[#eadbd2] py-9 px-5 text-center">

        <h2 className="font-serif text-2xl text-white">
          Cat’s World
        </h2>

        <p className="text-xs tracking-widest mt-2">
          PREMIUM PET STORE
        </p>

        <p className="text-xs mt-6">
          © 2026 Cat’s World. All rights reserved.
        </p>

      </footer>

      {/* Success Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 left-5 md:left-auto md:w-auto z-[70] bg-[#641e32] text-white px-6 py-4 shadow-xl rounded-sm text-sm text-center">
          {toast}
        </div>
      )}

    </main>
  );
      }
