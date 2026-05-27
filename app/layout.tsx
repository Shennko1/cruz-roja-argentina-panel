import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import Image from "next/image";
import "./globals.css";

const montserrat = Montserrat({ subsets: ["latin"], display: 'swap' });

export const metadata: Metadata = {
  title: "Equipo Nacional de Monitoreo",
  description: "Panel de control y monitoreo de emergencias",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${montserrat.className} antialiased bg-[#f4f4f4] min-h-screen`}>
        <div className="max-w-7xl mx-auto p-8">
          
          {/* Header con altura fija para evitar saltos */}
          <header className="h-[100px] mb-8 pb-4 border-b-4 border-[#ee3224] flex items-center gap-4">
            <div className="relative w-[100px] h-[80px]">
              <Image src="/enmo.jpg" alt="Equipo" fill className="object-contain" priority sizes="100px" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#ee3224]">Equipo Nacional de Monitoreo</h1>
              <p className="text-gray-500 text-sm mt-1">Panel de Monitoreo</p>
            </div>
          </header>

          {/* Menú restaurado con todas las opciones */}
          <nav className="mb-6 border-b border-gray-200 pb-2">
            <ul className="flex gap-6 text-sm font-medium">
              <li>
                <a href="/" className="flex items-center gap-1.5 px-3 py-1.5 rounded-md hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all text-xs font-bold text-gray-600 uppercase whitespace-nowrap">
                  <Image src="/net.png" alt="" width={36} height={36} className="w-9 h-9 object-contain"/> Inicio
                </a>
              </li>
              <li>
                <a href="/monitoreo-guardia" className="flex items-center gap-1.5 px-3 py-1.5 rounded-md hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all text-xs font-bold text-gray-600 uppercase whitespace-nowrap">  
                  <Image src="/mt.png" alt="" width={36} height={36} className="w-9 h-9 object-contain"/> Monitoreo
                </a>
              </li>
              <li>
                <a href="/monitoreo" className="flex items-center gap-1.5 px-3 py-1.5 rounded-md hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all text-xs font-bold text-gray-600 uppercase whitespace-nowrap"> 
                  <Image src="/alert.png" alt="" width={36} height={36} className="w-9 h-9 object-contain"/> Alertas
                </a>
              </li>
              <li>
                <a href="/guias" className="flex items-center gap-1.5 px-3 py-1.5 rounded-md hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all text-xs font-bold text-gray-600 uppercase whitespace-nowrap">
                  <Image src="/guia.png" alt="" width={36} height={36} className="w-9 h-9 object-contain"/> Guías y Procesos
                </a>
              </li>
            </ul>
          </nav>

          <main>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
