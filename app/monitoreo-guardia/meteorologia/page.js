import React from 'react';

export default function PanelIntegradoPage() {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mt-4 font-sans">
      
      {/* Encabezado Principal */}
      <div className="border-b border-gray-200 pb-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <span className="text-blue-600">🌍</span> Panel Integral: Meteorología y Redes
        </h2>
      </div>
      
      {/* Resumen Operativo Narrativo (Texto Continuo) */}
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 italic text-sm text-gray-700 leading-relaxed mb-8">
        <strong>Reporte de situación:</strong> El panel integrado centraliza las herramientas de vigilancia, combinando el mapa cartográfico con el flujo oficial de información. El visor de Windy permite el seguimiento de los frentes climáticos sobre el territorio nacional mediante la capa de vientos y presión, mientras que la sección de redes sincroniza en tiempo real los avisos a corto plazo emitidos por el Servicio Meteorológico Nacional y portales de clima, permitiendo al operador cruzar los datos visuales del radar con las alertas publicadas para mantener la vigilancia sin tener que cambiar de pantalla.
      </div>

      {/* SECCIÓN 1: MAPA WINDY */}
      <div className="mb-10">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span className="text-gray-500">📍</span> Radar Interactivo (Windy)
        </h3>
        <div className="w-full rounded-2xl overflow-hidden border border-gray-200 shadow-md bg-gray-100">
          <iframe
            width="100%"
            height="650"
            src="https://embed.windy.com/embed2.html?lat=-38.416&lon=-63.617&zoom=4&level=surface&overlay=wind&product=ecmwf&menu=&message=&marker=&calendar=now&pressure=&type=map&location=coordinates&detail=&metricWind=km%2Fh&metricTemp=%C2%B0C&radarRange=-1"
            frameBorder="0"
            title="Mapa meteorológico de Windy centrado en Argentina"
            allowFullScreen
          ></iframe>
        </div>
      </div>

      <hr className="border-gray-200 mb-8" />

      {/* SECCIÓN 2: REDES SOCIALES (Formato Compacto) */}
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
          <span className="text-gray-500">📡</span> Avisos Oficiales
        </h3>
        
        <div className="flex flex-col lg:flex-row justify-center gap-8 w-full">
          
          {/* Feed del SMN */}
          <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm w-full lg:w-auto flex flex-col items-center">
            <h4 className="text-sm font-bold text-blue-800 mb-3 text-center border-b border-gray-100 w-full pb-2">Servicio Meteorológico (SMN)</h4>
            <div className="w-full flex justify-center overflow-hidden rounded-lg">
              <iframe 
                src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2FSMN.ar&tabs=timeline&width=340&height=500&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=false&appId" 
                width="340" 
                height="500" 
                style={{ border: 'none', overflow: 'hidden' }} 
                scrolling="no" 
                frameBorder="0" 
                allowFullScreen={true} 
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              ></iframe>
            </div>
          </div>

          {/* Feed de Tiempo en Argentina */}
          <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm w-full lg:w-auto flex flex-col items-center">
            <h4 className="text-sm font-bold text-blue-800 mb-3 text-center border-b border-gray-100 w-full pb-2">Tiempo en Argentina</h4>
            <div className="w-full flex justify-center overflow-hidden rounded-lg">
              <iframe 
                src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2FTiempoenArg&tabs=timeline&width=340&height=500&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=false&appId" 
                width="340" 
                height="500" 
                style={{ border: 'none', overflow: 'hidden' }} 
                scrolling="no" 
                frameBorder="0" 
                allowFullScreen={true} 
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              ></iframe>
            </div>
          </div>

        </div>
      </div>
      
    </div>
  );
}
