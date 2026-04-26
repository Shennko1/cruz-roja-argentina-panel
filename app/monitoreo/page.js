'use client';

import React from 'react';

export default function MapaAlertasSMN() {
  
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
          top: 50%; left: 50%; 
          transform: translate(-50%, -50%); 
          z-index: 1000; 
          background: white; 
          padding: 12px 24px; 
          border-radius: 8px; 
          font-weight: bold; 
          box-shadow: 0 4px 6px rgba(0,0,0,0.1); 
          font-size: 14px; 
          color: #334155;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
      </style>
    </head>
    <body>
      <div id="loading" class="loading">Sincronizando feed SMN...</div>
      <div id="map"></div>
      
      <script>
        document.addEventListener("DOMContentLoaded", function() {
          // 1. Iniciamos el mapa Leaflet
          var map = L.map('map').setView([-38.4161, -63.6167], 5);
          L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            attribution: '© OpenStreetMap'
          }).addTo(map);

          // Agrupador para poder borrar alertas viejas al actualizar
          var layerGroup = L.layerGroup().addTo(map);

          // 2. Función principal de lectura y dibujo
          async function cargarAlertas() {
            try {
              document.getElementById('loading').style.display = 'block';
              layerGroup.clearLayers(); // Limpiamos el mapa antes de cargar las nuevas

              const proxyUrl = 'https://api.allorigins.win/raw?url=';
              const rssUrl = encodeURIComponent('https://ssl.smn.gob.ar/feeds/CAP/rss_alertaCAP_nuevo.xml');
              
              // Descargamos el índice principal
              const rssRes = await fetch(proxyUrl + rssUrl);
              const rssText = await rssRes.text();
              
              // Usamos DOMParser para leer el XML de forma segura
              const parser = new DOMParser();
              const rssDoc = parser.parseFromString(rssText, "text/xml");
              
              // Extraemos todos los links secundarios
              const items = rssDoc.querySelectorAll("item link");
              const links = Array.from(items).map(node => node.textContent);

              // Recorremos cada link para extraer la alerta
              for (const link of links) {
                if (!link.endsWith('.xml')) continue; 

                const capRes = await fetch(proxyUrl + encodeURIComponent(link));
                const capText = await capRes.text();
                const capDoc = parser.parseFromString(capText, "text/xml");

                const severityNode = capDoc.querySelector("severity");
                const severity = severityNode ? severityNode.textContent : 'Unknown';
                
                const headlineNode = capDoc.querySelector("headline");
                const headline = headlineNode ? headlineNode.textContent : 'Alerta Meteorológica';

                const polygonNodes = capDoc.querySelectorAll("polygon");
                
                polygonNodes.forEach(polyNode => {
                  const polyString = polyNode.textContent;
                  if (!polyString) return;

                  // Traducimos las coordenadas del SMN a Leaflet
                  const coords = polyString.trim().split(' ').map(par => {
                    const partes = par.split(',');
                    return [parseFloat(partes[0]), parseFloat(partes[1])];
                  });

                  // Definimos el semáforo de colores
                  let color = '#eab308'; // Amarillo por defecto
                  if (severity === 'Severe') color = '#f97316'; // Naranja
                  if (severity === 'Extreme') color = '#ef4444'; // Rojo

                  // Trazamos el polígono
                  var polygon = L.polygon(coords, {
                    color: color,
                    fillColor: color,
                    fillOpacity: 0.4,
                    weight: 2
                  });
                  
                  polygon.bindPopup("<div style='font-family:sans-serif;'><b>" + headline + "</b><br/><span style='color:#64748b;font-size:12px;'>Nivel: " + severity + "</span></div>");
                  layerGroup.addLayer(polygon);
                });
              }
              
              document.getElementById('loading').style.display = 'none';

            } catch (error) {
              console.error("Error cargando CAP:", error);
              document.getElementById('loading').innerText = "Error de conexión con el SMN.";
            }
          }

          // Ejecutamos al abrir la página
          cargarAlertas();
          
          // Actualización automática cada 15 minutos (900000 ms)
          setInterval(cargarAlertas, 900000);
        });
      </script>
    </body>
    </html>
  `;

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm font-sans">
      <div className="border-b border-gray-200 pb-2 mb-4">
        <h2 className="text-lg font-bold text-gray-800 uppercase tracking-tight">
          Radar de Alertas Oficiales (SMN)
        </h2>
        <p className="text-xs text-gray-600 mt-1 leading-relaxed">
          Lector automático de Protocolo CAP. El sistema rastrea el índice oficial y mapea los polígonos emitidos por el Servicio Meteorológico Nacional en tiempo real.
        </p>
      </div>

      <div className="w-full h-[600px] rounded-xl overflow-hidden border border-gray-200 relative bg-gray-50 mb-6 z-0">
        <iframe 
          srcDoc={mapHtml} 
          className="w-full h-full border-0 absolute inset-0" 
          title="Mapa CAP SMN" 
          sandbox="allow-scripts allow-same-origin allow-popups"
        />
      </div>

      <div className="flex flex-wrap gap-6 text-xs font-bold uppercase tracking-widest justify-center bg-gray-50 py-3 rounded-lg border border-gray-100">
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-full bg-[#ef4444] shadow-sm"></span>
          <span className="text-gray-700">Alerta Roja</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-full bg-[#f97316] shadow-sm"></span>
          <span className="text-gray-700">Alerta Naranja</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-full bg-[#eab308] shadow-sm"></span>
          <span className="text-gray-700">Alerta Amarilla</span>
        </div>
      </div>
    </div>
  );
}
