import React from 'react';

export const dynamic = 'force-dynamic';

async function getSmnData() {
  let isAlertActive = false;
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

    const itemMatches = [...indexXml.matchAll(/<item>([\s\S]*?)<\/item>/g)];
    
    let alertasIndexadas = [];
    let descNarrativa = "";

    // Primero leemos el índice para guardar los títulos y las fechas
    if (itemMatches.length > 0) {
       for(let i=0; i < itemMatches.length; i++) {
         let item = itemMatches[i][1];
         let titleMatch = item.match(/<title>(.*?)<\/title>/);
         let descMatch = item.match(/<description>(.*?)<\/description>/);
         let guidMatch = item.match(/<guid>(.*?)<\/guid>/);
         let itemDateMatch = item.match(/<pubDate>(.*?)<\/pubDate>/);
         
         if(titleMatch && guidMatch) {
            let tituloLimpiado = titleMatch[1].replace("<![CDATA[", "").replace("]]>", "").trim();
            let descLimpiada = descMatch ? descMatch[1].replace("<![CDATA[", "").replace("]]>", "").trim() : "";
            let itemDate = itemDateMatch ? itemDateMatch[1] : date;
            let url = guidMatch[1].trim();

            if (descLimpiada) {
               descNarrativa += tituloLimpiado + ". " + descLimpiada + " ";
            }

            alertasIndexadas.push({
              url: url,
              title: tituloLimpiado,
              date: itemDate
            });
         }
       }
       if (descNarrativa.trim() !== "") {
         description = descNarrativa.trim();
         isAlertActive = !description.includes('No se han emitido Avisos');
       }
    }

    // Ahora entramos a cada archivo secundario llevando los datos con nosotros
    for (let alerta of alertasIndexadas) {
      let fileUrl = alerta.url;
      if (fileUrl.startsWith('//')) {
        fileUrl = 'https:' + fileUrl;
      }

      // Definimos el color según el nivel de severidad en el título
      let polyColor = '#ee3224'; // Rojo por defecto
      let tituloMinuscula = alerta.title.toLowerCase();
      if (tituloMinuscula.includes('amarilla')) polyColor = '#ffc107'; // Amarillo
      else if (tituloMinuscula.includes('naranja')) polyColor = '#ff9800'; // Naranja
      else if (tituloMinuscula.includes('roja')) polyColor = '#f44336'; // Rojo

      try {
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
             // Guardamos las coordenadas JUNTO con el título, fecha y color
             polygons.push({
               coords: leafletCoords,
               title: alerta.title,
               date: alerta.date,
               color: polyColor
             });
           }
        }
      } catch(e) {
        console.error("Fallo al leer las coordenadas de alerta:", fileUrl);
      }
    }
  } catch (e) {
    console.error("Fallo general en la lectura del índice SMN:", e);
  }

  return { isAlertActive, description, date, polygons };
}

export default async function MonitoreoSMNPage() {
  const data = await getSmnData();

  const alertClass = data.isAlertActive ? 'bg-red-50 border-[#ee3224]' : 'bg-green-50 border-green-500';
  const badgeClass = data.isAlertActive ? 'bg-[#ee3224] text-white' : 'bg-green-500 text-white';
  const textClass = data.isAlertActive ? 'border-[#ee3224] text-red-900' : 'border-green-200 text-green-900';

  const mapHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css" />
      <script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js"></script>
      <style>
        body { margin: 0; padding: 0; background: #f0f0f0; font-family: sans-serif; }
        #map { width: 100%; height: 100vh; }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        document.addEventListener("DOMContentLoaded", function() {
          try {
            var map = L.map('map').setView([-38.4161, -63.6167], 4);
            L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
              attribution: '© OpenStreetMap'
            }).addTo(map);

            var polyDataArray = ${JSON.stringify(data.polygons)};
            
            if (polyDataArray && polyDataArray.length > 0) {
              var bounds = [];
              
              polyDataArray.forEach(function(polyData) {
                // Dibuja el polígono con su color específico
                var poly = L.polygon(polyData.coords, {
                  color: polyData.color, 
                  weight: 2, 
                  fillColor: polyData.color, 
                  fillOpacity: 0.5
                }).addTo(map);
                
                // Agrega el cartelito rápido al pasar el mouse
                poly.bindTooltip("<b>" + polyData.title + "</b>", { sticky: true });
                
                // Agrega el detalle completo al hacer clic
                var popupContenido = "<b>" + polyData.title + "</b><br><span style='font-size:11px; color:#555;'>Emisión: " + polyData.date + "</span>";
                poly.bindPopup(popupContenido);

                polyData.coords.forEach(function(c) { bounds.push(c); });
              });
              
              if (bounds.length > 0) {
                map.fitBounds(bounds);
              }
            }
          } catch (error) {
            console.error("Error al cargar el motor de mapas: ", error);
          }
        });
      </script>
    </body>
    </html>
  `;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Monitoreo de Alertas Nacionales</h2>
          <p className="text-gray-600 text-sm">Extracción automática de zonas afectadas y reportes en formato narrativo.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-1 space-y-6">
          <div className={"p-6 rounded-xl shadow-md border-l-8 transition-colors " + alertClass}>
            <div className="mb-4">
              <h3 className="text-lg font-bold text-gray-900 leading-tight">Estado Operativo</h3>
              <span className={"inline-block mt-2 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest " + badgeClass}>
                {data.isAlertActive ? 'ALERTA ACTIVA' : 'SIN NOVEDAD'}
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Corte Horario</p>
                <p className="text-gray-700 font-mono text-xs bg-white p-2 rounded border border-gray-100">{data.date}</p>
              </div>

              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Informe Consolidado</p>
                <div className={"text-sm font-medium p-4 rounded-lg bg-white border leading-relaxed " + textClass}>
                  {data.description}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="xl:col-span-2">
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 h-[600px] flex flex-col">
            <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Trazado Satelital y Coordenadas CAP</span>
            </div>
            <div className="flex-grow relative bg-[#f0f0f0]">
              <iframe srcDoc={mapHtml} className="absolute inset-0 w-full h-full border-0" title="Mapa de Contingencias" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
