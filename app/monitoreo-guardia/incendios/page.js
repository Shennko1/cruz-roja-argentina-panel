"use client";
import React, { useState } from "react";

export default function IncendiosPage() {
  const [isFocosOpen, setIsFocosOpen] = useState(false);
  const [isRedesOpen, setIsRedesOpen] = useState(false);
  const [isNoticiasOpen, setIsNoticiasOpen] = useState(false);

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm font-sans">
      
      {/* CABECERA */}
      <div className="border-b border-gray-200 pb-3 mb-4 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">
          Monitoreo: Incendios y Focos de Calor
        </h2>
        <span className="text-xs font-medium bg-red-50 text-red-600 px-3 py-1 rounded-full border border-red-100">
          En vivo
        </span>
      </div>

      {/* AREA DE TRABAJO (Blank State) */}
      <div className="bg-gray-50 p-4 rounded-lg border border-dashed border-gray-300 text-sm text-gray-500 mb-8">
        Agregar información.
      </div>

      {/* 1. MAPA DE FOCOS ACTIVOS (CONICET) - Siempre visible */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4 border-b border-gray-100 pb-2">
          <img src="/fire.png" alt="Ícono Fuego" className="w-9 h-9 object-contain" />
          <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
            Mapa de Focos Activos (CONICET)
          </h3>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 bg-gray-50 p-4 rounded-xl border border-gray-200 flex flex-col justify-between shadow-sm">
            <div>
              <h4 className="text-xs font-bold text-gray-600 mb-3 uppercase">
                ¿Para qué sirve este mapa?
              </h4>
              <p className="text-[12px] text-gray-600 mb-4 leading-relaxed">
                Plataforma oficial desarrollada por investigadores del CONICET (IANIGLA). Permite a los voluntarios corroborar datos con información satelital procesada localmente en Argentina.
              </p>
              <ul className="text-[12px] text-gray-500 space-y-3">
                <li className="flex gap-2">
                  <span className="text-red-500 font-bold">•</span>
                  <span><strong>Focos:</strong> Muestra anomalías térmicas recientes detectadas sobre el territorio nacional.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-red-500 font-bold">•</span>
                  <span><strong>Validación:</strong> Ideal para cruzar con reportes de humo o denuncias ciudadanas.</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="lg:col-span-3 rounded-xl overflow-hidden border border-gray-300 shadow-md bg-gray-100 h-[500px]">
            <iframe 
              width="100%" 
              height="100%" 
              src="https://ianigla.net/focos/mapa_nacional.php" 
              frameBorder="0" 
              title="Mapa Focos CONICET" 
              allowFullScreen>
            </iframe>
          </div>
        </div>
      </div>

      {/* 2. RESPALDO Y RIESGO (Launchers) - Desplegable */}
      <div className="mb-6 border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <button onClick={() => setIsFocosOpen(!isFocosOpen)} className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
          <div className="flex items-center gap-3">
            <img src="/smoke.png" alt="Ícono Respaldo" className="w-9 h-9 object-contain" />
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
              Respaldo Satelital y Riesgo
            </h3>
          </div>
          <svg className={`w-5 h-5 text-gray-500 transition-transform ${isFocosOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {isFocosOpen && (
          <div className="p-4 border-t border-gray-200 bg-white grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Launcher 1: PyroGuard */}
            <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 flex flex-col justify-between shadow-sm min-h-[220px]">
              <div>
                <h4 className="text-sm font-bold text-gray-800 mb-2">PyroGuard (Mapa Ágil)</h4>
                <p className="text-[12px] text-gray-600 leading-relaxed mb-2"><strong>Qué vas a encontrar:</strong> Interfaz rápida y visual de los focos de calor recientes.</p>
                <p className="text-[12px] text-gray-600 leading-relaxed"><strong>Para qué usarlo:</strong> Como alternativa ágil si el mapa oficial de CONICET presenta demoras en la carga.</p>
              </div>
              <a href="https://pyroguardapp.com/mapa" target="_blank" rel="noreferrer" className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2 px-6 rounded-lg transition-colors text-center mt-4 block">Abrir PyroGuard ↗</a>
            </div>

            {/* Launcher 2: GFW (Respaldo NASA) */}
            <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 flex flex-col justify-between shadow-sm min-h-[220px]">
              <div>
                <h4 className="text-sm font-bold text-gray-800 mb-2">Global Forest Watch</h4>
                <p className="text-[12px] text-gray-600 leading-relaxed mb-2"><strong>Qué vas a encontrar:</strong> Lectura directa de los satélites VIIRS/MODIS de la NASA montada sobre un mapa limpio.</p>
                <p className="text-[12px] text-gray-600 leading-relaxed"><strong>Para qué usarlo:</strong> Si hay dudas técnicas sobre una coordenada, este visor es el estándar global fáctico.</p>
              </div>
              <a href="https://www.globalforestwatch.org/map/?active_category=fires" target="_blank" rel="noreferrer" className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2 px-6 rounded-lg transition-colors text-center mt-4 block">Abrir GFW Focos ↗</a>
            </div>

            {/* Launcher 3: SNMF */}
            <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 flex flex-col justify-between shadow-sm min-h-[220px]">
              <div>
                <h4 className="text-sm font-bold text-gray-800 mb-2">Riesgo de Incendios (SNMF)</h4>
                <p className="text-[12px] text-gray-600 leading-relaxed mb-2"><strong>Qué vas a encontrar:</strong> Mapas oficiales de Argentina con el índice de peligro de propagación de fuego.</p>
                <p className="text-[12px] text-gray-600 leading-relaxed"><strong>Para qué usarlo:</strong> Para anticiparse. Si surge un foco en una zona marcada en "Riesgo Extremo", la alerta debe ser inmediata.</p>
              </div>
              <a href="https://www.argentina.gob.ar/ambiente/fuego/evaluacion-de-peligro" target="_blank" rel="noreferrer" className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2 px-6 rounded-lg transition-colors text-center mt-4 block">Abrir Mapa SNMF ↗</a>
            </div>

          </div>
        )}
      </div>

      {/* 3. REPORTES EN TIEMPO REAL (Feeds) - Desplegable */}
      <div className="mb-6 border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <button onClick={() => setIsRedesOpen(!isRedesOpen)} className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
          <div className="flex items-center gap-3">
            <img src="/media.png" alt="Ícono Redes Sociales" className="w-9 h-9 object-contain" />
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
              Redes Sociales (Manejo del Fuego)
            </h3>
          </div>
          <svg className={`w-5 h-5 text-gray-500 transition-transform ${isRedesOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {isRedesOpen && (
          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="mb-2">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                <div className="bg-white p-1 rounded-xl border border-gray-200 shadow-sm flex justify-center bg-gray-50 overflow-hidden h-[510px]">
                  <iframe src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fsplifrn&tabs=timeline&width=340&height=500&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=false&appId" width="100%" height="500" style={{ border: "none", overflow: "hidden" }} scrolling="no" frameBorder="0" allowFullScreen={true}></iframe>
                </div>

                <div className="bg-white p-1 rounded-xl border border-gray-200 shadow-sm flex justify-center bg-gray-50 overflow-hidden h-[510px]">
                  <iframe src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fprofile.php%3Fid%3D100067032056115&tabs=timeline&width=340&height=500&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=false&appId" width="100%" height="500" style={{ border: "none", overflow: "hidden" }} scrolling="no" frameBorder="0" allowFullScreen={true}></iframe>
                </div>

                <div className="bg-white p-1 rounded-xl border border-gray-200 shadow-sm flex justify-center bg-gray-50 overflow-hidden h-[510px]">
                  <iframe src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fmanejodelfuegochubut&tabs=timeline&width=340&height=500&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=false&appId" width="100%" height="500" style={{ border: "none", overflow: "hidden" }} scrolling="no" frameBorder="0" allowFullScreen={true}></iframe>
                </div>

              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4. NOTICIAS (Launchers Directos) - Desplegable */}
      <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <button onClick={() => setIsNoticiasOpen(!isNoticiasOpen)} className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
          <div className="flex items-center gap-3">
            <img src="/news.png" alt="Ícono Noticias" className="w-9 h-9 object-contain" />
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
              Buscar en Noticias (Últimas 24h)
            </h3>
          </div>
          <svg className={`w-5 h-5 text-gray-500 transition-transform ${isNoticiasOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {isNoticiasOpen && (
          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="mb-5 pb-4 border-b border-gray-200">
                <h4 className="text-xs font-bold text-gray-800 mb-2 uppercase">
                  Novedades en regiones clave
                </h4>
                <p className="text-[12px] text-gray-600 leading-relaxed">
                  Cada botón abre Google News buscando reportes de las últimas 24 horas. Los resultados están filtrados estrictamente para Córdoba, Río Negro, Neuquén, Buenos Aires, Mendoza y Argentina en general. Útil para verificar rápido si los operativos y cortes de ruta fueron publicados.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <a 
                  href='https://news.google.com/search?q=(%22incendio%20forestal%22%20OR%20%22incendios%20forestales%22)%20(c%C3%B3rdoba%20OR%20%22rio%20negro%22%20OR%20neuqu%C3%A9n%20OR%20%22buenos%20aires%22%20OR%20mendoza%20OR%20argentina)%20when%3A24h&hl=es-419&gl=AR&ceid=AR%3Aes-419' 
                  target="_blank" 
                  rel="noreferrer" 
                  className="bg-white border border-gray-300 hover:border-red-400 hover:text-red-600 text-gray-700 text-xs font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center shadow-sm text-center"
                >
                  Incendios Forestales
                </a>
                <a 
                  href='https://news.google.com/search?q=(%22incendio%20estructural%22%20OR%20%22incendios%20estructurales%22)%20(c%C3%B3rdoba%20OR%20%22rio%20negro%22%20OR%20neuqu%C3%A9n%20OR%20%22buenos%20aires%22%20OR%20mendoza%20OR%20argentina)%20when%3A24h&hl=es-419&gl=AR&ceid=AR%3Aes-419' 
                  target="_blank" 
                  rel="noreferrer" 
                  className="bg-white border border-gray-300 hover:border-red-400 hover:text-red-600 text-gray-700 text-xs font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center shadow-sm text-center"
                >
                  Incendios Estructurales
                </a>
                <a 
                  href='https://news.google.com/search?q=(bomberos%20OR%20evacuados%20OR%20%22rutas%20cortadas%22)%20(c%C3%B3rdoba%20OR%20%22rio%20negro%22%20OR%20neuqu%C3%A9n%20OR%20%22buenos%20aires%22%20OR%20mendoza%20OR%20argentina)%20when%3A24h&hl=es-419&gl=AR&ceid=AR%3Aes-419' 
                  target="_blank" 
                  rel="noreferrer" 
                  className="bg-white border border-gray-300 hover:border-red-400 hover:text-red-600 text-gray-700 text-xs font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center shadow-sm text-center"
                >
                  Impacto y Operativos
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
