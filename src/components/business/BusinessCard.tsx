"use client";

import Image from "next/image";
import { Negocio } from "@/types";
import { CATEGORY_CONFIG } from "@/lib/categories";
import { formatDistancia } from "@/lib/haversine";
import {
  X,
  Navigation,
  Bookmark,
  Share2,
  ExternalLink,
  Clock,
} from "lucide-react";

interface BusinessCardProps {
  negocio: Negocio;
  onClose: () => void;
}

export default function BusinessCard({ negocio, onClose }: BusinessCardProps) {
  const cfg = CATEGORY_CONFIG[negocio.categoria];
  const Icon = cfg.icon;

  const handleComoLlegar = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${negocio.lat},${negocio.lng}&destination_place_id=${encodeURIComponent(negocio.nombre)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleCompartir = () => {
    if (navigator.share) {
      navigator.share({
        title: negocio.nombre,
        text: negocio.descripcion,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-2xl animate-slide-up w-full">
      {/* Foto */}
      <div className="relative h-44 w-full">
        <Image
          src={negocio.foto}
          alt={negocio.nombre}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 280px"
        />
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 bg-background/80 hover:bg-background backdrop-blur-sm rounded-full flex items-center justify-center transition-colors border border-border"
          aria-label="Cerrar"
        >
          <X size={16} />
        </button>
        {/* Badge categoría */}
        <div
          className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold text-white"
          style={{ background: cfg.color }}
        >
          <Icon size={12} />
          {cfg.label}
        </div>
      </div>

      {/* Contenido */}
      <div className="p-4 space-y-3">
        {/* Encabezado */}
        <div>
          <h2 className="text-lg font-bold text-white">{negocio.nombre}</h2>
          <div className="flex items-center gap-2 text-sm text-muted mt-0.5">
            <span>{cfg.label}</span>
            {negocio.distancia !== undefined && (
              <>
                <span>•</span>
                <span>{formatDistancia(negocio.distancia)}</span>
              </>
            )}
          </div>
        </div>

        {/* Descripción */}
        <p className="text-sm text-muted leading-relaxed">{negocio.descripcion}</p>

        {/* Estado */}
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${
              negocio.abierto ? "bg-emerald-400" : "bg-red-400"
            }`}
          />
          <span
            className={`text-sm font-medium ${
              negocio.abierto ? "text-emerald-400" : "text-red-400"
            }`}
          >
            {negocio.abierto ? "Abierto ahora" : "Cerrado"}
          </span>
        </div>

        {/* Horario */}
        <div className="flex items-start gap-2 text-xs text-muted">
          <Clock size={13} className="mt-0.5 shrink-0" />
          <span>{negocio.horario}</span>
        </div>

        {/* Botón principal */}
        <button
          className="w-full py-3 rounded-xl font-semibold text-white text-sm transition-all duration-200 hover:brightness-110 active:scale-95 flex items-center justify-center gap-2"
          style={{ background: "#5b3df5" }}
        >
          <ExternalLink size={16} />
          Ver vitrina
        </button>

        {/* Acciones secundarias */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          <button
            onClick={handleComoLlegar}
            className="flex flex-col items-center gap-1.5 py-2.5 rounded-xl bg-surface-2 hover:bg-border transition-colors text-muted hover:text-white group"
          >
            <Navigation
              size={18}
              className="group-hover:text-accent transition-colors"
            />
            <span className="text-xs">Cómo llegar</span>
          </button>
          <button className="flex flex-col items-center gap-1.5 py-2.5 rounded-xl bg-surface-2 hover:bg-border transition-colors text-muted hover:text-white group">
            <Bookmark
              size={18}
              className="group-hover:text-accent transition-colors"
            />
            <span className="text-xs">Guardar</span>
          </button>
          <button
            onClick={handleCompartir}
            className="flex flex-col items-center gap-1.5 py-2.5 rounded-xl bg-surface-2 hover:bg-border transition-colors text-muted hover:text-white group"
          >
            <Share2
              size={18}
              className="group-hover:text-accent transition-colors"
            />
            <span className="text-xs">Compartir</span>
          </button>
        </div>
      </div>
    </div>
  );
}
