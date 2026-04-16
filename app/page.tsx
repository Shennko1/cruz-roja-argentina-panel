import React from 'react';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-[#f4f4f4] p-8 font-sans">
      
 
      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-md shadow-sm border border-gray-200">
          <h2 className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Emergencias Activas (30 Días)</h2>
          <p className="text-4xl font-bold text-gray-900 mt-2">X</p>
        </div>
        <div className="bg-white p-6 rounded-md shadow-sm border border-gray-200">
          <h2 className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Personas Afectadas</h2>
          <p className="text-4xl font-bold text-gray-900 mt-2">0</p>
        </div>
        <div className="bg-white p-6 rounded-md shadow-sm border border-gray-200">
          <h2 className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Texto 3</h2>
          <p className="text-4xl font-bold text-gray-900 mt-2">0</p>
        </div>
      </div>

      {/* Map Section - IFRC Style */}
      <div className="bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden mb-8">
        
        {/* Map Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-white flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900">Mapa de Emergencias: Argentina</h2>
          <span className="text-sm text-gray-500">Últimos 30 días</span>
        </div>
        
        {/* Map Viewer (OpenStreetMap Embed) */}
        <div className="w-full h-[400px] bg-gray-100 relative">
          <iframe 
            width="100%" 
            height="100%" 
            frameBorder="0" 
            scrolling="no" 
            marginHeight="0" 
            marginWidth="0" 
            src="https://www.google.com/maps/d/embed?mid=1H0v0xCT3MHMmLZtA93Rfb-wdHIgX0Zc&ehbc=2E312F" 
            style={{ border: 0 }}
            title="Mapa de Argentina"
          ></iframe>
        </div>

        {/* IFRC Map Legend */}
        <div className="bg-white px-6 py-4 border-t border-gray-200 flex flex-wrap gap-6 text-sm">
          <p className="text-gray-500 font-medium">Leyenda:</p>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#ee3224]"></span>
            <span className="text-gray-700">Con respuest</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#ff9e00]"></span>
            <span className="text-gray-700">Respuesta Mixta</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-gray-400"></span>
            <span className="text-gray-700">Sin respuesta</span>
          </div>
        </div>
        
      </div>

      {/* Main Data Table - IFRC Style */}
      <div className="bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-white flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900">Reportes de Terreno Recientes</h2>
          <button className="text-sm font-medium text-blue-600 hover:underline">Ver Todos</button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f4f4f4] text-gray-600 text-xs uppercase tracking-wider border-b border-gray-200">
                <th className="px-6 py-3 font-semibold">Fecha de Inicio</th>
                <th className="px-6 py-3 font-semibold">Nombre</th>
                <th className="px-6 py-3 font-semibold">Tipo de Desastre</th>
                <th className="px-6 py-3 font-semibold">Ubicación</th>
                <th className="px-6 py-3 font-semibold">Personas Afectadas</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-800">
              
             {/* Row 1 */}
<tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
  <td className="px-6 py-4 whitespace-nowrap text-gray-500">2025-12-29</td>
  <td className="px-6 py-4 font-medium text-[#ee3224] hover:text-red-700">
    <a href="https://drive.google.com/open?id=1ynnE4ImxwgSoqw6hZwRRws1pcZrXSdLv&usp=drive_copy" target="_blank" rel="noopener noreferrer">
      Inundaciones en Corrientes
    </a>
  </td>
  <td className="px-6 py-4">Inundación</td>
  <td className="px-6 py-4">Corrientes, Argentina</td>
  <td className="px-6 py-4 font-semibold">~1.500</td>
</tr>

