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
          var map = L.map('map').setView([-38.4161, -63.6167], 5);
          
          // Mapa base gris del IGN
          L.tileLayer('https://wms.ign.gob.ar/geoserver/gwc/service/tms/1.0.0/mapabase_gris@EPSG%3A3857@png/{z}/{x}/{-y}.png', {
            attribution: 'IGN'
          }).addTo(map);

          // Capas de Provincias y Capitales del IGN
          L.tileLayer.wms('https://wms.ign.gob.ar/geoserver/ows?', {
            layers: 'provincia,capa_capitales',
            format: 'image/png',
            transparent: true,
            opacity: 0.7
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

          function formatearFecha(isoString) {
            if (!isoString) return 'N/A';
            const d = new Date(isoString);
            return String(d.getDate()).padStart(2, '0') + '/' + String(d.getMonth() + 1).padStart(2, '0') + ' ' + String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
          }

          async function cargarAlertas() {
            const statusDiv = document.getElementById('loading');
            try {
              statusDiv.style.display = 'block';
              layerGroup.clearLayers();
              const proxyUrl = 'https://api.codetabs.com/v1/proxy?quest=';
              const targetUrl = 'https://ssl.smn.gob.ar/feeds/CAP/rss_alertaCAP_nuevo.xml?nocache=' + new Date().getTime();
              const rssRes = await fetch(proxyUrl + encodeURIComponent(targetUrl));
              const rssText = await rssRes.text();
              const parser = new DOMParser();
              const rssDoc = parser.parseFromString(rssText, "application/xml");
              const linkNodes = rssDoc.getElementsByTagName("link");
              const links = Array.from(linkNodes).map(l => l.textContent).filter(u => u.includes('.xml') && !u.includes('rss_alertaCAP'));
              const linksUnicos = [...new Set(links)];

              if (linksUnicos.length === 0) {
                statusDiv.innerText = "Sin Alertas";
                setTimeout(() => { statusDiv.style.display = 'none'; }, 4000);
                window.parent.postMessage({ type: 'CAP_DATA_READY', payload: [] }, '*');
                return;
              }

              const fetchPromises = linksUnicos.map(link => fetch(proxyUrl + encodeURIComponent(link)).then(r => r.text()).then(t => ({link, text: t})));
              const capsDescargados = await Promise.all(fetchPromises);
              
              let alertasDibujadas = 0;
              const poligonosYaDibujados = new Set();
              const datosParaTabla = [];
              const linksListados = new Set();

              for (const capData of capsDescargados) {
                if (!capData) continue;
                try {
                  const capDoc = parser.parseFromString(capData.text, "application/xml");
                  const link = capData.link;
                  const dateEndStr = capDoc.getElementsByTagName("expires")[0]?.textContent;
                  if (dateEndStr && new Date(dateEndStr) < new Date()) continue;

                  const severity = capDoc.getElementsByTagName("severity")[0]?.textContent || 'Minor';
                  const eventoTexto = capDoc.getElementsByTagName("event")[0]?.textContent || 'Alerta';
                  const areaDesc = capDoc.getElementsByTagName("areaDesc")[0]?.textContent || '';
                  
                  let color = '#eab308'; let nivel = 'Alerta Amarilla';
                  if (severity === 'Extreme') { color = '#ef4444'; nivel = 'Alerta Roja'; }
                  else if (severity === 'Severe') { color = '#f97316'; nivel = 'Alerta Naranja'; }
                  
                  let provsEncontradas = [];
                  provsDic.forEach(p => { if (p.c.some(c => (eventoTexto + areaDesc).toLowerCase().includes(c))) provsEncontradas.push(p.n); });
                  if (provsEncontradas.length === 0) provsEncontradas.push("Varias / Área Nacional");

                  if (!linksListados.has(link)) {
                    linksListados.add(link);
                    datosParaTabla.push({ id: link, evento: eventoTexto, nivel, color, provincias: provsEncontradas, inicio: formatearFecha(capDoc.getElementsByTagName("onset")[0]?.textContent), fin: formatearFecha(dateEndStr) });
                  }

                  Array.from(capDoc.getElementsByTagName("polygon")).forEach(p => {
                    const poly = p.textContent.trim();
                    if (!poligonosYaDibujados.has(poly)) {
                      poligonosYaDibujados.add(poly);
                      const coords = poly.split(' ').map(par => par.split(',').map(Number).reverse());
                      L.polygon(coords, {color, fillColor: color, fillOpacity: 0.4}).addTo(layerGroup).bindPopup(eventoTexto);
                      alertasDibujadas++;
                    }
                  });
                } catch(e) {}
              }
              window.parent.postMessage({ type: 'CAP_DATA_READY', payload: datosParaTabla }, '*');
              statusDiv.style.display = 'none';
            } catch(e) { statusDiv.innerText = "Error"; }
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
        <h2 className="text-lg font-bold text-gray-800 uppercase tracking-tight">Panel Automático de Alertas (SMN)</h2>
      </div>
      <div className="w-full h-[600px] rounded-xl overflow-hidden border border-gray-200 relative bg-gray-50 mb-6 z-0">
        <iframe srcDoc={mapHtml} className="w-full h-full border-0 absolute inset-0" title="Mapa CAP SMN" sandbox="allow-scripts allow-same-origin" />
      </div>
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500 border-b border-gray-200">
            <tr><th className="px-4 py-3">Nivel</th><th className="px-4 py-3">Fenómeno</th><th className="px-4 py-3">Vigencia</th></tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {alertasTabla.map((grupo) => (
              <React.Fragment key={grupo.provincia}>
                <tr className="bg-gray-100/60"><td colSpan="3" className="px-4 py-2 text-xs font-bold uppercase tracking-wider">📍 {grupo.provincia}</td></tr>
                {grupo.alertas.map((a, i) => (
                  <tr key={i}>
                    <td className="px-4 py-3"><span className="px-2 py-1 rounded text-white text-xs font-bold" style={{ backgroundColor: a.color }}>{a.nivel}</span></td>
                    <td className="px-4 py-3 font-medium">{a.evento}</td>
                    <td className="px-4 py-3 text-xs">{a.inicio} - {a.fin}</td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
