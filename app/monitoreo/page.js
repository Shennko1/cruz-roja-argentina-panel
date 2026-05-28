'use client';

import React, { useEffect, useState } from 'react';

export default function MapaAlertasSMN() {
  const [alertasTabla, setAlertasTabla] = useState([]);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data && event.data.type === 'CAP_DATA_READY') {
        // Recibimos la data cruda y la ordenamos por severidad
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
      <style>
        body { margin: 0; padding: 0; font-family: sans-serif; background: #f8fafc; }
        #map { width: 100%; height: 100vh; }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        document.addEventListener("DOMContentLoaded", function() {
          var map = L.map('map').setView([-38.4161, -63.6167], 5);
          L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png').addTo(map);
          var layerGroup = L.layerGroup().addTo(map);

          async function cargarAlertas() {
            const proxyUrl = 'https://api.codetabs.com/v1/proxy?quest=';
            const rssRes = await fetch(proxyUrl + encodeURIComponent('https://ssl.smn.gob.ar/feeds/CAP/rss_alertaCAP_nuevo.xml'));
            const rssText = await rssRes.text();
            const parser = new DOMParser();
            const rssDoc = parser.parseFromString(rssText, "application/xml");
            const links = Array.from(rssDoc.getElementsByTagName("link")).map(n => n.textContent).filter(url => url.includes('.xml') && !url.includes('rss_alertaCAP'));

            const caps = await Promise.all([...new Set(links)].map(link => 
              fetch(proxyUrl + encodeURIComponent(link)).then(res => res.text()).catch(() => null)
            ));

            const resultados = caps.map(text => {
              if (!text) return null;
              const doc = parser.parseFromString(text, "application/xml");
              const areaDesc = doc.getElementsByTagName("areaDesc")[0]?.textContent || "Zona sin especificar";
              const severity = doc.getElementsByTagName("severity")[0]?.textContent;
              const event = doc.getElementsByTagName("event")[0]?.textContent;
              const onset = doc.getElementsByTagName("onset")[0]?.textContent;
              const expires = doc.getElementsByTagName("expires")[0]?.textContent;
              
              return { areaDesc, severity, event, onset, expires };
            }).filter(Boolean);

            window.parent.postMessage({ type: 'CAP_DATA_READY', payload: resultados }, '*');
          }
          cargarAlertas();
        });
      </script>
    </body>
    </html>
  `;

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <h2 className="text-lg font-bold mb-4 uppercase text-gray-800">Alertas SMN (Fuente Directa)</h2>
      <div className="w-full h-[500px] mb-6 rounded-lg overflow-hidden border border-gray-200">
        <iframe srcDoc={mapHtml} className="w-full h-full border-0" sandbox="allow-scripts" />
      </div>

      <table className="w-full text-sm">
        <thead className="bg-gray-50 uppercase text-gray-500 text-xs">
          <tr>
            <th className="px-4 py-3 text-left">Zona afectada (Área)</th>
            <th className="px-4 py-3 text-left">Fenómeno</th>
            <th className="px-4 py-3 text-left">Nivel</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {alertasTabla.map((alerta, i) => (
            <tr key={i} className="hover:bg-gray-50">
              <td className="px-4 py-3 font-semibold text-gray-700">{alerta.areaDesc}</td>
              <td className="px-4 py-3 text-gray-600">{alerta.event}</td>
              <td className="px-4 py-3">
                <span className="px-2 py-1 rounded text-[10px] font-bold bg-gray-200">{alerta.severity}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
