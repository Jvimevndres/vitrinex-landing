"use client";

import Image from "next/image";
import { useRef } from "react";
import { Negocio } from "@/types";
import { CATEGORY_CONFIG } from "@/lib/categories";
import { formatDistancia } from "@/lib/haversine";
import { ChevronRight } from "lucide-react";

interface BusinessCarouselProps {
  negocios: Negocio[];
  selectedId: string | null;
  onSelect: (negocio: Negocio) => void;
}

export default function BusinessCarousel({
  negocios,
  selectedId,
  onSelect,
}: BusinessCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!trackRef.current) return;
    const amount = 300;
    trackRef.current.scrollBy({
      left: dir === "right" ? amount : -amount,
      behavior: "smooth",
    });
  };

  return (
    <section className="px-6 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">Negocios cerca de ti</h2>
        <button className="flex items-center gap-1 text-sm text-muted hover:text-white transition-colors group">
          Ver más negocios cerca
          <ChevronRight
            size={16}
            className="group-hover:translate-x-0.5 transition-transform"
          />
        </button>
      </div>

      {/* Carrusel */}
      <div className="relative">
        <div
          ref={trackRef}
          className="carousel-track flex gap-4 overflow-x-auto pb-2"
        >
          {negocios.map((negocio) => {
            const cfg = CATEGORY_CONFIG[negocio.categoria];
            const Icon = cfg.icon;
            const isSelected = selectedId === negocio.id;

            return (
              <button
                key={negocio.id}
                onClick={() => onSelect(negocio)}
                className={`
                  flex-shrink-0 w-56 rounded-2xl overflow-hidden text-left transition-all duration-200
                  ${
                    isSelected
                      ? "ring-2 ring-accent shadow-glow scale-[1.02]"
                      : "hover:scale-[1.01] hover:shadow-lg"
                  }
                  bg-surface border border-border
                `}
              >
                {/* Imagen */}
                <div className="relative h-36">
                  <Image
                    src={negocio.foto}
                    alt={negocio.nombre}
                    fill
                    className="object-cover"
                    sizes="224px"
                  />
                  {/* Icono categoría */}
                  <div
                    className="absolute top-3 left-3 w-9 h-9 rounded-xl flex items-center justify-center shadow-lg"
                    style={{ background: cfg.color }}
                  >
                    <Icon size={16} className="text-white" />
                  </div>
                </div>

                {/* Info */}
                <div className="p-3 space-y-1.5">
                  <h3 className="font-semibold text-white text-sm truncate">
                    {negocio.nombre}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-muted">
                    <span>{cfg.label}</span>
                    {negocio.distancia !== undefined && (
                      <>
                        <span>•</span>
                        <span>{formatDistancia(negocio.distancia)}</span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${
                        negocio.abierto ? "bg-emerald-400" : "bg-red-400"
                      }`}
                    />
                    <span
                      className={`text-xs font-medium ${
                        negocio.abierto ? "text-emerald-400" : "text-red-400"
                      }`}
                    >
                      {negocio.abierto ? "Abierto ahora" : "Cerrado"}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Flecha derecha */}
        <button
          onClick={() => scroll("right")}
          className="absolute -right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-surface border border-border rounded-full flex items-center justify-center shadow-lg hover:bg-surface-2 transition-colors z-10"
          aria-label="Siguiente"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </section>
  );
}
