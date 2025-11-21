"use client";

import { useState } from "react";

type NavItem = {
  label: string;
  href: string;
};

const navItems: NavItem[] = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Documentation", href: "#docs" },
  { label: "Login", href: "#login" },
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-lg">
      <div className="bg-gradient-to-r from-blue-900/95 via-indigo-900/95 to-purple-900/95 shadow-xl shadow-purple-900/30">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <a href="#" className="flex items-center gap-3 text-white">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-2xl shadow-lg shadow-blue-500/40">
              📈
            </span>
            <div>
              <p className="text-lg font-semibold tracking-tight">Backtester AI</p>
              <p className="text-xs text-blue-200">Strategy Intelligence</p>
            </div>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-6 text-sm font-medium text-blue-100 md:flex">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="group relative transition-colors duration-200 hover:text-white"
              >
                {item.label}
                <span className="pointer-events-none absolute inset-x-1 -bottom-1 block h-0.5 origin-center scale-x-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 transition-transform duration-200 group-hover:scale-x-100" />
              </a>
            ))}
            <button className="rounded-lg border border-white/30 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:border-white/80 hover:bg-white/20">
              Launch App
            </button>
          </nav>

          {/* Mobile button */}
          <button
            type="button"
            className="relative z-20 flex h-10 w-10 items-center justify-center rounded-lg border border-white/20 text-white transition-all duration-200 hover:border-white/60 md:hidden"
            aria-label="Toggle navigation menu"
            onClick={() => setIsOpen((prev) => !prev)}
          >
            <span
              className={`absolute block h-0.5 w-5 bg-current transition-all duration-200 ${
                isOpen ? "translate-y-0 rotate-45" : "-translate-y-1.5"
              }`}
            />
            <span
              className={`absolute block h-0.5 w-5 bg-current transition-opacity duration-200 ${
                isOpen ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute block h-0.5 w-5 bg-current transition-all duration-200 ${
                isOpen ? "translate-y-0 -rotate-45" : "translate-y-1.5"
              }`}
            />
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden ${
            isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          } overflow-hidden transition-all duration-300`}
        >
          <nav className="space-y-2 px-4 pb-6 pt-2 text-sm font-medium text-blue-100 sm:px-6">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="block rounded-lg bg-white/5 px-4 py-3 transition-all duration-200 hover:bg-white/10"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <button className="w-full rounded-lg border border-white/30 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition-all duration-200 hover:border-white/80 hover:bg-white/20">
              Launch App
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}

