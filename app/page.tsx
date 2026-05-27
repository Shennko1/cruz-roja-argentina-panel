import React from 'react';

// Interfaz TypeScript para definir la estructura de los datos
interface ReporteTerreno {
  id: number;
  fecha: string;
  nombre: string;
  tipo: string;
  ubicacion: string;
  afectadosText: string;
  afectadosNum: number;
  lat: number;
  lng: number;
  link: string;
}

// ACÁ PUEDEN MODIFICARSE LOS EVENTOS, AGREGARSE, O SACARSE. Copiar el formato, cambiar los datos necesarios y sumar o restar +-1 en "id" dependiendo el orden
const reportesTerreno: ReporteTerreno[] = [
  { id: 1, fecha: "2025-12-29", nombre: "Inundaciones en Corrientes", tipo: "Inundación", ubicacion: "Corrientes, Argentina", afectadosText: "~1.500", afectadosNum: 1500, lat: -28.65, lng: -59.04, link: "https://drive.google.com/open?id=1ynnE4ImxwgSoqw6hZwRRws1pcZrXSdLv&usp=drive_copy" },
  { id: 2, fecha: "2026-01-07", nombre: "Incendios Forestales en Patagonia", tipo: "Incendio forestal", ubicacion: "Patagonia, Argentina", afectadosText: "~5.000", afectadosNum: 5000, lat: -42.0, lng: -71.5, link: "https://drive.google.com/drive/u/1/folders/1jKqBPCmJtUG8K3DCrksUqXimXz3KyNl6" },
  { id: 3, fecha: "2026-01-18", nombre: "Remoción en masa en Comodoro Rivadavia", tipo: "Remoción en masa", ubicacion: "Chubut, Argentina", afectadosText: "-", afectadosNum: 0, lat: -45.86, lng: -67.49, link: "https://drive.google.com/drive/u/1/folders/1_8-Md0odJnFP6E0OphvTKI9OvyRMXLqB" },
  { id: 4, fecha: "2026-01-21", nombre: "Crecidas del Pilcomayo", tipo: "Inundación", ubicacion: "Norte de Argentina", afectadosText: "-", afectadosNum: 0, lat: -22.47, lng: -62.44, link: "https://drive.google.com/drive/u/1/folders/1AFLAv3z9Bu0WVKBCUj798PVClxCCC6ei" },
  { id: 5, fecha: "2026-01-30", nombre: "Tormentas en Cuyo y Patagonia", tipo: "Tormenta", ubicacion: "Cuyo y Patagonia, Argentina", afectadosText: "-", afectadosNum: 0, lat: -36.0, lng: -68.0, link: "https://drive.google.com/open?id=1nIYO0WNQxa8feAhbgOehh3-YW7OGMxKa&usp=drive_copy" },
  { id: 6, fecha: "2026-03-11", nombre: "Inundaciones en Tucumán", tipo: "Inundación", ubicacion: "Tucumán, Argentina", afectadosText: "~15.000", afectadosNum: 15000, lat: -26.80, lng: -65.21, link: "https://drive.google.com/open?id=1F8E3Tqh3bAMiq_BkF8LdxhITNZ3G5yL2&usp=drive_copy" },
  { id: 7, fecha: "2026-04-01", nombre: "Tormentas en la región Centro", tipo: "Tormenta", ubicacion: "Centro, Argentina", afectadosText: "~250", afectadosNum: 250, lat: -32.0, lng: -62.0, link: "https://drive.google.com/drive/u/1/folders/1Mju0AhqmPyhD_q0IV4mvjk3rmInmgOzy" },
];

