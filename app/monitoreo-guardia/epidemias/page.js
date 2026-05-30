"use client";
import React, { useState } from "react";

export default function EpidemiologiaPage() {
  const [isNacionalOpen, setIsNacionalOpen] = useState(false);
  const [isOmsOpen, setIsOmsOpen] = useState(false);

  // Estado para manejar qué fuente nacional se muestra en el iframe
  const [activeNacionalUrl, setActiveNacionalUrl] = useState("https://www.argentina.gob.ar/salud/boletin-epidemiologico-nacional/boletines-2026");

  const fuentesNacionales = [
    {
      nombre: "Boletines 2026",
      url: "https://www.argentina.gob.ar/salud/boletin-epidemiologico-nacional/boletines-2026"
    },
    {
      nombre: "Comunicaciones",
      url: "https://www.argentina.gob.ar/salud/boletin-epidemiologico-nacional/comunicaciones-epidemiologicas"
    },
    {
      nombre: "Circulares",
      url: "https://www.argentina.gob.ar/salud/boletin-epidemiologico-nacional/circulares-de-vigilancia-epidemiologica"
    }
  ];

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm font-sans">
      
      {/* CABECERA */}
      <div className="border-b border-gray-200 pb-3 mb-4 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">
          Epidemiologías
        </h2>
      </div>

      {/* AREA DE TRABAJO (Blank State) */}
      <div className="bg-gray-50 p-4 rounded-lg border border-dashed border-gray-300 text-sm text-gray-500 mb-8">
        Herramientas de monitoreo de brotes, acceso directo a boletines oficiales del Ministerio de Salud, seguimiento de alertas de la OMS/OPS y mapas de reportes complementarios.
      </div>

      {/* 1. MAPA EPIDEMIOLÓGICO (HealthMap) - Siempre visible */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4 border-b border-gray-100 pb-2">
          <img src="/epi.png" alt="Ícono Epidemiología" className="w-9 h-9 object-contain" onError={(e) => e.target.style.display='none'} />
          <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
            Mapa de Reportes (HealthMap)
          </h3>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 bg-gray-50 p-4 rounded-xl border border-gray-200 flex flex-col justify-between shadow-sm">
            <div>
              <h4 className="text-xs font-bold text-gray-600 mb-3 uppercase border-b border-gray-200 pb-2">
                Aviso Importante
              </h4>
              <p className="text-[12px] text-gray-600 mb-4 leading-relaxed">
                Este mapa <strong>no es una fuente oficial</strong> gubernamental y su interfaz se encuentra mayormente en inglés.
              </p>
              <ul className="text-[12px] text-gray-500 space-y-3">
                <li className="flex gap-2">
                  <span className="text-blue-500 font-bold">•</span>
                  <span><strong>Uso complementario:</strong> Utilizar exclusivamente para acceder a información preliminar, noticias o reportes no oficiales sobre posibles brotes.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-500 font-bold">•</span>
                  <span><strong>Validación:</strong> Cualquier evento detectado aquí debe ser contrastado con los boletines del Ministerio de Salud.</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="lg:col-span-3 rounded-xl overflow-hidden border border-gray-300 shadow-md bg-gray-100 h-[500px]">
            <iframe 
              width="100%" 
              height="100%" 
              src="https://www.healthmap.org/es/" 
              frameBorder="0" 
              title="HealthMap" 
              allowFullScreen>
            </iframe>
          </div>
        </div>
      </div>

      {/* 2. REPORTES NACIONALES (Visor Tabulado) - Desplegable */}
      <div className="mb-6 border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <button onClick={() => setIsNacionalOpen(!isNacionalOpen)} className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
          <div className="flex items-center gap-3">
            <img src="/guia.png" alt="Ícono Nacional" className="w-9 h-9 object-contain" onError={(e) => e.target.style.display='none'} />
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
              Boletines y Circulares (Ministerio de Salud)
            </h3>
          </div>
          <svg className={`w-5 h-5 text-gray-500 transition-transform ${isNacionalOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {isNacionalOpen && (
          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-4">
              
              {/* Selector de Pestañas */}
              <div className="flex flex-col sm:flex-row gap-2 border-b border-gray-200 pb-3">
                {fuentesNacionales.map((fuente, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveNacionalUrl(fuente.url)}
                    className={`px-4 py-2 text-xs font-bold uppercase rounded-lg transition-colors ${
                      activeNacionalUrl === fuente.url 
                        ? "bg-blue-600 text-white shadow-sm" 
                        : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    {fuente.nombre}
                  </button>
                ))}
              </div>

              {/* Contenedor del Iframe Dinámico */}
              <div className="w-full h-[600px] rounded-lg overflow-hidden border border-gray-300 bg-white relative">
                <div className="absolute top-0 left-0 w-full p-2 bg-gray-100 border-b border-gray-200 text-xs text-gray-500 font-mono z-10 flex justify-between items-center">
                  <span className="truncate pr-4">Fuente: {activeNacionalUrl}</span>
                  <a href={activeNacionalUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline flex-shrink-0 font-bold">
                    Abrir en pestaña ↗
                  </a>
                </div>
                <iframe 
                  src={activeNacionalUrl} 
                  className="w-full h-full border-0 pt-8" 
                  title="Visor Oficial Nacional" 
                />
              </div>

            </div>
          </div>
        )}
      </div>

      {/* 3. ALERTAS INTERNACIONALES (OMS / PAHO) - Desplegable */}
      <div className="mb-6 border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <button onClick={() => setIsOmsOpen(!isOmsOpen)} className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
          <div className="flex items-center gap-3">
            <img src="/alert.png" alt="Ícono Alerta" className="w-9 h-9 object-contain" onError={(e) => e.target.style.display='none'} />
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
              Alertas y Actualizaciones (OMS / OPS)
            </h3>
          </div>
          <svg className={`w-5 h-5 text-gray-500 transition-transform ${isOmsOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {isOmsOpen && (
          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 shadow-sm">
              <div className="mb-4">
                <p className="text-[13px] text-gray-600 leading-relaxed">
                  Repositorio oficial de la Organización Panamericana de la Salud. Contiene información sobre eventos de salud pública de importancia internacional, brotes regionales y guías de vigilancia.
                </p>
              </div>
              <div className="w-full h-[600px] rounded-lg overflow-hidden border border-gray-300 bg-white relative">
                <div className="absolute top-0 left-0 w-full p-2 bg-gray-100 border-b border-gray-200 text-xs text-gray-500 font-mono z-10 flex justify-between items-center">
                  <span className="truncate pr-4">Fuente: paho.org/es/alertas-actualizaciones-epidemiologicas</span>
                  <a href="https://www.paho.org/es/alertas-actualizaciones-epidemiologicas" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline flex-shrink-0 font-bold">
                    Abrir en pestaña ↗
                  </a>
                </div>
                <iframe 
                  src="https://www.paho.org/es/alertas-actualizaciones-epidemiologicas" 
                  className="w-full h-full border-0 pt-8" 
                  title="Visor Alertas OPS" 
                />
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
