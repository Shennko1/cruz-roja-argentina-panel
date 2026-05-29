'use client';

import React, { useEffect, useState } from 'react';

export default function DashboardGeofisica() {
  const [sismosTabla, setSismosTabla] = useState([]);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data && event.data.type === 'INPRES_DATA_READY') {
        setSismosTabla(event.data.payload);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // HTML inyectado para el mapa interactivo del INPRES
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
          position: absolute; top: 20px; left: 50%; transform: translateX(-50%); 
          z-index: 1000; background: rgba(255, 255, 255, 0.95); padding: 10px 20px; 
          border-radius: 30px; font-weight: bold; box-shadow: 0 4px 15px rgba(0,0,0,0.1); 
          font-size: 12px; color: #1e293b; text-transform: uppercase; border: 1px solid #e2e8f0;
        }
      </style>
    </head>
    <body>
      <div id="loading" class="loading">Sincronizando con INPRES...</div>
      <div id="map"></div>
      
      <script>
        document.addEventListener("DOMContentLoaded", function() {
          var map = L.map('map').setView([-38.4161, -63.6167], 4);
          
          // Capa Base Gris IGN
          L.tileLayer('https://wms.ign.gob.ar/geoserver/gwc/service/tms/1.0.0/mapabase_gris@EPSG%3A3857@png/{z}/{x}/{-y}.png', {
            minZoom: 1, maxZoom: 20,
            attribution: 'IGN | INPRES'
          }).addTo(map);

          // Capa Provincias IGN
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
              
              // Proxy para evitar bloqueo CORS y Mixed Content (HTTP a HTTPS)
              const proxyUrl = 'https://api.codetabs.com/v1/proxy?quest=';
              const targetUrl = 'http://contenidos.inpres.gob.ar/formatos/sentidos.xml?nocache=' + new Date().getTime();
              
              const res = await fetch(proxyUrl + encodeURIComponent(targetUrl));
              const xmlText = await res.text();
              
              const parser = new DOMParser();
              const xmlDoc = parser.parseFromString(xmlText, "application/xml");
              
              const sismos = xmlDoc.getElementsByTagName("sismo");
              const datosTabla = [];

              for (let i = 0; i < sismos.length; i++) {
                const s = sismos[i];
                
                // Extracción de datos (Defensivo por si varían las etiquetas)
                const fecha = s.getElementsByTagName("fecha")[0]?.textContent || "";
                const hora = s.getElementsByTagName("hora")[0]?.textContent || "";
                const lat = parseFloat(s.getElementsByTagName("lat")[0]?.textContent || s.getElementsByTagName("latitud")[0]?.textContent);
                const lng = parseFloat(s.getElementsByTagName("lon")[0]?.textContent || s.getElementsByTagName("longitud")[0]?.textContent);
                const mag = parseFloat(s.getElementsByTagName("magnitud")[0]?.textContent || "0");
                const prof = s.getElementsByTagName("profundidad")[0]?.textContent || "";
                const epi = s.getElementsByTagName("epicentro")[0]?.textContent || "Zona no especificada";

                if (!isNaN(lat) && !isNaN(lng)) {
                  // Estilizado del pin según magnitud
                  let color = '#3b82f6'; // Azul (< 3)
                  let radius = 5;
                  if (mag >= 3 && mag < 4.5) { color = '#eab308'; radius = 8; } // Amarillo
                  if (mag >= 4.5 && mag < 6) { color = '#f97316'; radius = 12; } // Naranja
                  if (mag >= 6) { color = '#ef4444'; radius = 16; } // Rojo

                  const marker = L.circleMarker([lat, lng], {
                    radius: radius,
                    fillColor: color,
                    color: '#ffffff',
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.8
                  });

                  const popupText = "<b>" + epi + "</b><br/>" +
                                    "Magnitud: " + mag + "<br/>" +
                                    "Profundidad: " + prof + " km<br/>" +
                                    "Fecha: " + fecha + " a las " + hora;
                  
                  marker.bindPopup(popupText);
                  layerGroup.addLayer(marker);

                  datosTabla.push({ fecha, hora, epi, mag, prof, color });
                }
              }
              
              window.parent.postMessage({ type: 'INPRES_DATA_READY', payload: datosTabla }, '*');
              statusDiv.style.display = 'none';
            } catch(e) {
              statusDiv.innerText = "Error cargando INPRES";
            }
          }

          cargarSismos();
          setInterval(cargarSismos, 300000); // Refresco cada 5 mins
        });
      </script>
    </body>
    </html>
  `;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans">
      
      {/* HEADER */}
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Dashboard Geofísico y Sismológico</h1>
        <p className="text-gray-500 mt-2">Plataforma integral de monitoreo de actividad tectónica, reportes oficiales y fuentes abiertas (OSINT).</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* WIDGET 1: MAPA INPRES (XML + IGN) */}
        <div className="lg:col-span-8 bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col">
          <div className="mb-3">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></span>
              Sismos Sentidos (Red INPRES)
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              [Descripción editable]: Mapa interactivo alimentado por el XML oficial de sismos sentidos del INPRES. Cartografía base provista por el IGN. El tamaño y color de los marcadores indica la magnitud del evento.
            </p>
          </div>
          <div className="w-full h-[450px] rounded-xl overflow-hidden border border-gray-200 relative bg-gray-100 flex-grow">
            <iframe 
              srcDoc={mapHtml} 
              className="w-full h-full border-0 absolute inset-0" 
              title="Mapa INPRES XML" 
              sandbox="allow-scripts allow-same-origin allow-popups"
            />
          </div>
        </div>

        {/* WIDGET 2: LISTA INPRES (EMBED DESKTOP) */}
        <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col">
          <div className="mb-3">
            <h2 className="text-lg font-bold text-gray-800">Últimos Registros (INPRES)</h2>
            <p className="text-xs text-gray-500 mt-1">
              [Descripción editable]: Visualización directa del listado tabular del INPRES. Útil para contrastar rápidamente los datos del mapa con la emisión oficial.
            </p>
          </div>
          <div className="w-full rounded-xl overflow-hidden border border-gray-200 bg-gray-100 flex-grow relative h-[450px]">
            {/* Se usa un div con overflow para cortar los headers del sitio de inpres si es necesario, 
                pero el iframe carga la web completa */}
            <iframe 
              src="https://www.inpres.gob.ar/desktop/" 
              className="w-full h-full border-0" 
              title="Lista INPRES" 
            />
          </div>
        </div>

        {/* WIDGET 3: VOLCANO DISCOVERY MAP */}
        <div className="lg:col-span-6 bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col">
          <div className="mb-3">
            <h2 className="text-lg font-bold text-gray-800">Monitoreo Global (VolcanoDiscovery)</h2>
            <p className="text-xs text-gray-500 mt-1">
              [Descripción editable]: Integración del mapa de sismicidad de Volcano Discovery enfocado en Argentina (Zoom L=8). Permite ver fuentes alternativas y actividad tectónica transfronteriza.
            </p>
          </div>
          <div className="w-full h-[400px] rounded-xl overflow-hidden border border-gray-200 bg-gray-100">
            <iframe 
              src="https://earthquakes.volcanodiscovery.com/map/Argentina?L=8" 
              className="w-full h-full border-0" 
              title="Volcano Discovery Map" 
            />
          </div>
        </div>

        {/* WIDGET 4: MONITORES OSINT (REDES Y NOTICIAS) */}
        <div className="lg:col-span-6 bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-gray-800">Fuentes Abiertas (Social & Noticias)</h2>
            <p className="text-xs text-gray-500 mt-1">
              [Descripción editable]: Accesos rápidos a consultas automatizadas de OSINT. Debido a políticas de seguridad globales (CSP), las búsquedas de redes sociales no pueden embeberse visualmente y se operan mediante enlaces dedicados.
            </p>
          </div>
          
          <div className="flex flex-col gap-4 flex-grow justify-center">
            
            {/* Botón Facebook */}
            <a 
              href="https://www.facebook.com/search/top/?q=INPRES" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 rounded-xl border border-blue-100 bg-blue-50 hover:bg-blue-100 transition-colors group"
            >
              <div className="flex flex-col">
                <span className="font-bold text-blue-900 group-hover:text-blue-700">Radar Social: Facebook</span>
                <span className="text-xs text-blue-600/80 mt-1">Buscar reportes ciudadanos y posts públicos sobre "INPRES".</span>
              </div>
              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
            </a>

            {/* Botón Noticias Sismos */}
            <a 
              href="https://www.google.com/search?q=INPRES&tbm=nws&tbs=qdr:d" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 rounded-xl border border-emerald-100 bg-emerald-50 hover:bg-emerald-100 transition-colors group"
            >
              <div className="flex flex-col">
                <span className="font-bold text-emerald-900 group-hover:text-emerald-700">Noticias: Sismología (24hs)</span>
                <span className="text-xs text-emerald-600/80 mt-1">Filtro de Google News para menciones institucionales recientes.</span>
              </div>
              <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
            </a>

            {/* Botón Noticias Deslizamientos */}
            <a 
              href="https://www.google.com/search?q=deslizamiento+OR+alud+OR+derrumbe+argentina&tbm=nws&tbs=qdr:w" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 rounded-xl border border-orange-100 bg-orange-50 hover:bg-orange-100 transition-colors group"
            >
              <div className="flex flex-col">
                <span className="font-bold text-orange-900 group-hover:text-orange-700">Noticias: Deslizamientos (7 días)</span>
                <span className="text-xs text-orange-600/80 mt-1">Alerta sobre movimientos en masa, aludes y derrumbes.</span>
              </div>
              <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
            </a>

          </div>
        </div>

      </div>
    </div>
  );
}
