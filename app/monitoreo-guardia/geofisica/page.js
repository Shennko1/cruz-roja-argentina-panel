"use client";
import React, { useState } from "react";

export default function GeofisicaPage() {
  const [isVolcanoOpen, setIsVolcanoOpen] = useState(false);
  const [isNoticiasOpen, setIsNoticiasOpen] = useState(false);

  // Estado para la ubicación del buscador de noticias
  const [ubicacion, setUbicacion] = useState("Argentina");

  // Configuración de las búsquedas dinámicas de noticias (Geofísica)
  const busquedas = [
    {
      titulo: "Sismos y Terremotos",
      terminos: '(sismo OR terremoto OR temblor)'
    },
    {
      titulo: "Deslizamientos y Derrumbes",
      terminos: '(deslizamiento OR alud OR derrumbe)'
    },
    {
      titulo: "Actividad Volcánica",
      terminos: '(volcán OR erupción OR ceniza)'
    }
  ];

  // Función para construir la URL de Google News
  const generarUrlGoogleNews = (terminos) => {
    const ubicacionFinal = ubicacion.trim() !== "" ? `${ubicacion.trim()} ` : "";
    const query = `${ubicacionFinal}${terminos} when:7d`; // Ampliado a 7 días por la naturaleza geofísica
    return `https://news.google.com/search?q=${encodeURIComponent(query)}&hl=es-419&gl=AR&ceid=AR%3Aes-419`;
  };

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
        }
        .leaflet-tooltip.custom-tooltip {
          background: white;
          border: 1px solid #e2e8f0;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          border-radius: 8px;
          padding: 8px 12px;
        }
      </style>
    </head>
    <body>
      <div id="loading" class="loading">Sincronizando XML...</div>
      <div id="map"></div>
      
      <script>
        document.addEventListener("DOMContentLoaded", function() {
          var map = L.map('map').setView([-38.4161, -63.6167], 4);
          
          L.tileLayer('https://wms.ign.gob.ar/geoserver/gwc/service/tms/1.0.0/mapabase_gris@EPSG%3A3857@png/{z}/{x}/{-y}.png', {
            minZoom: 1, maxZoom: 20,
            attribution: 'IGN | INPRES'
          }).addTo(map);

          L.tileLayer.wms('https://wms.ign.gob.ar/geoserver/ows?', {
            layers: 'provincia,capa_capitales',
            format: 'image/png',
            transparent: true,
            opacity: 0.6
          }).addTo(map);

          var layerGroup = L.layerGroup().addTo(map);

          // Mostrar solo los sismos de los últimos X días. 
          const DIAS_LIMITE = 7; 
          const meses = { 'Jan':0, 'Feb':1, 'Mar':2, 'Apr':3, 'May':4, 'Jun':5, 'Jul':6, 'Aug':7, 'Sep':8, 'Oct':9, 'Nov':10, 'Dec':11 };

          async function cargarSismos() {
            const statusDiv = document.getElementById('loading');
            try {
              statusDiv.style.display = 'block';
              statusDiv.innerText = "Sincronizando XML...";
              layerGroup.clearLayers();
              
              // Usamos el endpoint GET de allorigins para evitar bloqueos de formato raw
              const targetUrl = 'http://contenidos.inpres.gob.ar/formatos/sentidos.xml?nocache=' + new Date().getTime();
              const proxyUrl = 'https://api.allorigins.win/get?url=' + encodeURIComponent(targetUrl);
              
              const res = await fetch(proxyUrl);
              if (!res.ok) throw new Error("Fallo de red al contactar proxy.");
              
              const data = await res.json();
              const xmlText = data.contents;
              
              const parser = new DOMParser();
              const xmlDoc = parser.parseFromString(xmlText, "application/xml");
              const items = xmlDoc.getElementsByTagName("item");
              
              let sismosCargados = 0;
              const ahora = new Date();

              for (let i = 0; i < items.length; i++) {
                const item = items[i];
                
                // Extracción directa basada en la estructura oficial de INPRES
                const latNode = item.getElementsByTagName("latitude")[0];
                const lonNode = item.getElementsByTagName("longitude")[0];
                const magNode = item.getElementsByTagName("magnitude")[0];
                const dateNode = item.getElementsByTagName("pubDate")[0];
                const provNode = item.getElementsByTagName("province")[0];
                const depthNode = item.getElementsByTagName("depth")[0];

                if (latNode && lonNode) {
                  const lat = parseFloat(latNode.textContent.trim());
                  const lon = parseFloat(lonNode.textContent.trim());
                  const mag = magNode ? parseFloat(magNode.textContent.trim()) : NaN;
                  const dateStr = dateNode ? dateNode.textContent.trim() : "Fecha desconocida";
                  const prov = provNode ? provNode.textContent.trim() : "";
                  const depth = depthNode ? depthNode.textContent.trim() : "";

                  if (!isNaN(lat) && !isNaN(lon)) {
                    // Parseo del formato "29 May 05:14 hs."
                    let sismoFecha = new Date();
                    const parts = dateStr.split(' ');
                    if(parts.length >= 3) {
                       const day = parseInt(parts[0]);
                       const monthStr = parts[1];
                       const timeParts = parts[2].split(':');
                       if(timeParts.length === 2 && meses[monthStr] !== undefined) {
                         sismoFecha = new Date(ahora.getFullYear(), meses[monthStr], day, parseInt(timeParts[0]), parseInt(timeParts[1]));
                         // Si la fecha calculada es en el futuro, significa que fue a fines del año pasado
                         if (sismoFecha > ahora) sismoFecha.setFullYear(sismoFecha.getFullYear() - 1);
                       }
                    }

                    let mostrarSismo = true;
                    if (!isNaN(sismoFecha.getTime())) {
                      const diferenciaDias = (ahora - sismoFecha) / (1000 * 60 * 60 * 24);
                      if (diferenciaDias > DIAS_LIMITE) mostrarSismo = false;
                    }

                    if (mostrarSismo) {
                      let color = '#3b82f6'; // Azul (< 3)
                      let radius = 6;
                      if (mag >= 3 && mag < 4.5) { color = '#eab308'; radius = 10; } // Amarillo
                      if (mag >= 4.5 && mag < 6) { color = '#f97316'; radius = 14; } // Naranja
                      if (mag >= 6) { color = '#ef4444'; radius = 18; } // Rojo

                      const marker = L.circleMarker([lat, lon], {
                        radius: radius,
                        fillColor: color,
                        color: '#ffffff',
                        weight: 2,
                        opacity: 1,
                        fillOpacity: 0.8
                      });

                      const tooltipHTML = "<div style='font-family:sans-serif; text-align:left; min-width:160px;'>" +
                                          "<div style='background:" + color + "; color:white; padding:4px 8px; border-radius:4px; font-weight:bold; font-size:12px; display:inline-block; margin-bottom:6px;'>" +
                                          "Magnitud: " + (isNaN(mag) ? 'N/D' : mag) + "</div>" +
                                          (prov ? "<br/><span style='font-size:11px; font-weight:bold; color:#1e293b;'>📍 " + prov + "</span>" : "") +
                                          (depth ? "<br/><span style='font-size:11px; color:#475569;'>Profundidad: " + depth + "</span>" : "") +
                                          "<br/><span style='font-size:11px; color:#475569; font-weight:bold;'>" + dateStr + "</span>" +
                                          "</div>";
                      
                      marker.bindTooltip(tooltipHTML, {
                        direction: 'top',
                        className: 'custom-tooltip',
                        offset: [0, -10]
                      });
                      
                      layerGroup.addLayer(marker);
                      sismosCargados++;
                    }
                  }
                }
              }
              
              if (sismosCargados > 0) {
                statusDiv.innerText = "Actualizado (" + sismosCargados + " recientes)";
                setTimeout(() => { statusDiv.style.display = 'none'; }, 3000);
              } else {
                statusDiv.innerText = "No hay sismos en los últimos " + DIAS_LIMITE + " días";
              }
            } catch(e) {
              console.error("Fallo al cargar INPRES:", e);
              statusDiv.innerText = "Error cargando XML (Intente refrescar)";
            }
          }

          cargarSismos();
          setInterval(cargarSismos, 300000); // 5 minutos
        });
      </script>
    </body>
    </html>
  `;

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm font-sans">
      
      {/* CABECERA */}
      <div className="border-b border-gray-200 pb-3 mb-4 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">
          Monitoreo: Sismos y Geofísica
        </h2>
        <span className="text-xs font-medium bg-blue-50 text-blue-600 px-3 py-1 rounded-full border border-blue-100">
          En vivo
        </span>
      </div>

      {/* 1. MAPAS OFICIALES INPRES - Siempre visibles en Grilla Dividida */}
      <div className="mb-10">
        
        <div className="flex items-center gap-3 mb-4 border-b border-gray-100 pb-2">
          <img src="/earthquake.png" alt="Ícono Sismo" className="w-9 h-9 object-contain" onError={(e) => e.target.style.display='none'} />
          <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
            Reporte Oficial INPRES
          </h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* LADO IZQUIERDO: Mapa Sismos Sentidos (XML) */}
          <div className="flex flex-col h-[600px] border border-gray-300 rounded-xl overflow-hidden shadow-sm bg-gray-50">
            <div className="p-3 bg-white border-b border-gray-200 flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Sismos Sentidos (Mapa Mapeado)</h3>
                <p className="text-[10px] text-gray-500 uppercase">Datos XML - Últimos 7 Días</p>
              </div>
            </div>
            <div className="flex-grow relative z-0">
              <iframe 
                srcDoc={mapHtml}
                className="w-full h-full border-0 absolute inset-0" 
                title="Mapa INPRES XML" 
                sandbox="allow-scripts allow-same-origin"
              ></iframe>
            </div>
          </div>

          {/* LADO DERECHO: Iframe Web INPRES */}
          <div className="flex flex-col h-[600px] border border-gray-300 rounded-xl overflow-hidden shadow-sm bg-gray-50">
            <div className="p-3 bg-white border-b border-gray-200 flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Registro Web Oficial</h3>
                <p className="text-[10px] text-gray-500 uppercase">INPRES.gob.ar</p>
              </div>
            </div>
            <div className="flex-grow relative z-0 bg-white">
              <iframe 
                src="https://www.inpres.gob.ar/desktop/" 
                className="w-full h-full border-0 absolute inset-0" 
                title="Sitio INPRES Oficial" 
              />
            </div>
          </div>

        </div>
      </div>

      {/* 2. MONITOREO GLOBAL (Volcano Discovery) - Desplegable */}
      <div className="mb-6 border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <button onClick={() => setIsVolcanoOpen(!isVolcanoOpen)} className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
          <div className="flex items-center gap-3">
            <img src="/media.png" alt="Ícono Global" className="w-9 h-9 object-contain" onError={(e) => e.target.style.display='none'} />
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
              Monitoreo Global (VolcanoDiscovery)
            </h3>
          </div>
          <svg className={`w-5 h-5 text-gray-500 transition-transform ${isVolcanoOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {isVolcanoOpen && (
          <div className="p-4 border-t border-gray-200 bg-white">
            
            {/* Disclaimer VolcanoDiscovery */}
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4 rounded-r-lg shadow-sm">
              <h4 className="text-sm font-bold text-yellow-800 mb-1">Aviso sobre esta fuente:</h4>
              <p className="text-[12px] text-yellow-700 leading-relaxed">
                VolcanoDiscovery es una plataforma <strong>complementaria y extraoficial</strong>. La cartografía base está en inglés y contiene topónimos no reconocidos oficialmente (ej. Islas Malvinas). Además, al incluir reportes ciudadanos, la magnitud o ubicación exacta puede diferir de los registros oficiales del INPRES. Utilizar solo como referencia rápida.
              </p>
            </div>

            <div className="w-full h-[500px] rounded-xl overflow-hidden border border-gray-200 relative bg-gray-50">
              <iframe 
                src="https://earthquakes.volcanodiscovery.com/map/Argentina?L=8" 
                className="w-full h-full border-0 absolute inset-0" 
                title="Volcano Discovery Map" 
              />
            </div>
          </div>
        )}
      </div>

      {/* 3. NOTICIAS (Buscador Dinámico) - Desplegable */}
      <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <button onClick={() => setIsNoticiasOpen(!isNoticiasOpen)} className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
          <div className="flex items-center gap-3">
            <img src="/news.png" alt="Ícono Noticias" className="w-9 h-9 object-contain" onError={(e) => e.target.style.display='none'} />
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
              Buscador de Noticias
            </h3>
          </div>
          <svg className={`w-5 h-5 text-gray-500 transition-transform ${isNoticiasOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {isNoticiasOpen && (
          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 shadow-sm">
              
              <div className="mb-5 pb-4 border-b border-gray-200">
                <p className="text-[13px] text-gray-600 leading-relaxed">
                  Buscador automatizado para corroborar incidentes en el territorio a través de medios digitales. Todas las solicitudes filtran cronológicamente resultados de los <strong>últimos 7 días</strong>.
                </p>
              </div>

              {/* Grilla de Botones */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
                {busquedas.map((item, index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col justify-between shadow-sm">
                    <div>
                      <h4 className="text-sm font-bold text-gray-800 mb-2">{item.titulo}</h4>
                      <p className="text-[11px] text-gray-500 font-mono bg-gray-50 p-2 rounded border border-gray-100 mb-4 break-words">
                        {item.terminos}
                      </p>
                    </div>
                    <a 
                      href={generarUrlGoogleNews(item.terminos)} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="w-full text-center bg-white border border-gray-300 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 text-gray-700 text-xs font-bold py-2 px-4 rounded-md transition-all shadow-sm"
                    >
                      Buscar en Google News
                    </a>
                  </div>
                ))}
              </div>

              {/* Input de Ubicación */}
              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center bg-white p-4 rounded-lg border border-gray-200 border-l-4 border-l-[#3b82f6] shadow-sm">
                <label htmlFor="ubicacion" className="text-sm font-bold text-gray-700 whitespace-nowrap">
                  📍 Ubicación a monitorear:
                </label>
                <input
                  id="ubicacion"
                  type="text"
                  value={ubicacion}
                  onChange={(e) => setUbicacion(e.target.value)}
                  placeholder="Ej: Mendoza, San Juan, Neuquén..."
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent transition-all"
                />
              </div>

            </div>
          </div>
        )}
      </div>

    </div>
  );
}
