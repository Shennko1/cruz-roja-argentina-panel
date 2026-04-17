import Link from 'next/link';

export default function MonitoreoLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#fafafa] font-sans">
      
      {/* HEADER ULTRA MINIMALISTA (BORRADOR) */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 px-4 py-1">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Identificador simple */}
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
              ENMO / GUARDIA [DRAFT]
            </span>
            
            {/* Navegación compacta */}
            <nav className="flex gap-2 border-l border-gray-100 pl-4">
              {[
                { name: 'MET', path: 'meteorologia' },
                { name: 'HID', path: 'hidrologia' },
                { name: 'INC', path: 'incendios' },
                { name: 'GEO', path: 'geofisica' },
                { name: 'RED', path: 'redes' }
              ].map((item) => (
                <Link 
                  key={item.path}
                  href={`/monitoreo-guardia/${item.path}`} 
                  className="text-[9px] font-bold text-gray-500 hover:text-blue-600 px-2 py-0.5 rounded border border-transparent hover:border-gray-200 transition-all uppercase"
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Enlaces externos mínimos */}
          <div className="flex gap-3 text-[9px] font-bold uppercase">
            <a href="https://drive.google.com/..." target="_blank" className="text-gray-400 hover:text-blue-500">Matriz</a>
            <a href="https://forms.monday.com/..." target="_blank" className="text-gray-400 hover:text-red-500">Reportar</a>
          </div>
          
        </div>
      </header>

      {/* ÁREA DE CONTENIDO */}
      <main className="max-w-7xl mx-auto p-2">
        {children}
      </main>
      
    </div>
  );
}
