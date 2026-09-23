import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vitrinex – Descubre las pymes de tu zona",
  description:
    "Explora tiendas, servicios y experiencias locales en un solo mapa. Apoya a las pymes de tu ciudad.",
  keywords: ["pymes", "negocios locales", "mapa", "tiendas", "servicios"],
  openGraph: {
    title: "Vitrinex",
    description: "Descubre las pymes de tu zona",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://api.mapbox.com/mapbox-gl-js/v3.8.0/mapbox-gl.css"
          rel="stylesheet"
        />
      </head>
      <body className="bg-background text-white font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
