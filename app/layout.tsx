import Link from 'next/link';

export default function GCRLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#f4f4f4] font-sans">
      
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap lg:flex-nowrap items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <h1 className="text-sm font-black text-gray-900 tracking-tight uppercase">
              Google Crisis Response
            </h1>
          </div>

          <nav className="flex items-center gap-4 overflow-x-auto no-scrollbar w-full lg:w-auto justify-center">
            <span className="text-xs font-bold text-gray-400 uppercase">
              [Agregar información]
            </span>
          </nav>

        </div>
        
        <div className="bg-gray-50 border-t border-gray-100 px-4 py-2">
          <p className="max-w-7xl mx-auto text-xs text-gray-600">
            Sección destinada a consolidar alertas y herramientas de respuesta ante emergencias en Argentina para facilitar la visualización de incidentes y coordinar la asistencia.
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4">
        {children}
      </main>
      
    </div>
  );
}
