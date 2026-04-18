import React from 'react';

export default function PanelIntegradoPage() {
  return (
    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm font-sans">
      
      <div className="border-b border-gray-200 pb-2 mb-4">
        <h2 className="text-lg font-bold text-gray-800">
          Panel Integral
        </h2>
      </div>
      
      <div className="bg-gray-50 p-3 rounded-lg border border-dashed border-gray-300 text-sm text-gray-500 mb-6">
        Agregar información.
      </div>

      {/* SECCIÓN 1: REDES OFICIALES Y COMUNITARIAS */}
      <div className="mb-8">
        <h3 className="text-sm font-bold text-gray-700 mb-4 border-b border-gray-100 pb-1">Fuentes de Información</h3>
        <div className="flex flex-wrap justify-center gap-4 w-full">
          
          {/* Feed SMN */}
          <div className="bg-white p-2 rounded-xl border border-gray-200 flex flex-col items-center">
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

          {/* Feed Tiempo en Argentina */}
          <div className="bg-white p-2 rounded-xl border border-gray-200 flex flex-col items-center">
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

          {/* Feed METRA */}
          <div className="bg-white p-2 rounded-xl border border-gray-200 flex flex-col items-center">
            <div className="w-full flex justify-center overflow-hidden">
              <iframe 
                src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2FMETRArgentina&tabs=timeline&width=340&height=500&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=false&appId" 
                width="340" 
                height="500" 
                style={{ border: 'none', overflow: 'hidden' }} 
                scrolling="no" 
                frameBorder="0" 
                allowFullScreen={true} 
              ></iframe>
            </div>
          </div>

          {/* Feed Pronóstico Extendido */}
          <div className="bg-white p-2 rounded-xl border border-gray-200 flex flex-col items-center">
            <div className="w-full flex justify-center overflow-hidden">
              <iframe 
                src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fpronosticoextendido&tabs=timeline&width=340&height=500&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=false&appId" 
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

      {/* SECCIÓN 2: MAPA WINDY (Abajo) */}
      <div>
        <h3 className="text-sm font-bold text-gray-700 mb-4 border-b border-gray-100 pb-1">Radar Meteorológico</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          <div className="md:col-span-1 bg-gray-50 p-3 rounded-lg border border-gray-200 flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-bold text-gray-600 mb-2">Guía de uso</h4>
              <ul className="text-[11px] text-gray-500 space-y-2">
                <li>• <strong>Partículas:</strong> Dirección del viento.</li>
                <li>• <strong>Colores:</strong> Intensidad (azul = calma).</li>
                <li>• <strong>Menú derecho:</strong> Cambiar a lluvia/truenos.</li>
                <li>• <strong>Ubicación:</strong> Arrastrar para mover el mapa.</li>
              </ul>
            </div>
            <a 
              href="https://www.youtube.com/watch?v=RhNgxywKjw4" 
              target="_blank" 
              rel="noreferrer" 
              className="text-[11px] text-blue-600 hover:text-blue-800 mt-4 block font-bold"
            >
              Ver Tutorial en Español ↗
            </a>
          </div>

          <div className="md:col-span-3 rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
            <iframe
              width="100%"
              height="350"
              src="https://embed.windy.com/embed2.html?lat=-38.416&lon=-63.617&zoom=4&level=surface&overlay=wind&product=ecmwf&menu=&message=&marker=&calendar=now&pressure=&type=map&location=coordinates&detail=&metricWind=km%2Fh&metricTemp=%C2%B0C&radarRange=-1"
              frameBorder="0"
              title="Windy"
              allowFullScreen
            ></iframe>
          </div>

        </div>
      </div>
      
    </div>
  );
}
