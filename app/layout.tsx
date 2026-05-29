import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import Image from "next/image";
import Link from "next/link"; // 1. IMPORTAMOS LINK
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
          
          {/* HEADER */}
          <header className="h-[85px] mb-6 pb-2 border-b-4 border-[#ee3224] flex items-center gap-4">
            <img 
              src="/enmo.jpg" 
              alt="Logo" 
              style={{ 
                width: '100px', 
                minWidth: '100px', 
                height: '70px', 
                objectFit: 'contain', 
                flexShrink: 0 
              }} 
            />
            <div>
              <h1 className="text-3xl font-bold text-[#ee3224] leading-none">Equipo Nacional de Monitoreo</h1>
              <p className="text-gray-500 text-sm mt-1 uppercase tracking-wider">Panel de Alerta y Monitoreo de Emergencias</p>
            </div>
          </header>

          {/* MENÚ CORREGIDO */}
          <nav className="mb-6 border-b border-gray-200">
            <ul className="flex gap-6">
              {[
                { name: "Inicio", path: "/", icon: "/net.png" },
                { name: "Monitoreo", path: "/monitoreo-guardia", icon: "/mt.png" },
                { name: "Alertas", path: "/monitoreo", icon: "/alert.png" },
                { name: "Guías y Procesos", path: "/guias", icon: "/guia.png" }
              ].map((item) => (
                <li key={item.path} className="flex">
                  {/* 2. REEMPLAZAMOS <a> POR <Link> */}
                  <Link 
                    href={item.path} 
                    className="flex items-center gap-2 pt-1 pb-2 text-xs font-bold text-gray-600 uppercase hover:text-[#ee3224] transition-colors border-b-2 border-transparent hover:border-[#ee3224] whitespace-nowrap"
                  >
                    <Image 
                      src={item.icon} 
                      alt="" 
                      width={36} 
                      height={36} 
                      className="w-9 h-9 object-contain block" 
                    />
                    <span className="leading-none pt-0.5">{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
