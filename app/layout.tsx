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
      <body className={`${montserrat.className} antialiased bg-[#f4f4f4] min-h-screen`}>
        <div className="p-8">
          <header className="mb-8 pb-4 border-b-4 border-[#ee3224] flex items-center gap-4">
            <Image src="/enmo.jpg" alt="Logo" width={80} height={80} className="object-contain" priority />
            <div>
              <h1 className="text-3xl font-bold text-[#ee3224]">Equipo Nacional de Monitoreo</h1>
              <p className="text-gray-500 text-sm mt-1">Panel de Monitoreo y Alertas</p>
            </div>
          </header>
          
          <nav className="mb-6 border-b border-gray-200 pb-2">
            <ul className="flex gap-6 text-sm font-medium">
              {[ {name: "Inicio", path: "/", icon: "/net.png"}, {name: "Monitoreo", path: "/monitoreo-guardia", icon: "/mt.png"}, {name: "Alertas", path: "/monitoreo", icon: "/alert.png"} ].map((item) => (
                <li key={item.path}>
                  <a href={item.path} className="flex items-center gap-1.5 px-3 py-1.5 rounded-md hover:bg-gray-200 transition-all text-xs font-bold text-gray-600 uppercase">
                    <Image src={item.icon} alt="" width={36} height={36} className="w-9 h-9 object-contain"/> {item.name}
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
