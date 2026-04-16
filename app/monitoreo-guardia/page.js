import React from 'react';

export default function MonitoreoGuardiasPage() {
  return (
    <div className="space-y-8 max-w-6xl mx-auto p-4">
      {/* Encabezado */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Monitoreo y Guardias</h2>
        <p className="text-gray-600 text-sm mt-1">
          Enlaces operativos y pautas para el correcto desarrollo del turno.
        </p>
      </div>

      {/* SECCIÓN 1: Enlaces y Dashboards Operativos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <a href="#" className="flex items-center p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow hover:border-blue-300">
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 text-xl mr-4">
            📊
          </div>
          <div>
            <h3 className="font-bold text-gray-800 text-sm">Matriz de Seguimiento (MS)</h3>
            <p className="text-xs text-gray-500">Eventos abiertos y actualizaciones</p>
          </div>
        </a>

        <a href="#" className="flex items-center p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow hover:border-blue-300">
          <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 text-xl mr-4">
            🌍
          </div>
          <div>
            <h3 className="font-bold text-gray-800 text-sm">Tableros Oficiales</h3>
            <p className="text-xs text-gray-500">SMN, INPRES, Defensa Civil</p>
          </div>
        </a>

        <a href="#" className="flex items-center p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow hover:border-blue-300">
          <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 text-xl mr-4">
            📝
          </div>
          <div>
            <h3 className="font-bold text-gray-800 text-sm">Registro de Guardia</h3>
            <p className="text-xs text-gray-500">Formulario de monitoreo y Check</p>
          </div>
        </a>
      </div>

      <hr className="border-gray-200" />

      {/* SECCIÓN 2: Protocolo Operativo */}
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
          <span className="text-blue-600">📋</span> Guía Operativa de Guardia
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Bloque 1 */}
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <h4 className="font-bold text-gray-800 mb-4 border-b pb-2">1. Inicio de Turno</h4>
            <ul className="space-y-3 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span>Revisar calendario para confirmar seguimientos activos.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span>Conectar a canales internos (WhatsApp, Monday, Sitio ENMO, correo).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span>Verificar Matriz de Seguimiento (MS) e Informe de Situación (IDS) previo.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span>Confirmar ingreso en el Chat ENMO detallando quién acompaña.</span>
              </li>
            </ul>
          </div>

          {/* Bloque 2 */}
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <h4 className="font-bold text-gray-800 mb-4 border-b pb-2">2. Durante la Guardia</h4>
            <ul className="space-y-3 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span>Monitorear medios, redes y alertas oficiales cada 20-30 minutos.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span>Mantener MS y documentos actualizados en tiempo real (evitar duplicados).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span>Informar novedades relevantes en el momento, sin esperar al fin de turno.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span>Cargar formulario de monitoreos y registrar participación en el Check.</span>
              </li>
            </ul>
          </div>

          {/* Bloque 3 */}
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <h4 className="font-bold text-gray-800 mb-4 border-b pb-2">3. Detección de Eventos</h4>
            <ul className="space-y-3 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-0.5">•</span>
                <span>Validar siempre en fuentes oficiales (SMN, INPRES, DC).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-0.5">•</span>
                <span>
                  <strong>Registrar datos clave:</strong> Qué pasó, Dónde, Cuándo, Impactos preliminares y Fuente.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-0.5">•</span>
                <span>Evaluar severidad para determinar si amerita activar seguimiento.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-0.5">•</span>
                <span>Comunicar hallazgos en Chat ENMO utilizando el formato estándar establecido.</span>
              </li>
            </ul>
          </div>

          {/* Bloque 4 */}
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <h4 className="font-bold text-gray-800 mb-4 border-b pb-2">4. Cierre y Pase</h4>
            <ul className="space-y-3 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 mt-0.5">•</span>
                <span>Consolidar información en carpeta y Matriz de Seguimiento (MS).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 mt-0.5">•</span>
                <span>Redactar pase de guardia en Chat ENMO (situaciones en curso, alertas y recomendaciones).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 mt-0.5">•</span>
                <span>Coordinar verbalmente con la guardia entrante ante seguimientos críticos.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 mt-0.5">•</span>
                <span>Cerrar sesión en herramientas internas.</span>
              </li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
}
