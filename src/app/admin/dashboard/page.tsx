
"use client";

import { useState } from "react";

const menu = [
  "Dashboard",
  "Orders",
  "Products",
  "Customers",
  "Staff Management",
  "Reports",
  "Settings",
];

const stats = [
  { title: "Total Orders", value: "0", icon: "📦", note: "All customer orders" },
  { title: "Total Revenue", value: "SAR 0", icon: "💰", note: "Total sales" },
  { title: "Total Products", value: "0", icon: "🐈", note: "Products in store" },
  { title: "Total Customers", value: "0", icon: "👥", note: "Registered customers" },
];

export default function AdminDashboard() {
  const [active, setActive] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f8f5f2] text-[#302020]">
      <div className="flex min-h-screen">

        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <aside className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-[#541c2b] text-white transition-transform lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}>
          <div className="border-b border-white/15 px-6 py-7">
            <h1 className="text-2xl font-bold tracking-wide">Cat’s World</h1>
            <p className="mt-1 text-xs tracking-[3px] text-[#e8c8bd]">
              ADMIN PANEL
            </p>
          </div>

          <div className="px-5 py-6">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#d9b8b5]">
              Main Menu
            </p>

            <nav className="space-y-2">
              {menu.map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    setActive(item);
                    setSidebarOpen(false);
                  }}
                  className={`w-full rounded-xl px-4 py-3 text-left text-sm font-medium transition ${
                    active === item
                      ? "bg-[#f4e8df] text-[#541c2b]"
                      : "text-white/85 hover:bg-white/10"
                  }`}
                >
                  {item === "Dashboard" ? "⌂" :
                   item === "Orders" ? "▣" :
                   item === "Products" ? "◇" :
                   item === "Customers" ? "♙" :
                   item === "Staff Management" ? "♧" :
                   item === "Reports" ? "▤" : "⚙"}
                  <span className="ml-3">{item}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="mt-auto border-t border-white/15 p-5">
            <div className="rounded-xl bg-white/10 p-4">
              <p className="text-sm font-semibold">Admin Account</p>
              <p className="mt-1 text-xs text-[#e8c8bd]">Administrator</p>
            </div>
            <p className="mt-5 text-center text-xs text-white/50">
              © 2026 Cat’s World
            </p>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <header className="sticky top-0 z-20 flex items-center justify-between border-b border-[#eaded9] bg-white/95 px-4 py-4 sm:px-8">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="rounded-lg border border-[#eaded9] px-3 py-2 text-xl lg:hidden"
              >
                ☰
              </button>
              <div>
                <p className="text-xs text-gray-500">Cat’s World / Admin</p>
                <h2 className="text-lg font-bold text-[#541c2b] sm:text-xl">
                  {active}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="hidden text-sm text-gray-500 sm:inline">
                Welcome, Admin
              </span>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#541c2b] font-bold text-white">
                A
              </div>
            </div>
          </header>

          <div className="p-4 sm:p-8">
            <div className="mb-8 rounded-2xl bg-gradient-to-r from-[#541c2b] to-[#7d3548] p-6 text-white sm:p-9">
              <p className="text-sm text-[#f0d8d2]">
                PREMIUM CAT ACCESSORIES STORE
              </p>
              <h1 className="mt-3 text-2xl font-bold sm:text-3xl">
                Welcome to Cat’s World!
              </h1>
              <p className="mt-2 text-sm text-white/80">
                Manage your store, orders and team from one place.
              </p>
            </div>

            {active === "Dashboard" ? (
              <>
                <h3 className="mb-5 text-lg font-bold">Store Overview</h3>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {stats.map((stat) => (
                    <div
                      key={stat.title}
                      className="rounded-2xl border border-[#eee2dc] bg-white p-5 shadow-sm"
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-500">{stat.title}</p>
                        <span className="text-2xl">{stat.icon}</span>
                      </div>
                      <p className="mt-4 text-3xl font-bold text-[#541c2b]">
                        {stat.value}
                      </p>
                      <p className="mt-2 text-xs text-gray-400">{stat.note}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-8 grid gap-6 xl:grid-cols-2">
                  <section className="rounded-2xl border border-[#eee2dc] bg-white p-6">
                    <h3 className="font-bold">Recent Orders</h3>
                    <div className="py-10 text-center">
                      <span className="text-4xl">📦</span>
                      <p className="mt-3 font-medium">No orders displayed yet</p>
                      <p className="mt-1 text-sm text-gray-400">
                        Customer orders will appear here.
                      </p>
                    </div>
                  </section>

                  <section className="rounded-2xl border border-[#eee2dc] bg-white p-6">
                    <h3 className="font-bold">Quick Actions</h3>
                    <div className="mt-5 grid grid-cols-2 gap-3">
                      {["Orders", "Products", "Customers", "Staff Management"].map((item) => (
                        <button
                          key={item}
                          onClick={() => setActive(item)}
                          className="rounded-xl border border-[#eaded9] p-4 text-sm font-semibold text-[#541c2b] transition hover:bg-[#f8f0ed]"
                        >
                          {item}
                          <span className="mt-2 block text-xl">→</span>
                        </button>
                      ))}
                    </div>
                  </section>
                </div>
              </>
            ) : (
              <section className="rounded-2xl border border-[#eee2dc] bg-white p-8">
                <h3 className="text-xl font-bold text-[#541c2b]">{active}</h3>
                <p className="mt-3 text-sm text-gray-500">
                  This section is ready for the next development stage.
                </p>
                <p className="mt-2 text-xs text-gray-400">
                  Database connection and role permissions will be added separately.
                </p>
              </section>
            )}
          </div>
        </main>
      </div>
    </div>
  );
      }
