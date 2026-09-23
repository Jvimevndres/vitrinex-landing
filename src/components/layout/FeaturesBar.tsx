"use client";

import { Store, TrendingUp, Calendar, ArrowRight } from "lucide-react";

const features = [
  {
    icon: Store,
    title: "Tu vitrina digital",
    desc: "Crea y personaliza tu página web fácilmente.",
  },
  {
    icon: TrendingUp,
    title: "Gestiona tus ventas",
    desc: "Administra productos, pedidos y pagos.",
  },
  {
    icon: Calendar,
    title: "Organiza tu tiempo",
    desc: "Gestiona tu agenda de horas y reservas.",
  },
];

export default function FeaturesBar() {
  return (
    <section className="bg-surface border-t border-border">
      <div className="max-w-[1440px] mx-auto px-6 py-6">
        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-0">
          {/* Features */}
          <div className="flex flex-col sm:flex-row gap-6 flex-1">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-accent/10 border border-accent/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon size={22} className="text-accent" />
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm">{f.title}</p>
                    <p className="text-xs text-muted">{f.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* CTA */}
          <button className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white text-sm transition-all hover:brightness-110 active:scale-95 shadow-glow-sm whitespace-nowrap" style={{ background: "#5b3df5" }}>
            Crear mi tienda
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}
