import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

// Inicializamos la fuente Montserrat
const montserrat = Montserrat({
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Equipo Nacional de Monitoreo",
  description: "Panel de control y monitoreo de emergencias",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      {/* Aplicamos montserrat.className para que afecte a toda la app */}
      <body className={`${montserrat.className} antialiased bg-[#f4f4f4] min-h-screen`}>
        <div className="p-8">
          {/* Header Global */}
          <header className="mb-8 pb-4 border-b-4 border-[#ee3224] flex items-center gap-4">
            <img 
              src="/enmo.jpg"
              alt="Equipo"
              className="h-12 w-auto object-contain"
            />
            <div>
              <h1 className="text-3xl font-bold text-[#ee3224]">
                Equipo Nacional de Monitoreo
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                PRUEBA
              </p>
            </div>
          </header>

          {/* Menú */}
          <nav className="mb-6 border-b border-gray-200 pb-2">
            <ul className="flex gap-6 text-sm font-medium">
              <li>
                <a href="/" className="text-gray-600 hover:text-[#ee3224]">Inicio</a>
              </li>
              <li>
                <a href="/monitoreo-guardia" className="text-gray-600 hover:text-[#ee3224]">Monitoreo</a>
              </li>
              <li>
                <a href="/monitoreo" className="text-gray-600 hover:text-[#ee3224]">Alertas</a>
              </li>
                li>
                <a href="/guias" className="text-gray-600 hover:text-[#ee3224]">Guías y Procesos</a>
              </li>
            </ul>
          </nav>

          {/* El contenido de cada página (page.tsx) se inyecta aquí */}
          <main>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
