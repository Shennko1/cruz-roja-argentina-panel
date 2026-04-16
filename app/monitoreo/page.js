import React from 'react';

// CLAVE: Evita que el build falle si el servidor del SMN rechaza la conexion
export const dynamic = 'force-dynamic';

async function getSmnAlerts() {
  try {
    const res = await fetch('https://ssl.smn.gob.ar/feeds/CAP/avisocortoplazo/rss_acpCAP.xml', {
      next: { revalidate: 60 }
    });
    
    if (!res.ok) throw new Error('Error al conectar con el SMN');
    const xmlText = await res.text();

    const pubDateMatch = xmlText.match(/<pubDate>(.*?)<\/pubDate>/);
    const itemMatch = xmlText.match(/<item>([\s\S]*?)<\/item>/);
    const imageMatch = xmlText.match(/<url>(.*?)<\/url>/);

    let description = "Informacion no disponible";
    let link = "https://www.smn.gob.ar/alertas";

    if (itemMatch) {
      const descMatch = itemMatch[1].match(/<description>(.*?)<\/description>/);
      const linkMatch = itemMatch[1].match(/<link>(.*?)<\/link>/);
      
      if (descMatch) description = descMatch[1].replace("<![CDATA[", "").replace("]]>", "");
      if (linkMatch) link = linkMatch[1];
    }

    return {
      date: pubDateMatch ? pubDateMatch[1] : 'Fecha no disponible',
      description: description,
      image: imageMatch ? imageMatch[1] : '',
      link: link,
      isAlertActive: !description.includes('No se han emitido Avisos')
    };
  } catch (error) {
    // Si el SMN se cae, devolvemos un objeto seguro para que no se rompa la web
    return { 
      error: true, 
      description: "No se pudo cargar el feed del SMN", 
      isAlertActive: false, 
      link: "https://www.smn.gob.ar/alertas", 
      image: "", 
      date: "Desconocida" 
    };
  }
}

export default async function MonitoreoSMNPage() {
  const alertData = await getSmnAlerts();

  // Variables para clases de CSS limpias (evita errores de sintaxis en Turbopack)
  const alertClass = alertData.isAlertActive 
    ? 'bg-red-50 border-[#ee3224]' 
    : 'bg-green-50 border-green-500';
    
  const badgeClass = alertData.isAlertActive 
    ? 'bg-[#ee3224] text-white' 
    : 'bg-green-500 text-white';
    
  const textClass = alertData.isAlertActive 
    ? 'border-[#ee3224] text-red-900' 
    : 'border-green-200 text-green-900';

  return (
    <div className="space-y-6">
      <div className="mb-2">
        <h2 className="text-2xl font-bold text-gray-800">Monitoreo Meteorologico (SMN)</h2>
        <p className="text-gray-600">Integracion en tiempo real con los sistemas de alerta temprana.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Cuadro de Aviso a muy Corto Plazo */}
        <div className={"p-6 rounded-xl shadow-md border-l-8 transition-colors " + alertClass}>
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              {alertData.image && (
                <img src={alertData.image} alt="SMN Logo" className="h-10 w-auto rounded" />
              )}
              <div>
                <h3 className="text-lg font-bold text-gray-900">Aviso a muy Corto Plazo (ACP)</h3>
                <span className={"text-xs font-bold px-2 py-1 rounded uppercase " + badgeClass}>
                  {alertData.isAlertActive ? 'ALERTA ACTIVA' : 'SIN NOVEDAD'}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
              Ultima actualizacion:
            </p>
            <p className="text-gray-800 font-mono text-sm bg-white p-2 rounded border border-gray-200">
              {alertData.date}
            </p>

            <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mt-4">
              Reporte Oficial:
            </p>
            <p className={"text-base font-medium p-4 rounded-lg bg-white border " + textClass}>
              {alertData.description}
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200/50">
            <a 
              href={alertData.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm font-bold text-blue-700 hover:text-blue-900 transition-colors"
            >
              Ver en la fuente oficial (SMN)
            </a>
          </div>
        </div>

        {/* Espacio para sistemas adicionales */}
        <div className="p-6 rounded-xl shadow-md border border-gray-200 bg-white flex flex-col justify-center items-center text-center">
           <h3 className="text-lg font-bold text-gray-800">Sistemas Adicionales</h3>
           <p className="text-gray-500 text-sm mt-2">
             Espacio reservado para incrustar radares meteorologicos.
           </p>
        </div>

      </div>
    </div>
  );
}
