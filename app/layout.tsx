import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import Image from "next/image";
import "./globals.css";

const montserrat = Montserrat({ subsets: ["latin"], display: 'swap' });

export const metadata: Metadata = {
  title: "Equipo Nacional de Monitoreo",
  description: "Panel de monitoreo de emergencias",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      {/* Agregamos una clase base al body para evitar que el fondo cambie de color */}
      <body className={`${montserrat.className} antialiased bg-[#f4f4f4] min-h-screen`}>
        {/* Usamos un contenedor con ancho máximo definido para evitar estiramientos */}
        <div className="max-w-7xl mx-auto p-8">
          
          {/* Header con ALTURA FIJA para que el contenido de abajo no "salte" */}
          <header className="h-[120px] mb-8 pb-4 border-b-4 border-[#ee3224] flex items-center gap-4">
            <div className="relative w-[100px] h-[80px]"> {/* Contenedor rígido para la imagen */}
              <Image 
                src="/enmo.jpg" 
                alt="Equipo" 
                fill 
                className="object-contain" 
                priority 
                sizes="100px"
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#ee3224] leading-tight">Equipo Nacional de Monitoreo</h1>
              <p className="text-gray-500 text-sm mt-1 uppercase tracking-widest">Sistema Integrado</p>
            </div>
          </header>

          {/* Menú con altura mínima garantizada */}
          <nav className="min-h-[60px] mb-6 border-b border-gray-200">
             {/* ... tu código de menú ... */}
          </nav>

          <main>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
