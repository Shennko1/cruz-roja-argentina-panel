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
        body { margin: 0; padding: 0; font-family: sans-serif; }
        #map { width: 100%; height: 100vh; }
        .loading { position: absolute; top: 10px; left: 50%; transform: translateX(-50%); z-index: 1000; background: white; padding: 5px 15px; border-radius: 20px; font-size: 12px; }
      </style>
    </head>
    <body>
      <div id="loading" class="loading">Iniciando...</div>
      <div id="map"></div>
      <script>
        const provsDic = [
            { n: "Buenos Aires", c: ["buenos aires"] }, { n: "CABA", c: ["caba", "ciudad autónoma"] },
            { n: "Córdoba", c: ["córdoba", "cordoba"] }, { n: "Mendoza", c: ["mendoza"] }
            // ... (agrega aquí el resto de tu diccionario)
        ];

        var map = L.map('map').setView([-38.4161, -63.6167], 4);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
        var layerGroup = L.layerGroup().addTo(map);

        async function cargarAlertas() {
          const statusDiv = document.getElementById('loading');
          try {
            layerGroup.clearLayers();
            const proxy = 'https://corsproxy.io/?'; 
            const rssUrl = 'https://ssl.smn.gob.ar/CAP/AR.php';
            
            const response = await fetch(proxy + encodeURIComponent(rssUrl));
            const text = await response.text();
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(text, "application/xml");
            const items = xmlDoc.getElementsByTagName("item");

            const links = Array.from(items).map(i => i.getElementsByTagName("link")[0].textContent);
            const datosParaTabla = [];

            for (const link of links) {
              const res = await fetch(proxy + encodeURIComponent(link));
              const xmlText = await res.text();
              const doc = parser.parseFromString(xmlText, "application/xml");

              const event = doc.getElementsByTagName("event")[0]?.textContent || "Alerta";
              const desc = doc.getElementsByTagName("description")[0]?.textContent || "";
              const areaDesc = doc.getElementsByTagName("areaDesc")[0]?.textContent || "";
              const severity = doc.getElementsByTagName("severity")[0]?.textContent || "Moderate";
              const polygon = doc.getElementsByTagName("polygon")[0]?.textContent || "";

              const textoBusqueda = (areaDesc + " " + desc).toLowerCase();
              const provs = provsDic.filter(p => p.c.some(clave => textoBusqueda.includes(clave))).map(p => p.n);

              if (polygon) {
                  const coords = polygon.trim().split(' ').map(p => p.split(',').reverse().map(Number));
                  L.polygon(coords, { color: 'red' }).addTo(layerGroup);
              }
              datosParaTabla.push({ id: link, evento: event, nivel: severity, provincias: provs });
            }
            window.parent.postMessage({ type: 'CAP_DATA_READY', payload: datosParaTabla }, '*');
            statusDiv.style.display = 'none';
          } catch (err) { statusDiv.innerText = "Error cargando datos"; }
        }
        cargarAlertas();
      </script>
    </body>
    </html>
  `;

  return (
    <div className="w-full h-[600px] relative">
      <iframe 
        srcDoc={mapHtml} 
        className="w-full h-full border-0"
        title="Mapa SMN"
        sandbox="allow-scripts"
      />
    </div>
  );
}
