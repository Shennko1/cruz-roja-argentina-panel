'use client';

import React, { useEffect } from 'react';

export default function MonitoreoRedesPage() {
  
  useEffect(() => {
    // Le pedimos a React que inyecte el script oficial de Twitter 
    // solo cuando el navegador del usuario ya está listo.
    const script = document.createElement("script");
    script.src = "https://platform.twitter.com/widgets.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mt-4">
      <h2 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
        <span className="text-blue-400">🐦</span> Feed Oficial de Contingencias
      </h2>
      <p className="text-sm text-gray-600 mb-6">
        Línea de tiempo en tiempo real consolidando las publicaciones de los organismos de respuesta.
      </p>

      <div className="flex justify-center w-full">
        <div className="w-full max-w-xl bg-gray-50 rounded-lg border border-gray-200 overflow-hidden min-h-[500px]">
          
          {/* El enlace oficial. El script de arriba detecta esta etiqueta <a> y la transforma en el feed interactivo */}
          <a 
  className="twitter-timeline" 
  data-height="700" 
  data-theme="light" 
  href="https://twitter.com/i/lists/2044983870605435128" 
>
  Cargando publicaciones de la red oficial...
</a>

        </div>
      </div>
    </div>
  );
}
