"use client";
import React, { useState, useEffect } from 'react';

export default function HidrometeorologiaPage() {
  const [isRiesgoOpen, setIsRiesgoOpen] = useState(false);
  const [isRedesOpen, setIsRedesOpen] = useState(false);
  const [isNoticiasOpen, setIsNoticiasOpen] = useState(false);

  const [news, setNews] = useState([]);
  const [loadingNews, setLoadingNews] = useState(false);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoadingNews(true);

        const rssUrl = encodeURIComponent(
          "https://news.google.com/rss/search?q=(inundación OR inundaciones OR crecida OR desborde) when:24h&hl=es-419&gl=AR&ceid=AR:es-419"
        );

        const res = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${rssUrl}`);
        const data = await res.json();

        if (data.items) {
          setNews(data.items.slice(0, 10));
        }

      } catch (err) {
        console.error("Error fetching news:", err);
      } finally {
        setLoadingNews(false);
      }
    };

    fetchNews();
    const interval = setInterval(fetchNews, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm font-sans">
      
      <div className="border-b border-gray-200 pb-3 mb-4 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">
          Monitoreo: Hidrometeorología
        </h2>
        <span className="text-xs font-medium bg-blue-50 text-blue-600 px-3 py-1 rounded-full border border-blue-100">
          En vivo
        </span>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg border border-dashed border-gray-300 text-sm text-gray-500 mb-8">
        Agregar información.
      </div>

      {/* MAPA */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4 border-b border-gray-100 pb-2">
          <img src="/storm.png" className="w-9 h-9" />
          <h3 className="text-sm font-bold text-gray-700 uppercase">Mapa de lluvia en tiempo real</h3>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 bg-gray-50 p-4 rounded-xl border">
            <p className="text-[12px] text-gray-600">
              Muestra dónde está lloviendo y cómo evoluciona la tormenta.
            </p>
          </div>

          <div className="lg:col-span-3 h-[500px]">
            <iframe
              width="100%"
              height="100%"
              src="https://embed.windy.com/embed2.html?lat=-38.416&lon=-63.617&zoom=4&overlay=rain"
            ></iframe>
          </div>
        </div>
      </div>

      {/* RIESGO */}
      <div className="mb-6 border rounded-xl overflow-hidden">
        <button onClick={() => setIsRiesgoOpen(!isRiesgoOpen)} className="w-full p-4 bg-gray-50 flex justify-between">
          <span>Riesgo Hídrico</span>
        </button>
        
        {isRiesgoOpen && (
          <div className="p-4">
            <a href="https://sites.research.google/floods/" target="_blank">FloodHub</a>
          </div>
        )}
      </div>

      {/* REDES */}
      <div className="mb-6 border rounded-xl overflow-hidden">
        <button onClick={() => setIsRedesOpen(!isRedesOpen)} className="w-full p-4 bg-gray-50 flex justify-between">
          <span>Redes Sociales</span>
        </button>

        {isRedesOpen && (
          <div className="p-4">
            <iframe src="https://www.facebook.com/plugins/page.php?href=https://www.facebook.com/SMN.ar&tabs=timeline" width="100%" height="500"></iframe>
          </div>
        )}
      </div>

      {/* NOTICIAS */}
      <div className="border rounded-xl overflow-hidden">
        <button onClick={() => setIsNoticiasOpen(!isNoticiasOpen)} className="w-full p-4 bg-gray-50 flex justify-between">
          <span>Noticias (últimas 24h)</span>
        </button>

        {isNoticiasOpen && (
          <div className="p-4">

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
              <a href="https://news.google.com/search?q=tormenta when:24h&hl=es-419&gl=AR" target="_blank">Tormentas</a>
              <a href="https://news.google.com/search?q=inundación when:24h&hl=es-419&gl=AR" target="_blank">Inundaciones</a>
              <a href="https://news.google.com/search?q=evacuados when:24h&hl=es-419&gl=AR" target="_blank">Evacuados</a>
            </div>

            <h4 className="text-xs font-bold mb-3">
              Feed en vivo (Inundaciones)
            </h4>

            {loadingNews ? (
              <p className="text-xs text-gray-500">Cargando...</p>
            ) : (
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {news.map((item, idx) => (
                  <a key={idx} href={item.link} target="_blank" className="block p-3 border rounded">
                    <p className="text-xs font-semibold">{item.title}</p>
                    <p className="text-[11px] text-gray-500">
                      {new Date(item.pubDate).toLocaleString()}
                    </p>
                  </a>
                ))}
              </div>
            )}

          </div>
        )}
      </div>

    </div>
  );
}
