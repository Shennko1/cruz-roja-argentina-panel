"use client";
import React, { useState } from "react";

export default function TensionSocialPage() {
  const [isNoticiasOpen, setIsNoticiasOpen] = useState(true); // Abierto por defecto al ser el enfoque principal
  
  // Estado para la ubicación del buscador de noticias
  const [ubicacion, setUbicacion] = useState("Argentina");

  // Configuración de las búsquedas dinámicas para Tensión Social
  const busquedasTension = [
    {
      titulo: "Paros y Gremios",
      terminos: '(paro OR huelga OR gremio OR sindicato OR "medida de fuerza" OR "retención de tareas")'
    },
    {
      titulo: "Protestas y Cortes",
      terminos: '(piquete OR corte OR movilización OR marcha OR concentración OR acampe OR bloqueo)'
    },
    {
      titulo: "Conflictos y Disturbios",
      terminos: '(disturbios OR incidentes OR enfrentamiento OR tensión OR represión)'
    }
  ];

  // Función para construir la URL de Google News
  const generarUrlGoogleNews = (terminos) => {
    const ubicacionFinal = ubicacion.trim() !== "" ? `${ubicacion.trim()} ` : "";
    const query = `${ubicacionFinal}${terminos} when:24h`;
    return `https://news.google.com/search?q=${encodeURIComponent(query)}&hl=es-419&gl=AR&ceid=AR%3Aes-419`;
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm font-sans">
      
      {/* CABECERA */}
      <div className="border-b border-gray-200 pb-3 mb-4 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">
          Tensión Social
        </h2>
      </div>

      {/* AREA DE TRABAJO (Blank State) */}
      <div className="bg-gray-50 p-4 rounded-lg border border-dashed border-gray-300 text-sm text-gray-500 mb-8">
        Herramientas para el seguimiento de medidas de fuerza, conflictividad gremial, movilizaciones y estado de la transitabilidad pública.
      </div>

      {/* 1. ALERTAS DE TRÁNSITO Y MOVILIZACIONES (Facebook Compacto) - Siempre visible */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4 border-b border-gray-100 pb-2">
          <img src="/traffic.png" alt="Ícono Tránsito" className="w-9 h-9 object-contain" onError={(e) => e.target.style.display='none'} />
          <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
            Reportes de Movilidad y Cortes en Tiempo Real
          </h3>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-2 bg-gray-50 p-5 rounded-xl border border-gray-200 flex flex-col justify-between shadow-sm">
            <div>
              <h4 className="text-xs font-bold text-gray-600 mb-3 uppercase border-b border-gray-200 pb-2">
                Monitoreo Colaborativo
              </h4>
              <p className="text-[12px] text-gray-600 mb-4 leading-relaxed">
                El feed adjunto recopila reportes ciudadanos inmediatos sobre demoras, interrupciones de transporte y bloqueos de vías públicas.
              </p>
              <ul className="text-[12px] text-gray-500 space-y-3">
                <li className="flex gap-2">
                  <span className="text-blue-500 font-bold">•</span>
                  <span><strong>Indicador temprano:</strong> Los cortes por protestas o asambleas gremiales suelen reportarse aquí antes de impactar en los medios masivos.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-500 font-bold">•</span>
                  <span><strong>Actualización:</strong> Deslizar hacia abajo dentro del cuadro para refrescar las publicaciones más recientes del feed.</span>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Embed de Facebook optimizado para ocupar menos espacio vertical (altura 400px) */}
          <div className="lg:col-span-2 bg-gray-50 p-2 rounded-xl border border-gray-200 flex justify-center items-center shadow-sm">
            <div className="w-[340px] h-[400px] overflow-hidden rounded-lg border border-gray-300 bg-white">
              <iframe 
                src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2FAlertasTransito&tabs=timeline&width=340&height=400&small_header=true&adapt_container_width=true&hide_cover=true&show_facepile=false&appId" 
                width="340" 
                height="400" 
                style={{ border: "none", overflow: "hidden" }} 
                scrolling="no" 
                frameBorder="0" 
                allowFullScreen={true}
                title="Alertas Tránsito Facebook"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. NOTICIAS Y CLASIFICACIONES (Enfoque Principal) - Desplegable */}
      <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <button onClick={() => setIsNoticiasOpen(!isNoticiasOpen)} className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
          <div className="flex items-center gap-3">
            <img src="/news.png" alt="Ícono Noticias" className="w-9 h-9 object-contain" onError={(e) => e.target.style.display='none'} />
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
              Buscador Temático de Conflictividad (Últimas 24h)
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
                  <strong>¿Cómo funciona?</strong> Selecciona una categoría para rastrear incidentes específicos a través de operadores lógicos. El sistema agrupa términos clave vinculados a la tensión social para identificar novedades publicadas exclusivamente en las <strong>últimas 24 horas</strong>.
                </p>
              </div>

              {/* Grilla de Botones y Transparencia (AL MEDIO) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
                {busquedasTension.map((item, index) => (
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
                      className="w-full text-center bg-white border border-gray-300 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 text-gray-700 text-xs font-bold py-2 px-4 rounded-md transition-all shadow-sm"
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
                  placeholder="Ej: Buenos Aires, Córdoba, Rosario..."
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