{/* Row 2 */}
<tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
  <td className="px-6 py-4 whitespace-nowrap text-gray-500">2026-01-07</td>
  <td className="px-6 py-4 font-medium text-[#ee3224] hover:text-red-700">
    <a href="https://drive.google.com/open?id=1Mju0AhqmPyhD_q0IV4mvjk3rmInmgOzy&usp=drive_copy" target="_blank" rel="noopener noreferrer">
      Incendios Forestales en Patagonia
    </a>
  </td>
  <td className="px-6 py-4">Incendio forestal</td>
  <td className="px-6 py-4">Patagonia, Argentina</td>
  <td className="px-6 py-4 font-semibold">~5.000</td>
</tr>

{/* Row 3 */}
<tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
  <td className="px-6 py-4 whitespace-nowrap text-gray-500">2026-01-18</td>
  <td className="px-6 py-4 font-medium text-[#ee3224] hover:text-red-700">
    <a href="https://drive.google.com/open?id=1jKqBPCmJtUG8K3DCrksUqXimXz3KyNl6&usp=drive_copy" target="_blank" rel="noopener noreferrer">
      Remoción en masa en Comodoro Rivadavia
    </a>
  </td>
  <td className="px-6 py-4">Remoción en masa</td>
  <td className="px-6 py-4">Chubut, Argentina</td>
  <td className="px-6 py-4 font-semibold">-</td>
</tr>

{/* Row 4 */}
<tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
  <td className="px-6 py-4 whitespace-nowrap text-gray-500">2026-01-21</td>
  <td className="px-6 py-4 font-medium text-[#ee3224] hover:text-red-700">
    <a href="https://drive.google.com/open?id=1_8-Md0odJnFP6E0OphvTKI9OvyRMXLqB&usp=drive_copy" target="_blank" rel="noopener noreferrer">
      Crecidas del Pilcomayo
    </a>
  </td>
  <td className="px-6 py-4">Inundación</td>
  <td className="px-6 py-4">Norte de Argentina</td>
  <td className="px-6 py-4 font-semibold">-</td>
</tr>

{/* Row 5 */}
<tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
  <td className="px-6 py-4 whitespace-nowrap text-gray-500">2026-01-30</td>
  <td className="px-6 py-4 font-medium text-[#ee3224] hover:text-red-700">
    <a href="https://drive.google.com/open?id=1AFLAv3z9Bu0WVKBCUj798PVClxCCC6ei&usp=drive_copy" target="_blank" rel="noopener noreferrer">
      Tormentas en Cuyo y Patagonia
    </a>
  </td>
  <td className="px-6 py-4">Tormenta</td>
  <td className="px-6 py-4">Cuyo y Patagonia, Argentina</td>
  <td className="px-6 py-4 font-semibold">-</td>
</tr>

{/* Row 6 */}
<tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
  <td className="px-6 py-4 whitespace-nowrap text-gray-500">2026-03-11</td>
  <td className="px-6 py-4 font-medium text-[#ee3224] hover:text-red-700">
    <a href="https://drive.google.com/open?id=1nIYO0WNQxa8feAhbgOehh3-YW7OGMxKa&usp=drive_copy" target="_blank" rel="noopener noreferrer">
      Inundaciones en Tucumán
    </a>
  </td>
  <td className="px-6 py-4">Inundación</td>
  <td className="px-6 py-4">Tucumán, Argentina</td>
  <td className="px-6 py-4 font-semibold">~15.000</td>
</tr>

{/* Row 7 */}
<tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
  <td className="px-6 py-4 whitespace-nowrap text-gray-500">2026-04-01</td>
  <td className="px-6 py-4 font-medium text-[#ee3224] hover:text-red-700">
    <a href="https://drive.google.com/open?id=1F8E3Tqh3bAMiq_BkF8LdxhITNZ3G5yL2&usp=drive_copy" target="_blank" rel="noopener noreferrer">
      Tormentas en la región Centro
    </a>
  </td>
  <td className="px-6 py-4">Tormenta</td>
  <td className="px-6 py-4">Centro, Argentina</td>
  <td className="px-6 py-4 font-semibold">~250</td>
</tr>

            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
