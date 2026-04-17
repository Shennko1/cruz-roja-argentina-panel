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

      <div className="mb-8">
        <div className="w-full rounded-xl overflow-hidden border border-gray-200 bg-gray-100">
          <iframe
            width="100%"
            height="650"
            src="https://embed.windy.com/embed2.html?lat=-38.416&lon=-63.617&zoom=4&level=surface&overlay=wind&product=ecmwf&menu=&message=&marker=&calendar=now&pressure=&type=map&location=coordinates&detail=&metricWind=km%2Fh&metricTemp=%C2%B0C&radarRange=-1"
            frameBorder="0"
            title="Windy"
            allowFullScreen
          ></iframe>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row justify-center gap-4 w-full">
        
        <div className="bg-white p-2 rounded-xl border border-gray-200 w-full lg:w-auto flex flex-col items-center">
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

        <div className="bg-white p-2 rounded-xl border border-gray-200 w-full lg:w-auto flex flex-col items-center">
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
