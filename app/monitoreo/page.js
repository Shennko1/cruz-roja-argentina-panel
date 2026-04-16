import React from 'react';

export const dynamic = 'force-dynamic';

async function getSmnAcpData() {
  let isAlertActive = false;
  let description = "Monitoreando canales oficiales. Sin novedades en el reporte a corto plazo.";
  let date = "S/D";
  let link = "https://www.smn.gob.ar/alertas";

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
      
      const linkMatch = itemMatch[1].match(/<link>(.*?)<\/link>/);
      if (linkMatch) link = linkMatch[1];
    }
    
    isAlertActive = !description.includes('No se han emitido Avisos');
  } catch (e) {
    console.error("Fallo al leer el RSS de corto plazo:", e);
  }

  return { isAlertActive, description, date, link };
}

export default async function MonitoreoSMNPage() {
  const data = await getSmnAcpData();

  const alertClass = data.isAlertActive ? 'bg-red-50 border-[#ee3224]' : 'bg-green-50 border-green-500';
  const badgeClass = data.isAlertActive ? 'bg-[#ee3224] text-white' : 'bg-green-500 text-white';
  const textClass = data.isAlertActive ? 'border-[#ee3224] text-red-900' : 'border-green-200 text-green-900';

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Avisos a Muy Corto Plazo (ACP)</h2>
          <p className="text-gray-600 text-sm">Monitoreo exclusivo del feed oficial del SMN.</p>
        </div>
      </div>

      <div className={"p-6 rounded-xl shadow-md border-l-8 transition-colors " + alertClass}>
        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-900 leading-tight">Estado Operativo</h3>
          <span className={"inline-block mt-2 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest " + badgeClass}>
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

        <div className="mt-6 pt-4 border-t border-gray-200/50">
          <a href={data.link} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-blue-600 hover:underline">
            Acceder a la Fuente Oficial
          </a>
        </div>
      </div>
    </div>
  );
}
