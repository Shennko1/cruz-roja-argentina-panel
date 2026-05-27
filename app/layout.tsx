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
          {/* Header con altura fija */}
          <header className="h-[100px] mb-8 pb-4 border-b-4 border-[#ee3224] flex items-center gap-4">
            <div className="relative w-[100px] h-[80px]">
              <Image src="/enmo.jpg" alt="Logo" fill className="object-contain" priority sizes="100px" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#ee3224]">Equipo Nacional de Monitoreo</h1>
              <p className="text-gray-500 text-sm mt-1 uppercase">Panel de Alerta y Monitoreo de Emergencias</p>
            </div>
          </header>

          {/* Menú fino y ajustado */}
          <nav className="mb-6 border-b border-gray-200">
            <ul className="flex gap-6">
              {[
                { name: "Inicio", path: "/", icon: "/net.png" },
                { name: "Monitoreo", path: "/monitoreo-guardia", icon: "/mt.png" },
                { name: "Alertas", path: "/monitoreo", icon: "/alert.png" },
                { name: "Guías", path: "/guias", icon: "/guia.png" }
              ].map((item) => (
                <li key={item.path}>
                  <a href={item.path} className="flex items-center gap-2 px-2 py-2 text-xs font-bold text-gray-600 uppercase hover:text-[#ee3224] transition-colors border-b-2 border-transparent hover:border-[#ee3224]">
                    <Image src={item.icon} alt="" width={20} height={20} className="w-5 h-5 object-contain" />
                    {item.name}
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
