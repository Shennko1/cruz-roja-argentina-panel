import React from 'react';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-[#f4f4f4] p-8 font-sans">
      
      {/* Header */}
      <header className="mb-8 border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-bold text-[#ee3224]">Cruz Roja Argentina</h1>
        <p className="text-gray-500 text-sm mt-1">Equipo Nacional de Monitoreo de Emergencias y Desastres</p>
      </header>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-md shadow-sm border border-gray-200">
          <h2 className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Emergencias Activas (30 Días)</h2>
          <p className="text-4xl font-bold text-gray-900 mt-2">4</p>
        </div>
        <div className="bg-white p-6 rounded-md shadow-sm border border-gray-200">
          <h2 className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Personas Afectadas</h2>
          <p className="text-4xl font-bold text-gray-900 mt-2">12,450</p>
        </div>
        <div className="bg-white p-6 rounded-md shadow-sm border border-gray-200">
          <h2 className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Fondos Requeridos (ARS)</h2>
          <p className="text-4xl font-bold text-gray-900 mt-2">$45.2M</p>
        </div>
      </div>

      {/* Main Data Table - IFRC Style */}
      <div className="bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden mt-8">
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
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">2025-29-12</td>
                <td className="px-6 py-4 font-medium text-[#ee3224] hover:text-red-700 cursor-pointer">
                  COR: Inundaciones en Corrientes
                </td>
                <td className="px-6 py-4">Inundación</td>
                <td className="px-6 py-4">Corrientes, Argentina</td>
                <td className="px-6 py-4 font-semibold">83,728</td>
              </tr>

              {/* Row 2 */}
              <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">2026-03-05</td>
                <td className="px-6 py-4 font-medium text-[#ee3224] hover:text-red-700 cursor-pointer">
                  PAT: Incendios Forestales en Patagonia
                </td>
                <td className="px-6 py-4">Incendio</td>
                <td className="px-6 py-4">Epuyén y El Bolsón</td>
                <td className="px-6 py-4 font-semibold">3,500</td>
              </tr>

              {/* Row 3 */}
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">2026-03-11</td>
                <td className="px-6 py-4 font-medium text-[#ee3224] hover:text-red-700 cursor-pointer">
                  TUC: Inundación en Tucumán
                </td>
                <td className="px-6 py-4">Inundación</td>
                <td className="px-6 py-4">Sur de Tucumán, Argentina</td>
                <td className="px-6 py-4 font-semibold">15,000</td>
              </tr>

            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
