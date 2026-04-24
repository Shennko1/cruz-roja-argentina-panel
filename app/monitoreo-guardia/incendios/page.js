"use client";
import React, { useState, useEffect } from "react";

// COMPONENTE: Feed de Noticias con Pestañas e Imágenes (Categorías de Incendios)
function NoticiasFuegoFeed({ categoria }) {
  const [noticias, setNoticias] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    setCargando(true);
    setNoticias([]);

    // Consultas estructuradas con los operadores lógicos y filtros regionales solicitados
    const queries = {
      forestales: '("incendio forestal" OR "incendios forestales") (córdoba OR "rio negro" OR neuquén OR "buenos aires" OR mendoza OR argentina) when:24h',
      estructurales: '("incendio estructural" OR "incendios estructurales") (córdoba OR "rio negro" OR neuquén OR "buenos aires" OR mendoza OR argentina) when:24h',
      impacto: '(bomberos OR evacuados OR "rutas cortadas") (córdoba OR "rio negro" OR neuquén OR "buenos aires" OR mendoza OR argentina) when:24h'
    };

    const googleNewsUrl = `https://news.google.com/rss/search?q=${queries[categoria]}&hl=es-419&gl=AR&ceid=AR:es-419`;
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(googleNewsUrl)}`;

    fetch(proxyUrl)
      .then((res) => res.json())
      .then((data) => {
        if (data.contents) {
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(data.contents, "text/xml");
          const items = xmlDoc.getElementsByTagName("item");
          
          const notasExtraidas = [];
          
          for (let i = 0; i < Math.min(items.length, 5); i++) {
            const title = items[i].getElementsByTagName("title")[0]?.textContent || "Sin título";
            const link = items[i].getElementsByTagName("link")[0]?.textContent || "#";
            const pubDate = items[i].getElementsByTagName("pubDate")[0]?.textContent;
            
            let imageUrl = null;
            const description = items[i].getElementsByTagName("description")[0]?.textContent;
            if (description) {
              const imgMatch = description.match(/<img[^>]+src="([^">]+)"/);
              if (imgMatch && imgMatch[1]) {
                imageUrl = imgMatch[1];
              }
            }

            notasExtraidas.push({ title, link, pubDate, imageUrl });
          }
          setNoticias(notasExtraidas);
        }
        setCargando(false);
      })
      .catch((err) => {
        console.error("Error al cargar el RSS:", err);
        setCargando(false);
      });
  }, [categoria]);

  if (cargando) {
    return (
      <div className="text-sm text-gray-500 p-4 bg-gray-50 rounded-lg border border-dashed border-gray-300">
        Cargando feed de noticias...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {noticias.length > 0 ? (
        noticias.map((noticia, index) => (
          <a
            key={index}
            href={noticia.link}
            target="_blank"
            rel="noreferrer"
            className="bg-gray-50 p-3 rounded-lg border border-gray-200 hover:border-red-400 hover:bg-red-50 transition-colors flex items-center gap-4 shadow-sm"
          >
            {noticia.imageUrl ? (
              <img 
                src={noticia.imageUrl} 
                alt="Miniatura" 
                className="w-16 h-16 rounded object-cover bg-white border border-gray-200 shrink-0"
              />
            ) : (
              <div className="w-16 h-16 rounded bg-gray-200 border border-gray-300 shrink-0 flex items-center justify-center">
                <span className="text-gray-400 text-xs">📰</span>
              </div>
            )}
            
            <div className="flex flex-col gap-1">
              <h4 className="text-sm font-bold text-gray-800 leading-snug line-clamp-2">{noticia.title}</h4>
              <span className="text-[11px] text-gray-500 font-medium">
                {new Date(noticia.pubDate).toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short' })}
              </span>
            </div>
          </a>
        ))
      ) : (
        <div className="text-sm text-gray-500 p-4 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          Agregar información.
        </div>
      )}
    </div>
  );
}

// COMPONENTE PRINCIPAL: Página de Incendios
export default function IncendiosPage() {
  const [isFocosOpen, setIsFocosOpen] = useState(false);
  const [isRedesOpen, setIsRedesOpen] = useState(false);
  const [isNoticiasOpen, setIsNoticiasOpen] = useState(false);
  
  const [categoriaNoticias, setCategoriaNoticias] = useState("forestales");

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm font-sans">
      
      {/* CABECERA */}
      <div className="border-b border-gray-200 pb-3 mb-4 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">
          Monitoreo: Incendios y Focos de Calor
        </h2>
        <span className="text-xs font-medium bg-red-50 text-red-600 px-3 py-1 rounded-full border border-red-100">
          En vivo
        </span>
      </div>

      {/* AREA DE TRABAJO (Blank State) */}
      <div className="bg-gray-50 p-4 rounded-lg border border-dashed border-gray-300 text-sm text-gray-500 mb-8">
        Agregar información.
      </div>

      {/* 1. MAPA DE HUMO Y VIENTO (Windy PM2.5) - Siempre visible */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4 border-b border-gray-100 pb-2">
          <img src="/smoke.png" alt="Ícono Humo" className="w-9 h-9 object-contain" />
          <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
            Rastreo de Humo y Viento en tiempo real
          </h3>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 bg-gray-50 p-4 rounded-xl border border-gray-200 flex flex-col justify-between shadow-sm">
            <div>
              <h4 className="text-xs font-bold text-gray-600 mb-3 uppercase">
                ¿Para qué sirve este mapa?
              </h4>
              <p className="text-[12px] text-gray-600 mb-4 leading-relaxed">
                Muestra la concentración de partículas en el aire (humo) y la dirección del viento. Sirve para ver si una pluma tóxica se dirige hacia una ciudad o ruta, incluso si hay nubes tapando la visual del satélite.
              </p>
              <ul className="text-[12px] text-gray-500 space-y-3">
                <li className="flex gap-2">
                  <span className="text-orange-500 font-bold">•</span>
                  <span><strong>Colores:</strong> Tonos naranjas/rojos marcan alta densidad de humo.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-orange-500 font-bold">•</span>
                  <span><strong>Partículas:</strong> Las líneas muestran hacia dónde está empujando el fuego en vivo.</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="lg:col-span-3 rounded-xl overflow-hidden border border-gray-300 shadow-md bg-gray-100 h-[500px]">
            <iframe 
              width="100%" 
              height="100%" 
              src="https://embed.windy.com/embed2.html?lat=-38.416&lon=-63.617&zoom=4&level=surface&overlay=pm2p5&product=ecmwf&menu=&message=&marker=&calendar=now&pressure=&type=map&location=coordinates&detail=&metricWind=km%2Fh&metricTemp=%C2%B0C&radarRange=-1" 
              frameBorder="0" 
              title="Windy Smoke Radar" 
              allowFullScreen>
            </iframe>
          </div>
        </div>
      </div>

      {/* 2. FOCOS ACTIVOS (Launchers) - Desplegable */}
      <div className="mb-6 border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <button onClick={() => setIsFocosOpen(!isFocosOpen)} className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
          <div className="flex items-center gap-3">
            <img src="/fire.png" alt="Ícono Fuego" className="w-9 h-9 object-contain" />
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
              Detección Satelital de Focos
            </h3>
          </div>
          <svg className={`w-5 h-5 text-gray-500 transition-transform ${isFocosOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {isFocosOpen && (
          <div className="p-4 border-t border-gray-200 bg-white grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 flex flex-col justify-between shadow-sm min-h-[220px]">
              <div>
                <h4 className="text-sm font-bold text-gray-800 mb-2">PyroGuard (Mapa Ágil)</h4>
                <p className="text-[12px] text-gray-600 leading-relaxed mb-2"><strong>Qué vas a encontrar:</strong> Interfaz rápida y visual de los focos de calor recientes.</p>
                <p className="text-[12px] text-gray-600 leading-relaxed"><strong>Para qué usarlo:</strong> Primera línea visual para que los voluntarios rastreen rápido un reporte ciudadano en el mapa.</p>
              </div>
              <a href="https://pyroguardapp.com/mapa" target="_blank" rel="noreferrer" className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2 px-6 rounded-lg transition-colors text-center mt-4 block">Abrir PyroGuard ↗</a>
            </div>

            <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 flex flex-col justify-between shadow-sm min-h-[220px]">
              <div>
                <h4 className="text-sm font-bold text-gray-800 mb-2">Global Forest Watch</h4>
                <p className="text-[12px] text-gray-600 leading-relaxed mb-2"><strong>Qué vas a encontrar:</strong> Lectura directa de los satélites VIIRS/MODIS de la NASA montada sobre un mapa limpio.</p>
                <p className="text-[12px] text-gray-600 leading-relaxed"><strong>Para qué usarlo:</strong> Es el respaldo fáctico. Si PyroGuard falla o hay dudas técnicas sobre una coordenada, chequeá este mapa.</p>
              </div>
              <a href="https://www.globalforestwatch.org/map/?active_category=fires" target="_blank" rel="noreferrer" className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2 px-6 rounded-lg transition-colors text-center mt-4 block">Abrir GFW Focos ↗</a>
            </div>

            <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 flex flex-col justify-between shadow-sm min-h-[220px]">
              <div>
                <h4 className="text-sm font-bold text-gray-800 mb-2">Riesgo de Incendios (SNMF)</h4>
                <p className="text-[12px] text-gray-600 leading-relaxed mb-2"><strong>Qué vas a encontrar:</strong> Mapas oficiales de Argentina con el índice de peligro de propagación de fuego.</p>
                <p className="text-[12px] text-gray-600 leading-relaxed"><strong>Para qué usarlo:</strong> Para anticiparse. Si surge un foco en una zona marcada en "Riesgo Extremo", la alerta debe ser inmediata.</p>
              </div>
              <a href="https://www.argentina.gob.ar/ambiente/fuego/evaluacion-de-peligro" target="_blank" rel="noreferrer" className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2 px-6 rounded-lg transition-colors text-center mt-4 block">Abrir Mapa SNMF ↗</a>
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
              Redes Sociales (Manejo del Fuego)
            </h3>
          </div>
          <svg className={`w-5 h-5 text-gray-500 transition-transform ${isRedesOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {isRedesOpen && (
          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="mb-2">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* SPLIF Río Negro */}
                <div className="bg-white p-1 rounded-xl border border-gray-200 shadow-sm flex justify-center bg-gray-50 overflow-hidden h-[510px]">
                  <iframe src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fsplifrn&tabs=timeline&width=340&height=500&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=false&appId" width="100%" height="500" style={{ border: "none", overflow: "hidden" }} scrolling="no" frameBorder="0" allowFullScreen={true}></iframe>
                </div>

                {/* Manejo del Fuego (Perfil Genérico) */}
                <div className="bg-white p-1 rounded-xl border border-gray-200 shadow-sm flex justify-center bg-gray-50 overflow-hidden h-[510px]">
                  <iframe src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fprofile.php%3Fid%3D100067032056115&tabs=timeline&width=340&height=500&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=false&appId" width="100%" height="500" style={{ border: "none", overflow: "hidden" }} scrolling="no" frameBorder="0" allowFullScreen={true}></iframe>
                </div>

                {/* Manejo del Fuego Chubut */}
                <div className="bg-white p-1 rounded-xl border border-gray-200 shadow-sm flex justify-center bg-gray-50 overflow-hidden h-[510px]">
                  <iframe src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fmanejodelfuegochubut&tabs=timeline&width=340&height=500&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=false&appId" width="100%" height="500" style={{ border: "none", overflow: "hidden" }} scrolling="no" frameBorder="0" allowFullScreen={true}></iframe>
                </div>

              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4. NOTICIAS (Feed RSS Integrado con Pestañas) - Desplegable */}
      <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <button onClick={() => setIsNoticiasOpen(!isNoticiasOpen)} className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
          <div className="flex items-center gap-3">
            <img src="/news.png" alt="Ícono Noticias" className="w-9 h-9 object-contain" />
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
              Feed de Noticias (Últimas 24h)
            </h3>
          </div>
          <svg className={`w-5 h-5 text-gray-500 transition-transform ${isNoticiasOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {isNoticiasOpen && (
          <div className="p-4 border-t border-gray-200 bg-white">
             <div className="mb-5 pb-4 border-b border-gray-200">
                <h4 className="text-xs font-bold text-gray-800 mb-2 uppercase">
                  Novedades en regiones clave
                </h4>
                <p className="text-[12px] text-gray-600 leading-relaxed mb-4">
                  Elegí la categoría para escanear rápido las últimas 5 notas publicadas en medios nacionales y regionales. Los resultados están filtrados para las provincias con mayor incidencia.
                </p>
                
                <div className="flex flex-wrap gap-2">
                  <button 
                    onClick={() => setCategoriaNoticias("forestales")}
                    className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors border ${categoriaNoticias === "forestales" ? "bg-red-50 border-red-400 text-red-700" : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50"}`}
                  >
                    Incendios Forestales
                  </button>
                  <button 
                    onClick={() => setCategoriaNoticias("estructurales")}
                    className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors border ${categoriaNoticias === "estructurales" ? "bg-red-50 border-red-400 text-red-700" : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50"}`}
                  >
                    Incendios Estructurales
                  </button>
                  <button 
                    onClick={() => setCategoriaNoticias("impacto")}
                    className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors border ${categoriaNoticias === "impacto" ? "bg-red-50 border-red-400 text-red-700" : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50"}`}
                  >
                    Impacto y Operativos
                  </button>
                </div>
              </div>

            <NoticiasFuegoFeed categoria={categoriaNoticias} />
            
          </div>
        )}
      </div>
    </div>
  );
}
