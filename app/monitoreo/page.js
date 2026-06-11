'use client';

import React, { useEffect, useState } from 'react';

export default function MapaAlertasSMN() {
  const [alertasTabla, setAlertasTabla] = useState([]);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data && event.data.type === 'CAP_DATA_READY') {
        const payload = event.data.payload;
        
        const agrupado = {};
        
        payload.forEach(alerta => {
          alerta.provincias.forEach(prov => {
            if (!agrupado[prov]) agrupado[prov] = {};
            const llaveUnica = `${alerta.nivel}-${alerta.evento}`;
            if (!agrupado[prov][llaveUnica]) {
              agrupado[prov][llaveUnica] = { ...alerta };
            }
          });
        });

        const tablaFinal = Object.keys(agrupado).sort().map(prov => ({
          provincia: prov,
          alertas: Object.values(agrupado[prov])
        }));

        setAlertasTabla(tablaFinal);
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
          transition: all 0.3s ease;
        }
      </style>
    </head>
    <body>
      <div id="loading" class="loading">Iniciando sistema...</div>
      <div id="map"></div>
      
      <script>
        document.addEventListener("DOMContentLoaded", function() {
          var map = L.map('map').setView([-38.4161, -63.6167], 5);
          L.tileLayer('https://wms.ign.gob.ar/geoserver/gwc/service/tms/1.0.0/mapabase_gris@EPSG%3A3857@png/{z}/{x}/{-y}.png', {
            attribution: '© OpenStreetMap'
          }).addTo(map);

          var layerGroup = L.layerGroup().addTo(map);

          const provsDic = [
            { n: "Buenos Aires", c: ["buenos aires"] },
            { n: "CABA", c: ["caba", "ciudad autónoma de buenos aires", "capital federal"] },
            { n: "Catamarca", c: ["catamarca"] },
            { n: "Chaco", c: ["chaco"] },
            { n: "Chubut", c: ["chubut"] },
            { n: "Córdoba", c: ["córdoba", "cordoba"] },
            { n: "Corrientes", c: ["corrientes"] },
            { n: "Entre Ríos", c: ["entre ríos", "entre rios"] },
            { n: "Formosa", c: ["formosa"] },
            { n: "Jujuy", c: ["jujuy"] },
            { n: "La Pampa", c: ["la pampa"] },
            { n: "La Rioja", c: ["la rioja"] },
            { n: "Mendoza", c: ["mendoza"] },
            { n: "Misiones", c: ["misiones"] },
            { n: "Neuquén", c: ["neuquén", "neuquen"] },
            { n: "Río Negro", c: ["río negro", "rio negro"] },
            { n: "Salta", c: ["salta"] },
            { n: "San Juan", c: ["san juan"] },
            { n: "San Luis", c: ["san luis"] },
            { n: "Santa Cruz", c: ["santa cruz"] },
            { n: "Santa Fe", c: ["santa fe"] },
            { n: "Santiago del Estero", c: ["santiago del estero"] },
            { n: "Tierra del Fuego", c: ["tierra del fuego", "antártida"] },
            { n: "Tucumán", c: ["tucumán", "tucuman"] }
          ];

          function formatearFecha(isoString) {
            if (!isoString) return 'N/A';
            const d = new Date(isoString);
            const dia = String(d.getDate()).padStart(2, '0');
            const mes = String(d.getMonth() + 1).padStart(2, '0');
            const horas = String(d.getHours()).padStart(2, '0');
            const min = String(d.getMinutes()).padStart(2, '0');
            return dia + '/' + mes + ' ' + horas + ':' + min;
          }

          async function cargarAlertas() {
  const statusDiv = document.getElementById('loading');
  statusDiv.style.display = 'block';
  statusDiv.innerText = "Conectando al índice...";

  try {
    layerGroup.clearLayers();
    const proxy = 'https://corsproxy.io/?'; 
    const rssUrl = 'https://ssl.smn.gob.ar/CAP/AR.php';
    
    // 1. Obtener índice
    const response = await fetch(proxy + encodeURIComponent(rssUrl));
    const text = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(text, "application/xml");
    const items = xmlDoc.getElementsByTagName("item");

    if (items.length === 0) throw new Error("No hay items en el RSS");

    const links = Array.from(items).map(item => item.getElementsByTagName("link")[0].textContent);
    
    statusDiv.innerText = `Procesando ${links.length} alertas...`;

    const datosParaTabla = [];

    // 2. Procesar cada alerta individual
    for (const link of links) {
      try {
        const res = await fetch(proxy + encodeURIComponent(link));
        const xmlText = await res.text();
        const doc = parser.parseFromString(xmlText, "application/xml");

        // Extraer datos clave
        const event = doc.getElementsByTagName("event")[0]?.textContent || "Alerta";
        const desc = doc.getElementsByTagName("description")[0]?.textContent || "";
        const areaDesc = doc.getElementsByTagName("areaDesc")[0]?.textContent || "";
        const severity = doc.getElementsByTagName("severity")[0]?.textContent || "Moderate";
        const polygon = doc.getElementsByTagName("polygon")[0]?.textContent || "";

        // DEBUG: Mira qué estamos leyendo en consola
        console.log("Leyendo:", event, "AreaDesc:", areaDesc, "Poligono:", polygon.substring(0, 20));

        // Lógica de detección de provincias (si areaDesc está vacío, usamos la descripción)
        const textoBusqueda = (areaDesc + " " + desc).toLowerCase();
        const provsEncontradas = provsDic
            .filter(p => p.c.some(clave => textoBusqueda.includes(clave)))
            .map(p => p.n);

        if (provsEncontradas.length === 0) provsEncontradas.push("Nacional / Otras");

        // 3. Dibujar si hay polígono
        if (polygon) {
            const coords = polygon.trim().split(' ').map(p => p.split(',').reverse().map(Number));
            const color = severity === 'Extreme' ? '#ef4444' : severity === 'Severe' ? '#f97316' : '#eab308';
            
            L.polygon(coords, { color, fillColor: color, fillOpacity: 0.4 }).addTo(layerGroup);
        }

        datosParaTabla.push({ id: link, evento: event, nivel: severity, provincias: provsEncontradas });

      } catch (err) {
        console.error("Error en alerta individual:", link, err);
      }
    }

    window.parent.postMessage({ type: 'CAP_DATA_READY', payload: datosParaTabla }, '*');
    statusDiv.style.display = 'none';

  } catch (error) {
    statusDiv.innerText = "Error: " + error.message;
    console.error(error);
  }
}

          cargarAlertas();
          setInterval(cargarAlertas, 900000); 
        });
      </script>
    </body>
    </html>
  `;

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm font-sans">
      <div className="border-b border-gray-200 pb-2 mb-4">
        <h2 className="text-lg font-bold text-gray-800 uppercase tracking-tight">
          Panel Automático de Alertas (SMN)
        </h2>
        <p className="text-xs text-gray-600 mt-1 leading-relaxed">
          Alertas recibidas desde el CAP del Servicio Meteorológico Nacional.
        </p>
      </div>

      <div className="w-full h-[600px] rounded-xl overflow-hidden border border-gray-200 relative bg-gray-50 mb-6 z-0">
        <iframe 
          srcDoc={mapHtml} 
          className="w-full h-full border-0 absolute inset-0" 
          title="Mapa CAP SMN" 
          sandbox="allow-scripts allow-same-origin allow-popups"
        />
      </div>

      <div className="flex flex-wrap gap-6 text-xs font-bold uppercase tracking-widest justify-center bg-gray-50 py-3 rounded-lg border border-gray-100 mb-6">
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-full bg-[#ef4444] shadow-sm"></span>
          <span className="text-gray-700">Alerta Roja</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-full bg-[#f97316] shadow-sm"></span>
          <span className="text-gray-700">Alerta Naranja</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-full bg-[#eab308] shadow-sm"></span>
          <span className="text-gray-700">Alerta Amarilla</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-full bg-[#8b5cf6] shadow-sm"></span>
          <span className="text-gray-700">Advertencia / Informate</span>
        </div>
      </div>

      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <div className="bg-gray-100 px-4 py-3 border-b border-gray-200">
          <h3 className="text-sm font-bold text-gray-800 uppercase tracking-tight">Resumen Operativo de Eventos Activos</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 font-semibold w-1/4">Nivel</th>
                <th className="px-4 py-3 font-semibold w-2/4">Fenómeno</th>
                <th className="px-4 py-3 font-semibold w-1/4">Vigencia (Inicio - Fin)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {alertasTabla.length === 0 ? (
                <tr>
                  <td colSpan="3" className="px-4 py-6 text-center text-gray-500 text-sm">
                    Analizando reportes o sin novedades activas en el territorio.
                  </td>
                </tr>
              ) : (
                alertasTabla.map((grupo) => (
                  <React.Fragment key={grupo.provincia}>
                    <tr className="bg-gray-100/60 border-t-2 border-gray-200">
                      <td colSpan="3" className="px-4 py-2.5 text-xs font-bold text-gray-800 uppercase tracking-wider">
                        📍 {grupo.provincia}
                      </td>
                    </tr>
                    
                    {grupo.alertas.map((alerta, index) => (
                      <tr key={`${grupo.provincia}-${index}`} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 pl-6">
                          <span 
                            className="px-2.5 py-1 rounded-md text-white text-xs font-bold whitespace-nowrap" 
                            style={{ backgroundColor: alerta.color }}
                          >
                            {alerta.nivel}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-medium text-gray-800">{alerta.evento}</td>
                        <td className="px-4 py-3 text-xs">
                          <div className="flex flex-col gap-0.5">
                            <span><b className="text-gray-700">Desde:</b> {alerta.inicio} hs</span>
                            <span><b className="text-gray-700">Hasta:</b> {alerta.fin} hs</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
