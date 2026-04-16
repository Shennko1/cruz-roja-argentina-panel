import React from 'react';

export const dynamic = 'force-dynamic';

async function getSmnData() {
  let isAlertActive = false;
  let description = "Informacion no disponible en este momento. El equipo se encuentra monitoreando la evolucion de los canales oficiales.";
  let date = "S/D";
  let link = "https://www.smn.gob.ar/alertas";
  let polygons = [];

  try {
    const rssRes = await fetch('https://ssl.smn.gob.ar/feeds/CAP/avisocortoplazo/rss_acpCAP.xml', {
      next: { revalidate: 60 }
    });
    const xmlText = await rssRes.text();

    const pubDateMatch = xmlText.match(/<pubDate>(.*?)<\/pubDate>/);
    if (pubDateMatch) date = pubDateMatch[1];

    const itemMatch = xmlText.match(/<item>([\s\S]*?)<\/item>/);
    if (itemMatch) {
      const descMatch = itemMatch[1].match(/<description>(.*?)<\/description>/);
      if (descMatch) description = descMatch[1].replace("<![CDATA[", "").replace("]]>", "").trim();
      
      const linkMatch = itemMatch[1].match(/<link>(.*?)<\/link>/);
      if (linkMatch) link = linkMatch[1];
    }
    
    isAlertActive = !description.includes('No se han emitido Avisos');
  } catch (e) {
    console.error("Error al procesar el estado general del RSS:", e);
  }

  try {
    const capRes = await fetch('https://ssl.smn.gob.ar/CAP/AR.php', {
      next: { revalidate: 60 }
    });
    const capHtml = await capRes.text();

    const xmlLinks = [];
    const regex = /href=["']?([^"'>]+\.xml)["']?/gi;
    let match;
    while ((match = regex.exec(capHtml)) !== null) {
      xmlLinks.push(match[1]);
    }

    const uniqueLinks = [...new Set(xmlLinks)];

    for (let xmlFile of uniqueLinks) {
      let fileUrl = xmlFile;
      
      if (fileUrl.startsWith('//')) {
        fileUrl = 'https:' + fileUrl;
      } else if (!fileUrl.startsWith('http')) {
        fileUrl = fileUrl.replace(/^\.\//, '');
        if (fileUrl.startsWith('/')) {
          fileUrl = 'https://ssl.smn.gob.ar' + fileUrl;
        } else {
          fileUrl = 'https://ssl.smn.gob.ar/CAP/' + fileUrl;
        }
      }

      const fileRes = await fetch(fileUrl);
      const fileText = await fileRes.text();

      const polyMatches = [...fileText.matchAll(/<polygon>(.*?)<\/polygon>/g)];
      for (let p of polyMatches) {
         let rawCoords = p[1].trim().split(/\s+/);
         let leafletCoords = rawCoords.map(coord => {
           let [lat, lon] = coord.split(',');
           return [parseFloat(lat), parseFloat(lon)];
         });
         polygons.push(leafletCoords);
      }
    }
  } catch (e) {
    console.error("Error en el rastreo de poligonos CAP:", e);
  }

  return { isAlertActive, description, date, link, polygons };
}

export default async function MonitoreoSMNPage() {
  const data = await getSmnData();

  const alertClass = data.isAlertActive 
    ? 'bg-red-50 border-[#ee3224]' 
    : 'bg-green-50 border-green-500';
    
  const badgeClass = data.isAlertActive 
    ? 'bg-[#ee3224] text-white' 
    : 'bg-green-500 text-white';
    
  const textClass = data.isAlertActive 
    ? 'border-[#ee3224] text-red-900' 
    : 'border-green-200 text-green-900';

  const mapHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <style>
        body { margin: 0; padding: 0; }
        #map { width: 100%; height: 100vh; background: #f0f0f0; }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        var map = L.map('map').setView([-38.4161, -63.6167], 4);
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
          attribution: '© OpenStreetMap'
        }).addTo(map);

        var realPolygons = ${JSON.stringify(data.polygons)};
        
        if (realPolygons.length > 0) {
          var bounds = [];
          realPolygons.forEach(function(coords) {
            var poly = L.polygon(coords, {
              color: '#ee3224',
              weight: 2,
              fillColor: '#ee3224',
              fillOpacity: 0.4
            }).addTo(map);
            coords.forEach(function(c) { bounds.push(c); });
          });
          map.fitBounds(bounds);
        }
      </script>
    </body>
    </html>
  `;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Monitoreo de Alertas CAP</h2>
          <p className="text-gray-600 text-sm">Integracion directa con los sistemas del SMN para conciencia situacional.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-1 space-y-6">
          <div className={"p-6 rounded-xl shadow-md border-l-8 transition-colors " + alertClass}>
            <div className="mb-4">
              <h3 className="text-lg font-bold text-gray-900 leading-tight">Estado de Alertas a Corto Plazo</h3>
              <span className={"inline-block mt-2 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest " + badgeClass}>
                {data.isAlertActive ? 'ALERTA ACTIVA' : 'SIN NOVEDAD'}
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Ultima Actualizacion</p>
                <p className="text-gray-700 font-mono text-xs bg-white p-2 rounded border border-gray-100">{data.date}</p>
              </div>

              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Reporte de Situacion</p>
                <div className={"text-sm font-medium p-4 rounded-lg bg-white border leading-relaxed " + textClass}>
                  {data.description}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200/50">
              <a href="https://ssl.smn.gob.ar/CAP/AR.php" target="_blank" className="text-xs font-bold text-blue-600 hover:underline">
                Acceder al Indice CAP Oficial
              </a>
            </div>
          </div>
        </div>

        <div className="xl:col-span-2">
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 h-[600px] flex flex-col">
            <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Visualizador de Poligonos Operativos</span>
            </div>
            <div className="flex-grow relative">
              <iframe srcDoc={mapHtml} className="absolute inset-0 w-full h-full border-0" title="Mapa CAP" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
