"use client";
import React from 'react';
import dynamic from 'next/dynamic';

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

// Carga dinámica de Leaflet
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const CircleMarker = dynamic(() => import('react-leaflet').then(mod => mod.CircleMarker), { ssr: false });
const Tooltip = dynamic(() => import('react-leaflet').then(mod => mod.Tooltip), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

// Base de datos tipada
const reportesTerreno: ReporteTerreno[] = [
  { id: 1, fecha: "2025-12-29", nombre: "Inundaciones en Corrientes", tipo: "Inundación", ubicacion: "Corrientes, Argentina", afectadosText: "~1.500", afectadosNum: 1500, lat: -28.65, lng: -59.04, link: "https://drive.google.com/open?id=1ynnE4ImxwgSoqw6hZwRRws1pcZrXSdLv&usp=drive_copy" },
  { id: 2, fecha: "2026-01-07", nombre: "Incendios Forestales en Patagonia", tipo: "Incendio forestal", ubicacion: "Patagonia, Argentina", afectadosText: "~5.000", afectadosNum: 5000, lat: -42.0, lng: -71.5, link: "https://drive.google.com/open?id=1Mju0AhqmPyhD_q0IV4mvjk3rmInmgOzy&usp=drive_copy" },
  { id: 3, fecha: "2026-01-18", nombre: "Remoción en masa en Comodoro Rivadavia", tipo: "Remoción en masa", ubicacion: "Chubut, Argentina", afectadosText: "-", afectadosNum: 0, lat: -45.86, lng: -67.49, link: "https://drive.google.com/open?id=1jKqBPCmJtUG8K3DCrksUqXimXz3KyNl6&usp=drive_copy" },
  { id: 4, fecha: "2026-01-21", nombre: "Crecidas del Pilcomayo", tipo: "Inundación", ubicacion: "Norte de Argentina", afectadosText: "-", afectadosNum: 0, lat: -22.5, lng: -60.0, link: "https://drive.google.com/open?id=1_8-Md0odJnFP6E0OphvTKI9OvyRMXLqB&usp=drive_copy" },
  { id: 5, fecha: "2026-01-30", nombre: "Tormentas en Cuyo y Patagonia", tipo: "Tormenta", ubicacion: "Cuyo y Patagonia, Argentina", afectadosText: "-", afectadosNum: 0, lat: -36.0, lng: -68.0, link: "https://drive.google.com/open?id=1AFLAv3z9Bu0WVKBCUj798PVClxCCC6ei&usp=drive_copy" },
  { id: 6, fecha: "2026-03-11", nombre: "Inundaciones en Tucumán", tipo: "Inundación", ubicacion: "Tucumán, Argentina", afectadosText: "~15.000", afectadosNum: 15000, lat: -26.80, lng: -65.21, link: "https://drive.google.com/open?id=1nIYO0WNQxa8feAhbgOehh3-YW7OGMxKa&usp=drive_copy" },
  { id: 7, fecha: "2026-04-01", nombre: "Tormentas en la región Centro", tipo: "Tormenta", ubicacion: "Centro, Argentina", afectadosText: "~250", afectadosNum: 250, lat: -32.0, lng: -62.0, link: "https://drive.google.com/open?id=1F8E3Tqh3bAMiq_BkF8LdxhITNZ3G5yL2&usp=drive_copy" }
];

export default function Dashboard() {
  const totalEmergencias = reportesTerreno.length;
  const totalAfectados = reportesTerreno.reduce((acc, curr) => acc + curr.afectadosNum, 0);

  return (
    <div className="min-h-screen bg-[#f4f4f4] p-8 font-sans">
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />

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
          <h2 className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Texto 3</h2>
          <p className="text-4xl font-bold text-gray-900 mt-2">0</p>
        </div>
      </div>

      {/* Map Section */}
      <div className="bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-gray-200 bg-white flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900">Mapa de Emergencias: Argentina</h2>
          <span className="text-sm text-gray-500">Eventos Activos</span>
        </div>
        
        <div className="w-full h-[400px] bg-gray-100 relative z-0">
          <MapContainer center={[-38.4161, -63.6167]} zoom={4} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            />
            {reportesTerreno.map((evento) => (
              <CircleMarker 
                key={evento.id} 
                center={[evento.lat, evento.lng]} 
                pathOptions={{ color: '#ee3224', fillColor: '#ee3224', fillOpacity: 0.7, weight: 1 }}
                radius={8}
              >
                <Tooltip sticky>
                  <div className="text-xs">
                    <strong className="block text-gray-900">{evento.nombre}</strong>
                    <span className="text-gray-600">{evento.tipo}</span>
                  </div>
                </Tooltip>
                <Popup>
                  <div className="text-sm">
                    <strong className="block text-[#ee3224] text-base mb-1">{evento.nombre}</strong>
                    <p className="m-0 text-gray-700"><strong>Fecha:</strong> {evento.fecha}</p>
                    <p className="m-0 text-gray-700"><strong>Ubicación:</strong> {evento.ubicacion}</p>
                    <p className="m-0 text-gray-700"><strong>Afectados:</strong> {evento.afectadosText}</p>
                    <a href={evento.link} target="_blank" rel="noopener noreferrer" className="block mt-2 text-blue-600 hover:underline">
                      Abrir Carpeta de Evento
                    </a>
                  </div>
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>
        {/* IFRC Map Legend */}
        <div className="bg-white px-6 py-4 border-t border-gray-200 flex flex-wrap gap-6 text-sm">
          <p className="text-gray-500 font-medium">Leyenda:</p>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#ee3224' }}></span>
            <span className="text-gray-700">Con respuesta</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#ff9e00' }}></span>
            <span className="text-gray-700">Respuesta Mixta</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-gray-400"></span>
            <span className="text-gray-700">Sin respuesta</span>
          </div>
        </div>
