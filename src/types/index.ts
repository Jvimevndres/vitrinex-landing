export type Category =
  | "todos"
  | "restaurante"
  | "tienda"
  | "cafeteria"
  | "gimnasio"
  | "belleza"
  | "salud"
  | "mascotas"
  | "servicios";

export interface Negocio {
  id: string;
  nombre: string;
  categoria: Category;
  descripcion: string;
  direccion: string;
  lat: number;
  lng: number;
  foto: string;
  distancia?: number; // km, calculado dinámicamente
  abierto: boolean;
  horario: string;
  telefono?: string;
  // Preparado para Supabase + PostGIS
  // supabase_id?: string;
}
