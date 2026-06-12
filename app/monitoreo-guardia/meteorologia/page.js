"use client";
import React, { useState, useEffect } from "react";

export default function HidrometeorologiaPage() {
  const [isRiesgoOpen, setIsRiesgoOpen] = useState(false);
  const [isRedesOpen, setIsRedesOpen] = useState(false);
  const [isNoticiasOpen, setIsNoticiasOpen] = useState(false);
  
  // Estado para la ubicación del buscador de noticias
  const [ubicacion, setUbicacion] = useState("Argentina");
  
  // Estado para la tabla resumida de alertas del SMN
  const [alertasTabla, setAlertasTabla] = useState([]);

  // Escuchar los reportes procesados por el iframe del mapa del SMN
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

  // Configuración de las búsquedas dinámicas de noticias
  const busquedas = [
    {
      titulo: "Tormentas y Vientos",
      terminos: '(tormenta OR tormentas OR temporal OR "vientos fuertes" OR zonda OR tornado)'
    },
    {
      titulo: "Inundaciones",
      terminos: '(inundación OR inundaciones OR crecida OR desborde)'
    },
    {
      titulo: "Daños y Evacuados",
      terminos: '(evacuados OR anegamientos OR daños)'
    }
  ];

  // Función para construir la URL de Google News
  const generarUrlGoogleNews = (terminos) => {
    const ubicacionFinal = ubicacion.trim() !== "" ? `${ubicacion.trim()} ` : "";
    const query = `${ubicacionFinal}${terminos} when:24h`;
    return `https://news.google.com/search?q=${encodeURIComponent(query)}&hl=es-419&gl=AR&ceid=AR%3Aes-419`;
  };

  // Código fuente inyectado en el iframe del SMN (Leaflet + CAP RSS)
  const smnMapHtml = `
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
          top: 15px; left: 50%; 
          transform: translateX(-50%); 
          z-index: 1000; 
          background: rgba(255, 255, 255, 0.95); 
          padding: 8px 16px; 
          border-radius: 30px; 
          font-weight: bold; 
          box-shadow: 0 4px 15px rgba(0,0,0,0.1); 
          font-size: 11px; 
          color: #1e293b;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border: 1px solid #e2e8f0;
        }
      </style>
    </head>
    <body>
      <div id="loading" class="loading">Iniciando sistema...</div>
      <div id="map"></div>
      
      <script>
        document.addEventListener("DOMContentLoaded", function() {
          var map = L.map('map').setView([-38.4161, -63.6167], 4);
          L.tileLayer('https://wms.ign.gob.ar/geoserver/gwc/service/tms/1.0.0/mapabase_gris@EPSG%3A3857@png/{z}/{x}/{-y}.png', {
            attribution: '© Instituto Geográfico Nacional'
          }).addTo(map);

          var layerGroup = L.layerGroup().addTo(map);

const capasPorFecha = {};
let controlCapas = null;

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
          function obtenerFechaCorta(isoString) {
          if (!isoString) return 'Sin fecha';
          const d = new Date(isoString);
          if (isNaN(d.getTime())) return 'Sin fecha';
          const dia = String(d.getDate()).padStart(2, '0');
          const mes = String(d.getMonth() + 1).padStart(2, '0');
          const anio = d.getFullYear();
          return dia + '-' + mes + '-' + anio;
          }
            if (!isoString) return 'N/A';
            const d = new Date(isoString);
            if (isNaN(d.getTime())) return 'N/A';
            const dia = String(d.getDate()).padStart(2, '0');
            const mes = String(d.getMonth() + 1).padStart(2, '0');
            const horas = String(d.getHours()).padStart(2, '0');
            const min = String(d.getMinutes()).padStart(2, '0');
            return dia + '/' + mes + ' ' + horas + ':' + min;
          }

          async function cargarAlertas() {
            const statusDiv = document.getElementById('loading');
            try {
              statusDiv.style.display = 'block';
              statusDiv.innerText = "Conectando al SMN...";
              layerGroup.clearLayers();
              Object.values(capasPorFecha).forEach(capa => {
  map.removeLayer(capa);
});

Object.keys(capasPorFecha).forEach(key => {
  delete capasPorFecha[key];
});

if (controlCapas) {
  map.removeControl(controlCapas);
  controlCapas = null;
}

              // Se cambia a API interno
              const proxyUrl = '/api/smn?url=';
              const timestamp = new Date().getTime();
              const targetUrl = 'https://ssl.smn.gob.ar/feeds/CAP/rss_alertaCAP_nuevo.xml?nocache=' + timestamp;
              
              const rssRes = await fetch(proxyUrl + encodeURIComponent(targetUrl));
              if (!rssRes.ok) throw new Error("Fallo en el proxy");
              
              const rssText = await rssRes.text();
              
              // Evitar que un error del proxy se procese como un XML vacío
              if (!rssText.includes('<rss')) throw new Error("El proxy no devolvió un XML válido");

              const parser = new DOMParser();
              const rssDoc = parser.parseFromString(rssText, "application/xml");
              const linkNodes = rssDoc.getElementsByTagName("link");
              const links = [];
              
              for (let i = 0; i < linkNodes.length; i++) {
                const url = linkNodes[i].textContent;
                if (url && url.includes('.xml') && !url.includes('rss_alertaCAP')) {
                  links.push(url);
                }
              }

              const linksUnicos = [...new Set(links)];
              console.log("XML encontrados:", linksUnicos.length);
              console.log(linksUnicos.slice(0,10));
              console.log("Polígonos dibujados:", alertasDibujadas);
              console.log("Alertas tabla:", datosParaTabla.length);

              if (linksUnicos.length === 0) {
                statusDiv.innerText = "Territorio despejado (Sin Alertas)";
                setTimeout(() => { statusDiv.style.display = 'none'; }, 4000);
                window.parent.postMessage({ type: 'CAP_DATA_READY', payload: [] }, '*');
                return;
              }

              statusDiv.innerText = "Descargando " + linksUnicos.length + " reportes oficiales...";
              
              // SOLUCIÓN: Carga por lotes (batches de a 5) para no saturar el proxy y evitar error 429
              const capsDescargados = [];
              for (let i = 0; i < linksUnicos.length; i += 5) {
                const batch = linksUnicos.slice(i, i + 5);
                const fetchPromises = batch.map(link => 
                  fetch(proxyUrl + encodeURIComponent(link + "?nocache=" + timestamp))
                    .then(res => res.ok ? res.text() : null)
                    .then(text => (text && text.includes('<alert')) ? { link, text } : null)
                    .catch(err => null)
                );
                const resultados = await Promise.all(fetchPromises);
                capsDescargados.push(...resultados);
              }

              statusDiv.innerText = "Procesando mapas de alerta...";

              let alertasDibujadas = 0;
              const poligonosYaDibujados = new Set();
              const datosParaTabla = [];
              const linksListados = new Set();

              for (const capData of capsDescargados) {
                if (!capData) continue;
                try {
                  const capDoc = parser.parseFromString(capData.text, "application/xml");
                  const link = capData.link;

                  const expiresNodes = capDoc.getElementsByTagName("expires");
                  const dateEndStr = expiresNodes.length > 0 ? expiresNodes[0].textContent : null;
                  
                  if (dateEndStr) {
                    const fechaExpiracion = new Date(dateEndStr);
                    if (fechaExpiracion < new Date()) continue; 
                  }

                  const onsetNodes = capDoc.getElementsByTagName("onset");
                  const effectiveNodes = capDoc.getElementsByTagName("effective");
                  const dateStartStr = onsetNodes.length > 0 ? onsetNodes[0].textContent : (effectiveNodes.length > 0 ? effectiveNodes[0].textContent : null);

                  const inicioFormat = formatearFecha(dateStartStr);
                  const finFormat = formatearFecha(dateEndStr);
                  const fechaMapa = obtenerFechacorta(dateStartStr);

                  const severityNodes = capDoc.getElementsByTagName("severity");
                  const severity = severityNodes.length > 0 ? severityNodes[0].textContent : 'Unknown';
                  
                  const eventNodes = capDoc.getElementsByTagName("event");
                  const headlineNodes = capDoc.getElementsByTagName("headline");
                  const areaDescNodes = capDoc.getElementsByTagName("areaDesc");
                  const descriptionNodes = capDoc.getElementsByTagName("description");
                  
                  const eventoTexto = eventNodes.length > 0 ? eventNodes[0].textContent : (headlineNodes.length > 0 ? headlineNodes[0].textContent : 'Alerta Meteorológica');
                  const descArea = areaDescNodes.length > 0 ? areaDescNodes[0].textContent : '';
                  const descText = descriptionNodes.length > 0 ? descriptionNodes[0].textContent : '';

                  let color = '#eab308';
                  let nivel = 'Alerta Amarilla';
                  const evtLower = eventoTexto.toLowerCase();

                  if (severity === 'Extreme') { 
                    color = '#ef4444'; nivel = 'Alerta Roja'; 
                  } else if (severity === 'Severe') { 
                    color = '#f97316'; nivel = 'Alerta Naranja'; 
                  } else if (severity === 'Minor' || evtLower.includes('advertencia') || evtLower.includes('niebla') || evtLower.includes('ceniza')) {
                    color = '#8b5cf6'; 
                    nivel = 'Advertencia (Informate)';
                  }

                  const textoParaEscanear = (eventoTexto + " " + descArea + " " + descText).toLowerCase();
                  let provsEncontradas = [];
                  
                  provsDic.forEach(prov => {
                    if (prov.c.some(clave => textoParaEscanear.includes(clave))) {
                      if (prov.n === "Buenos Aires" && textoParaEscanear.includes("ciudad autónoma") && !textoParaEscanear.replace("ciudad autónoma de buenos aires", "").includes("buenos aires")) {
                        return;
                      }
                      provsEncontradas.push(prov.n);
                    }
                  });

                  if (provsEncontradas.length === 0) {
                    provsEncontradas.push("Varias / Área Nacional");
                  }

                  if (!linksListados.has(link)) {
                    linksListados.add(link);
                    datosParaTabla.push({
                      id: link,
                      evento: eventoTexto,
                      nivel: nivel,
                      color: color,
                      inicio: inicioFormat,
                      fin: finFormat,
                      provincias: provsEncontradas
                    });
                  }

                  const polygonNodes = capDoc.getElementsByTagName("polygon");
                  for (let j = 0; j < polygonNodes.length; j++) {
                    const polyString = polygonNodes[j].textContent.trim();
                    if (!polyString) continue;

                    if (poligonosYaDibujados.has(polyString)) continue;
                    poligonosYaDibujados.add(polyString);

                    const coords = polyString.split(' ').map(par => {
                      const partes = par.split(',');
                      return [parseFloat(partes[0]), parseFloat(partes[1])];
                    });
if (!capasPorFecha[fechaMapa]) {
  capasPorFecha[fechaMapa] = L.layerGroup().addTo(map);
}
                    var polygon = L.polygon(coords, {
                      color: color,
                      fillColor: color,
                      fillOpacity: 0.4,
                      weight: 2
                    });
                    
                    const popupHTML = "<div style='font-family:sans-serif; min-width:180px;'>" +
                      "<b style='color:#1e293b; font-size:14px;'>" + eventoTexto + "</b><br/>" +
                      "<span style='display:inline-block; margin:6px 0; padding:3px 8px; border-radius:4px; background:" + color + "; color:white; font-size:11px; font-weight:bold;'> " + nivel + "</span><br/>" +
                      "<div style='background:#f1f5f9; padding:8px; border-radius:4px; font-size:12px; color:#475569; margin-top:4px;'>" +
                      "<b>Vigencia:</b><br/>" +
                      "Desde: " + inicioFormat + " hs<br/>" +
                      "Hasta: " + finFormat + " hs</div>" +
                      "</div>";

                    polygon.bindPopup(popupHTML);
                   capasPorFecha[fechaMapa].addLayer(polygon);
                    alertasDibujadas++;
                  }
                } catch (e) {}
              }
              if (Object.keys(capasPorFecha).length > 0) {
  controlCapas = L.control.layers(
    null,
    capasPorFecha,
    {
      collapsed: false
    }
  ).addTo(map);
}
              window.parent.postMessage({ type: 'CAP_DATA_READY', payload: datosParaTabla }, '*');
              statusDiv.innerText = "Mapa listo: " + alertasDibujadas + " alertas activas";
              setTimeout(() => { statusDiv.style.display = 'none'; }, 4000);

            } catch (error) {
              console.error(error);
              statusDiv.innerText = "Error de conexión o proxy. Reintentando...";
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
      
      {/* CABECERA */}
      <div className="border-b border-gray-200 pb-3 mb-4 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">
          Hidrometeorología
        </h2>
      </div>

      {/* ÁREA DE TRABAJO (Blank State) */}
      <div className="bg-gray-50 p-4 rounded-lg border border-dashed border-gray-300 text-sm text-gray-500 mb-8">
        Incluye herramientas de monitoreo meteorológico en tiempo real, seguimiento de riesgo hídrico, visualización de alertas, monitoreo de redes sociales y búsqueda de noticias relacionadas a fenómenos hidrometeorológicos.
      </div>

      {/* SECCIÓN DE MAPAS METEOROLÓGICOS Y ALERTAS (Side by Side / Vertical Argentina) */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4 border-b border-gray-100 pb-2">
          <img src="/storm.png" alt="Ícono Lluvia" className="w-9 h-9 object-contain" />
          <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
            Monitoreo en Tiempo Real y Alertas Oficiales
          </h3>
        </div>

        {/* Grilla principal de mapas */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
          
          {/* COLUMNA 1: MAPA DE LLUVIA (WINDY) */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
            {/* Cabecera con altura fija (h-12) para alinear perfectamente con el otro mapa */}
            <div className="bg-gray-50 px-4 h-12 border-b border-gray-200 flex justify-between items-center">
              <span className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
               Mapa de Lluvia y Radar (Windy)
              </span>
              <a 
                href="https://www.youtube.com/watch?v=RhNgxywKjw4" 
                target="_blank" 
                rel="noreferrer" 
                className="text-[11px] text-blue-600 hover:underline font-bold"
              >
                Ver tutorial ↗
              </a>
            </div>
            
            <div className="w-full h-[600px] bg-gray-100">
              <iframe 
                width="100%" 
                height="100%" 
                src="https://embed.windy.com/embed2.html?lat=-40.518&lon=-63.599&zoom=4&level=surface&overlay=rain&product=ecmwf&menu=&message=&marker=&calendar=now&pressure=&type=map&location=coordinates&detail=&metricWind=km%2Fh&metricTemp=%C2%B0C&radarRange=-1&lang=es" 
                frameBorder="0" 
                title="Windy Radar" 
                allowFullScreen
              ></iframe>
            </div>

            {/* Instrucciones movidas al subtítulo */}
            <div className="p-3 bg-blue-50/40 border-t border-blue-100 text-[11px] text-gray-600 leading-relaxed">
              Permite visualizar fenómenos en tiempo real. Puede cambiar el modelo o la capa activa (Lluvia, Nubes, Viento, Radar) presionando el menú en la esquina superior derecha. Los colores inferiores indican intensidad.
            </div>
          </div>

          {/* COLUMNA 2: MAPA DE ALERTAS (SMN) */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
            {/* Cabecera con altura fija (h-12) para alinear perfectamente con el otro mapa */}
            <div className="bg-gray-50 px-4 h-12 border-b border-gray-200 flex items-center">
              <span className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                Alertas del Servicio Meteorológico Nacional
              </span>
            </div>
            
            <div className="w-full h-[600px] relative bg-gray-100">
              <iframe 
                srcDoc={smnMapHtml} 
                className="w-full h-full border-0 absolute inset-0" 
                title="Mapa CAP SMN" 
                sandbox="allow-scripts allow-same-origin allow-popups"
              />
            </div>

            {/* Leyenda movida al subtítulo para mantener la simetría con Windy */}
            <div className="p-3 bg-gray-50 border-t border-gray-200 flex flex-wrap gap-4 text-[10px] font-bold uppercase tracking-wider justify-center">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#ef4444]"></span>
                <span className="text-gray-700">Alerta Roja</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#f97316]"></span>
                <span className="text-gray-700">Alerta Naranja</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#eab308]"></span>
                <span className="text-gray-700">Alerta Amarilla</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#8b5cf6]"></span>
                <span className="text-gray-700">Advertencia</span>
              </div>
            </div>
          </div>

        </div>

        {/* TABLA DE RESUMEN OPERATIVO SMN (Ubicada debajo de los dos mapas) */}
        <div className="mt-6 border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
            <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
              Resumen Operativo de Eventos Activos por Provincia
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50/70 text-xs uppercase text-gray-500 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 font-semibold w-1/4">Nivel</th>
                  <th className="px-4 py-3 font-semibold w-2/4">Fenómeno</th>
                  <th className="px-4 py-3 font-semibold w-1/4">Vigencia (Inicio - Fin)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {alertasTabla.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="px-4 py-8 text-center text-gray-500 text-xs">
                      Analizando reportes oficiales o sin novedades críticas en el territorio.
                    </td>
                  </tr>
                ) : (
                  alertasTabla.map((grupo) => (
                    <React.Fragment key={grupo.provincia}>
                      <tr className="bg-gray-100/70 border-t border-gray-200">
                        <td colSpan="3" className="px-4 py-2 text-xs font-bold text-gray-800 uppercase tracking-wider">
                          📍 {grupo.provincia}
                        </td>
                      </tr>
                      {grupo.alertas.map((alerta, index) => (
                        <tr key={`${grupo.provincia}-${index}`} className="hover:bg-gray-50/80 transition-colors">
                          <td className="px-4 py-3 pl-6">
                            <span 
                              className="px-2.5 py-1 rounded-md text-white text-[11px] font-bold whitespace-nowrap" 
                              style={{ backgroundColor: alerta.color }}
                            >
                              {alerta.nivel}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-medium text-gray-800 text-xs">{alerta.evento}</td>
                          <td className="px-4 py-3 text-[11px]">
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

      {/* 2. RIESGO HÍDRICO (Launchers) - Desplegable */}
      <div className="mb-6 border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <button onClick={() => setIsRiesgoOpen(!isRiesgoOpen)} className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
          <div className="flex items-center gap-3">
            <img src="/floods.png" alt="Ícono Riesgo Hídrico" className="w-9 h-9 object-contain" />
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
              Riesgo Hídrico y Estado de los Ríos
            </h3>
          </div>
          <svg className={`w-5 h-5 text-gray-500 transition-transform ${isRiesgoOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {isRiesgoOpen && (
          <div className="p-4 border-t border-gray-200 bg-white grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 flex flex-col justify-between shadow-sm min-h-[220px]">
              <div>
                <h4 className="text-sm font-bold text-gray-800 mb-2">Google FloodHub</h4>
                <p className="text-[12px] text-gray-600 leading-relaxed mb-2">
                  Plataforma gratuita de Google que utiliza inteligencia artificial para predecir inundaciones fluviales con hasta 7 días de anticipación. <strong>No reemplaza a los sistemas oficiales o locales de alerta.</strong>
                </p>
                <p className="text-[12px] text-gray-600 leading-relaxed">
                  Puede usarse como complemento para estimar posibles impactos en localidades afectadas por lluvia. Al hacer clic en el botón de ayuda dentro de su interfaz, se puede acceder al manual de uso en español.
                </p>
              </div>
              <a href="https://sites.research.google/floods/l/-40.476461911063325/-63.59899572450027/3.6899628892558125/p/ChIJZ8b99fXKvJURqA_wKpl3Lz0?hl=es" target="_blank" rel="noreferrer" className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 px-6 rounded-lg transition-colors text-center mt-4 block">Abrir FloodHub ↗</a>
            </div>
            <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 flex flex-col justify-between shadow-sm min-h-[220px]">
              <div>
                <h4 className="text-sm font-bold text-gray-800 mb-2">Sistema de Información y Alerta Hidrológico</h4>
                <p className="text-[12px] text-gray-600 leading-relaxed mb-2">Mapa del Instituto Nacional del Agua (INA) con las mediciones en tiempo real de todos los puertos y cuencas del país.</p>
                <p className="text-[12px] text-gray-600 leading-relaxed">Puede utilizarse para evaluar tendencias de aumento/descenso de ríos y prever posibles inundaciones o necesidades de evacuación.</p>
              </div>
              <a href="https://alerta.ina.gob.ar/pub/mapa" target="_blank" rel="noreferrer" className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 px-6 rounded-lg transition-colors text-center mt-4 block">Abrir Mapa del INA ↗</a>
            </div>
          </div>
        )}
      </div>

      {/* 3. REPORTES EN TIEMPO REAL (Feeds) - Desplegable */}
      <div className="mb-6 border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <button onClick={() => setIsRedesOpen(!isRedesOpen)} className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
          <div className="flex items-center gap-3">
            <img src="/media.png" alt="Ícono Redes Sociales" className="w-9 h-9 object-contain" />
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
              Redes Sociales (Monitoreo de Facebook)
            </h3>
          </div>
          <svg className={`w-5 h-5 text-gray-500 transition-transform ${isRedesOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {isRedesOpen && (
          <div className="p-4 border-t border-gray-200 bg-white">
            <div>
              <h4 className="text-xs font-bold text-gray-800 mb-4 uppercase border-b border-gray-100 pb-2">Cuentas comunitarias de meteorología</h4>
              <p className="text-[12px] text-gray-600 leading-relaxed mb-2"> Proveen imágenes de impactos en tiempo real, además de compartir alertas y análisis de utilidad para el monitoreo general. </p>
              <p className="text-[12px] text-gray-600 leading-relaxed mb-4"> Deben usarse para obtener un panorama rápido de la situación y saber dónde orientar las búsquedas concretas de información. </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* Tiempo en Arg */}
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center">
                  <span className="text-[11px] font-bold text-gray-600 mb-2 uppercase">Tiempo en Arg</span>
                  <iframe src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2FTiempoenArg&tabs=timeline&width=340&height=500&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=false&appId" width="100%" height="500" style={{ border: "none", overflow: "hidden" }} scrolling="no" frameBorder="0" allowFullScreen={true}></iframe>
                </div>

                {/* Pronostico Extendido */}
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center">
                  <span className="text-[11px] font-bold text-gray-600 mb-2 uppercase">Pronóstico Extendido</span>
                  <iframe src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fpronosticoextendido&tabs=timeline&width=340&height=500&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=false&appId" width="100%" height="500" style={{ border: "none", overflow: "hidden" }} scrolling="no" frameBorder="0" allowFullScreen={true}></iframe>
                </div>

                {/* METRA */}
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center">
                  <span className="text-[11px] font-bold text-gray-600 mb-2 uppercase">METRA Argentina</span>
                  <iframe src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2FMETRArgentina&tabs=timeline&width=340&height=500&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=false&appId" width="100%" height="500" style={{ border: "none", overflow: "hidden" }} scrolling="no" frameBorder="0" allowFullScreen={true}></iframe>
                </div>

              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4. NOTICIAS (Launchers) - Desplegable */}
      <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <button onClick={() => setIsNoticiasOpen(!isNoticiasOpen)} className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
          <div className="flex items-center gap-3">
            <img src="/news.png" alt="Ícono Noticias" className="w-9 h-9 object-contain" />
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
              Buscar en Noticias (Últimas 24h)
            </h3>
          </div>
          <svg className={`w-5 h-5 text-gray-500 transition-transform ${isNoticiasOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {isNoticiasOpen && (
          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 shadow-sm">
              
              {/* Descripción del funcionamiento (ARRIBA) */}
              <div className="mb-5 pb-4 border-b border-gray-200">
                <p className="text-[13px] text-gray-600 leading-relaxed">
                  Este buscador automatizado utiliza operadores booleanos avanzados (como la palabra <code>OR</code>). Esto permite agrupar múltiples términos similares en una sola consulta estructurada, expandiendo la cobertura a cualquier noticia que incluya al menos una de estas palabras clave. Todas las solicitudes filtran cronológicamente resultados de las <strong>últimas 24 horas</strong>.
                </p>
              </div>

              {/* Grilla de Botones y Transparencia (AL MEDIO) */}
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
                      className="w-full text-center bg-white border border-gray-300 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 text-gray-700 text-xs font-bold py-2 px-4 rounded-md transition-all shadow-sm"
                    >
                      Buscar en Google News
                    </a>
                  </div>
                ))}
              </div>

              {/* Input de Ubicación (ABAJO DE TODO) */}
              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center bg-white p-4 rounded-lg border border-gray-200 border-l-4 border-l-[#ee3224] shadow-sm">
                <label htmlFor="ubicacion" className="text-sm font-bold text-gray-700 whitespace-nowrap">
                  📍 Ubicación a monitorear:
                </label>
                <input
                  id="ubicacion"
                  type="text"
                  value={ubicacion}
                  onChange={(e) => setUbicacion(e.target.value)}
                  placeholder="Ej: Buenos Aires, Rosario, Córdoba..."
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ee3224] focus:border-transparent transition-all"
                />
              </div>

            </div>
          </div>
        )}
      </div>

    </div>
  );
}
