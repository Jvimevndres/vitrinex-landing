"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import { Negocio, Category } from "@/types";
import { CATEGORY_CONFIG } from "@/lib/categories";
import { UserLocation } from "@/hooks/useGeolocation";
import { renderToStaticMarkup } from "react-dom/server";
import {
  Coffee,
  ShoppingBag,
  Dumbbell,
  Scissors,
  Heart,
  PawPrint,
  UtensilsCrossed,
  MapPin,
} from "lucide-react";

// Íconos SVG en string para usar dentro de los marcadores HTML
const ICON_MAP: Record<Category, string> = {
  todos: renderToStaticMarkup(<MapPin size={14} color="white" />),
  cafeteria: renderToStaticMarkup(<Coffee size={14} color="white" />),
  tienda: renderToStaticMarkup(<ShoppingBag size={14} color="white" />),
  gimnasio: renderToStaticMarkup(<Dumbbell size={14} color="white" />),
  belleza: renderToStaticMarkup(<Scissors size={14} color="white" />),
  salud: renderToStaticMarkup(<Heart size={14} color="white" />),
  mascotas: renderToStaticMarkup(<PawPrint size={14} color="white" />),
  restaurante: renderToStaticMarkup(<UtensilsCrossed size={14} color="white" />),
  servicios: renderToStaticMarkup(<MapPin size={14} color="white" />),
};

