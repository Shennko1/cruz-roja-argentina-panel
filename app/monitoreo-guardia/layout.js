import Link from 'next/link';

export default function MonitoreoLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#f4f4f4] font-sans">
      
      {/* HEADER COMPACTO PERO CON IDENTIDAD */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        {/* Cambiado a flex-col lg:flex-row para que en celu se apilen ordenadamente */}
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col lg:flex-row items-center justify-between gap-3 lg:gap-4">
          
          {/* Bloque superior en celular (Título + Enlaces Externos opcionales) */}
          <div className="flex items-center justify-between w-full lg:w-auto">
            {/* Identificador */}
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <h1 className="text-sm font-black text-gray-900 tracking-tight uppercase">Dashboard de Monitoreo</h1>
            </div>
            
            {/* Enlaces Externos en Celular (Se ocultan en PC para mostrarlos a la derecha del todo) */}
            <div className="flex lg:hidden gap-3 text-[10px] sm:text-xs font-bold uppercase">
              <a href="https://drive.google.com/drive/u/1/folders/1FqtyrYTwX_xIRbRSAFSGVl_zwi_gP_8h" target="_blank" rel="noreferrer" className="text-blue-600 hover:text-blue-800 transition-colors">Matriz MS</a>
              <a href="https://forms.monday.com/forms/30abb0ab881b5ad9ed68a1113a38a13f?r=use1" target="_blank" rel="noreferrer" className="text-red-600 hover:text-red-800 transition-colors">Reportar</a>
            </div>
          </div>

          {/* Navegación (Ajustada para deslizar fluido en celulares) */}
          <nav className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full lg:w-auto justify-start lg:justify-center pb-2 lg:pb-0">
            <Link href="/monitoreo-guardia/meteorologia" className="flex items-center gap-1.5 px-2 py-1.5 rounded-md hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all text-[11px] lg:text-xs font-bold text-gray-600 uppercase whitespace-nowrap">
             <img src="/storm.png" alt="Ícono Lluvia" className="w-4 h-4 lg:w-5 lg:h-5 object-contain" /> Hidrometeorología
            </Link>
            
            <Link href="/monitoreo-guardia/incendios" className="flex items-center gap-1.5 px-2 py-1.5 rounded-md hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all text-[11px] lg:text-xs font-bold text-gray-600 uppercase whitespace-nowrap">
              <img src="/fire.png" alt="Ícono Incendios" className="w-4 h-4 lg:w-5 lg:h-5 object-contain" /> Incendios
            </Link>
            
            <Link href="/monitoreo-guardia/geofisica" className="flex items-center gap-1.5 px-2 py-1.5 rounded-md hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all text-[11px] lg:text-xs font-bold text-gray-600 uppercase whitespace-nowrap">
             <img src="/geo.png" alt="Ícono Geofísica" className="w-4 h-4 lg:w-5 lg:h-5 object-contain" /> Geofísica
            </Link>
            
             <Link href="/monitoreo-guardia/tension" className="flex items-center gap-1.5 px-2 py-1.5 rounded-md hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all text-[11px] lg:text-xs font-bold text-gray-600 uppercase whitespace-nowrap">
             <img src="/soc.png" alt="Ícono Tension Social" className="w-4 h-4 lg:w-5 lg:h-5 object-contain" /> Tensión Social
            </Link>
            
             <Link href="/monitoreo-guardia/epidemias" className="flex items-center gap-1.5 px-2 py-1.5 rounded-md hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all text-[11px] lg:text-xs font-bold text-gray-600 uppercase whitespace-nowrap">
             <img src="/epi.png" alt="Ícono Epidemiologías" className="w-4 h-4 lg:w-5 lg:h-5 object-contain" /> Epidemiologías
            </Link>
          </nav>

          {/* Enlaces Externos (Versión PC) */}
          <div className="hidden lg:flex gap-3 text-xs font-bold uppercase border-l pl-3 border-gray-200 shrink-0">
            <a href="https://drive.google.com/drive/u/1/folders/1FqtyrYTwX_xIRbRSAFSGVl_zwi_gP_8h" target="_blank" rel="noreferrer" className="text-blue-600 hover:text-blue-800 transition-colors">Matriz MS</a>
            <a href="https://forms.monday.com/forms/30abb0ab881b5ad9ed68a1113a38a13f?r=use1" target="_blank" rel="noreferrer" className="text-red-600 hover:text-red-800 transition-colors">Reportar</a>
          </div>

        </div>
      </header>

      {/* ÁREA DE CONTENIDO */}
      <main className="max-w-7xl mx-auto p-3 sm:p-4">
        {children}
      </main>
      
    </div>
  );
}
