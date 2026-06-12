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

  const capasPorFecha = {};
  const controlCapas = L.control.layers(null, null, {
    collapsed: false,
    position: 'topright'
  }).addTo(map);

  const provsDic = [ /* igual que el tuyo */ ];

  function formatearFecha(isoString) {
    if (!isoString) return 'N/A';
    const d = new Date(isoString);
    return (
      String(d.getDate()).padStart(2,'0') + '/' +
      String(d.getMonth()+1).padStart(2,'0') + ' ' +
      String(d.getHours()).padStart(2,'0') + ':' +
      String(d.getMinutes()).padStart(2,'0')
    );
  }

  function fechaSimple(isoString) {
    if (!isoString) return "Sin fecha";
    const d = new Date(isoString);
    return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`;
  }

  async function fetchLimitado(urls, limit = 8) {
    const results = [];
    let index = 0;

    async function worker() {
      while (index < urls.length) {
        const i = index++;
        try {
          const res = await fetch(urls[i]);
          const text = await res.text();
          results[i] = { url: urls[i], text };
        } catch (e) {
          results[i] = null;
        }
      }
    }

    const workers = Array.from({ length: limit }, () => worker());
    await Promise.all(workers);
    return results;
  }

  async function cargarAlertas() {

    const statusDiv = document.getElementById('loading');

    try {

      statusDiv.innerText = "Conectando índice...";

      Object.values(capasPorFecha).forEach(layer => map.removeLayer(layer));
      for (const k in capasPorFecha) delete capasPorFecha[k];

      const proxyUrl = '/api/smn?url=';
      const ts = Date.now();

      const rss = await fetch(proxyUrl + encodeURIComponent(
        'https://ssl.smn.gob.ar/feeds/CAP/rss_alertaCAP_nuevo.xml?nocache=' + ts
      ));

      const rssText = await rss.text();
      const doc = new DOMParser().parseFromString(rssText, "application/xml");

      const links = [...doc.getElementsByTagName("link")]
        .map(n => n.textContent)
        .filter(u => u && u.includes('.xml') && !u.includes('rss_alertaCAP'));

      const linksUnicos = [...new Set(links)];

      if (!linksUnicos.length) {
        statusDiv.innerText = "Sin alertas";
        return;
      }

      statusDiv.innerText = `Descargando ${linksUnicos.length} alertas...`;

      const urls = linksUnicos.map(l =>
        proxyUrl + encodeURIComponent(l + "?nocache=" + ts)
      );

      console.time("DESCARGA");

      const caps = await fetchLimitado(urls, 8);

      console.timeEnd("DESCARGA");

      let poligonos = new Set();
      let datosTabla = [];

      let alertasDibujadas = 0;

      for (const cap of caps) {
        if (!cap) continue;

        const doc = new DOMParser().parseFromString(cap.text, "application/xml");

        const onset = doc.getElementsByTagName("onset")[0]?.textContent;
        const expire = doc.getElementsByTagName("expires")[0]?.textContent;

        if (expire && new Date(expire) < new Date()) continue;

        const evento =
          doc.getElementsByTagName("event")[0]?.textContent ||
          doc.getElementsByTagName("headline")[0]?.textContent ||
          "Alerta";

        const severity = doc.getElementsByTagName("severity")[0]?.textContent || "Unknown";

        let color = "#eab308";
        let nivel = "Amarilla";

        if (severity === "Extreme") { color = "#ef4444"; nivel = "Roja"; }
        else if (severity === "Severe") { color = "#f97316"; nivel = "Naranja"; }

        const fechaGrupo = fechaSimple(onset);

        if (!capasPorFecha[fechaGrupo]) {
          capasPorFecha[fechaGrupo] = L.layerGroup();
          controlCapas.addOverlay(capasPorFecha[fechaGrupo], fechaGrupo);
          capasPorFecha[fechaGrupo].addTo(map);
        }

        const polys = doc.getElementsByTagName("polygon");

        for (let p of polys) {
          const coords = p.textContent.trim().split(" ").map(x => {
            const [a,b] = x.split(",");
            return [parseFloat(a), parseFloat(b)];
          });

          const key = p.textContent.trim();
          if (poligonos.has(key)) continue;
          poligonos.add(key);

          const poly = L.polygon(coords, {
            color,
            fillColor: color,
            fillOpacity: 0.4,
            weight: 2
          });

          poly.bindPopup(evento);

          capasPorFecha[fechaGrupo].addLayer(poly);
          alertasDibujadas++;
        }

        datosTabla.push({
          evento,
          nivel,
          inicio: formatearFecha(onset),
          fin: formatearFecha(expire)
        });
      }

      window.parent.postMessage({
        type: 'CAP_DATA_READY',
        payload: datosTabla
      }, '*');

      statusDiv.innerText = `Listo: ${alertasDibujadas} zonas`;

    } catch (e) {
      console.log(e);
      statusDiv.innerText = "Error de carga";
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
          Monitor de alertas y advertencias con filtros de caducidad y deduplicación de geometría.
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
