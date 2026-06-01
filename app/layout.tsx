import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
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
        {/* Redujimos el padding en celulares para ganar espacio útil */}
        <div className="max-w-7xl mx-auto p-4 sm:p-8">
          
          {/* HEADER: Ajuste dinámico de textos y tamaño de logo */}
          <header className="min-h-[85px] mb-5 sm:mb-6 pb-3 border-b-4 border-[#ee3224] flex items-center gap-3 sm:gap-4">
            <img 
              src="/enmo.jpg" 
              alt="Logo" 
              className="w-[70px] min-w-[70px] h-auto sm:w-[100px] sm:min-w-[100px] sm:h-[70px] object-contain shrink-0"
            />
            <div>
              <h1 className="text-xl sm:text-3xl font-bold text-[#ee3224] leading-tight sm:leading-none">
                Equipo Nacional de Monitoreo
              </h1>
              <p className="text-gray-500 text-[10px] sm:text-sm mt-1 sm:mt-1.5 uppercase tracking-wider">
                Panel de Alerta y Monitoreo de Emergencias
              </p>
            </div>
          </header>

          {/* MENÚ: Agregamos scroll horizontal oculto para la versión mobile */}
          <nav className="mb-6 border-b border-gray-200">
            <ul className="flex gap-3 sm:gap-6 overflow-x-auto no-scrollbar pb-1">
              {[
                { name: "Inicio", path: "/", icon: "/net.png" },
                { name: "Monitoreo", path: "/monitoreo-guardia", icon: "/mt.png" },
                { name: "Alertas", path: "/monitoreo", icon: "/alert.png" },
                { name: "Guías y Procesos", path: "/guias", icon: "/guia.png" }
              ].map((item) => (
                <li key={item.path} className="flex shrink-0">
                  <Link 
                    href={item.path} 
                    className="flex items-center gap-1.5 sm:gap-2 pt-1 pb-2 px-1 sm:px-0 text-[11px] sm:text-xs font-bold text-gray-600 uppercase hover:text-[#ee3224] transition-colors border-b-2 border-transparent hover:border-[#ee3224] whitespace-nowrap"
                  >
                    <Image 
                      src={item.icon} 
                      alt="" 
                      width={36} 
                      height={36} 
                      className="w-7 h-7 sm:w-9 sm:h-9 object-contain block" 
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
