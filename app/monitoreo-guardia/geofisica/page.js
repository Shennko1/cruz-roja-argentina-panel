"use client";
import React, { useState } from "react";

export default function GeofisicaPage() {
  const [isInpresOpen, setIsInpresOpen] = useState(false);
  const [isVolcanoOpen, setIsVolcanoOpen] = useState(false);
  const [isNoticiasOpen, setIsNoticiasOpen] = useState(false);

  const mapHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css" />
      <script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js"></script>
      <style>
        body { margin: 0; padding: 0; font-family: sans-serif; background: #f8fafc; }
        #map { width: 100%; height: 100vh; z-index: 1; }
        .loading { 
          position: absolute; 
          top: 20px; left: 50%; 
          transform: translateX(-50%); 
          z-index: 1000; 
          background: rgba(255, 255, 255, 0.95); 
          padding: 10px 20px; 
          border-radius: 30px; 
          font-weight: bold; 
          box-shadow: 0 4px 15px rgba(0,0,0,0.1); 
          font-size: 12px; 
          color: #1e293b;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border: 1px solid #e2e8f0;
        }
        .leaflet-tooltip.custom-tooltip {
          background: white;
          border: 1px solid #e2e8f0;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          border-radius: 8px;
          padding: 8px 12px;
        }
      </style>
    </head>
    <body>
      <div id="loading" class="loading">Sincronizando XML...</div>
      <div id="map"></div>
      
      <script>
        document.addEventListener("DOMContentLoaded", function() {
          var map = L.map('map').setView([-38.4161, -63.6167], 4);
          
          L.tileLayer('https://wms.ign.gob.ar/geoserver/gwc/service/tms/1.0.0/mapabase_gris@EPSG%3A3857@png/{z}/{x}/{-y}.png', {
            minZoom: 1, maxZoom: 20,
            attribution: 'IGN | INPRES'
          }).addTo(map);

          L.tileLayer.wms('https://wms.ign.gob.ar/geoserver/ows?', {
            layers: 'provincia,capa_capitales',
            format: 'image/png',
            transparent: true,
            opacity: 0.6
          }).addTo(map);

          var layerGroup = L.layerGroup().addTo(map);

          async function cargarSismos() {
            const statusDiv = document.getElementById('loading');
            try {
              statusDiv.style.display = 'block';
              layerGroup.clearLayers();
              
              const proxyUrl = 'https://api.codetabs.com/v1/proxy?quest=';
              const targetUrl = 'http://contenidos.inpres.gob.ar/formatos/sentidos.xml?nocache=' + new Date().getTime();
              
              const res = await fetch(proxyUrl + encodeURIComponent(targetUrl));
              const xmlText = await res.text();
              
              const parser = new DOMParser();
              const xmlDoc = parser.parseFromString(xmlText, "application/xml");
              
              const items = xmlDoc.getElementsByTagName("item");

              for (let i = 0; i < items.length; i++) {
                const item = items[i];
                
                // Extracción exacta de las etiquetas solicitadas
                const latStr = (item.getElementsByTagName("latitude")[0] || item.getElementsByTagName("geo:lat")[0])?.textContent;
                const lonStr = (item.getElementsByTagName("longitude")[0] || item.getElementsByTagName("geo:long")[0])?.textContent;
                const magStr = item.getElementsByTagName("magnitude")[0]?.textContent || "N/D";
                const dateStr = (item.getElementsByTagName("pubdate")[0] || item.getElementsByTagName("pubDate")[0])?.textContent || "Fecha desconocida";

                const lat = parseFloat(latStr);
                const lon = parseFloat(lonStr);
                const mag = parseFloat(magStr);

                if (!isNaN(lat) && !isNaN(lon)) {
                  let color = '#3b82f6'; // Azul (< 3)
                  let radius = 6;
                  if (mag >= 3 && mag < 4.5) { color = '#eab308'; radius = 10; } // Amarillo
                  if (mag >= 4.5 && mag < 6) { color = '#f97316'; radius = 14; } // Naranja
                  if (mag >= 6) { color = '#ef4444'; radius = 18; } // Rojo

                  const marker = L.circleMarker([lat, lon], {
                    radius: radius,
                    fillColor: color,
                    color: '#ffffff',
                    weight: 2,
                    opacity: 1,
                    fillOpacity: 0.8
                  });

                  // Tooltip que aparece al poner el mouse arriba (hover)
                  const tooltipHTML = "<div style='font-family:sans-serif; text-align:left; min-width:140px;'>" +
                                      "<div style='background:" + color + "; color:white; padding:4px 8px; border-radius:4px; font-weight:bold; font-size:12px; display:inline-block; margin-bottom:6px;'>" +
                                      "Magnitud: " + (isNaN(mag) ? magStr : mag) + "</div><br/>" +
                                      "<span style='font-size:11px; color:#475569; font-weight:bold;'>" + dateStr + "</span>" +
                                      "</div>";
                  
                  marker.bindTooltip(tooltipHTML, {
                    direction: 'top',
                    className: 'custom-tooltip',
                    offset: [0, -10]
                  });
                  
                  layerGroup.addLayer(marker);
                }
              }
              
              statusDiv.innerText = "Mapa actualizado";
              setTimeout(() => { statusDiv.style.display = 'none'; }, 3000);
            } catch(e) {
              statusDiv.innerText = "Error cargando XML";
            }
          }

          cargarSismos();
          setInterval(cargarSismos, 300000); // 5 minutos
        });
      </script>
    </body>
    </html>
  `;

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm font-sans">
      
      {/* CABECERA */}
      <div className="border-b border-gray-200 pb-3 mb-4 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">
          Monitoreo: Sismos y Geofísica
        </h2>
        <span className="text-xs font-medium bg-blue-50 text-blue-600 px-3 py-1 rounded-full border border-blue-100">
          En vivo
        </span>
      </div>

      {/* AREA DE TRABAJO (Blank State) */}
      <div className="bg-gray-50 p-4 rounded-lg border border-dashed border-gray-300 text-sm text-gray-500 mb-8">
        Agregar información.
      </div>

      {/* 1. MAPA GEOFÍSICO (INPRES) - Siempre visible */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4 border-b border-gray-100 pb-2">
          <img src="/earthquake.png" alt="Ícono Sismo" className="w-9 h-9 object-contain" onError={(e) => e.target.style.display='none'} />
          <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
            Sismos Sentidos (XML Oficial)
          </h3>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 bg-gray-50 p-4 rounded-xl border border-gray-200 flex flex-col justify-between shadow-sm">
            <div>
              <h4 className="text-xs font-bold text-gray-600 mb-3 uppercase">
                ¿Para qué sirve este mapa?
              </h4>
              <p className="text-[12px] text-gray-600 mb-4 leading-relaxed">
                Visualiza en tiempo real los sismos reportados a través del XML de INPRES. Pasá el mouse sobre los puntos para ver detalles.
              </p>
              <ul className="text-[12px] text-gray-500 space-y-3">
                <li className="flex gap-2">
                  <span className="text-blue-500 font-bold">•</span>
                  <span><strong>Colores:</strong> Indican la magnitud. Rojo (≥ 6), Naranja (4.5 - 5.9), Amarillo (3 - 4.4), Azul (&lt; 3).</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-500 font-bold">•</span>
                  <span><strong>Interacción:</strong> Solo con posar el cursor se despliega la magnitud y la fecha de publicación (pubdate).</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="lg:col-span-3 rounded-xl overflow-hidden border border-gray-300 shadow-md bg-gray-100 h-[500px] relative z-0">
            <iframe 
              srcDoc={mapHtml}
              className="w-full h-full border-0 absolute inset-0" 
              title="Mapa INPRES" 
              sandbox="allow-scripts allow-same-origin"
            ></iframe>
          </div>
        </div>
      </div>

      {/* 2. REGISTRO OFICIAL (Embed) - Desplegable */}
      <div className="mb-6 border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <button onClick={() => setIsInpresOpen(!isInpresOpen)} className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
          <div className="flex items-center gap-3">
            <img src="/floods.png" alt="Ícono INPRES" className="w-9 h-9 object-contain" onError={(e) => e.target.style.display='none'} />
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
              Registro Oficial del INPRES
            </h3>
          </div>
          <svg className={`w-5 h-5 text-gray-500 transition-transform ${isInpresOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {isInpresOpen && (
          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="w-full h-[600px] rounded-xl overflow-hidden border border-gray-200 relative bg-gray-50">
              <iframe 
                src="https://www.inpres.gob.ar/desktop/" 
                className="w-full h-full border-0 absolute inset-0" 
                title="Sitio INPRES Oficial" 
              />
            </div>
          </div>
        )}
      </div>

      {/* 3. MONITOREO GLOBAL (Volcano Discovery) - Desplegable */}
      <div className="mb-6 border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <button onClick={() => setIsVolcanoOpen(!isVolcanoOpen)} className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
          <div className="flex items-center gap-3">
            <img src="/media.png" alt="Ícono Global" className="w-9 h-9 object-contain" onError={(e) => e.target.style.display='none'} />
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
              Monitoreo Global (VolcanoDiscovery)
            </h3>
          </div>
          <svg className={`w-5 h-5 text-gray-500 transition-transform ${isVolcanoOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {isVolcanoOpen && (
          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="w-full h-[500px] rounded-xl overflow-hidden border border-gray-200 relative bg-gray-50">
              <iframe 
                src="https://earthquakes.volcanodiscovery.com/map/Argentina?L=8" 
                className="w-full h-full border-0 absolute inset-0" 
                title="Volcano Discovery Map" 
              />
            </div>
          </div>
        )}
      </div>

      {/* 4. NOTICIAS Y REPORTES (Launchers) - Desplegable */}
      <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <button onClick={() => setIsNoticiasOpen(!isNoticiasOpen)} className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
          <div className="flex items-center gap-3">
            <img src="/news.png" alt="Ícono Noticias" className="w-9 h-9 object-contain" onError={(e) => e.target.style.display='none'} />
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
              Buscar Repercusiones y Noticias
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
                  ¿Para qué usar estos botones?
                </h4>
                <p className="text-[12px] text-gray-600 leading-relaxed">
                  Cada botón abre una pestaña nueva configurada para rastrear impactos y reportes ciudadanos relacionados con eventos sísmicos recientes en redes o medios digitales.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <a href="https://www.facebook.com/search/top/?q=INPRES" target="_blank" rel="noreferrer" className="bg-white border border-gray-300 hover:border-blue-400 hover:text-blue-600 text-gray-700 text-xs font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center shadow-sm text-center">
                  Facebook: Búsqueda "INPRES"
                </a>
                <a href="https://www.google.com/search?q=INPRES&tbm=nws&tbs=qdr:d" target="_blank" rel="noreferrer" className="bg-white border border-gray-300 hover:border-blue-400 hover:text-blue-600 text-gray-700 text-xs font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center shadow-sm text-center">
                  Noticias: INPRES (Últimas 24h)
                </a>
                <a href="https://www.google.com/search?q=deslizamiento+OR+alud+OR+derrumbe+argentina&tbm=nws&tbs=qdr:w" target="_blank" rel="noreferrer" className="bg-white border border-gray-300 hover:border-blue-400 hover:text-blue-600 text-gray-700 text-xs font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center shadow-sm text-center">
                  Noticias: Deslizamientos (7 días)
                </a>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
