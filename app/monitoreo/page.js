'use client';

import React from 'react';

export default function MapaAlertasSMN() {
  
  // Tu truco de inyección: armamos el HTML completo como un texto
  const mapHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css" />
      <script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js"></script>
      <style>
        body { margin: 0; padding: 0; font-family: sans-serif; background: #f8fafc; }
        #map { width: 100%; height: 100vh; z-index: 1; }
        .loading { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 1000; background: white; padding: 10px 20px; border-radius: 8px; font-weight: bold; box-shadow: 0 4px 6px rgba(0,0,0,0.1); font-family: sans-serif; }
      </style>
    </head>
    <body>
      <div id="loading" class="loading">Sincronizando feed SMN...</div>
      <div id="map"></div>
      
      <script>
        document.addEventListener("DOMContentLoaded", function() {
          // 1. Iniciamos el mapa
          var map = L.map('map').setView([-38.4161, -63.6167], 5);
          L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            attribution: '© OpenStreetMap'
          }).addTo(map);

          // 2. Función para procesar el SMN usando un proxy para evitar bloqueo CORS
          async function cargarAlertas() {
            try {
              // Leemos el índice principal
              const proxyUrl = 'https://api.allorigins.win/raw?url=';
              const rssUrl = encodeURIComponent('https://ssl.smn.gob.ar/feeds/CAP/rss_alertaCAP_nuevo.xml');
              
              const rssRes = await fetch(proxyUrl + rssUrl);
              const rssText = await rssRes.text();

              // Buscamos los links a cada alerta
              const linksMatches = [...rssText.matchAll(/<link>(https?:\\/\\/.*?\\.xml)<\\/link>/g)];
              const links = linksMatches.map(m => m[1]).slice(0, 10); // Limitamos a 10 para no saturar

              for (const link of links) {
                const capRes = await fetch(proxyUrl + encodeURIComponent(link));
                const capText = await capRes.text();

                // Extraemos gravedad y polígonos
                const severityMatch = capText.match(/<severity>(.*?)<\\/severity>/);
                const severity = severityMatch ? severityMatch[1] : 'Unknown';
                
                const headlineMatch = capText.match(/<headline>(.*?)<\\/headline>/);
                const headline = headlineMatch ? headlineMatch[1] : 'Alerta SMN';

                const polygonsMatches = [...capText.matchAll(/<polygon>(.*?)<\\/polygon>/g)];
                
                polygonsMatches.forEach(m => {
                  const polyString = m[1];
                  // El SMN da formato "-34.5,-58.4 -35.2,-59.1"
                  const coords = polyString.trim().split(' ').map(par => {
                    const partes = par.split(',');
                    return [parseFloat(partes[0]), parseFloat(partes[1])];
                  });

                  // Color según gravedad
                  let color = '#eab308'; // Amarillo
                  if (severity === 'Severe') color = '#f97316'; // Naranja
                  if (severity === 'Extreme') color = '#ef4444'; // Rojo

                  // Dibujamos el polígono en Leaflet
                  var polygon = L.polygon(coords, {
                    color: color,
                    fillColor: color,
                    fillOpacity: 0.4,
                    weight: 2
                  }).addTo(map);

                  polygon.bindPopup("<b>" + headline + "</b><br/>Nivel: " + severity);
                });
              }
              
              document.getElementById('loading').style.display = 'none';

            } catch (error) {
              console.error("Error cargando CAP:", error);
              document.getElementById('loading').innerText = "Error al cargar alertas.";
            }
          }

          cargarAlertas();
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
        <p className="text-xs text-gray-600 mt-1">
          Lector automático de Protocolo CAP (Common Alerting Protocol).
        </p>
      </div>

      {/* Contenedor del Iframe usando tu método srcDoc */}
      <div className="w-full h-[500px] rounded-xl overflow-hidden border border-gray-200 relative bg-gray-50">
        <iframe 
          srcDoc={mapHtml} 
          className="w-full h-full border-0 absolute inset-0" 
          title="Mapa CAP SMN" 
          sandbox="allow-scripts allow-same-origin allow-popups"
        />
      </div>

      {/* Leyenda */}
      <div className="mt-4 flex flex-wrap gap-4 text-xs font-bold uppercase tracking-widest justify-center">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#ef4444]"></span>
          <span className="text-gray-600">Alerta Roja</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#f97316]"></span>
          <span className="text-gray-600">Alerta Naranja</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#eab308]"></span>
          <span className="text-gray-600">Alerta Amarilla</span>
        </div>
      </div>
    </div>
  );
}
