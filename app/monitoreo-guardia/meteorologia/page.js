"use client";
import React, { useState } from 'react';

export default function HidrometeorologiaPage() {
  const [isRiesgoOpen, setIsRiesgoOpen] = useState(false);
  const [isRedesOpen, setIsRedesOpen] = useState(false);
  const [isNoticiasOpen, setIsNoticiasOpen] = useState(false);

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

      {/* MAPA METEOROLÓGICO (Windy) - Siempre visible */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4 border-b border-gray-100 pb-2">
          <img src="/storm.png" alt="Ícono Lluvia" className="w-9 h-9 object-contain" />
          <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Mapa de lluvia en tiempo real</h3>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 bg-gray-50 p-4 rounded-xl border border-gray-200 flex flex-col justify-between shadow-sm">
            <div>
              <h4 className="text-xs font-bold text-gray-600 mb-3 uppercase">¿Para qué sirve este mapa?</h4>
              <p className="text-[12px] text-gray-600 mb-4 leading-relaxed">
                Muestra dónde está lloviendo ahora mismo y hacia dónde se mueven las tormentas. Úsalo para ver rápido si una zona está siendo afectada.
              </p>
              <ul className="text-[12px] text-gray-500 space-y-3">
                <li className="flex gap-2">
                  <span className="text-blue-500 font-bold">•</span>
                  <span><strong>Colores:</strong> Indican qué tan fuerte llueve. Si ves amarillo o rojo, es tormenta fuerte.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-500 font-bold">•</span>
                  <span><strong>Evolución:</strong> Toca la línea de tiempo abajo para ver el pronóstico de las próximas horas.</span>
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
                Ver tutorial del mapa ↗
              </a>
            </div>
          </div>

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

      {/* RIESGO HÍDRICO (Launchers) - Desplegable */}
      <div className="mb-6 border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <button 
          onClick={() => setIsRiesgoOpen(!isRiesgoOpen)}
          className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center gap-3">
            <img src="/floods.png" alt="Ícono Riesgo Hídrico" className="w-9 h-9 object-contain" />
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Riesgo Hídrico y Estado de los Ríos</h3>
          </div>
          <svg className={`w-5 h-5 text-gray-500 transition-transform ${isRiesgoOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {isRiesgoOpen && (
          <div className="p-4 border-t border-gray-200 bg-white grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 flex flex-col justify-between shadow-sm min-h-[220px]">
              <div>
                <h4 className="text-sm font-bold text-gray-800 mb-2">Google FloodHub</h4>
                <p className="text-[12px] text-gray-600 leading-relaxed mb-2">
                  <strong>Qué vas a encontrar:</strong> Un mapa global que marca específicamente las zonas con peligro de inundación.
                </p>
                <p className="text-[12px] text-gray-600 leading-relaxed">
                  <strong>Para qué usarlo:</strong> Al hacer clic, te lleva a la plataforma para ver si hay pronósticos de desbordes en los próximos días y analizar qué áreas podrían verse afectadas.
                </p>
              </div>
              <a 
                href="https://sites.research.google/floods/l/-36.03176295791796/-60.050830721829755/4.465513712098249/p/ChIJZ8b99fXKvJURqA_wKpl3Lz0" 
                target="_blank" 
                rel="noreferrer"
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 px-6 rounded-lg transition-colors text-center mt-4 block"
              >
                Abrir FloodHub ↗
              </a>
            </div>

            <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 flex flex-col justify-between shadow-sm min-h-[220px]">
              <div>
                <h4 className="text-sm font-bold text-gray-800 mb-2">Niveles de Ríos (Prefectura)</h4>
                <p className="text-[12px] text-gray-600 leading-relaxed mb-2">
                  <strong>Qué vas a encontrar:</strong> El mapa interactivo oficial con las mediciones reales de todos los puertos del país.
                </p>
                <p className="text-[12px] text-gray-600 leading-relaxed">
                  <strong>Para qué usarlo:</strong> Haz clic para confirmar datos fácticos. Te sirve para ver la altura exacta del agua hoy y saber si el río está creciendo, bajando o estacionado.
                </p>
              </div>
              <a 
                href="https://contenidosweb.prefecturanaval.gob.ar/alturas/mapa.php" 
                target="_blank" 
                rel="noreferrer"
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 px-6 rounded-lg transition-colors text-center mt-4 block"
              >
                Abrir Mapa de Prefectura ↗
              </a>
            </div>

          </div>
        )}
      </div>

      {/* REPORTES EN TIEMPO REAL (Feeds) - Desplegable */}
      <div className="mb-6 border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <button 
          onClick={() => setIsRedesOpen(!isRedesOpen)}
          className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center gap-3">
            <img src="/media.png" alt="Ícono Redes Sociales" className="w-9 h-9 object-contain" />
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Redes Sociales (Muros de Facebook)</h3>
          </div>
          <svg className={`w-5 h-5 text-gray-500 transition-transform ${isRedesOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {isRedesOpen && (
          <div className="p-4 border-t border-gray-200 bg-white grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <div className="bg-white p-1 rounded-xl border border-gray-200 shadow-sm overflow-hidden h-[510px]">
              <iframe 
                src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2FSMN.ar&tabs=timeline&width=340&height=500&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=false&appId" 
                width="100%" height="500" style={{ border: 'none', overflow: 'hidden' }} scrolling="no" frameBorder="0" allowFullScreen={true}>
              </iframe>
            </div>

            <div className="bg-white p-1 rounded-xl border border-gray-200 shadow-sm overflow-hidden h-[510px]">
              <iframe 
                src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2FTiempoenArg&tabs=timeline&width=340&height=500&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=false&appId" 
                width="100%" height="500" style={{ border: 'none', overflow: 'hidden' }} scrolling="no" frameBorder="0" allowFullScreen={true}>
              </iframe>
            </div>

            <div className="bg-white p-1 rounded-xl border border-gray-200 shadow-sm overflow-hidden h-[510px]">
              <iframe 
                src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2FMETRArgentina&tabs=timeline&width=340&height=500&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=false&appId" 
                width="100%" height="500" style={{ border: 'none', overflow: 'hidden' }} scrolling="no" frameBorder="0" allowFullScreen={true}>
              </iframe>
            </div>

            <div className="bg-white p-1 rounded-xl border border-gray-200 shadow-sm overflow-hidden h-[510px]">
              <iframe 
                src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fpronosticoextendido&tabs=timeline&width=340&height=500&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=false&appId" 
                width="100%" height="500" style={{ border: 'none', overflow: 'hidden' }} scrolling="no" frameBorder="0" allowFullScreen={true}>
              </iframe>
            </div>
          </div>
        )}
      </div>

      {/* NOTICIAS (Google News Launchers) - Desplegable */}
      <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <button 
          onClick={() => setIsNoticiasOpen(!isNoticiasOpen)}
          className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center gap-3">
            <img src="/news.png" alt="Ícono Noticias" className="w-9 h-9 object-contain" />
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Buscar en Noticias (Últimas 24h)</h3>
          </div>
          <svg className={`w-5 h-5 text-gray-500 transition-transform ${isNoticiasOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {isNoticiasOpen && (
          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-sm">
              
              <div className="mb-5 pb-4 border-b border-gray-200">
                <h4 className="text-xs font-bold text-gray-800 mb-2 uppercase">¿Para qué usar estos botones?</h4>
                <p className="text-[12px] text-gray-600 leading-relaxed">
                  Cada botón abre una pestaña nueva en Google News ya configurada para buscar solo en Argentina y solo noticias publicadas en las últimas 24 horas. Son un atajo. Úsalos para rastrear rápido qué está pasando en los medios, confirmar si hay evacuados, o ver los daños de un evento sin tener que escribir la búsqueda a mano.
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <a 
                  href="https://news.google.com/search?q=(tormenta%20OR%20tormentas%20OR%20temporal)%20Argentina%20when%3A24h&hl=es-419&gl=AR&ceid=AR%3Aes-419" 
                  target="_blank" 
                  rel="noreferrer"
                  className="bg-white border border-gray-300 hover:border-blue-400 hover:text-blue-600 text-gray-700 text-xs font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center shadow-sm"
                >
                  Ver noticias de Tormentas
                </a>

                <a 
                  href="https://news.google.com/search?q=(inundacion%20OR%20inundaciones%20OR%20crecida%20OR%20desborde)%20Argentina%20when%3A24h&hl=es-419&gl=AR&ceid=AR%3Aes-419" 
                  target="_blank" 
                  rel="noreferrer"
                  className="bg-white border border-gray-300 hover:border-blue-400 hover:text-blue-600 text-gray-700 text-xs font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center shadow-sm"
                >
                  Ver noticias de Inundaciones
                </a>

                <a 
                  href="https://news.google.com/search?q=(evacuados%20OR%20anegamientos%20OR%20da%C3%B1os)%20Argentina%20when%3A24h&hl=es-419&gl=AR&ceid=AR%3Aes-419" 
                  target="_blank" 
                  rel="noreferrer"
                  className="bg-white border border-gray-300 hover:border-blue-400 hover:text-blue-600 text-gray-700 text-xs font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center shadow-sm"
                >
                  Ver reportes de Daños y Evacuados
                </a>
              </div>

            </div>
          </div>
        )}
      </div>
      
    </div>
  );
}
