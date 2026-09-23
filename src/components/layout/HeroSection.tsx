"use client";

import dynamic from "next/dynamic";
import { useState, useMemo, useEffect } from "react";
import { Negocio, Category } from "@/types";
import { negocios as allNegocios } from "../../../data/negocios";
import { haversine } from "@/lib/haversine";
import { useGeolocation } from "@/hooks/useGeolocation";
import CategoryFilters from "@/components/ui/CategoryFilters";
import BusinessCard from "@/components/business/BusinessCard";
import BusinessCarousel from "@/components/business/BusinessCarousel";
import { Search, LocateFixed, Loader2 } from "lucide-react";

// Importación dinámica del mapa (no SSR)
const MapComponent = dynamic(() => import("@/components/map/MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-surface flex items-center justify-center">
      <Loader2 size={32} className="animate-spin text-accent" />
    </div>
  ),
});

export default function HeroSection() {
  const [selectedNegocio, setSelectedNegocio] = useState<Negocio | null>(null);
  const [activeCategory, setActiveCategory] = useState<Category>("todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const { location, loading: geoLoading, requestLocation } = useGeolocation();

  // Calcular distancias y ordenar
  const negociosConDistancia = useMemo<Negocio[]>(() => {
    return allNegocios
      .map((n) => ({
        ...n,
        distancia: haversine(location.lat, location.lng, n.lat, n.lng),
      }))
      .sort((a, b) => (a.distancia ?? 0) - (b.distancia ?? 0));
  }, [location]);

  // Filtrar por categoría y búsqueda
  const negociosFiltrados = useMemo<Negocio[]>(() => {
    return negociosConDistancia.filter((n) => {
      const matchCat =
        activeCategory === "todos" || n.categoria === activeCategory;
      const matchSearch =
        searchQuery === "" ||
        n.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.categoria.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [negociosConDistancia, activeCategory, searchQuery]);

  // IDs filtrados para el mapa
  const filteredIds = useMemo(
    () => new Set(negociosFiltrados.map((n) => n.id)),
    [negociosFiltrados]
  );

  // Bottom sheet en móvil
  useEffect(() => {
    setShowBottomSheet(!!selectedNegocio);
  }, [selectedNegocio]);

  const handleCategoryChange = (cat: Category) => {
    setActiveCategory(cat);
    setSelectedNegocio(null);
  };

  return (
    <>
      {/* ══════════════════════════════════════════
          HERO: mapa de fondo + texto superpuesto
         ══════════════════════════════════════════ */}
      <section
        className="relative pt-16"
        style={{ height: "calc(100vh - 0px)", minHeight: 600 }}
      >
        {/* ── MAPA (ocupa todo el hero) ── */}
        <div className="absolute inset-0 top-16">
          <MapComponent
            negocios={allNegocios}
            selectedNegocio={selectedNegocio}
            onSelectNegocio={setSelectedNegocio}
            userLocation={location}
            filteredIds={filteredIds}
          />
        </div>

        {/* ── GRADIENTE izquierdo (funde mapa → texto) ── */}
        <div
          className="absolute inset-y-16 left-0 pointer-events-none z-10"
          style={{
            width: "55%",
            background:
              "linear-gradient(to right, #0b0d1a 38%, #0b0d1acc 65%, transparent 100%)",
          }}
        />
        {/* Gradiente inferior para suavizar la transición al carrusel */}
        <div
          className="absolute bottom-0 left-0 right-0 pointer-events-none z-10 h-32"
          style={{
            background: "linear-gradient(to top, #0b0d1a 20%, transparent)",
          }}
        />

        {/* ── PANEL DE TEXTO (izquierda, sobre el mapa) ── */}
        <div className="absolute inset-y-16 left-0 z-20 flex flex-col justify-center px-8 md:px-14 lg:px-20 max-w-[600px] w-full">
          {/* Etiqueta */}
          <p className="text-xs font-semibold tracking-widest text-muted uppercase mb-4">
            Tu negocio, más cerca
          </p>

          {/* Titular */}
          <h1 className="text-5xl md:text-6xl xl:text-7xl font-black leading-[1.05] text-white mb-5">
            Descubre
            <br />
            las pymes
            <br />
            <span style={{ color: "#5b3df5" }}>de tu zona</span>
          </h1>

          {/* Subtítulo */}
          <p className="text-muted text-base leading-relaxed mb-7 max-w-[380px]">
            Explora tiendas, servicios y experiencias locales en un solo mapa.
            Apoya a las pymes de tu ciudad y encuentra justo lo que necesitas.
          </p>

          {/* Barra de búsqueda */}
          <div className="flex gap-2 mb-5 max-w-[480px]">
            <div className="flex-1 flex items-center gap-3 bg-surface/90 backdrop-blur-sm border border-border rounded-xl px-4 py-3 focus-within:border-accent transition-colors">
              <Search size={17} className="text-muted flex-shrink-0" />
              <input
                type="text"
                placeholder="Buscar negocios, productos o servicios..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-sm text-white placeholder:text-muted outline-none flex-1 min-w-0"
              />
            </div>
            <button
              onClick={requestLocation}
              disabled={geoLoading}
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-surface/90 backdrop-blur-sm border border-border text-muted hover:text-white hover:border-accent/50 transition-all text-sm font-medium flex-shrink-0 disabled:opacity-50 whitespace-nowrap"
            >
              {geoLoading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <LocateFixed size={16} />
              )}
              <span className="hidden sm:inline">Mi ubicación</span>
            </button>
          </div>

          {/* Filtros de categoría */}
          <div className="max-w-[520px]">
            <CategoryFilters
              active={activeCategory}
              onChange={handleCategoryChange}
            />
          </div>
        </div>

        {/* ── TARJETA LATERAL – DESKTOP (encima del mapa, esquina derecha) ── */}
        {selectedNegocio && (
          <div className="hidden lg:block absolute top-20 right-5 w-72 z-30 animate-fade-in">
            <BusinessCard
              negocio={selectedNegocio}
              onClose={() => setSelectedNegocio(null)}
            />
          </div>
        )}
      </section>

      {/* ══════════════════════════════════════════
          CARRUSEL (debajo del hero)
         ══════════════════════════════════════════ */}
      <div className="bg-background relative z-10 pt-6">
        <BusinessCarousel
          negocios={negociosFiltrados}
          selectedId={selectedNegocio?.id ?? null}
          onSelect={(n) => setSelectedNegocio(n)}
        />
      </div>

      {/* ══════════════════════════════════════════
          BOTTOM SHEET móvil
         ══════════════════════════════════════════ */}
      {selectedNegocio && (
        <>
          {/* Overlay */}
          <div
            className="lg:hidden fixed inset-0 bg-black/60 z-40 animate-fade-in"
            onClick={() => setSelectedNegocio(null)}
          />
          {/* Sheet */}
          <div
            className={`lg:hidden fixed bottom-0 left-0 right-0 z-50 px-4 pb-6 bottom-sheet ${
              showBottomSheet ? "open" : ""
            }`}
          >
            <BusinessCard
              negocio={selectedNegocio}
              onClose={() => setSelectedNegocio(null)}
            />
          </div>
        </>
      )}
    </>
  );
}
