
import Link from 'next/link';

export default function MonitoreoLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#f4f4f4] font-sans">
      
      {/* HEADER PRINCIPAL */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <nav className="flex text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
              <Link href="/" className="hover:text-blue-600">Inicio</Link>
              <span className="mx-2">/</span>
              <span className="text-gray-600">Monitoreo y Guardias</span>
            </nav>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <h1 className="text-xl font-black text-gray-900 tracking-tight">ENMO | Centro de Monitoreo</h1>
            </div>
          </div>
          <div className="flex gap-4 text-xs font-bold text-blue-600">
            <a href="https://drive.google.com/drive/u/1/folders/1FqtyrYTwX_xIRbRSAFSGVl_zwi_gP_8h" target="_blank" rel="noreferrer">Matriz (MS)</a>
            <a href="https://forms.monday.com/forms/30abb0ab881b5ad9ed68a1113a38a13f?r=use1" target="_blank" rel="noreferrer">Reportar Evento</a>
          </div>
        </div>
      </header>

      {/* MENÚ DE TARJETAS FIJADO POR EL USUARIO */}
      <section className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="text-blue-600">🌍</span> MONITOREO
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link href="/monitoreo-guardias/meteorologia" className="block p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all group">
                <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">⛈️</div>
                <h4 className="font-bold text-gray-800 text-sm">Meteorología</h4>
                <p className="text-xs text-gray-500 mt-1">Alertas SMN, radares y reportes.</p>
              </Link>
              <Link href="/monitoreo-guardias/hidrologia" className="block p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all group">
                <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">🌊</div>
                <h4 className="font-bold text-gray-800 text-sm">Hidrología</h4>
                <p className="text-xs text-gray-500 mt-1">Niveles INA y predicción de inundaciones.</p>
              </Link>
              <Link href="/monitoreo-guardias/incendios" className="block p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all group">
                <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">🔥</div>
                <h4 className="font-bold text-gray-800 text-sm">Incendios</h4>
                <p className="text-xs text-gray-500 mt-1">Focos de calor y datos satelitales.</p>
              </Link>
              <Link href="/monitoreo-guardias/geofisica" className="block p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all group">
                <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">🌋</div>
                <h4 className="font-bold text-gray-800 text-sm">Geofísica</h4>
                <p className="text-xs text-gray-500 mt-1">Reportes sísmicos del INPRES.</p>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CONTENIDO DINÁMICO DE LAS SUB-PÁGINAS */}
      <main className="max-w-7xl mx-auto p-6">
        {children}
      </main>
      
    </div>
  );
}
