'use client';

import React, { useEffect, useState } from 'react';

export default function MapaAlertasSMN() {
  const [alertasTabla, setAlertasTabla] = useState([]);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data && event.data.type === 'CAP_DATA_READY') {
        setAlertasTabla(event.data.payload);
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
      <style>body { margin: 0; padding: 0; } #map { width: 100%; height: 100vh; }</style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        document.addEventListener("DOMContentLoaded", async function() {
          var map = L.map('map').setView([-38.4161, -63.6167], 5);
          L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png').addTo(map);
          const layerGroup = L.layerGroup().addTo(map);

          const proxyUrl = 'https://api.codetabs.com/v1/proxy?quest=';
          const rssUrl = 'https://ssl.smn.gob.ar/feeds/CAP/rss_alertaCAP_nuevo.xml';
          
          const rssRes = await fetch(proxyUrl + encodeURIComponent(rssUrl));
          const xmlText = await rssRes.text();
          const parser = new DOMParser();
          const doc = parser.parseFromString(xmlText, "application/xml");
          const links = Array.from(doc.getElementsByTagName("link"))
            .map(l => l.textContent)
            .filter(url => url.includes('.xml') && !url.includes('rss_alertaCAP'));

          const datosProcesados = [];

          for (const link of links) {
            try {
              const res = await fetch(proxyUrl + encodeURIComponent(link));
              const capText = await res.text();
              const capDoc = parser.parseFromString(capText, "application/xml");

              // Extracción directa del XML
              const areaDesc = capDoc.getElementsByTagName("areaDesc")[0]?.textContent || "Zona no especificada";
              const event = capDoc.getElementsByTagName("event")[0]?.textContent || "Evento";
              const severity = capDoc.getElementsByTagName("severity")[0]?.textContent || "Minor";
              
              // Determinar color basado en severidad real del CAP
              let color = '#eab308'; // Amarillo
              if (severity === 'Extreme') color = '#ef4444';
              if (severity === 'Severe') color = '#f97316';

              datosProcesados.push({ areaDesc, event, severity, color });

              // Dibujar polígonos si existen
              const polys = capDoc.getElementsByTagName("polygon");
              for (let p of polys) {
                const coords = p.textContent.trim().split(' ').map(c => c.split(',').map(Number));
                L.polygon(coords, { color: color, fillOpacity: 0.4 }).addTo(layerGroup);
              }
            } catch(e) { console.error(e); }
          }
          window.parent.postMessage({ type: 'CAP_DATA_READY', payload: datosProcesados }, '*');
        });
      </script>
    </body>
    </html>
  `;

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <h2 className="text-lg font-bold mb-4 uppercase">Alertas Activas (SMN Data)</h2>
      <div className="w-full h-[500px] mb-6 rounded-lg overflow-hidden border border-gray-200">
        <iframe srcDoc={mapHtml} className="w-full h-full border-0" sandbox="allow-scripts" />
      </div>
      <table className="w-full text-sm">
        <thead className="text-gray-500 uppercase text-xs">
          <tr><th className="py-2 text-left">Zona (Fuente: areaDesc)</th><th className="py-2">Fenómeno</th></tr>
        </thead>
        <tbody className="divide-y">
          {alertasTabla.map((a, i) => (
            <tr key={i}>
              <td className="py-3 font-medium">{a.areaDesc}</td>
              <td className="py-3">{a.event}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
