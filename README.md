# Vitrinex 🏪

Landing page para descubrir pymes locales en un mapa interactivo.

## Stack
- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Mapbox GL JS** (mapa 3D oscuro, pitch 45°, edificios 3D)
- **Lucide React** (íconos de categorías)

## Setup

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar Mapbox
Edita `.env.local` y agrega tu token de Mapbox:
```
NEXT_PUBLIC_MAPBOX_TOKEN=pk.eyJ1Ijoixxxxxx
```
Obtén un token gratuito en [mapbox.com](https://mapbox.com).

### 3. Correr en desarrollo
```bash
npm run dev
```
Abre [http://localhost:3000](http://localhost:3000).

## Estructura

```
src/
  app/           → Layout y páginas (App Router)
  components/
    layout/      → Navbar, HeroSection, FeaturesBar
    map/         → MapComponent (Mapbox GL JS)
    business/    → BusinessCard, BusinessCarousel
    ui/          → CategoryFilters
  hooks/         → useGeolocation
  lib/           → haversine, categories config
  types/         → TypeScript interfaces
data/
  negocios.ts   → 15 negocios de ejemplo (preparado para Supabase + PostGIS)
```

## Migración a Supabase + PostGIS

Los datos de ejemplo en `data/negocios.ts` están listos para reemplazar con:

```sql
-- Tabla negocios con columna geography
CREATE TABLE negocios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  categoria TEXT NOT NULL,
  descripcion TEXT,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  location GEOGRAPHY(POINT, 4326) GENERATED ALWAYS AS (ST_MakePoint(lng, lat)::geography) STORED,
  foto TEXT,
  abierto BOOLEAN DEFAULT true,
  horario TEXT
);

-- Índice espacial
CREATE INDEX negocios_location_idx ON negocios USING GIST(location);

-- Query por distancia
SELECT *, ST_Distance(location, ST_MakePoint($lng, $lat)::geography) / 1000 AS distancia_km
FROM negocios
ORDER BY distancia_km
LIMIT 20;
```

## Features
- ✅ Mapa Mapbox con estilo oscuro, pitch 45° y edificios 3D
- ✅ Marcadores tipo gota con ícono por categoría y glow
- ✅ Pin seleccionado con etiqueta y animación de pulso
- ✅ Tarjeta lateral con foto, estado, horario y acciones
- ✅ "Cómo llegar" abre Google Maps
- ✅ Geolocalización con `navigator.geolocation`
- ✅ Botón "Mi ubicación" y fly-to animado
- ✅ Marcador "tú estás aquí"
- ✅ Ciudad por defecto (Santiago) si se rechaza el permiso
- ✅ Filtros por categoría
- ✅ Carrusel ordenado por distancia (haversine)
- ✅ Bottom sheet en móvil
- ✅ Diseño responsive
