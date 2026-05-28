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
      <div id="loading" class="loading">Iniciando sistema...</div>
      <div id="map"></div>
      
      <script>
        document.addEventListener("DOMContentLoaded", function() {
          var map = L.map('map', { center: [-38.4161, -63.6167], zoom: 5 });

          // Capa Base IGN
          new L.tileLayer('https://wms.ign.gob.ar/geoserver/gwc/service/tms/1.0.0/mapabase_gris@EPSG%3A3857@png/{z}/{x}/{-y}.png', {
            minZoom: 1, maxZoom: 20,
            attribution: 'IGN | Cruz Roja Argentina'
          }).addTo(map);

          // Capa Provincias y Capitales IGN
          new L.tileLayer.wms('https://wms.ign.gob.ar/geoserver/ows?', {
            layers: 'provincia,capa_capitales',
            format: 'image/png',
            transparent: true,
            opacity: 0.6
          }).addTo(map);

          var layerGroup = L.layerGroup().addTo(map);
          const provsDic = [
            { n: "Buenos Aires", c: ["buenos aires"] }, { n: "CABA", c: ["caba", "ciudad autónoma de buenos aires", "capital federal"] },
            { n: "Catamarca", c: ["catamarca"] }, { n: "Chaco", c: ["chaco"] }, { n: "Chubut", c: ["chubut"] },
            { n: "Córdoba", c: ["córdoba", "cordoba"] }, { n: "Corrientes", c: ["corrientes"] },
            { n: "Entre Ríos", c: ["entre ríos", "entre rios"] }, { n: "Formosa", c: ["formosa"] },
            { n: "Jujuy", c: ["jujuy"] }, { n: "La Pampa", c: ["la pampa"] }, { n: "La Rioja", c: ["la rioja"] },
            { n: "Mendoza", c: ["mendoza"] }, { n: "Misiones", c: ["misiones"] }, { n: "Neuquén", c: ["neuquén", "neuquen"] },
            { n: "Río Negro", c: ["río negro", "rio negro"] }, { n: "Salta", c: ["salta"] },
            { n: "San Juan", c: ["san juan"] }, { n: "San Luis", c: ["san luis"] }, { n: "Santa Cruz", c: ["santa cruz"] },
            { n: "Santa Fe", c: ["santa fe"] }, { n: "Santiago del Estero", c: ["santiago del estero"] },
            { n: "Tierra del Fuego", c: ["tierra del fuego", "antártida"] }, { n: "Tucumán", c: ["tucumán", "tucuman"] }
          ];

          function formatearFecha(iso) { 
            if(!iso) return 'N/A';
            const d = new Date(iso);
            return \`\${String(d.getDate()).padStart(2,'0')}/\${String(d.getMonth()+1).padStart(2,'0')} \${String(d.getHours()).padStart(2,'0')}:\${String(d.getMinutes()).padStart(2,'0')}\`;
          }

          async function cargarAlertas() {
            const statusDiv = document.getElementById('loading');
            try {
              statusDiv.style.display = 'block';
              layerGroup.clearLayers();
              const proxy = 'https://api.codetabs.com/v1/proxy?quest=';
              const rss = await fetch(proxy + encodeURIComponent('https://ssl.smn.gob.ar/feeds/CAP/rss_alertaCAP_nuevo.xml?nocache=' + new Date().getTime()));
              const xml = new DOMParser().parseFromString(await rss.text(), "application/xml");
              const links = [...new Set(Array.from(xml.getElementsByTagName("link")).map(l => l.textContent).filter(u => u.includes('.xml') && !u.includes('rss_alertaCAP')))];

              const datos = [];
              for(const link of links) {
                const res = await fetch(proxy + encodeURIComponent(link));
                const cap = new DOMParser().parseFromString(await res.text(), "application/xml");
                const event = cap.getElementsByTagName("event")[0]?.textContent || "Alerta";
                const sev = cap.getElementsByTagName("severity")[0]?.textContent || "Minor";
                let color = sev === 'Extreme' ? '#ef4444' : sev === 'Severe' ? '#f97316' : '#eab308';
                
                Array.from(cap.getElementsByTagName("polygon")).forEach(p => {
                  const coords = p.textContent.trim().split(' ').map(par => par.split(',').map(Number).reverse());
                  L.polygon(coords, {color, fillColor: color, fillOpacity: 0.4}).addTo(layerGroup).bindPopup(event);
                });
                datos.push({ id: link, evento: event, nivel: sev, color, provincias: ["Nacional"] });
              }
              window.parent.postMessage({ type: 'CAP_DATA_READY', payload: datos }, '*');
              statusDiv.style.display = 'none';
            } catch(e) { statusDiv.innerText = "Error de conexión"; }
          }
          cargarAlertas();
        });
      </script>
    </body>
    </html>
  `;

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm font-sans">
      <h2 className="text-lg font-bold text-gray-800 uppercase mb-4">Panel Automático de Alertas (IGN + SMN)</h2>
      <div className="w-full h-[600px] rounded-xl overflow-hidden border border-gray-200 relative mb-6">
        <iframe srcDoc={mapHtml} className="w-full h-full border-0 absolute inset-0" title="Mapa IGN" sandbox="allow-scripts allow-same-origin" />
      </div>
      <div className="border rounded-xl overflow-hidden">
        <table className="w-full text-sm text-gray-600">
          <thead className="bg-gray-50 uppercase text-xs">
            <tr><th className="px-4 py-3">Nivel</th><th className="px-4 py-3">Fenómeno</th></tr>
          </thead>
          <tbody>
            {alertasTabla.map((a, i) => (
              <tr key={i} className="border-t">
                <td className="px-4 py-2 font-bold" style={{color: a.color}}>{a.nivel}</td>
                <td className="px-4 py-2">{a.evento}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
