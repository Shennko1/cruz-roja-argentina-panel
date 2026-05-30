"use client";
import React, { useState } from "react";

export default function IncendiosPage() {
  const [isRiesgoOpen, setIsRiesgoOpen] = useState(false);
  const [isRedesOpen, setIsRedesOpen] = useState(false);
  const [isNoticiasOpen, setIsNoticiasOpen] = useState(false);

  // Estado para la ubicación del buscador de noticias
  const [ubicacion, setUbicacion] = useState("Argentina");

  // Configuración de las búsquedas dinámicas de noticias
  const busquedas = [
    {
      titulo: "Incendios Forestales",
      terminos: '("incendio forestal" OR "incendios forestales")'
    },
    {
      titulo: "Incendios Estructurales",
      terminos: '("incendio estructural" OR "incendios estructurales")'
    },
    {
      titulo: "Impacto y Operativos",
      terminos: '(bomberos OR evacuados OR "rutas cortadas")'
    }
  ];

  // Función para construir la URL de Google News
  const generarUrlGoogleNews = (terminos) => {
    const ubicacionFinal = ubicacion.trim() !== "" ? `${ubicacion.trim()} ` : "";
    const query = `${ubicacionFinal}${terminos} when:24h`;
    return `https://news.google.com/search?q=${encodeURIComponent(query)}&hl=es-419&gl=AR&ceid=AR%3Aes-419`;
  };

  // Función para que el mapa de Patagonia Fires siempre muestre las últimas 48hs
  const getPatagoniaFiresUrl = () => {
    const hoy = new Date();
    const haceDosDias = new Date();
    haceDosDias.setDate(hoy.getDate() - 2);
    
    const toStr = hoy.toISOString().split('T')[0];
    const fromStr = haceDosDias.toISOString().split('T')[0];
    
    return `https://www.patagoniafires.org/#lat=-39.9327&lng=-66.6063&zoom=4&from=${fromStr}&to=${toStr}&severities=critical%2Chigh`;
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm font-sans">
      
      {/* CABECERA */}
      <div className="border-b border-gray-200 pb-3 mb-4 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">
          Incendios y Focos de Calor
        </h2>
        <span className="text-xs font-medium bg-red-50 text-red-600 px-3 py-1 rounded-full border border-red-100">
          En vivo
        </span>
      </div>

      {/* ÁREA DE TRABAJO */}
      <div className="bg-gray-50 p-4 rounded-lg border border-dashed border-gray-300 text-sm text-gray-500 mb-8">
        Incluye herramientas de detección satelital en tiempo real, índices de peligro oficiales, seguimiento de operativos de manejo del fuego y búsqueda dinámica de noticias para corroborar incidentes en el territorio.
      </div>

      {/* 1. MAPAS OPERATIVOS - Siempre visibles */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4 border-b border-gray-100 pb-2">
          <img src="/fire.png" alt="Ícono Fuego" className="w-9 h-9 object-contain" />
          <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
            Focos de Calor en Tiempo Real
          </h3>
        </div>

        {/* Disclaimer Importante */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-r-lg shadow-sm">
          <h4 className="text-sm font-bold text-yellow-800 mb-1">Aviso sobre la interpretación de datos:</h4>
          <p className="text-[12px] text-yellow-700 leading-relaxed">
            Ambos mapas deben usarse como <strong>complementarios</strong>. Los focos de calor detectados no son siempre incendios confirmados. Se debe revisar en la herramienta FIRMS (más abajo) si el foco de calor está presente desde hace tiempo, o si surgió de forma repentina.
          </p>
        </div>

        {/* Grilla principal de mapas (Ancho Completo) */}
        <div className="flex flex-col gap-8">
          
          {/* MAPA 1: Huella del Fuego */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
            <div className="bg-gray-50 px-4 h-12 border-b border-gray-200 flex justify-between items-center">
              <span className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                Huella del Fuego (VIIRS)
              </span>
            </div>
            <div className="w-full h-[500px] bg-gray-100">
              <iframe 
                width="100%" 
                height="100%" 
                src="https://www.huelladelfuego.com/tiempo-real" 
                frameBorder="0" 
                title="Huella del Fuego" 
                allowFullScreen
              ></iframe>
            </div>
            <div className="p-3 bg-red-50/40 border-t border-red-100 text-[12px] text-gray-700 leading-relaxed">
              Mapa interactivo de focos de calor activos en Argentina detectados por satélites VIIRS en tiempo real (últimas 48 horas).
            </div>
          </div>

          {/* MAPA 2: Patagonia Fires */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
            <div className="bg-gray-50 px-4 h-12 border-b border-gray-200 flex items-center">
              <span className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                Patagonia Fires (NASA)
              </span>
            </div>
            <div className="w-full h-[500px] bg-gray-100 relative">
              <iframe 
                width="100%" 
                height="100%" 
                src={getPatagoniaFiresUrl()} 
                frameBorder="0" 
                title="Patagonia Fires" 
                allowFullScreen
              ></iframe>
            </div>
            <div className="p-3 bg-red-50/40 border-t border-red-100 text-[12px] text-gray-700 leading-relaxed">
              Visualiza focos de incendio activos en Argentina y Chile usando datos satelitales de NASA. Se ajusta automáticamente a las últimas 48 horas.
            </div>
          </div>

        </div>
      </div>

      {/* 2. FIRMS E ÍNDICES DE PELIGRO (Launchers) - Desplegable */}
      <div className="mb-6 border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <button onClick={() => setIsRiesgoOpen(!isRiesgoOpen)} className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
          <div className="flex items-center gap-3">
            <img src="/data.png" alt="Ícono Datos" className="w-9 h-9 object-contain" />
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
              Análisis Avanzado e Índices de Peligro
            </h3>
          </div>
          <svg className={`w-5 h-5 text-gray-500 transition-transform ${isRiesgoOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {isRiesgoOpen && (
          <div className="p-4 border-t border-gray-200 bg-white">
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Launcher: FIRMS */}
              <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 flex flex-col justify-between shadow-sm min-h-[200px]">
                <div>
                  <h4 className="text-sm font-bold text-gray-800 mb-2">Verificación de Puntos Estáticos vs Nuevos (FIRMS)</h4>
                  <p className="text-[12px] text-gray-600 leading-relaxed">
                    <strong>Guía de colores:</strong> Los puntos de calor estáticos repetidos en el tiempo (ej. industrias) están en <strong>celeste</strong> y <strong>rosa</strong>. Los puntos <strong>rojos</strong> son focos nuevos detectados (probables incendios o quemas).
                  </p>
                </div>
                <a href="https://firms.modaps.eosdis.nasa.gov/map/#m:advanced;d:today,today;l:fires_landsat_landsat,fires_modis_aqua,fires_modis_terra,fires_viirs_noaa20,fires_viirs_noaa21,fires_viirs_snpp,sta_detections,sta_mask,country-outline,firefly;@-59.8,-38.9,4.6z" target="_blank" rel="noreferrer" className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2 px-6 rounded-lg transition-colors text-center mt-4 block">Abrir Mapa FIRMS ↗</a>
              </div>

              {/* Launcher: SMN */}
              <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 flex flex-col justify-between shadow-sm min-h-[200px]">
                <div>
                  <h4 className="text-sm font-bold text-gray-800 mb-2">Índices de Peligro (SMN)</h4>
                  <p className="text-[12px] text-gray-600 leading-relaxed">
                    Mapas del Servicio Meteorológico Nacional con la predicción diaria de peligro de incendios a lo largo del territorio nacional.
                  </p>
                </div>
                <a href="https://www.smn.gob.ar/indices_peligro_fuego" target="_blank" rel="noreferrer" className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2 px-6 rounded-lg transition-colors text-center mt-4 block">Abrir Índices SMN ↗</a>
              </div>

              {/* Launcher: SNMF */}
              <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 flex flex-col justify-between shadow-sm min-h-[200px]">
                <div>
                  <h4 className="text-sm font-bold text-gray-800 mb-2">Alerta Temprana (SNMF)</h4>
                  <p className="text-[12px] text-gray-600 leading-relaxed">
                    Sistema del Servicio Nacional de Manejo del Fuego. Incluye reporte mensual, reporte técnico de ocurrencia, mapa de peligro y series de evaluación.
                  </p>
                </div>
                <a href="https://www.argentina.gob.ar/seguridad/servicio-nacional-de-manejo-del-fuego/evaluacion-de-peligro-y-alerta-temprana" target="_blank" rel="noreferrer" className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2 px-6 rounded-lg transition-colors text-center mt-4 block">Abrir Evaluaciones SNMF ↗</a>
              </div>

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

      {/* 4. NOTICIAS (Buscador Dinámico) - Desplegable */}
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
            <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 shadow-sm">
              
              {/* Descripción del funcionamiento (ARRIBA) */}
              <div className="mb-5 pb-4 border-b border-gray-200">
                <p className="text-[13px] text-gray-600 leading-relaxed">
                  Este buscador automatizado utiliza operadores booleanos para expandir la cobertura a cualquier noticia que incluya al menos una de las palabras clave. Todas las solicitudes filtran cronológicamente resultados de las <strong>últimas 24 horas</strong>.
                </p>
              </div>

              {/* Grilla de Botones (AL MEDIO) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
                {busquedas.map((item, index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col justify-between shadow-sm">
                    <div>
                      <h4 className="text-sm font-bold text-gray-800 mb-2">{item.titulo}</h4>
                      <p className="text-[11px] text-gray-500 font-mono bg-gray-50 p-2 rounded border border-gray-100 mb-4 break-words">
                        {item.terminos}
                      </p>
                    </div>
                    <a 
                      href={generarUrlGoogleNews(item.terminos)} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="w-full text-center bg-white border border-gray-300 hover:border-red-400 hover:text-red-600 hover:bg-red-50 text-gray-700 text-xs font-bold py-2 px-4 rounded-md transition-all shadow-sm"
                    >
                      Buscar en Google News
                    </a>
                  </div>
                ))}
              </div>

              {/* Input de Ubicación (ABAJO DE TODO) */}
              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center bg-white p-4 rounded-lg border border-gray-200 border-l-4 border-l-[#ee3224] shadow-sm">
                <label htmlFor="ubicacion" className="text-sm font-bold text-gray-700 whitespace-nowrap">
                  📍 Ubicación a monitorear:
                </label>
                <input
                  id="ubicacion"
                  type="text"
                  value={ubicacion}
                  onChange={(e) => setUbicacion(e.target.value)}
                  placeholder="Ej: Córdoba, Bariloche, Mendoza..."
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ee3224] focus:border-transparent transition-all"
                />
              </div>

            </div>
          </div>
        )}
      </div>

    </div>
  );
}
