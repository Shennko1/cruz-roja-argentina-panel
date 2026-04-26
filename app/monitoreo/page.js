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
      <div id="loading" class="loading">Iniciando radar...</div>
      <div id="map"></div>
      
      <script>
        document.addEventListener("DOMContentLoaded", function() {
          var map = L.map('map').setView([-38.4161, -63.6167], 5);
          L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            attribution: '© OpenStreetMap'
          }).addTo(map);

          var layerGroup = L.layerGroup().addTo(map);

          async function cargarAlertas() {
            const statusDiv = document.getElementById('loading');
            
            try {
              statusDiv.style.display = 'block';
              statusDiv.innerText = "Conectando al índice del SMN...";
              layerGroup.clearLayers();

              const proxyUrl = 'https://api.codetabs.com/v1/proxy?quest=';
              const timestamp = new Date().getTime();
              const targetUrl = 'https://ssl.smn.gob.ar/feeds/CAP/rss_alertaCAP_nuevo.xml?nocache=' + timestamp;
              
              const rssRes = await fetch(proxyUrl + encodeURIComponent(targetUrl));
              const rssText = await rssRes.text();

              const parser = new DOMParser();
              const rssDoc = parser.parseFromString(rssText, "application/xml");
              
              const linkNodes = rssDoc.getElementsByTagName("link");
              const links = [];
              
              // 1. Recopilamos todos los links
              for (let i = 0; i < linkNodes.length; i++) {
                const url = linkNodes[i].textContent;
                if (url && url.includes('.xml') && !url.includes('rss_alertaCAP')) {
                  links.push(url);
                }
              }

              // 2. Filtro Anti-Duplicados: Eliminamos URLs idénticas en el índice
              const linksUnicos = [...new Set(links)];

              if (linksUnicos.length === 0) {
                statusDiv.innerText = "Territorio despejado (Sin Alertas)";
                setTimeout(() => { statusDiv.style.display = 'none'; }, 4000);
                return;
              }

              statusDiv.innerText = "Analizando " + linksUnicos.length + " reportes...";
              
              let alertasDibujadas = 0;
              // 3. Memoria Fotográfica: Guarda los polígonos ya dibujados
              const poligonosYaDibujados = new Set();

              for (const link of linksUnicos) {
                try {
                  const capRes = await fetch(proxyUrl + encodeURIComponent(link + "?nocache=" + timestamp));
                  const capText = await capRes.text();
                  const capDoc = parser.parseFromString(capText, "application/xml");

                  // Filtro de Caducidad (Descartamos alertas vencidas)
                  const expiresNodes = capDoc.getElementsByTagName("expires");
                  if (expiresNodes.length > 0) {
                    const fechaExpiracion = new Date(expiresNodes[0].textContent);
                    const ahora = new Date();
                    if (fechaExpiracion < ahora) continue; 
                  }

                  const severityNodes = capDoc.getElementsByTagName("severity");
                  const severity = severityNodes.length > 0 ? severityNodes[0].textContent : 'Unknown';
                  
                  const headlineNodes = capDoc.getElementsByTagName("headline");
                  const headline = headlineNodes.length > 0 ? headlineNodes[0].textContent : 'Alerta Meteorológica';

                  const polygonNodes = capDoc.getElementsByTagName("polygon");
                  
                  for (let j = 0; j < polygonNodes.length; j++) {
                    const polyString = polygonNodes[j].textContent.trim();
                    if (!polyString) continue;

                    // 4. EL FILTRO MAGICO: Si ya dibujamos estas coordenadas exactas, las salteamos
                    if (poligonosYaDibujados.has(polyString)) continue;
                    poligonosYaDibujados.add(polyString);

                    const coords = polyString.split(' ').map(par => {
                      const partes = par.split(',');
                      return [parseFloat(partes[0]), parseFloat(partes[1])];
                    });

                    let color = '#eab308'; // Amarillo
                    if (severity === 'Severe') color = '#f97316'; // Naranja
                    if (severity === 'Extreme') color = '#ef4444'; // Rojo

                    var polygon = L.polygon(coords, {
                      color: color,
                      fillColor: color,
                      fillOpacity: 0.4, // Ahora siempre será translúcido
                      weight: 2
                    });
                    
                    polygon.bindPopup("<div style='font-family:sans-serif;'><b>" + headline + "</b><br/><span style='color:#64748b;font-size:12px;'>Gravedad: " + severity + "</span></div>");
                    layerGroup.addLayer(polygon);
                    
                    alertasDibujadas++;
                  }
                } catch (e) {
                  // Error silencioso para no frenar el ciclo si falla un solo link
                }
              }
              
              statusDiv.innerText = "Mapa limpio: " + alertasDibujadas + " zonas bajo alerta";
              setTimeout(() => { statusDiv.style.display = 'none'; }, 4000);

            } catch (error) {
              statusDiv.innerText = "Reintentando conexión...";
            }
          }

          cargarAlertas();
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
          Lector automático de Protocolo CAP. El sistema cuenta con filtros de caducidad y deduplicación de geometría para evitar saturación visual en zonas con múltiples avisos concurrentes.
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
