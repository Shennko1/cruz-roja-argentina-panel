import React from 'react';
import Link from 'next/link';

export default function MonitoreoGuardiasPage() {
  return (
    <div className="space-y-8 max-w-6xl mx-auto p-4 font-sans">

      {/* Encabezado */}
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-3xl font-bold text-gray-800">Monitoreo y Guardias</h2>
        <p className="text-gray-600 text-sm mt-1">
          Accesos y herramientas para el monitoreo operativo.
        </p>
      </div>

      {/* Uso de la página */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-gray-800">Uso de la página</h3>

        <p className="text-sm text-gray-700">
          Esta sección centraliza accesos y herramientas necesarias para el monitoreo. Permite consultar eventos activos, reportar nuevos eventos y registrar la actividad de guardia. En la sección de arriba, puede realizarse un monitoreo de posibles eventos utilizando diversas aplicaciones a disposición, así como revisar rapidamente noticias o actualizaciones en feeds automático de Facebook de cuentas que reportan información oficial o secundaria.
        </p>

        <ul className="text-sm text-gray-700 space-y-2">
          <li>• La Matriz de Seguimiento permite visualizar eventos que estan o estuvieron activos.</li>
          <li>• El reporte de eventos se utiliza para cargar noticias de eventos que quizá requieran monitoreo o seguimiento.</li>
          <li>• El registro de guardia sirve para registrar la actividad realizada durante el turno.</li>
        </ul>
      </div>

      {/* Enlaces operativos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <a 
          href="https://drive.google.com/drive/u/1/folders/1FqtyrYTwX_xIRbRSAFSGVl_zwi_gP_8h" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow hover:border-blue-300"
        >
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 text-xl mr-4">
            📊
          </div>
          <div>
            <h3 className="font-bold text-gray-800 text-sm">Matriz de Seguimiento</h3>
            <p className="text-xs text-gray-500">Eventos activos y actualizaciones</p>
          </div>
        </a>

        <a 
          href="https://forms.monday.com/forms/30abb0ab881b5ad9ed68a1113a38a13f?r=use1" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow hover:border-red-300"
        >
          <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-600 text-xl mr-4">
            🚨
          </div>
          <div>
            <h3 className="font-bold text-gray-800 text-sm">Reportar evento</h3>
            <p className="text-xs text-gray-500">Carga de eventos relevantes</p>
          </div>
        </a>

        <a 
          href="https://forms.monday.com/forms/dbba27f2383af28516ad8037aa502124?r=use1"
          className="flex items-center p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow hover:border-emerald-300"
        >
          <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 text-xl mr-4">
            📝
          </div>
          <div>
            <h3 className="font-bold text-gray-800 text-sm">Registro de guardia</h3>
            <p className="text-xs text-gray-500">Seguimiento de actividad del turno</p>
          </div>
        </a>
      </div>

      {/* Guía operativa */}
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-6">
          Guía de monitoreo
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">


          {/* Durante la guardia */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h4 className="font-bold text-gray-800 mb-4 border-b pb-2">Monitoreo</h4>
            <ul className="space-y-3 text-sm text-gray-700">
              <li>• Monitorear medios, redes oficiales y alertas cada 20-30 minutos.</li>
              <li>• Mantener la información actualizada evitando duplicaciones.</li>
              <li>• Informar novedades relevantes en el momento.</li>
              <li>• Registrar todas las acciones realizadas.</li>
              <li>• Completar el formulario de monitoreo.</li>
            </ul>
          </div>

          {/* Detección de evento */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h4 className="font-bold text-gray-800 mb-4 border-b pb-2">Detección de eventos</h4>
            <ul className="space-y-3 text-sm text-gray-700">
              <li>• Validar información en fuentes oficiales y confiables.</li>
              <li>• Registrar tipo de evento, ubicación, fecha, hora e impactos preliminares.</li>
              <li>• Identificar fuente de la información.</li>
              <li>• Evaluar severidad y necesidad de seguimiento.</li>
              <li>• Comunicar utilizando el formato estándar.</li>
            </ul>
          </div>

          {/* Formato estándar */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h4 className="font-bold text-gray-800 mb-4 border-b pb-2">Formato de reporte</h4>
            <div className="text-sm text-gray-700 space-y-1 font-mono">
              <p>[EVENTO] – [LOCALIDAD/PROVINCIA]</p>
              <p>Fecha y hora: [dd/mm/aa – hh:mm]</p>
              <p>Ubicación: [Localidad – Provincia]</p>
              <p>Magnitud/severidad: [dato relevante]</p>
              <p>Descripción: [resumen del hecho]</p>
              <p>Impactos preliminares: [daños, evacuados, cortes]</p>
              <p>Fuente: [organismo o enlace verificado]</p>
            </div>
          </div>
          
  

        </div>
      </div>

    </div>
  );
}
