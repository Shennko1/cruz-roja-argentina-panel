import React from 'react';

export default function PanelIntegradoPage() {
  return (
    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm font-sans">
      
      {/* Encabezado */}
      <div className="border-b border-gray-200 pb-2 mb-4">
        <h2 className="text-lg font-bold text-gray-600">
          [BORRADOR] Panel Integral
        </h2>
      </div>
      
      {/* Resumen Operativo (Blank State) */}
      <div className="bg-gray-50 p-3 rounded-lg border border-dashed border-gray-300 italic text-sm text-gray-400 mb-6">
        [Espacio reservado para el reporte de situación continuo. Ingresar aquí la descripción operativa del turno...]
      </div>

      {/* SECCIÓN 1: MAPA WINDY */}
      <div className="mb-8">
        <div className="w-full rounded-xl overflow-hidden border border-gray-200 bg-gray-100">
          <iframe
            width="100%"
            height="650"
            src="https://embed.windy.com/embed2.html?lat=-38.416&lon=-63.617&zoom=4&level=surface&overlay=wind&product=ecmwf&menu=&message=&marker=&calendar=now&pressure=&type=map&location=coordinates&detail=&metricWind=km%2Fh&metricTemp=%C2%B0C&radarRange=-1"
            frameBorder="0"
            title="Windy Draft"
            allowFullScreen
          ></iframe>
        </div>
      </div>

      {/* SECCIÓN 2: REDES SOCIALES */}
      <div className="flex flex-col lg:flex-row justify-center gap-4 w-full">
        
        {/* Feed del SMN */}
        <div className="bg-white p-2 rounded-xl border border-gray-200 w-full lg:w-auto flex flex-col items-center">
          <h4 className="text-xs font-bold text-gray-500 mb-2 border-b border-gray-100 w-full pb-1 text-center">[Feed SMN]</h4>
          <div className="w-full flex justify-center overflow-hidden">
            <iframe 
              src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2FSMN.ar&tabs=timeline&width=340&height=500&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=false&appId" 
              width="340" 
              height="500" 
              style={{ border: 'none', overflow: 'hidden' }} 
              scrolling="no" 
              frameBorder="0" 
              allowFullScreen={true} 
            ></iframe>
          </div>
        </div>

        {/* Feed de Tiempo en Argentina */}
        <div className="bg-white p-2 rounded-xl border border-gray-200 w-full lg:w-auto flex flex-col items-center">
          <h4 className="text-xs font-bold text-gray-500 mb-2 border-b border-gray-100 w-full pb-1 text-center">[Feed TiempoAr]</h4>
          <div className="w-full flex justify-center overflow-hidden">
            <iframe 
              src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2FTiempoenArg&tabs=timeline&width=340&height=500&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=false&appId" 
              width="340" 
              height="500" 
              style={{ border: 'none', overflow: 'hidden' }} 
              scrolling="no" 
              frameBorder="0" 
              allowFullScreen={true} 
            ></iframe>
          </div>
        </div>

      </div>
      
    </div>
  );
}
