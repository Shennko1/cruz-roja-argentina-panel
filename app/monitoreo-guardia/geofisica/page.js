"use client";
import React, { useState } from "react";

export default function GeofisicaPage() {
  const [isVolcanoOpen, setIsVolcanoOpen] = useState(false);
  const [isNoticiasOpen, setIsNoticiasOpen] = useState(false);

  // El script del mapa ahora busca los datos con mayor flexibilidad ante cambios en el XML
  const mapHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css" />
      <script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js"></script>
      <style>
        body { margin: 0; padding: 0; font-family: sans-serif; }
        #map { width: 100%; height: 100%; }
        .marker-tooltip { font-size: 12px; }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        var map = L.map('map').setView([-38.4161, -63.6167], 4);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

        async function cargarSismos() {
          try {
            const url = 'https://api.allorigins.win/get?url=' + encodeURIComponent('http://contenidos.inpres.gob.ar/formatos/sentidos.xml');
            const res = await fetch(url);
            const data = await res.json();
            const parser = new DOMParser();
            const xml = parser.parseFromString(data.contents, "text/xml");
            const items = xml.getElementsByTagName("item");

            for (let item of items) {
              const lat = parseFloat(item.getElementsByTagName("latitude")[0]?.textContent);
              const lon = parseFloat(item.getElementsByTagName("longitude")[0]?.textContent);
              const mag = item.getElementsByTagName("magnitude")[0]?.textContent;
              const date = item.getElementsByTagName("pubDate")[0]?.textContent;

              if (!isNaN(lat) && !isNaN(lon)) {
                L.circleMarker([lat, lon], { radius: 7, fillColor: "#ef4444", color: "#fff", fillOpacity: 0.7 })
                 .addTo(map)
                 .bindTooltip("Mag: " + mag + "<br>" + date);
              }
            }
          } catch(e) { console.error("Error cargando INPRES:", e); }
        }
        cargarSismos();
      </script>
    </body>
    </html>
  `;

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm font-sans space-y-6">
      
      <div className="border-b border-gray-200 pb-3 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">Sismos y Geofísica</h2>
        <span className="text-xs font-medium bg-blue-50 text-blue-600 px-3 py-1 rounded-full border border-blue-100">En vivo</span>
      </div>

      {/* MAPA Y REGISTRO OFICIAL (Lado a Lado) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[500px]">
        <div className="rounded-xl border border-gray-300 overflow-hidden shadow-sm">
          <iframe srcDoc={mapHtml} className="w-full h-full border-0" title="Mapa Sismos" />
        </div>
        <div className="rounded-xl border border-gray-300 overflow-hidden shadow-sm">
          <iframe src="https://www.inpres.gob.ar/desktop/" className="w-full h-full border-0" title="INPRES Oficial" />
        </div>
      </div>

      {/* MONITOREO GLOBAL */}
      <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <button onClick={() => setIsVolcanoOpen(!isVolcanoOpen)} className="w-full flex justify-between items-center p-4 bg-gray-50">
          <h3 className="text-sm font-bold text-gray-700 uppercase">Monitoreo Global (VolcanoDiscovery)</h3>
        </button>
        {isVolcanoOpen && (
          <div className="p-4 border-t border-gray-200 text-xs text-gray-600">
            <p className="mb-2 italic">* Complemento en inglés. Los datos pueden variar de fuentes oficiales. Útil para verificación cruzada de eventos.</p>
            <div className="h-[400px]">
              <iframe src="https://earthquakes.volcanodiscovery.com/map/Argentina?L=8" className="w-full h-full border-0" />
            </div>
          </div>
        )}
      </div>

      {/* NOTICIAS DE EVENTOS GEOFÍSICOS */}
      <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <button onClick={() => setIsNoticiasOpen(!isNoticiasOpen)} className="w-full flex justify-between items-center p-4 bg-gray-50">
          <h3 className="text-sm font-bold text-gray-700 uppercase">Noticias de Eventos Geofísicos</h3>
        </button>
        {isNoticiasOpen && (
          <div className="p-4 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a href="https://www.google.com/search?q=terremoto+OR+sismo+argentina+noticias&tbm=nws&tbs=qdr:w" target="_blank" className="p-3 border border-gray-200 rounded-lg text-xs font-bold hover:bg-red-50 text-center">Sismos y Terremotos (Últimos 7 días)</a>
            <a href="https://www.google.com/search?q=deslizamiento+tierra+alud+erupcion+volcanica+argentina&tbm=nws&tbs=qdr:w" target="_blank" className="p-3 border border-gray-200 rounded-lg text-xs font-bold hover:bg-red-50 text-center">Deslizamientos / Erupciones (Últimos 7 días)</a>
          </div>
        )}
      </div>
    </div>
  );
}
