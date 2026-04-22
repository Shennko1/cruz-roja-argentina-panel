import Link from 'next/link';

export default function MonitoreoLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#f4f4f4] font-sans">
      
      {/* HEADER COMPACTO PERO CON IDENTIDAD */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-2 flex flex-wrap lg:flex-nowrap items-center justify-between gap-4">
          
          {/* Identificador */}
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <h1 className="text-sm font-black text-gray-900 tracking-tight uppercase">ENMO Operaciones</h1>
          </div>

          {/* Navegación con Emojis (En una sola línea) */}
          <nav className="flex items-center gap-1 overflow-x-auto no-scrollbar w-full lg:w-auto justify-center">
            <Link href="/monitoreo-guardia/meteorologia" className="flex items-center gap-1.5 px-3 py-1.5 rounded-md hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all text-xs font-bold text-gray-600 uppercase whitespace-nowrap">
              <img src="/weather.png" alt="Meteorología" className="h-4 w-4" /> Meteorología
            </Link>
            <Link href="/monitoreo-guardia/hidrologia" className="flex items-center gap-1.5 px-3 py-1.5 rounded-md hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all text-xs font-bold text-gray-600 uppercase whitespace-nowrap">
              <span>🌊</span> Hidrología
            </Link>
            <Link href="/monitoreo-guardia/incendios" className="flex items-center gap-1.5 px-3 py-1.5 rounded-md hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all text-xs font-bold text-gray-600 uppercase whitespace-nowrap">
              <span>🔥</span> Incendios
            </Link>
            <Link href="/monitoreo-guardia/geofisica" className="flex items-center gap-1.5 px-3 py-1.5 rounded-md hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all text-xs font-bold text-gray-600 uppercase whitespace-nowrap">
              <span>🌋</span> Geofísica
            </Link>
            <Link href="/monitoreo-guardia/redes" className="flex items-center gap-1.5 px-3 py-1.5 rounded-md hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all text-xs font-bold text-gray-600 uppercase whitespace-nowrap">
              <span>📡</span> Redes
            </Link>
          </nav>

          {/* Enlaces Externos */}
          <div className="flex gap-4 text-xs font-bold uppercase lg:border-l lg:pl-4 border-gray-100">
            <a href="https://drive.google.com/drive/u/1/folders/1FqtyrYTwX_xIRbRSAFSGVl_zwi_gP_8h" target="_blank" rel="noreferrer" className="text-blue-600 hover:text-blue-800">Matriz MS</a>
            <a href="https://forms.monday.com/forms/30abb0ab881b5ad9ed68a1113a38a13f?r=use1" target="_blank" rel="noreferrer" className="text-red-600 hover:text-red-800">Reportar</a>
          </div>

        </div>
      </header>

      {/* ÁREA DE CONTENIDO */}
      <main className="max-w-7xl mx-auto p-4">
        {children}
      </main>
      
    </div>
  );
}
