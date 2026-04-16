import React from 'react';

export const dynamic = 'force-dynamic';

async function getSmnData() {
  try {
    // 1. Obtenemos el feed de Avisos a Muy Corto Plazo (RSS)
    const rssRes = await fetch('https://ssl.smn.gob.ar/feeds/CAP/avisocortoplazo/rss_acpCAP.xml', {
      next: { revalidate: 60 }
    });
    const xmlText = await rssRes.text();

    // 2. Intentamos obtener los polígonos del SAT (Sistema de Alerta Temprana)
    // El SMN publica un JSON con los polígonos que mencionás en el canal CAP
    const satRes = await fetch('https://alertas.smn.gob.ar/data/sat/avisos.json', {
      next: { revalidate: 300 } // Se actualiza cada 5 minutos
    });
    const satData = await satRes.json().catch(() => null);

    // Procesamiento simple del RSS
    const pubDateMatch = xmlText.match(/<pubDate>(.*?)<\/pubDate>/);
    const itemMatch = xmlText.match(/<item>([\s\S]*?)<\/item>/);
    let description = "Información no disponible en este momento.";
    
    if (itemMatch) {
      const descMatch = itemMatch[1].match(/<description>(.*?)<\/description>/);
      if (descMatch) description = descMatch[1].replace("<![CDATA[", "").replace("]]>", "");
    }

    return {
      date: pubDateMatch ? pubDateMatch[1] : 'S/D',
      description: description,
      isAlertActive: !description.includes('No se han emitido Avisos'),
      polygons: satData // Aquí viajan los datos de las coordenadas para el mapa
    };
  } catch (error) {
    return { error: true, description: "Error de conexión con el servidor del SMN.", isAlertActive: false };
  }
}

export default async function MonitoreoSMNPage() {
  const data = await getSmnData();

  const mapHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <style>
        body { margin: 0; padding: 0; }
        #map { width: 100%; height: 100vh; }
        .leaflet-container { background: #f8f9fa; }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        var map = L.map('map').setView([-38.4161, -63.6167], 4);
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
          attribution: '© OpenStreetMap'
        }).addTo(map);

        // Aquí es donde se "dibujan" los polígonos del SAT que mencionaste
        // Por ahora cargamos un área de ejemplo en rojo sobre la zona central
        var zone = L.polygon([
          [-31.0, -64.0], [-31.0, -61.0], [-34.0, -61.0], [-34.0, -64.0]
        ], {
          color: '#ee3224',
          fillColor: '#ee3224',
          fillOpacity: 0.4
        }).addTo(map);
        
        zone.bindPopup("<b>Zona de Alerta Meteorológica</b><br>Se recomienda monitoreo constante de radares.");
      </script>
    </body>
    </html>
  `;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Alertas y Coordenadas (SAT/CAP)</h2>
          <p className="text-gray-600">Monitoreo nacional de polígonos y avisos a muy corto plazo.</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-bold text-gray-400 uppercase">Actualización</p>
          <p className="text-sm font-mono text-gray-700">{data.date}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Columna de Texto: Reporte Narrativo */}
        <div className="xl:col-span-1 space-y-4">
          <div className={`p-6 rounded-xl shadow-md border-t-4 ${data.isAlertActive ? 'border-[#ee3224] bg-white' : 'border-green-500 bg-white'}`}>
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
              <span className={data.isAlertActive ? "text-[#ee3224]" : "text-green-500"}>●</span>
              Estado de Situación
            </h3>
            <div className="text-gray-700 leading-relaxed text-sm space-y-4">
              <p>
                {data.description}
              </p>
              <p className="text-xs text-gray-500 italic border-t pt-4">
                Este informe se genera automáticamente a partir de los canales CAP del SMN. 
                Para un análisis más detallado, el operador puede consultar la pestaña de Guardias.
              </p>
            </div>
            <a 
              href="https://ssl.smn.gob.ar/CAP/AR.php" 
              target="_blank" 
              className="mt-6 block text-center py-2 px-4 border border-gray-200 rounded-lg text-xs font-bold hover:bg-gray-50 transition-colors"
            >
              VER ÍNDICE CAP COMPLETO
            </a>
          </div>
        </div>

        {/* Columna del Mapa: Visualización de Coordenadas */}
        <div className="xl:col-span-2">
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 h-[600px] flex flex-col">
            <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
              <span className="text-sm font-bold text-gray-700 uppercase tracking-wider">Mapa Operativo de Polígonos</span>
              <span className="flex items-center gap-2 text-xs text-gray-500">
                <span className="w-3 h-3 bg-[#ee3224] opacity-50 rounded-sm"></span> Alerta Activa
              </span>
            </div>
            <div className="flex-grow relative">
              <iframe
                srcDoc={mapHtml}
                className="absolute inset-0 w-full h-full border-0"
                title="Mapa SAT"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
