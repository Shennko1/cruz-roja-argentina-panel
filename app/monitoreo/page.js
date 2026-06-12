'use client';

import React, { useEffect, useState } from 'react';

export default function MapaAlertasSMN() {
  const [alertasTabla, setAlertasTabla] = useState([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleMessage = (event) => {
      if (event.data?.type !== 'CAP_DATA_READY') return;

      const payload = event.data.payload || [];

      const agrupado = {};

      payload.forEach(alerta => {
        (alerta.provincias || []).forEach(prov => {
          if (!agrupado[prov]) agrupado[prov] = {};

          const key = `${alerta.nivel}-${alerta.evento}`;

          if (!agrupado[prov][key]) {
            agrupado[prov][key] = alerta;
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
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const mapHtml = String.raw`
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css"/>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js"></script>

  <style>
    body { margin:0; padding:0; font-family:sans-serif; }
    #map { width:100%; height:100vh; }
    .loading {
      position:absolute;
      top:20px;
      left:50%;
      transform:translateX(-50%);
      background:white;
      padding:10px 20px;
      border-radius:20px;
      font-size:12px;
      z-index:1000;
    }
  </style>
</head>

<body>
<div id="loading" class="loading">Cargando...</div>
<div id="map"></div>

<script>
document.addEventListener("DOMContentLoaded", function () {

  const map = L.map('map').setView([-38.4161, -63.6167], 5);

  L.tileLayer('https://wms.ign.gob.ar/geoserver/gwc/service/tms/1.0.0/mapabase_gris@EPSG%3A3857@png/{z}/{x}/{-y}.png', {
    attribution: '© OpenStreetMap'
  }).addTo(map);

  const capas = {};
  const control = L.control.layers(null, null, { collapsed:false }).addTo(map);

  const poligonos = new Set();

  function fechaSimple(iso) {
    if (!iso) return "sin fecha";
    const d = new Date(iso);
    return d.getDate().toString().padStart(2,'0') + "/" +
           (d.getMonth()+1).toString().padStart(2,'0') + "/" +
           d.getFullYear();
  }

  async function cargar() {

    const proxy = "/api/smn?url=";
    const ts = Date.now();

    const rss = await fetch(proxy + encodeURIComponent(
      "https://ssl.smn.gob.ar/feeds/CAP/rss_alertaCAP_nuevo.xml?nocache=" + ts
    ));

    const text = await rss.text();
    const doc = new DOMParser().parseFromString(text, "application/xml");

    const links = [...doc.getElementsByTagName("link")]
      .map(x => x.textContent)
      .filter(x => x && x.includes(".xml"));

    const uniq = [...new Set(links)];

    const caps = await Promise.all(
      uniq.map(u =>
        fetch(proxy + encodeURIComponent(u + "?nocache=" + ts))
          .then(r => r.text())
          .catch(() => null)
      )
    );

    let output = [];

    for (const raw of caps) {
      if (!raw) continue;

      const xml = new DOMParser().parseFromString(raw, "application/xml");

      if (xml.getElementsByTagName("parsererror").length) continue;

      const event = xml.getElementsByTagName("event")[0]?.textContent || "Alerta";
      const severity = xml.getElementsByTagName("severity")[0]?.textContent || "Unknown";

      let color = "#eab308";
      let nivel = "Amarilla";

      if (severity === "Extreme") { color = "#ef4444"; nivel = "Roja"; }
      else if (severity === "Severe") { color = "#f97316"; nivel = "Naranja"; }

      const polys = xml.getElementsByTagName("polygon");

      for (let p of polys) {
        const key = p.textContent.trim();
        if (poligonos.has(key)) continue;
        poligonos.add(key);

        const coords = key.split(" ").map(c => {
          const [a,b] = c.split(",");
          return [parseFloat(a), parseFloat(b)];
        });

        const poly = L.polygon(coords, {
          color,
          fillColor: color,
          fillOpacity: 0.4,
          weight: 2
        });

        poly.bindPopup(event);
        poly.addTo(map);
      }

      output.push({ evento: event, nivel });
    }

    window.parent.postMessage({
      type: "CAP_DATA_READY",
      payload: output
    }, "*");

    document.getElementById("loading").innerText = "Listo";
  }

  cargar();
});
</script>

</body>
</html>
`;

  return (
    <div className="bg-white p-6 rounded-xl border">

      <div className="w-full h-[600px]">
        <iframe
          srcDoc={mapHtml}
          className="w-full h-full border-0"
          sandbox="allow-scripts allow-same-origin"
        />
      </div>

      <div className="mt-6">
        <table className="w-full text-sm">
          <tbody>
            {alertasTabla.map((g, i) => (
              <React.Fragment key={i}>
                <tr>
                  <td colSpan="3" className="font-bold bg-gray-100 p-2">
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