function createPinHTML(negocio: Negocio, isSelected: boolean): string {
  const cfg = CATEGORY_CONFIG[negocio.categoria];
  const color = cfg.color;
  const glow = cfg.glowColor;
  const icon = ICON_MAP[negocio.categoria];

  return `
    <div class="business-pin ${isSelected ? "selected" : ""}" style="position:relative;display:flex;flex-direction:column;align-items:center;">
      ${
        isSelected
          ? `<div style="
              position:absolute;
              bottom:calc(100% + 4px);
              left:50%;
              transform:translateX(-50%);
              background:#12152b;
              border:1px solid #1e2447;
              border-radius:8px;
              padding:4px 10px;
              white-space:nowrap;
              font-size:12px;
              font-weight:600;
              color:white;
              pointer-events:none;
              box-shadow:0 4px 12px rgba(0,0,0,0.5);
              z-index:20;
              font-family:Inter,system-ui,sans-serif;
            ">${negocio.nombre}</div>`
          : ""
      }
      ${
        isSelected
          ? `<div style="
              position:absolute;
              top:50%;left:50%;
              transform:translate(-50%,-50%);
              width:52px;height:52px;
              border-radius:50%;
              background:${color};
              opacity:0.25;
              animation:pulse-ring 2s ease-out infinite;
              pointer-events:none;
            "></div>`
          : ""
      }
      <div style="
        width:36px;
        height:44px;
        background:${color};
        border-radius:18px 18px 4px 4px;
        clip-path:polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%);
        display:flex;
        align-items:center;
        justify-content:center;
        box-shadow:0 0 14px ${glow}, 0 3px 10px rgba(0,0,0,0.5);
        padding-bottom:4px;
        position:relative;
        z-index:10;
      ">
        ${icon}
      </div>
    </div>
  `;
}

interface MapComponentProps {
  negocios: Negocio[];
  selectedNegocio: Negocio | null;
  onSelectNegocio: (negocio: Negocio | null) => void;
  userLocation: UserLocation;
  filteredIds: Set<string>;
}

export default function MapComponent({
  negocios,
  selectedNegocio,
  onSelectNegocio,
  userLocation,
  filteredIds,
}: MapComponentProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<Map<string, mapboxgl.Marker>>(new Map());
  const userMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [noToken, setNoToken] = useState(false);

  // Inicializar mapa
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token || token === "your_mapbox_token_here") {
      setNoToken(true);
      return;
    }

    mapboxgl.accessToken = token;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [userLocation.lng, userLocation.lat],
      zoom: 13,
      pitch: 45,
      bearing: -17.6,
      antialias: true,
    });

    mapRef.current = map;

    map.on("load", () => {
      // Edificios 3D en tonos oscuros
      const layers = map.getStyle()?.layers ?? [];
      const labelLayerId = layers.find(
        (layer) => layer.type === "symbol" && layer.layout?.["text-field"]
      )?.id;

      map.addLayer(
        {
          id: "3d-buildings",
          source: "composite",
          "source-layer": "building",
          filter: ["==", "extrude", "true"],
          type: "fill-extrusion",
          minzoom: 12,
          paint: {
            "fill-extrusion-color": "#0f1225",
            "fill-extrusion-height": [
              "interpolate", ["linear"], ["zoom"],
              15, 0,
              15.05, ["get", "height"],
            ],
            "fill-extrusion-base": [
              "interpolate", ["linear"], ["zoom"],
              15, 0,
              15.05, ["get", "min_height"],
            ],
            "fill-extrusion-opacity": 0.85,
          },
        },
        labelLayerId
      );

      setMapLoaded(true);
    });

    // Controles de zoom
    map.addControl(
      new mapboxgl.NavigationControl({ showCompass: false }),
      "bottom-right"
    );

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Marcador de usuario "tú estás aquí"
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;

    if (userMarkerRef.current) {
      userMarkerRef.current.setLngLat([userLocation.lng, userLocation.lat]);
    } else {
      const el = document.createElement("div");
      el.className = "user-marker";
      userMarkerRef.current = new mapboxgl.Marker({ element: el })
        .setLngLat([userLocation.lng, userLocation.lat])
        .addTo(mapRef.current);
    }

    mapRef.current.flyTo({
      center: [userLocation.lng, userLocation.lat],
      zoom: 13,
      duration: 2000,
    });
  }, [userLocation, mapLoaded]);

  // Marcadores de negocios
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current.clear();

    negocios.forEach((negocio) => {
      if (!filteredIds.has(negocio.id)) return;

      const isSelected = selectedNegocio?.id === negocio.id;
      const el = document.createElement("div");
      el.innerHTML = createPinHTML(negocio, isSelected);
      el.style.cursor = "pointer";

      const marker = new mapboxgl.Marker({ element: el, anchor: "bottom" })
        .setLngLat([negocio.lng, negocio.lat])
        .addTo(mapRef.current!);

      el.addEventListener("click", (e) => {
        e.stopPropagation();
        onSelectNegocio(isSelected ? null : negocio);
      });

      markersRef.current.set(negocio.id, marker);
    });
  }, [negocios, selectedNegocio, filteredIds, mapLoaded, onSelectNegocio]);

  // Volar al negocio seleccionado
  useEffect(() => {
    if (!mapRef.current || !selectedNegocio) return;
    mapRef.current.flyTo({
      center: [selectedNegocio.lng, selectedNegocio.lat],
      zoom: 15,
      duration: 1200,
      offset: [0, -100],
    });
  }, [selectedNegocio]);

  // Fallback cuando no hay token
  if (noToken) {
    return (
      <div
        className="w-full h-full flex flex-col items-center justify-center gap-4"
        style={{
          background:
            "radial-gradient(ellipse at center, #1a1f3a 0%, #0b0d1a 100%)",
        }}
      >
        {/* Grid de puntos simulando una cuadrícula de ciudad */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(circle, #5b3df520 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            opacity: 0.6,
          }}
        />
        <div className="relative z-10 text-center space-y-3 px-8">
          <div className="w-16 h-16 bg-accent/10 border border-accent/30 rounded-2xl flex items-center justify-center mx-auto">
            <MapPin size={28} className="text-accent" />
          </div>
          <p className="text-white font-semibold text-lg">Mapa no disponible</p>
          <p className="text-muted text-sm max-w-xs leading-relaxed">
            Agrega tu token de Mapbox en{" "}
            <code className="text-accent bg-surface px-1.5 py-0.5 rounded text-xs">
              .env.local
            </code>
          </p>
          <p className="text-xs text-muted/60">
            NEXT_PUBLIC_MAPBOX_TOKEN=pk.eyJ1...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={mapContainerRef}
      className="w-full h-full"
    />
  );
}
