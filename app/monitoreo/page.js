'use client';

import React, { useEffect, useState } from 'react';

export default function MapaAlertasSMN() {
  const [alertasTabla, setAlertasTabla] = useState([]);

  useEffect(() => {
    if (typeof window === "undefined") return;

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

        const tablaFinal = Object.keys(agrupado)
          .sort()
          .map(prov => ({
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
    body { margin:0; padding:0; font-family:sans-serif; background:#f8fafc; }
    #map { width:100%; height:100vh; }
    .loading {
      position:absolute;
      top:20px;
      left:50%;
      transform:translateX(-50%);
      z-index:1000;
      background:white;
      padding:10px 20px;
      border-radius:30px;
      font-size:12px;
      font-weight:bold;
      border:1px solid #e2e8f0;
    }
  </style>
</head>

<body>
<div id="loading" class="loading">Iniciando...</div>
<div id="map"></div>

<script>
document.addEventListener("DOMContentLoaded", function () {

  var map = L.map('map').setView([-38.4161, -63.6167], 5);

  L.tileLayer('https://wms.ign.gob.ar/geoserver/gwc/service/tms/1.0.0/mapabase_gris@EPSG%3A3857@png/{z}/{x}/{-y}.png', {
    attribution: '© OpenStreetMap'
  }).addTo(map);

  const capasPorFecha = {};
  const controlCapas = L.control.layers(null, null, {
    collapsed: false,
    position: 'topright'
  }).addTo(map);

  const provsDic = [ /* tu diccionario original */ ];

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
    const results = new Array(urls.length);
    let index = 0;

    const worker = async () => {
      while (true) {
        const i = index++;
        if (i >= urls.length) break;

        try {
          const res = await fetch(urls[i]);
          const text = await res.text();
          results[i] = { url: urls[i], text };
        } catch (e) {
          results[i] = null;
        }
      }
    };

    await Promise.all(Array.from({ length: limit }, worker));
    return results;
  }

  async function cargarAlertas() {

    const statusDiv = document.getElementById('loading');

    try {

      statusDiv.innerText = "Conectando...";

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

      const urls = linksUnicos.map(l =>
        proxyUrl + encodeURIComponent(l + "?nocache=" + ts)
      );

      const caps = await fetchLimitado(urls, 8);

      let poligonos = new Set();
      let datosTabla = [];
      let alertasDibujadas = 0;

      for (const cap of caps) {
        if (!cap) continue;

        const doc = new DOMParser().parseFromString(cap.text, "application/xml");

        if (doc.getElementsByTagName("parsererror").length > 0) continue;

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

          const key = p.textContent.trim();
          if (poligonos.has(key)) continue;
          poligonos.add(key);

          const coords = key.split(" ").map(x => {
            const [a,b] = x.split(",");
            return [parseFloat(a), parseFloat(b)];
          });

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

      statusDiv.innerText = `Listo: ${alertasDibujadas}`;

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

      <div className="w-full h-[600px] rounded-xl overflow-hidden border border-gray-200 relative bg-gray-50 mb-6">
        <iframe
          srcDoc={mapHtml}
          className="w-full h-full border-0"
          sandbox="allow-scripts allow-same-origin"
        />
      </div>

      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <tbody>
            {alertasTabla.map((g, i) => (
              <React.Fragment key={i}>
                <tr>
                  <td colSpan="3" className="bg-gray-100 p-2 font-bold">
                    {g.provincia}
                  </td>
                </tr>
                {g.alertas.map((a, j) => (
                  <tr key={j}>
                    <td>{a.nivel}</td>
                    <td>{a.evento}</td>
                    <td>{a.inicio} - {a.fin}</td>
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
