import React from 'react';

export default function MonitoreoRedesPage() {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mt-4">
      
      {/* Encabezado */}
      <h2 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
        <span className="text-blue-600">📡</span> Feed Oficial de Contingencias (Meta)
      </h2>
      
      {/* Resumen Operativo */}
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 italic text-sm text-gray-700 leading-relaxed mb-6">
        <strong>Estado de conexión:</strong> El visor de redes se encuentra enlazado a los canales oficiales del Servicio Meteorológico Nacional y portales de meteorología en Argentina, permitiendo a la guardia observar las alertas tempranas y los avisos a corto plazo en tiempo real de forma directa y unificada en la pantalla principal.
      </div>

      {/* Contenedor de las dos tarjetas de Facebook */}
      <div className="flex flex-col md:flex-row justify-center gap-6 w-full mt-8">
        
        {/* Feed del SMN */}
        <div className="bg-white p-2 rounded-xl border border-gray-200 shadow-sm w-full md:w-auto">
          <h3 className="text-sm font-bold text-blue-800 mb-3 text-center border-b pb-2">Últimos avisos (SMN)</h3>
          <div className="flex justify-center">
            <iframe 
              src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2FSMN.ar&tabs=timeline&width=450&height=600&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=false&appId" 
              width="450" 
              height="600" 
              style={{ border: 'none', overflow: 'hidden', borderRadius: '8px' }} 
              scrolling="no" 
              frameBorder="0" 
              allowFullScreen={true} 
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            ></iframe>
          </div>
        </div>

        {/* Feed de Tiempo en Argentina */}
        <div className="bg-white p-2 rounded-xl border border-gray-200 shadow-sm w-full md:w-auto">
          <h3 className="text-sm font-bold text-blue-800 mb-3 text-center border-b pb-2">Tiempo en Argentina</h3>
          <div className="flex justify-center">
            <iframe 
              src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2FTiempoenArg&tabs=timeline&width=450&height=600&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=false&appId" 
              width="450" 
              height="600" 
              style={{ border: 'none', overflow: 'hidden', borderRadius: '8px' }} 
              scrolling="no" 
              frameBorder="0" 
              allowFullScreen={true} 
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            ></iframe>
          </div>
        </div>

      </div>
      
    </div>
  );
}
