"use client";

import Link from "next/link";
import { MapPin, Search, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-[1440px] mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
            <MapPin size={18} color="white" />
          </div>
          <span className="text-white">Vitrinex</span>
        </Link>

        {/* Nav desktop */}
        <nav className="hidden md:flex items-center gap-8">
          {["Explorar", "Cómo funciona", "Para tu negocio", "Precios"].map(
            (item) => (
              <Link
                key={item}
                href="#"
                className="text-sm text-muted hover:text-white transition-colors"
              >
                {item}
              </Link>
            )
          )}
        </nav>

        {/* Acciones desktop */}
        <div className="hidden md:flex items-center gap-3">
          <button className="p-2 text-muted hover:text-white transition-colors">
            <Search size={20} />
          </button>
          <button className="text-sm text-muted hover:text-white transition-colors px-4 py-2">
            Iniciar sesión
          </button>
          <button className="text-sm font-semibold text-white px-5 py-2.5 rounded-xl transition-all hover:brightness-110 active:scale-95 shadow-glow-sm" style={{ background: "#5b3df5" }}>
            Crear mi tienda
          </button>
        </div>

        {/* Burger mobile */}
        <button
          className="md:hidden p-2 text-muted hover:text-white"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menú"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Menú móvil */}
      {mobileOpen && (
        <div className="md:hidden bg-surface border-t border-border px-6 py-4 space-y-3">
          {["Explorar", "Cómo funciona", "Para tu negocio", "Precios"].map(
            (item) => (
              <Link
                key={item}
                href="#"
                className="block text-sm text-muted hover:text-white transition-colors py-2"
                onClick={() => setMobileOpen(false)}
              >
                {item}
              </Link>
            )
          )}
          <div className="pt-3 border-t border-border space-y-2">
            <button className="w-full text-sm text-muted hover:text-white transition-colors py-2 text-left">
              Iniciar sesión
            </button>
            <button className="w-full text-sm font-semibold text-white py-3 rounded-xl" style={{ background: "#5b3df5" }}>
              Crear mi tienda
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
