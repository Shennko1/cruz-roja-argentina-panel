import React from 'react';
import Link from 'next/link';

export default function MonitoreoGuardiasPage() {
  return (
    <div className="space-y-8 max-w-6xl mx-auto p-4 font-sans">
      
      {/* Encabezado */}
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-3xl font-bold text-gray-800">Monitoreo y Guardias</h2>
        <p className="text-gray-600 text-sm mt-1">
          Accesos rápidos, visores de contingencias y lineamientos operativos.
        </p>
      </div>

      {/* SECCIÓN 1: Enlaces y Dashboards Operativos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <a 
          href="https://drive.google.com/drive/u/1/folders/1FqtyrYTwX_xIRbRSAFSGVl_zwi_gP_8h" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow hover:border-blue-300"
        >
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 text-xl mr-4">
            📊
          </div>
          <div>
            <h3 className="font-bold text-gray-800 text-sm">Matriz de Seguimiento (MS)</h3>
            <p className="text-xs text-gray-500">Eventos abiertos y actualizaciones</p>
          </div>
        </a>

        <a 
          href="https://forms.monday.com/forms/30abb0ab881b5ad9ed68a1113a38a13f?r=use1" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow hover:border-red-300"
        >
          <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-600 text-xl mr-4">
            🚨
          </div>
          <div>
            <h3 className="font-bold text-gray-800 text-sm">Reportar un evento</h3>
            <p className="text-xs text-gray-500">Para casos que requieran monitoreo</p>
          </div>
        </a>

        <a 
          href="#" 
          className="flex items-center p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow hover:border-emerald-300"
        >
          <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 text-xl mr-4">
            📝
          </div>
          <div>
            <h3 className="font-bold text-gray-800 text-sm">Registro de Guardia</h3>
            <p className="text-xs text-gray-500">Formulario de monitoreo y Check</p>
          </div>
        </a>
      </div>

      {/* SECCIÓN 2: Hub de Monitoreo por Evento (NUEVO) */}
      <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span className="text-blue-600">🌍</span> Visores de Contingencias
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <Link href="/monitoreo-guardias/meteorologia" className="block p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all group">
            <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">⛈️</div>
            <h4 className="font-bold text-gray-800 text-sm">Meteorología</h4>
            <p className="text-xs text-gray-500 mt-1">Alertas SMN y radares en vivo.</p>
          </Link>

          <Link href="/monitoreo-guardias/hidrologia" className="block p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all group">
            <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">🌊</div>
            <h4 className="font-bold text-gray-800 text-sm">Hidrología</h4>
            <p className="text-xs text-gray-500 mt-1">Niveles INA y predictivo Flood Hub.</p>
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

      <hr className="border-gray-200" />

      {/* SECCIÓN 3: Protocolo Operativo */}
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
          <span className="text-blue-600">📋</span> Guía Práctica de Guardia
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h4 className="font-bold text-gray-800 mb-4 border-b pb-2">1. Al arrancar el turno</h4>
            <ul className="space-y-3 text-sm text-gray-700">
              <li>• Revisá el calendario para ver si hay seguimientos activos.</li>
              <li>• Conectate a los canales: WhatsApp, Monday, Sitio ENMO y correo.</li>
              <li>• Pegale una mirada a la Matriz de Seguimiento (MS) para ver qué quedó abierto.</li>
              <li>• Si retomás un evento, leé el último Informe de Situación (IDS).</li>
              <li>• Avisá por el Chat ENMO que entrás a la guardia y quién te acompaña.</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h4 className="font-bold text-gray-800 mb-4 border-b pb-2">2. Durante la guardia</h4>
            <ul className="space-y-3 text-sm text-gray-700">
              <li>• Hacé un paneo de medios, redes y alertas oficiales cada 20 o 30 minutos.</li>
              <li>• Mantené la MS y las carpetas al día (ojo con no duplicar información).</li>
              <li>• Si surge algo importante, avisalo en el momento, no esperes al cierre.</li>
              <li>• Cargá el formulario de monitoreos y anotate en el Check de guardias.</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h4 className="font-bold text-gray-800 mb-4 border-b pb-2">3. Detección de una noticia/evento</h4>
            <ul className="space-y-3 text-sm text-gray-700">
              <li>• Validá siempre con fuentes oficiales (SMN, INPRES, Defensa Civil).</li>
              <li>• Anotá lo básico: Qué pasó, Dónde, Cuándo, Impactos preliminares y la Fuente.</li>
              <li>• Evaluá si la severidad da para activar un seguimiento.</li>
              <li>• Pasalo por el Chat ENMO usando el formato estándar.</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h4 className="font-bold text-gray-800 mb-4 border-b pb-2">4. Pase y cierre de guardia</h4>
            <ul className="space-y-3 text-sm text-gray-700">
              <li>• Asegurate de que todo haya quedado en la carpeta y en la MS.</li>
              <li>• Dejá el pase por escrito en el Chat ENMO (eventos en curso, alertas vigentes y recomendaciones).</li>
              <li>• Si hay seguimientos muy críticos, dejalo bien aclarado en el chat.</li>
              <li>• Cerrá sesión en las herramientas internas (MS, Drive, etc.).</li>
            </ul>
          </div>

        </div>
      </div>
      
    </div>
  );
}
