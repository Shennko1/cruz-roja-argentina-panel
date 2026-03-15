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
          <td className="px-6 py-4 whitespace-nowrap text-gray-500">2026-03-12</td>
          <td className="px-6 py-4 font-medium text-[#ee3224] hover:text-red-700 cursor-pointer">
            BUE: Tormenta Severa - Zona Sur
          </td>
          <td className="px-6 py-4">Inundación</td>
          <td className="px-6 py-4">Gerli, Buenos Aires</td>
          <td className="px-6 py-4 font-semibold">4,200</td>
        </tr>

        {/* Row 2 */}
        <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
          <td className="px-6 py-4 whitespace-nowrap text-gray-500">2026-03-05</td>
          <td className="px-6 py-4 font-medium text-[#ee3224] hover:text-red-700 cursor-pointer">
            COR: Incendios Forestales - Punilla
          </td>
          <td className="px-6 py-4">Incendio</td>
          <td className="px-6 py-4">Córdoba</td>
          <td className="px-6 py-4 font-semibold">1,850</td>
        </tr>

        {/* Row 3 */}
        <tr className="hover:bg-gray-50 transition-colors">
          <td className="px-6 py-4 whitespace-nowrap text-gray-500">2026-02-28</td>
          <td className="px-6 py-4 font-medium text-[#ee3224] hover:text-red-700 cursor-pointer">
            LIT: Crecida del Río Paraná
          </td>
          <td className="px-6 py-4">Inundación</td>
          <td className="px-6 py-4">Corrientes, Chaco</td>
          <td className="px-6 py-4 font-semibold">5,100</td>
        </tr>

      </tbody>
    </table>
  </div>
</div>