export default function Dashboard() {
  const totalEmergencias = reportesTerreno.length;
  const totalAfectados = reportesTerreno.reduce((acc, curr) => acc + curr.afectadosNum, 0);

  // Armamos el mapa 
  const mapHtml = `
  <!DOCTYPE html>
  <html>
  <head>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.4.0/leaflet.css" />
    <script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.4.0/leaflet.js"></script>
    <script src="https://code.jquery.com/jquery-3.4.0.min.js"></script>
    <style>
      body { margin: 0; padding: 0; }
      #map { position: absolute; top: 0; left: 0; width: 100%; height: 100vh; }
    </style>
  </head>
  <body>
    <div id="map"></div>
    <script type="text/javascript">
      $(function () {
        var map = L.map('map', {
          center: [-38.4161, -63.6167],
          zoom: 4
        });

        // Capa 1: Base gris del IGN
       var argenmap_gris = new L.tileLayer('https://wms.ign.gob.ar/geoserver/gwc/service/tms/1.0.0/mapabase_gris@EPSG%3A3857@png/{z}/{x}/{-y}.png', {
          minZoom: 1, 
          maxZoom: 20,
          attribution: '<a href="https://www.ign.gob.ar/" target="_blank" rel="noopener noreferrer" style="color: #ee3224; font-weight: bold;">Instituto Geográfico Nacional</a> | <a href="https://cruzroja.org.ar/" target="_blank" rel="noopener noreferrer" style="color: #ee3224; font-weight: bold;">Cruz Roja Argentina</a>'
        }).addTo(map);

        // Capa 2: Provincias y Capitales (WMS)
        var capa_provincias = new L.tileLayer.wms('https://wms.ign.gob.ar/geoserver/ows?', {
          layers: 'provincia,capa_capitales',
          format: 'image/png',
          transparent: true,
          opacity: 0.8
        }).addTo(map);

        // Tus marcadores de eventos (inyectados desde React)
        var eventos = ${JSON.stringify(reportesTerreno)};

eventos.forEach(function(evento) {
   // Gris para eventos sin accion en terreno, Rojo para el resto
   var colorMarker = (evento.nombre === "Incendios Forestales en Patagonia") ? '#808080' : '#ee3224';

   var marker = L.circleMarker([evento.lat, evento.lng], {
     color: colorMarker,
     fillColor: colorMarker,
     fillOpacity: 0.7,
     radius: 8
   }).addTo(map);

   // Tooltip: Solo el nombre al pasar el mouse.
   marker.bindTooltip(evento.nombre, {
     direction: 'top',
     offset: [0, -8]
   });
});
});
    </script>
  </body>
  </html>
`;

  return (
    <div className="min-h-screen bg-[#f4f4f4] p-8 font-sans">

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-md shadow-sm border border-gray-200">
          <h2 className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Emergencias Activas</h2>
          <p className="text-4xl font-bold text-gray-900 mt-2">{totalEmergencias}</p>
        </div>
        <div className="bg-white p-6 rounded-md shadow-sm border border-gray-200">
          <h2 className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Personas Afectadas (Est.)</h2>
          <p className="text-4xl font-bold text-gray-900 mt-2">{totalAfectados.toLocaleString('es-AR')}</p>
        </div>
        <div className="bg-white p-6 rounded-md shadow-sm border border-gray-200">
          <h2 className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Métricas Adicionales</h2>
          <p className="text-4xl font-bold text-gray-900 mt-2">0</p>
        </div>
      </div>

      {/* Map Section */}
      <div className="bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-gray-200 bg-white flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900">Mapa de Emergencias: Argentina</h2>
          <span className="text-sm text-gray-500">Eventos Activos</span>
        </div>
        
        {/* El visor de mapa embebido que funciona sin dependencias */}
        <div className="w-full h-[400px] bg-gray-100 relative">
          <iframe 
            srcDoc={mapHtml} 
            className="w-full h-full border-0 absolute inset-0" 
            title="Mapa de Emergencias" 
            sandbox="allow-scripts allow-same-origin allow-popups"
          />
        </div>

        {/* Leyenda */}
        <div className="bg-white px-6 py-4 border-t border-gray-200 flex flex-wrap gap-6 text-sm">
          <p className="text-gray-500 font-medium">Leyenda:</p>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#ee3224' }}></span>
            <span className="text-gray-700">Con movilización en terreno</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-gray-400"></span>
            <span className="text-gray-700">Sin movilización en terreno</span>
          </div>
        </div>
      </div>

      {/* Main Data Table */}
      <div className="bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-white flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900">Últimos seguimientos</h2>
          <button className="text-sm font-medium text-blue-600 hover:underline">Ver Todos</button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f4f4f4] text-gray-600 text-xs uppercase tracking-wider border-b border-gray-200">
                <th className="px-6 py-3 font-semibold">Fecha de Inicio</th>
                <th className="px-6 py-3 font-semibold">Nombre</th>
                <th className="px-6 py-3 font-semibold">Tipo de evento</th>
                <th className="px-6 py-3 font-semibold">Ubicación</th>
                <th className="px-6 py-3 font-semibold">Personas Afectadas</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-800">
              {reportesTerreno.map((row) => (
                <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">{row.fecha}</td>
                  <td className="px-6 py-4 font-medium text-[#ee3224] hover:text-red-700">
                    <a href={row.link} target="_blank" rel="noopener noreferrer">
                      {row.nombre}
                    </a>
                  </td>
                  <td className="px-6 py-4">{row.tipo}</td>
                  <td className="px-6 py-4">{row.ubicacion}</td>
                  <td className="px-6 py-4 font-semibold">{row.afectadosText}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
