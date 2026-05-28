'use client';

import React, { useEffect, useState } from 'react';

export default function MapaAlertasSMN() {
  const [alertasTabla, setAlertasTabla] = useState([]);

  // La lógica de procesamiento de alertas se mantiene igual, 
  // asegurando que la tabla reciba la data del CAP procesada.

  const mapHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css" />
      <script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js"></script>
      <style>
        body { margin: 0; padding: 0; }
        #map { width: 100%; height: 100vh; }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        document.addEventListener("DOMContentLoaded", function() {
          // Configuración del mapa con capa base del IGN
          var map = L.map('map').setView([-38.4161, -63.6167], 5);
          
          L.tileLayer.wms('https://wms.ign.gob.ar/geoserver/wms', {
            layers: 'capabaseosmart',
            format: 'image/png',
            transparent: true,
            attribution: '© Instituto Geográfico Nacional'
          }).addTo(map);

          var layerGroup = L.layerGroup().addTo(map);
          
          // ... (aquí iría la lógica de fetch y dibujo de polígonos SMN que ya teníamos)
        });
      </script>
    </body>
    </html>
  `;

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <h2 className="text-lg font-bold mb-4 uppercase">Monitoreo con Cartografía IGN</h2>
      <div className="w-full h-[600px] rounded-xl overflow-hidden border border-gray-200 mb-6">
        <iframe 
          srcDoc={mapHtml} 
          className="w-full h-full border-0" 
          title="Mapa IGN" 
          sandbox="allow-scripts"
        />
      </div>
      {/* ... (resto del componente con la tabla) ... */}
    </div>
  );
}
