import React from 'react';

export const dynamic = 'force-dynamic';

async function getSmnData() {
  let isAlertActive = false;
  let description = "Sin novedades en el reporte o no se pudo establecer conexión con los canales oficiales.";
  let date = "S/D";
  let polygons = [];

  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  };

  try {
    const indexRes = await fetch('https://ssl.smn.gob.ar/feeds/CAP/rss_alertaCAP_nuevo.xml', { 
      headers, 
      next: { revalidate: 60 } 
    });
    const indexXml = await indexRes.text();

    const pubDateMatch = indexXml.match(/<pubDate>(.*?)<\/pubDate>/);
    if (pubDateMatch) date = pubDateMatch[1];

    // Capturamos todos los items y nos quedamos solo con los primeros dos
    const itemMatches = [...indexXml.matchAll(/<item>([\s\S]*?)<\/item>/g)].slice(0, 2);
    
    let descNarrativa = "";

    if (itemMatches.length > 0) {
       for(let i=0; i < itemMatches.length; i++) {
         let item = itemMatches[i][1];
         let titleMatch = item.match(/<title>(.*?)<\/title>/);
         let descMatch = item.match(/<description>(.*?)<\/description>/);
         let guidMatch = item.match(/<guid>(.*?)<\/guid>/);
         let itemDateMatch = item.match(/<pubDate>(.*?)<\/pubDate>/);
         
         if(titleMatch && guidMatch) {
            let titulo = titleMatch[1].replace("<![CDATA[", "").replace("]]>", "").trim();
            let desc = descMatch ? descMatch[1].replace("<![CDATA[", "").replace("]]>", "").trim() : "";
            let fecha = itemDateMatch ? itemDateMatch[1] : "Fecha no especificada";
            let url = guidMatch[1].trim();

            // Construcción del texto narrativo con distinción de fecha
            descNarrativa += "Con fecha " + fecha + " se registra " + titulo + ". " + desc + " ";

            let color = '#ffc107'; 
            let t = titulo.toLowerCase();
            if (t.includes('naranja')) color = '#ff9800';
            else if (t.includes('roja')) color = '#f44336';

            // Procesamiento de polígonos solo para este item
            try {
              let fileUrl = url.startsWith('//') ? 'https:' + url : url;
              const capRes = await fetch(fileUrl, { headers });
              const capText = await capRes.text();
              const polyMatches = [...capText.matchAll(/<polygon>(.*?)<\/polygon>/g)];
              
              for (let p of polyMatches) {
                 let rawCoords = p[1].trim().split(/\s+/).filter(c => c.includes(','));
                 let leafletCoords = rawCoords.map(coord => {
                   let [lat, lon] = coord.split(',');
                   return [parseFloat(lat), parseFloat(lon)];
                 });
                 if (leafletCoords.length > 0) {
                   polygons.push({
                     coords: leafletCoords,
                     title: titulo,
                     date: fecha,
                     color: color
                   });
                 }
              }
            } catch(e) { console.error("Error en CAP:", url); }
         }
       }
       if (descNarrativa.trim() !== "") {
         description = descNarrativa.trim();
         isAlertActive = !description.includes('No se han emitido Avisos');
       }
    }
  } catch (e) { console.error("Error en índice:", e); }

  return { isAlertActive, description, date, polygons };
}

export default async function MonitoreoSMNPage() {
  const data = await getSmnData();

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
        document.addEventListener("DOMContentLoaded", function() {
          var map = L.map('map').setView([-38.4161, -63.6167], 4);
          L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png').addTo(map);
          var polys = ${JSON.stringify(data.polygons)};
          if (polys.length > 0) {
            var bounds = [];
            polys.forEach(function(p) {
              var poly = L.polygon(p.coords, {color: p.color, weight: 2, fillColor: p.color, fillOpacity: 0.5}).addTo(map);
              poly.bindTooltip("<b>" + p.title + "</b>", {sticky: true});
              poly.bindPopup("<b>" + p.title + "</b><br>Fecha: " + p.date);
              p.coords.forEach(function(c) { bounds.push(c); });
            });
            map.fitBounds(bounds);
          }
        });
      </script>
    </body>
    </html>
  `;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Monitoreo de Alertas (Últimos 2 Eventos)</h2>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-1">
          <div className={`p-6 rounded-xl shadow-md border-l-8 ${data.isAlertActive ? 'bg-red-50 border-red-600' : 'bg-green-50 border-green-500'}`}>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Informe Consolidado</p>
            <div className="text-sm font-medium leading-relaxed text-gray-800">
              {data.description}
            </div>
          </div>
        </div>
        <div className="xl:col-span-2">
          <div className="bg-white rounded-xl shadow-md overflow-hidden h-[600px]">
            <iframe srcDoc={mapHtml} className="w-full h-full border-0" />
          </div>
        </div>
      </div>
    </div>
  );
}
