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
          
          {/* 1. HEADER OPTIMIZADO: Altura reducida a 85px y medidas del logo 100% estáticas */}
          <header className="h-[85px] mb-6 pb-2 border-b-4 border-[#ee3224] flex items-center gap-4">
            
            {/* Contenedor estricto que bloquea a Flexbox */}
            <div className="relative w-[100px] h-[70px] flex-none">
              <Image 
                src="/enmo.jpg" 
                alt="Logo" 
                fill
                sizes="100px"
                className="object-contain" 
                priority 
              />
            </div>
            
            <div>
              <h1 className="text-3xl font-bold text-[#ee3224] leading-none">Equipo Nacional de Monitoreo</h1>
              <p className="text-gray-500 text-sm mt-1 uppercase tracking-wider">Panel de Alerta y Monitoreo de Emergencias</p>
            </div>
          </header>

          {/* 2. MENÚ AJUSTADO: Se eliminó el espacio muerto superior e inferior */}
          <nav className="mb-6 border-b border-gray-200">
            <ul className="flex gap-6">
              {[
                { name: "Inicio", path: "/", icon: "/net.png" },
                { name: "Monitoreo", path: "/monitoreo-guardia", icon: "/mt.png" },
                { name: "Alertas", path: "/monitoreo", icon: "/alert.png" },
                { name: "Guías y Procesos", path: "/guias", icon: "/guia.png" }
              ].map((item) => (
                <li key={item.path} className="flex">
                  <a 
                    href={item.path} 
                    className="flex items-center gap-2 pt-1 pb-2 text-xs font-bold text-gray-600 uppercase hover:text-[#ee3224] transition-colors border-b-2 border-transparent hover:border-[#ee3224] whitespace-nowrap"
                  >
                    {/* Icono al tamaño original (w-9 h-9) pero contenido estrictamente */}
                    <Image 
                      src={item.icon} 
                      alt="" 
                      width={36} 
                      height={36} 
                      className="w-9 h-9 object-contain block" 
                    />
                    {/* El texto ahora se alinea perfectamente al centro del icono */}
                    <span className="leading-none pt-0.5">{item.name}</span>
                  </a>
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
