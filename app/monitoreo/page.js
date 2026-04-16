import React from 'react';

// Esta función lee el RSS directamente desde el servidor de Vercel
async function getSmnAlerts() {
  try {
    // El 'revalidate: 60' hace que Vercel actualice la info cada 60 segundos
    const res = await fetch('https://ssl.smn.gob.ar/feeds/CAP/avisocortoplazo/rss_acpCAP.xml', {
      next: { revalidate: 60 }
    });
    
    if (!res.ok) throw new Error('Error al conectar con el SMN');
    const xmlText = await res.text();

    // Extracción de datos del XML
    const pubDateMatch = xmlText.match(/<pubDate>(.*?)<\/pubDate>/);
    const itemMatch = xmlText.match(/<item>([\s\S]*?)<\/item>/);
    const imageMatch = xmlText.match(/<url>(.*?)<\/url>/);

    let description = "Información no disponible";
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
      // Si la descripción tiene la frase típica de "no hay alertas", es seguro. Si no, es alerta.
      isAlertActive: !description.includes('No se han emitido Avisos')
    };
  } catch (error) {
    return { error: true, description: "No se pudo cargar el feed del SMN" };
  }
}

export default async function MonitoreoSMNPage() {
  const alertData = await getSmnAlerts();

  return (
    <div className="space-y-6">
      <div className="mb-2">
        <h2 className="text-2xl font-bold text-gray-800">Monitoreo Meteorológico (SMN)</h2>
        <p className="text-gray-600">Integración en tiempo real con los sistemas de alerta temprana.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Cuadro de Aviso a muy Corto Plazo */}
        <div className={`p-6 rounded-xl shadow-md border-l-8 transition-colors ${
          alertData.isAlertActive ? 'bg-red-50 border-[#ee3224]' : 'bg-green-50 border-green-500'
        }`}>
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              {alertData.image && (
                <img src={alertData.image} alt="SMN Logo" className="h-10 w-auto rounded" />
              )}
              <div>
                <h3 className="text-lg font-bold text-gray-900">Aviso a muy Corto Plazo (ACP)</h3>
                <span className={`text-xs font-bold px-2 py-1 rounded uppercase ${
                  alertData.isAlertActive ? 'bg-[#ee3224] text-white' : 'bg-green-500 text-white'
                }`}>
                  {alertData.isAlertActive ? 'ALERTA ACTIVA' : 'SIN NOVEDAD'}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <p className
