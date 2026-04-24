'use client';

import React, { useState } from 'react';

export default function MonitoreoInternacional() {
  const [paisActivo, setPaisActivo] = useState(null);

  // Base de datos de países y sus configuraciones
  const configuracionPaises = {
    brasil: {
      nombre: 'Brasil',
      idioma: 'Portugués',
      queries: [
        { label: 'Inundaciones/Lluvias', q: '("enchente" OR "inundação" OR "chuvas") Brasil' },
        { label: 'Incendios', q: '("incêndio florestal" OR "fogo") Brasil' },
        { label: 'Deslizamientos', q: '("deslizamento" OR "soterramento") Brasil' },
        { label: 'Crisis Eléctrica', q: '("apagão" OR "falta de energia") Brasil' },
        { label: 'Seguridad/Protestas', q: '("manifestação" OR "confronto" OR "polícia") Brasil' }
      ]
    },
    usa: {
      nombre: 'Estados Unidos',
      idioma: 'Inglés',
      queries: [
        { label: 'Clima Severo', q: '("tornado" OR "hurricane" OR "storm") "United States"' },
        { label: 'Tirador Activo', q: '("active shooter" OR "mass shooting") "United States"' },
        { label: 'Incendios', q: '("wildfire" OR "forest fire") "United States"' },
        { label: 'Químicos/Hazmat', q: '("chemical spill" OR "hazmat") "United States"' },
        { label: 'Sismos', q: '("earthquake" OR "tsunami") "United States"' }
      ]
    },
    chile: {
      nombre: 'Chile',
      idioma: 'Español',
      queries: [
        { label: 'Sismos/Tsunami', q: '("sismo" OR "terremoto" OR "shoa") Chile' },
        { label: 'Incendios Forestales', q: '("incendio forestal" OR "conaf") Chile' },
        { label: 'Actividad Volcánica', q: '("volcán" OR "erupción" OR "sernageomin") Chile' },
        { label: 'Eventos Meteorológicos', q: '("sistema frontal" OR "temporal") Chile' },
        { label: 'Disturbios', q: '("protestas" OR "incidentes") Chile' }
      ]
    }
  };

  const abrirNoticias = (query) => {
    const url = `https://www.google.com/search?q=${encodeURIComponent(query)}&tbm=nws&tbs=qdr:d`;
    window.open(url, '_blank');
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm font-sans">
      
      <div className="border-b border-gray-200 pb-2 mb-4">
        <h2 className="text-lg font-bold text-gray-800 uppercase tracking-tight">
          Vigilancia Internacional
        </h2>
      </div>

      <div className="bg-gray-50 p-3 rounded-lg border border-dashed border-gray-300 text-sm text-gray-500 mb-6">
        Seleccionar un territorio para desplegar los filtros de búsqueda local (últimas 24hs).
      </div>

      {/* MAPA MUNDI SIMPLIFICADO (SVG) */}
      <div className="flex justify-center mb-8 bg-gray-100 rounded-xl p-4 border border-gray-200">
        <svg viewBox="0 0 1000 500" className="w-full max-w-3xl h-auto">
          {/* Representación básica de continentes para el borrador */}
          <rect width="1000" height="500" fill="transparent" />
          
          {/* USA */}
          <path 
            d="M150,150 L300,150 L300,250 L150,250 Z" 
            className={`cursor-pointer transition-colors ${paisActivo === 'usa' ? 'fill-blue-600' : 'fill-gray-300 hover:fill-gray-400'}`}
            onClick={() => setPaisActivo('usa')}
          />
          
          {/* Brasil */}
          <path 
            d="M350,300 L450,300 L450,450 L350,450 Z" 
            className={`cursor-pointer transition-colors ${paisActivo === 'brasil' ? 'fill-green-600' : 'fill-gray-300 hover:fill-gray-400'}`}
            onClick={() => setPaisActivo('brasil')}
          />

          {/* Chile */}
          <path 
            d="M320,350 L340,350 L340,480 L320,480 Z" 
            className={`cursor-pointer transition-colors ${paisActivo === 'chile' ? 'fill-red-600' : 'fill-gray-300 hover:fill-gray-400'}`}
            onClick={() => setPaisActivo('chile')}
          />
          
          <text x="170" y="200" className="text-[12px] font-bold fill-gray-600 pointer-events-none">USA</text>
          <text x="370" y="380" className="text-[12px] font-bold fill-gray-600 pointer-events-none">BRA</text>
          <text x="280" y="440" className="text-[12px] font-bold fill-gray-600 pointer-events-none">CHI</text>
        </svg>
      </div>

      {/* LISTADO DE PAISES */}
      <div className="flex gap-2 mb-8 justify-center">
        {Object.keys(configuracionPaises).map((id) => (
          <button
            key={id}
            onClick={() => setPaisActivo(id)}
            className={`px-4 py-1.5 rounded text-xs font-bold uppercase transition-all border ${
              paisActivo === id 
              ? 'bg-gray-800 text-white border-gray-800' 
              : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
            }`}
          >
            {configuracionPaises[id].nombre}
          </button>
        ))}
      </div>

      {/* SECCIÓN DETALLE (SE ACTIVA AL HACER CLICK) */}
      {paisActivo && (
        <div className="border-t pt-6 animate-in fade-in slide-in-from-bottom-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-black text-gray-700 uppercase tracking-widest">
              Lanzadores: {configuracionPaises[paisActivo].nombre}
            </h3>
            <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-bold uppercase">
              Idioma: {configuracionPaises[paisActivo].idioma}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {configuracionPaises[paisActivo].queries.map((item, index) => (
              <button
                key={index}
                onClick={() => abrirNoticias(item.q)}
                className="flex flex-col items-start p-3 rounded-lg border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all text-left group"
              >
                <span className="text-xs font-bold text-gray-800 group-hover:text-blue-700">
                  {item.label}
                </span>
                <span className="text-[9px] text-gray-400 mt-1 font-mono truncate w-full italic">
                  {item.q}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* FOOTER BLANK STATE */}
      {!paisActivo && (
        <div className="text-center py-10 text-gray-400 italic text-sm">
          Seleccione un país para visualizar los lanzadores de noticias.
        </div>
      )}
      
    </div>
  );
}
