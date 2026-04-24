"use client";
import React, { useState } from "react";

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

      {/* BLANK */}
      <div className="bg-gray-50 p-4 rounded-lg border border-dashed border-gray-300 text-sm text-gray-500 mb-8">
        Agregar información.
      </div>

      {/* MAPA */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4 border-b border-gray-100 pb-2">
          <img src="/storm.png" className="w-9 h-9" />
          <h3 className="text-sm font-bold text-gray-700 uppercase">
            Mapa de lluvia en tiempo real
          </h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 bg-gray-50 p-4 rounded-xl border">
            <p className="text-[12px] text-gray-600">
              Muestra dónde está lloviendo ahora mismo y cómo evolucionan las tormentas.
            </p>
          </div>

          <div className="lg:col-span-3 h-[500px]">
            <iframe
              width="100%"
              height="100%"
              src="https://embed.windy.com/embed2.html?lat=-38.416&lon=-63.617&zoom=4&overlay=rain"
            />
          </div>
        </div>
      </div>

      {/* RIESGO */}
      <div className="mb-6 border rounded-xl overflow-hidden">
        <button
          onClick={() => setIsRiesgoOpen(!isRiesgoOpen)}
          className="w-full flex justify-between p-4 bg-gray-50"
        >
          <span>Riesgo Hídrico</span>

          <svg
            className={`w-5 h-5 transition-transform ${
              isRiesgoOpen ? "rotate-180" : ""
            }`}
            viewBox="0 0 24 24"
          >
            <path d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isRiesgoOpen && (
          <div className="p-4">
            <a href="https://sites.research.google/floods/" target="_blank">
              FloodHub
            </a>
          </div>
        )}
      </div>

      {/* REDES */}
      <div className="mb-6 border rounded-xl overflow-hidden">
        <button
          onClick={() => setIsRedesOpen(!isRedesOpen)}
          className="w-full flex justify-between p-4 bg-gray-50"
        >
          <span>Redes Sociales</span>

          <svg
            className={`w-5 h-5 transition-transform ${
              isRedesOpen ? "rotate-180" : ""
            }`}
            viewBox="0 0 24 24"
          >
            <path d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isRedesOpen && (
          <div className="p-4">
            <iframe
              src="https://www.facebook.com/plugins/page.php?href=https://www.facebook.com/SMN.ar&tabs=timeline"
              width="100%"
              height="500"
            />
          </div>
        )}
      </div>

      {/* NOTICIAS */}
      <div className="border rounded-xl overflow-hidden">
        <button
          onClick={() => setIsNoticiasOpen(!isNoticiasOpen)}
          className="w-full flex justify-between p-4 bg-gray-50"
        >
          <span>Noticias</span>

          <svg
            className={`w-5 h-5 transition-transform ${
              isNoticiasOpen ? "rotate-180" : ""
            }`}
            viewBox="0 0 24 24"
          >
            <path d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isNoticiasOpen && (
          <div className="p-4 space-y-3">
            <a href="https://news.google.com" target="_blank">
              Abrir Google News
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
