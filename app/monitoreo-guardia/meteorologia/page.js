import React from 'react';

export default function HidrometeorologiaPage() {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm font-sans">
      
      {/* CABECERA */}
      <div className="border-b border-gray-200 pb-3 mb-4 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">
          Monitoreo: Hidrometeorología
        </h2>
        <span className="text-xs font-medium bg-blue-50 text-blue-600 px-3 py-1 rounded-full border border-blue-100">
          En vivo
        </span>
      </div>
      
      {/* AREA DE TRABAJO (Blank State) */}
      <div className="bg-gray-50 p-4 rounded-lg border border-dashed border-gray-300 text-sm text-gray-500 mb-8">
        Agregar información.
      </div>

      {/* 1. RADAR METEOROLÓGICO (Windy) */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-1">
          <span className="text-lg">🌧️</span>
          <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">1. Mapa de lluvia en tiempo real</h3>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Guía de Uso Lateral */}
          <div className="lg:col-span-1 bg-gray-50 p-4 rounded-xl border border-gray-200 flex flex-col justify-between shadow-sm">
            <div>
              <h4 className="text-xs font-bold text-gray-600 mb-3 uppercase">Guía rápida</h4>
              <ul className="text-[12px] text-gray-500 space-y-3">
                <li className="flex gap-2">
                  <span className="text-blue-500 font-bold">•</span>
                  <span><strong>Capa activa:</strong> Lluvia y truenos (automático).</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-500 font-bold">•</span>
                  <span><strong>Colores:</strong> Intensidad de precipitación (Amarillo/Rojo = Fuerte).</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-500 font-bold">•</span>
                  <span><strong>Previsión:</strong> Usar la barra inferior para ver evolución.</span>
                </li>
              </ul>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-200">
              <a 
                href="https://www.youtube.com/watch?v=RhNgxywKjw4" 
                target="_blank" 
                rel="noreferrer" 
                className="text-[11px] text-blue-600 hover:underline flex items-center gap-1 font-bold"
              >
                Tutorial de herramientas ↗
              </a>
            </div>
          </div>

          {/* Mapa Windy */}
          <div className="lg:col-span-3 rounded-xl overflow-hidden border border-gray-300 shadow-md bg-gray-100 h-[500px]">
            <iframe
              width="100%"
              height="100%"
              src="https://embed.windy.com/embed2.html?lat=-38.416&lon=-63.617&zoom=4&level=surface&overlay=rain&product=ecmwf&menu=&message=&marker=&calendar=now&pressure=&type=map&location=coordinates&detail=&metricWind=km%2Fh&metricTemp=%C2%B0C&radarRange=-1"
              frameBorder="0"
              title="Windy Radar"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>

      {/* 2. RIESGO HÍDRICO (FloodHub / Niveles) */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-1">
          <span className="text-lg">🌊</span>
          <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">2. Riesgo Hídrico y Condiciones del Suelo</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 h-40 rounded-xl border border-dashed border-gray-300 flex items-center justify-center text-sm text-gray-400">
            [Módulo FloodHub - Pronóstico de Inundaciones]
          </div>
          <div className="bg-gray-50 h-40 rounded-xl border border-dashed border-gray-300 flex items-center justify-center text-sm text-gray-400">
            [Niveles de Ríos y Humedad del Suelo]
          </div>
        </div>
      </div>

      {/* 3. REPORTES EN TIEMPO REAL (Feeds) */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-1">
          <span className="text-lg">📱</span>
          <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">3. Reportes en Tiempo Real (Redes Sociales)</h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {/* Feed SMN */}
          <div className="bg-white p-1 rounded-xl border border-gray-200 shadow-sm overflow-hidden h-[510px]">
            <iframe 
              src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2FSMN.ar&tabs=timeline&width=340&height=500&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=false&appId" 
              width="100%" height="500" style={{ border: 'none', overflow: 'hidden' }} scrolling="no" frameBorder="0" allowFullScreen={true}>
            </iframe>
          </div>

          {/* Feed Tiempo en Argentina */}
          <div className="bg-white p-1 rounded-xl border border-gray-200 shadow-sm overflow-hidden h-[510px]">
            <iframe 
              src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2FTiempoenArg&tabs=timeline&width=340&height=500&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=false&appId" 
              width="100%" height="500" style={{ border: 'none', overflow: 'hidden' }} scrolling="no" frameBorder="0" allowFullScreen={true}>
            </iframe>
          </div>

          {/* Feed METRA */}
          <div className="bg-white p-1 rounded-xl border border-gray-200 shadow-sm overflow-hidden h-[510px]">
            <iframe 
              src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2FMETRArgentina&tabs=timeline&width=340&height=500&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=false&appId" 
              width="100%" height="500" style={{ border: 'none', overflow: 'hidden' }} scrolling="no" frameBorder="0" allowFullScreen={true}>
            </iframe>
          </div>

          {/* Feed Pronóstico Extendido */}
          <div className="bg-white p-1 rounded-xl border border-gray-200 shadow-sm overflow-hidden h-[510px]">
            <iframe 
              src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fpronosticoextendido&tabs=timeline&width=340&height=500&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=false&appId" 
              width="100%" height="500" style={{ border: 'none', overflow: 'hidden' }} scrolling="no" frameBorder="0" allowFullScreen={true}>
            </iframe>
          </div>
        </div>
      </div>

      {/* 4. NOTICIAS (Google News) */}
      <div>
        <div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-1">
          <span className="text-lg">📰</span>
          <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">4. Noticias y Búsqueda</h3>
        </div>
        <div className="bg-gray-50 p-10 rounded-xl border border-dashed border-gray-300 text-center text-sm text-gray-500">
          [Integración de Google News con consultas de inundaciones/tormentas]
        </div>
      </div>
      
    </div>
  );
}
