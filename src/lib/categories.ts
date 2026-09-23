import { Category } from "@/types";
import type { LucideIcon } from "lucide-react";
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

export interface CategoryConfig {
  label: string;
  color: string;
  bgColor: string;
  glowColor: string;
  icon: LucideIcon;
}

export const CATEGORY_CONFIG: Record<Category, CategoryConfig> = {
  todos: {
    label: "Todos",
    color: "#5b3df5",
    bgColor: "bg-accent",
    glowColor: "rgba(91,61,245,0.6)",
    icon: MapPin,
  },
  cafeteria: {
    label: "Cafetería",
    color: "#e85d3f",
    bgColor: "bg-orange-500",
    glowColor: "rgba(232,93,63,0.6)",
    icon: Coffee,
  },
  tienda: {
    label: "Tienda",
    color: "#3b82f6",
    bgColor: "bg-blue-500",
    glowColor: "rgba(59,130,246,0.6)",
    icon: ShoppingBag,
  },
  gimnasio: {
    label: "Gimnasio",
    color: "#06b6d4",
    bgColor: "bg-cyan-500",
    glowColor: "rgba(6,182,212,0.6)",
    icon: Dumbbell,
  },
  belleza: {
    label: "Belleza",
    color: "#ec4899",
    bgColor: "bg-pink-500",
    glowColor: "rgba(236,72,153,0.6)",
    icon: Scissors,
  },
  salud: {
    label: "Salud",
    color: "#10b981",
    bgColor: "bg-emerald-500",
    glowColor: "rgba(16,185,129,0.6)",
    icon: Heart,
  },
  mascotas: {
    label: "Mascotas",
    color: "#f59e0b",
    bgColor: "bg-amber-500",
    glowColor: "rgba(245,158,11,0.6)",
    icon: PawPrint,
  },
  restaurante: {
    label: "Restaurante",
    color: "#f97316",
    bgColor: "bg-orange-400",
    glowColor: "rgba(249,115,22,0.6)",
    icon: UtensilsCrossed,
  },
  servicios: {
    label: "Servicios",
    color: "#8b5cf6",
    bgColor: "bg-violet-500",
    glowColor: "rgba(139,92,246,0.6)",
    icon: MapPin,
  },
};

export const FILTER_CATEGORIES: Category[] = [
  "todos",
  "restaurante",
  "tienda",
  "servicios",
  "salud",
  "belleza",
];
