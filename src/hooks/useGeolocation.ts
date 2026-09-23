"use client";

import { useState, useEffect, useCallback } from "react";

export interface UserLocation {
  lat: number;
  lng: number;
}

// Ciudad por defecto: Santiago, Chile
const DEFAULT_LOCATION: UserLocation = {
  lat: -33.4372,
  lng: -70.6506,
};

export function useGeolocation() {
  const [location, setLocation] = useState<UserLocation>(DEFAULT_LOCATION);
  const [isDefault, setIsDefault] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Geolocalización no disponible");
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setIsDefault(false);
        setLoading(false);
      },
      () => {
        setError("No se pudo obtener tu ubicación");
        setLocation(DEFAULT_LOCATION);
        setIsDefault(true);
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  return { location, isDefault, loading, error, requestLocation };
}
