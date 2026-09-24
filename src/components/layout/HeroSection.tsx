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

const MapComponent = dynamic(() => import("@/components/map/MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-surface flex items-center justify-center">
      <Loader2 size={28} className="animate-spin text-accent" />
    </div>
  ),
});

export default function HeroSection() {
  const [selectedNegocio, setSelectedNegocio] = useState<Negocio | null>(null);
  const [activeCategory, setActiveCategory] = useState<Category>("todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const { location, loading: geoLoading, requestLocation } = useGeolocation();

  const negociosConDistancia = useMemo<Negocio[]>(() => {
    return allNegocios
      .map((n) => ({
        ...n,
        distancia: haversine(location.lat, location.lng, n.lat, n.lng),
      }))
      .sort((a, b) => (a.distancia ?? 0) - (b.distancia ?? 0));
  }, [location]);

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

  const filteredIds = useMemo(
    () => new Set(negociosFiltrados.map((n) => n.id)),
    [negociosFiltrados]
  );

  useEffect(() => {
    setShowBottomSheet(!!selectedNegocio);
  }, [selectedNegocio]);

  const handleCategoryChange = (cat: Category) => {
    setActiveCategory(cat);
    setSelectedNegocio(null);
  };

  return (
    <>
      {/* ═══════════════════════════════════════════════════
          HERO — ocupa exactamente 100vh (sin scroll)
         ═══════════════════════════════════════════════════ */}
      <section className="relative" style={{ height: "100vh" }}>

        {/* ── Mapa: fondo absoluto completo ── */}
        <div className="absolute inset-0">
          <MapComponent
            negocios={allNegocios}
            selectedNegocio={selectedNegocio}
            onSelectNegocio={setSelectedNegocio}
            userLocation={location}
            filteredIds={filteredIds}
          />
        </div>

        {/* ── Gradiente izquierdo texto→mapa ── */}
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background:
              "linear-gradient(to right, #0b0d1a 30%, #0b0d1ae0 50%, #0b0d1a60 68%, transparent 85%)",
          }}
        />

        {/* ── Gradiente inferior (hacia el carrusel) ── */}
        <div
          className="absolute bottom-0 left-0 right-0 pointer-events-none z-10"
          style={{
            height: 120,
            background: "linear-gradient(to top, #0b0d1a, transparent)",
          }}
        />

        {/* ── Panel de texto: centrado verticalmente en el hero ── */}
        <div
          className="absolute inset-0 z-20 flex flex-col justify-center"
          style={{ paddingLeft: "clamp(1.5rem, 6vw, 5rem)", paddingTop: 64 }}
        >
          <div className="max-w-[500px]">

            {/* Etiqueta */}
            <p className="text-[11px] font-semibold tracking-[0.2em] text-muted uppercase mb-3">
              Tu negocio, más cerca
            </p>

            {/* Titular — tamaño responsive que NO desborda */}
            <h1
              className="font-black leading-[1.02] text-white mb-4"
              style={{ fontSize: "clamp(2.6rem, 5.5vw, 4.5rem)" }}
            >
              Descubre
              <br />
              las pymes
              <br />
              <span style={{ color: "#5b3df5" }}>de tu zona</span>
            </h1>

            {/* Subtítulo */}
            <p className="text-muted text-sm leading-relaxed mb-5 max-w-[360px]">
              Explora tiendas, servicios y experiencias locales en un solo mapa.
              Apoya a las pymes de tu ciudad y encuentra justo lo que necesitas.
            </p>

            {/* Barra de búsqueda */}
            <div className="flex gap-2 mb-4 max-w-[460px]">
              <div className="flex-1 flex items-center gap-2.5 bg-surface/90 backdrop-blur-sm border border-border rounded-xl px-4 py-2.5 focus-within:border-accent transition-colors">
                <Search size={16} className="text-muted flex-shrink-0" />
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
                className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-surface/90 backdrop-blur-sm border border-border text-muted hover:text-white hover:border-accent/50 transition-all text-sm font-medium flex-shrink-0 disabled:opacity-50"
              >
                {geoLoading ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : (
                  <LocateFixed size={15} />
                )}
                <span className="hidden sm:inline text-xs">Mi ubicación</span>
              </button>
            </div>

            {/* Filtros */}
            <CategoryFilters
              active={activeCategory}
              onChange={handleCategoryChange}
            />
          </div>
        </div>

        {/* ── Tarjeta lateral desktop ── */}
        {selectedNegocio && (
          <div className="hidden lg:block absolute top-20 right-5 w-72 z-30 animate-fade-in">
            <BusinessCard
              negocio={selectedNegocio}
              onClose={() => setSelectedNegocio(null)}
            />
          </div>
        )}
      </section>

      {/* ═══════════════════════════════════════════════════
          CARRUSEL — debajo del hero, fondo sólido
         ═══════════════════════════════════════════════════ */}
      <div className="bg-background relative z-10">
        <BusinessCarousel
          negocios={negociosFiltrados}
          selectedId={selectedNegocio?.id ?? null}
          onSelect={(n) => setSelectedNegocio(n)}
        />
      </div>

      {/* ═══════════════════════════════════════════════════
          BOTTOM SHEET móvil
         ═══════════════════════════════════════════════════ */}
      {selectedNegocio && (
        <>
          <div
            className="lg:hidden fixed inset-0 bg-black/60 z-40 animate-fade-in"
            onClick={() => setSelectedNegocio(null)}
          />
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
