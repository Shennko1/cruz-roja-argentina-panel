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
          transition: all 0.3s ease;
        }
      </style>
    </head>
    <body>
      <div id="loading" class="loading">Sincronizando con INPRES...</div>
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
              
              const sismos = xmlDoc.getElementsByTagName("sismo");
              const datosTabla = [];

              for (let i = 0; i < sismos.length; i++) {
                const s = sismos[i];
                
                const fecha = s.getElementsByTagName("fecha")[0]?.textContent || "";
                const hora = s.getElementsByTagName("hora")[0]?.textContent || "";
                const lat = parseFloat(s.getElementsByTagName("lat")[0]?.textContent || s.getElementsByTagName("latitud")[0]?.textContent);
                const lng = parseFloat(s.getElementsByTagName("lon")[0]?.textContent || s.getElementsByTagName("longitud")[0]?.textContent);
                const mag = parseFloat(s.getElementsByTagName("magnitud")[0]?.textContent || "0");
                const prof = s.getElementsByTagName("profundidad")[0]?.textContent || "";
                const epi = s.getElementsByTagName("epicentro")[0]?.textContent || "Zona no especificada";

                if (!isNaN(lat) && !isNaN(lng)) {
                  let color = '#3b82f6'; // Azul (< 3)
                  let radius = 6;
                  if (mag >= 3 && mag < 4.5) { color = '#eab308'; radius = 10; } // Amarillo
                  if (mag >= 4.5 && mag < 6) { color = '#f97316'; radius = 14; } // Naranja
                  if (mag >= 6) { color = '#ef4444'; radius = 18; } // Rojo

                  const marker = L.circleMarker([lat, lng], {
                    radius: radius,
                    fillColor: color,
                    color: '#ffffff',
                    weight: 2,
                    opacity: 1,
                    fillOpacity: 0.8
                  });

                  const popupHTML = "<div style='font-family:sans-serif; min-width:180px;'>" +
                                    "<b style='color:#1e293b; font-size:14px;'>" + epi + "</b><br/>" +
                                    "<span style='display:inline-block; margin:6px 0; padding:3px 8px; border-radius:4px; background:" + color + "; color:white; font-size:11px; font-weight:bold;'>Magnitud: " + mag + "</span><br/>" +
                                    "<div style='background:#f1f5f9; padding:8px; border-radius:4px; font-size:12px; color:#475569; margin-top:4px;'>" +
                                    "<b>Profundidad:</b> " + prof + " km<br/>" +
                                    "<b>Fecha:</b> " + fecha + " a las " + hora + "</div>" +
                                    "</div>";
                  
                  marker.bindPopup(popupHTML);
                  layerGroup.addLayer(marker);

                  datosTabla.push({ fecha, hora, epi, mag, prof, color });
                }
              }
              
              window.parent.postMessage({ type: 'INPRES_DATA_READY', payload: datosTabla }, '*');
              statusDiv.innerText = "Mapa listo: " + datosTabla.length + " sismos sentidos";
              setTimeout(() => { statusDiv.style.display = 'none'; }, 4000);
            } catch(e) {
              statusDiv.innerText = "Error cargando INPRES";
            }
          }

          cargarSismos();
          setInterval(cargarSismos, 300000);
        });
      </script>
    </body>
    </html>
  `;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-sans">
      
      {/* 1. SECCIÓN INPRES: MAPA + TABLA (Estilo SMN Exacto) */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm col-span-12">
        <div className="border-b border-gray-200 pb-2 mb-4">
          <h2 className="text-lg font-bold text-gray-800 uppercase tracking-tight">
            Panel Automático de Sismos Sentidos (INPRES)
          </h2>
          <p className="text-xs text-gray-600 mt-1 leading-relaxed">
            Mapa interactivo y registro tabular alimentado por el XML oficial de sismos sentidos.
          </p>
        </div>

        <div className="w-full h-[600px] rounded-xl overflow-hidden border border-gray-200 relative bg-gray-50 mb-6 z-0">
          <iframe 
            srcDoc={mapHtml} 
            className="w-full h-full border-0 absolute inset-0" 
            title="Mapa INPRES XML" 
            sandbox="allow-scripts allow-same-origin allow-popups"
          />
        </div>

        <div className="flex flex-wrap gap-6 text-xs font-bold uppercase tracking-widest justify-center bg-gray-50 py-3 rounded-lg border border-gray-100 mb-6">
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-full bg-[#ef4444] shadow-sm"></span>
            <span className="text-gray-700">Mag ≥ 6.0</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-full bg-[#f97316] shadow-sm"></span>
            <span className="text-gray-700">Mag 4.5 - 5.9</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-full bg-[#eab308] shadow-sm"></span>
            <span className="text-gray-700">Mag 3.0 - 4.4</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-full bg-[#3b82f6] shadow-sm"></span>
            <span className="text-gray-700">Mag &lt; 3.0</span>
          </div>
        </div>

        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <div className="bg-gray-100 px-4 py-3 border-b border-gray-200">
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-tight">Resumen Operativo de Eventos Activos</h3>
          </div>
          <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 font-semibold w-1/6">Magnitud</th>
                  <th className="px-4 py-3 font-semibold w-3/6">Epicentro</th>
                  <th className="px-4 py-3 font-semibold w-1/6">Profundidad</th>
                  <th className="px-4 py-3 font-semibold w-1/6">Fecha y Hora</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sismosTabla.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-4 py-6 text-center text-gray-500 text-sm">
                      Analizando reportes o sin sismos recientes.
                    </td>
                  </tr>
                ) : (
                  sismosTabla.map((sismo, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 pl-6">
                        <span 
                          className="px-2.5 py-1 rounded-md text-white text-xs font-bold whitespace-nowrap" 
                          style={{ backgroundColor: sismo.color }}
                        >
                          Mag: {sismo.mag}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-800">{sismo.epi}</td>
                      <td className="px-4 py-3 text-xs">
                        <b className="text-gray-700">{sismo.prof} km</b>
                      </td>
                      <td className="px-4 py-3 text-xs">
                        <div className="flex flex-col gap-0.5">
                          <span>{sismo.fecha}</span>
                          <span>{sismo.hora} hs</span>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 2. SECCIÓN VOLCANO DISCOVERY (Estilo SMN Aplicado) */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm col-span-12 lg:col-span-6">
        <div className="border-b border-gray-200 pb-2 mb-4">
          <h2 className="text-lg font-bold text-gray-800 uppercase tracking-tight">
            Monitoreo Global (VolcanoDiscovery)
          </h2>
          <p className="text-xs text-gray-600 mt-1 leading-relaxed">
            Mapa de sismicidad enfocado en Argentina para evaluar actividad tectónica transfronteriza.
          </p>
        </div>
        <div className="w-full h-[400px] rounded-xl overflow-hidden border border-gray-200 relative bg-gray-50 z-0">
          <iframe 
            src="https://earthquakes.volcanodiscovery.com/map/Argentina?L=8" 
            className="w-full h-full border-0 absolute inset-0" 
            title="Volcano Discovery Map" 
          />
        </div>
      </div>

      {/* 3. SECCIÓN BÚSQUEDAS EXTERNAS (Estilo SMN Aplicado) */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm col-span-12 lg:col-span-6 flex flex-col">
        <div className="border-b border-gray-200 pb-2 mb-4">
          <h2 className="text-lg font-bold text-gray-800 uppercase tracking-tight">
            Búsquedas Externas (Redes y Noticias)
          </h2>
          <p className="text-xs text-gray-600 mt-1 leading-relaxed">
            Accesos rápidos a consultas en redes sociales y agregadores de noticias para relevamiento de impacto.
          </p>
        </div>
        
        <div className="flex flex-col gap-4 flex-grow justify-center">
          <a 
            href="https://www.facebook.com/search/top/?q=INPRES" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-between p-4 rounded-xl border border-blue-100 bg-blue-50 hover:bg-blue-100 transition-colors group"
          >
            <div className="flex flex-col">
              <span className="font-bold text-blue-900 group-hover:text-blue-700">Facebook: Búsqueda "INPRES"</span>
              <span className="text-xs text-blue-600/80 mt-1">Reportes ciudadanos y publicaciones públicas.</span>
            </div>
            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
          </a>

          <a 
            href="https://www.google.com/search?q=INPRES&tbm=nws&tbs=qdr:d" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-between p-4 rounded-xl border border-emerald-100 bg-emerald-50 hover:bg-emerald-100 transition-colors group"
          >
            <div className="flex flex-col">
              <span className="font-bold text-emerald-900 group-hover:text-emerald-700">Google News: Sismología (24hs)</span>
              <span className="text-xs text-emerald-600/80 mt-1">Filtro de menciones institucionales recientes.</span>
            </div>
            <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
          </a>

          <a 
            href="https://www.google.com/search?q=deslizamiento+OR+alud+OR+derrumbe+argentina&tbm=nws&tbs=qdr:w" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-between p-4 rounded-xl border border-orange-100 bg-orange-50 hover:bg-orange-100 transition-colors group"
          >
            <div className="flex flex-col">
              <span className="font-bold text-orange-900 group-hover:text-orange-700">Google News: Deslizamientos (7 días)</span>
              <span className="text-xs text-orange-600/80 mt-1">Alertas sobre movimientos en masa, aludes y derrumbes.</span>
            </div>
            <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
          </a>
        </div>
      </div>

      {/* 4. SECCIÓN EMBED INPRES (Estilo SMN, Ancho Completo Abajo) */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm col-span-12">
        <div className="border-b border-gray-200 pb-2 mb-4">
          <h2 className="text-lg font-bold text-gray-800 uppercase tracking-tight">
            Registro Oficial del INPRES
          </h2>
          <p className="text-xs text-gray-600 mt-1 leading-relaxed">
            Visualización directa del sitio web oficial para contrastar rápidamente los datos parseados.
          </p>
        </div>
        <div className="w-full h-[600px] rounded-xl overflow-hidden border border-gray-200 relative bg-gray-50 z-0">
          <iframe 
            src="https://www.inpres.gob.ar/desktop/" 
            className="w-full h-full border-0 absolute inset-0" 
            title="Lista INPRES Oficial" 
          />
        </div>
      </div>

    </div>
  );
}
