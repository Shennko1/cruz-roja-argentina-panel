import React from 'react';

export const dynamic = 'force-dynamic';

async function getSmnAcpData() {
  let isAlertActive = false;
  let description = "El equipo mantiene el monitoreo continuo de los canales oficiales. Sin novedades en el reporte meteorológico a corto plazo por el momento.";
  let date = "S/D";

  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  };

  try {
    const rssRes = await fetch('https://ssl.smn.gob.ar/feeds/CAP/avisocortoplazo/rss_acpCAP.xml', { 
      headers, 
      next: { revalidate: 60 } 
    });
    const xmlText = await rssRes.text();

    const pubDateMatch = xmlText.match(/<pubDate>(.*?)<\/pubDate>/);
    if (pubDateMatch) date = pubDateMatch[1];

    const itemMatch = xmlText.match(/<item>([\s\S]*?)<\/item>/);
    if (itemMatch) {
      const descMatch = itemMatch[1].match(/<description>(.*?)<\/description>/);
      if (descMatch) {
         description = descMatch[1].replace(/<!\[CDATA\[/g, "").replace(/]]>/g, "").trim();
      }
    }
    
    isAlertActive = !description.includes('No se han emitido Avisos');
  } catch (e) {
    console.error("Fallo al leer el RSS de corto plazo:", e);
  }

  return { isAlertActive, description, date };
}

export default async function AlertasGeneralesPage() {
  const data = await getSmnAcpData();

  const alertClass = data.isAlertActive ? 'bg-red-50 border-[#ee3224]' : 'bg-green-50 border-green-500';
  const badgeClass = data.isAlertActive ? 'bg-[#ee3224] text-white' : 'bg-green-500 text-white';
  const textClass = data.isAlertActive ? 'border-[#ee3224] text-red-900' : 'border-green-200 text-green-900';

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-4">
      
      {/* Encabezado */}
      <div className="flex justify-between items-end border-b border-gray-200 pb-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Panel de Alertas Generales</h2>
          <p className="text-gray-600 text-sm mt-1">Monitoreo unificado de contingencias meteorológicas (SMN) y sísmicas (INPRES).</p>
        </div>
      </div>

      {/* SECCIÓN 1: Estado Meteorológico Narrativo */}
      <div className={"p-6 rounded-xl shadow-md border-l-8 transition-colors " + alertClass}>
        <div className="mb-4 flex items-center gap-3">
          <h3 className="text-lg font-bold text-gray-900 leading-tight">Estado Meteorológico (ACP)</h3>
          <span className={"text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest " + badgeClass}>
            {data.isAlertActive ? 'ALERTA ACTIVA' : 'SIN NOVEDAD'}
          </span>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Corte Horario Oficial</p>
            <p className="text-gray-700 font-mono text-xs bg-white p-2 rounded border border-gray-100">{data.date}</p>
          </div>

          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Reporte de Situación</p>
            {/* Texto narrativo continuo para fácil lectura */}
            <div className={"text-sm font-medium p-4 rounded-lg bg-white border leading-relaxed " + textClass}>
              {data.description}
            </div>
          </div>
        </div>
      </div>

      {/* SECCIÓN 2: Visores Embebidos (SMN e INPRES) */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* Columna Izquierda: SMN */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <span className="text-blue-600">⛈️</span> Alertas Meteorológicas
          </h3>
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center shadow-sm h-[600px] flex flex-col items-center justify-center">
             <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
              🗺️
            </div>
            <h4 className="text-gray-800 font-bold mb-2">Visor Externo SMN</h4>
            <p className="text-sm text-gray-600 mb-6 max-w-sm mx-auto">
              Por protocolos de seguridad, el mapa interactivo del SMN no puede incrustarse dentro de plataformas externas. Ingresá al visor oficial desde el siguiente enlace seguro.
            </p>
            <a 
              href="https://www.smn.gob.ar/alertas" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-md"
            >
              Abrir Mapa SMN en nueva pestaña
            </a>
          </div>
        </div>

        {/* Columna Derecha: INPRES */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <span className="text-red-600">🌋</span> Actividad Sísmica
          </h3>
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 h-[600px] w-full">
            {/* Ventana incrustada de la web de sismos */}
            <iframe 
              src="https://www.inpres.gob.ar/desktop/" 
              className="w-full h-full border-0"
              title="Sismos INPRES"
              sandbox="allow-scripts allow-same-origin allow-popups"
            />
          </div>
        </div>

      </div>
    </div>
  );
}
