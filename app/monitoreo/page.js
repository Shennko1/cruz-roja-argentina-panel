import React from 'react';

export const dynamic = 'force-dynamic';

async function getSmnAcpData() {
  let isAlertActive = false;
  let description = "Monitoreando canales oficiales. Sin novedades en el reporte a corto plazo.";
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

export default async function MonitoreoSMNPage() {
  const data = await getSmnAcpData();

  const alertClass = data.isAlertActive ? 'bg-red-50 border-[#ee3224]' : 'bg-green-50 border-green-500';
  const badgeClass = data.isAlertActive ? 'bg-[#ee3224] text-white' : 'bg-green-500 text-white';
  const textClass = data.isAlertActive ? 'border-[#ee3224] text-red-900' : 'border-green-200 text-green-900';

  return (
    <div className="space-y-8 max-w-6xl mx-auto p-4">
      
      {/* Encabezado */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Monitoreo Meteorológico</h2>
          <p className="text-gray-600 text-sm mt-1">Avisos a corto plazo y visor oficial del Sistema de Alertas Tempranas.</p>
        </div>
      </div>

      {/* SECCIÓN 1: Avisos a Muy Corto Plazo (ACP) */}
      <div className={"p-6 rounded-xl shadow-md border-l-8 transition-colors " + alertClass}>
        <div className="mb-4 flex items-center gap-3">
          <h3 className="text-lg font-bold text-gray-900 leading-tight">Avisos a Muy Corto Plazo (ACP)</h3>
          <span className={"text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest " + badgeClass}>
            {data.isAlertActive ? 'ALERTA ACTIVA' : 'SIN NOVEDAD'}
          </span>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Corte Horario</p>
            <p className="text-gray-700 font-mono text-xs bg-white p-2 rounded border border-gray-100">{data.date}</p>
          </div>

          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Informe Consolidado</p>
            <div className={"text-sm font-medium p-4 rounded-lg bg-white border leading-relaxed " + textClass}>
              {data.description}
            </div>
          </div>
        </div>
      </div>

      <hr className="border-gray-200" />

      {/* SECCIÓN 2: Visor Oficial SMN incrustado */}
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span className="text-blue-600">🌍</span> Visor Nacional de Alertas (SMN)
        </h3>
        
        {/* El iframe actúa como una ventana embebida de la URL original */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 h-[800px] w-full">
          <iframe 
            src="https://www.smn.gob.ar/alertas" 
            className="w-full h-full border-0"
            title="Página Oficial SMN Alertas"
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
          />
        </div>
      </div>

    </div>
  );
}
