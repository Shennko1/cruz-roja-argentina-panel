"use client";
import React, { useState } from "react";

export default function GuiasProcesosPage() {
  // Estado para controlar qué sección del acordeón está abierta
  const [activeSection, setActiveSection] = useState(null);

  const toggleSection = (id) => {
    setActiveSection(activeSection === id ? null : id);
  };

  // Datos de las secciones
  const secciones = [
    {
      id: 1,
      titulo: "1. Identidad y Propósito (ENMO)",
      icono: "/info.png",
      contenido: (
        <div className="space-y-4">
          <p>En el marco del <strong>PECRA 2024-2029</strong>, el ENMO (Equipo Nacional de Monitoreo) es el mecanismo operativo de Cruz Roja Argentina para monitorear amenazas y eventos severos las 24 horas, los 365 días del año.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <h4 className="font-bold text-xs uppercase text-gray-700 mb-2">Objetivo General</h4>
              <p className="text-xs">Facilitar la toma de decisiones humanitarias con foco en la anticipación basada en información.</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <h4 className="font-bold text-xs uppercase text-gray-700 mb-2">Objetivos Específicos</h4>
              <ul className="list-disc ml-4 text-xs space-y-1">
                <li>Gestionar información sobre componentes del riesgo.</li>
                <li>Emitir productos de análisis y comunicación.</li>
                <li>Brindar apoyo a mecanismos locales y regionales.</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 2,
      titulo: "2. Estructura Organizativa",
      icono: "/users.png",
      contenido: (
        <div className="space-y-3">
          <p>Liderado por la <strong>Dirección de Gestión del Riesgo</strong>, el ENMO se organiza en tres coordinaciones funcionales:</p>
          <ul className="space-y-2">
            <li className="text-[13px]"><strong>• Coordinación NEXO:</strong> Gestión del voluntariado, participación y bienestar.</li>
            <li className="text-[13px]"><strong>• Coordinación de Guardias:</strong> Organización del sistema rotativo 24/7.</li>
            <li className="text-[13px]"><strong>• Coordinación de Formación:</strong> Desarrollo de capacidades y actualización técnica.</li>
          </ul>
        </div>
      )
    },
    {
      id: 3,
      titulo: "3. Sistema de Guardias y Operatividad",
      icono: "/clock.png",
      contenido: (
        <div className="space-y-4">
          <p>La funcionalidad 24/7 se garantiza mediante guardias pasivas rotativas de <strong>6 horas</strong> (00-06, 06-12, 12-18, 18-24). La convocatoria se realiza semanalmente mediante encuestas en los canales oficiales.</p>
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
            <h4 className="font-bold text-xs uppercase text-blue-700 mb-1 text-center">Canales de Comunicación</h4>
            <div className="flex justify-around text-xs font-bold text-blue-800">
              <span>Chat ENMO</span>
              <span>•</span>
              <span>Noticias</span>
              <span>•</span>
              <span>CRA - ENMO</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 4,
      titulo: "4. Flujo de Monitoreo y Seguimiento",
      icono: "/flow.png",
      contenido: (
        <div className="space-y-4 text-[13px]">
          <div>
            <h4 className="font-bold text-gray-800 mb-1">A. Monitoreo Diario</h4>
            <p>Relevamiento de fuentes oficiales (SMN, INA, SNMF, SHN, etc) y redes sociales. Se prioriza la comunicación clara en los grupos nacionales.</p>
          </div>
          <div>
            <h4 className="font-bold text-gray-800 mb-1">B. Activación de Seguimiento</h4>
            <p>Indicado por la Coordinación Nacional ante eventos de potencial daño. Requiere:</p>
            <ul className="list-disc ml-5 mt-1 space-y-1">
              <li>Creación de <strong>Carpeta de Seguimiento</strong> en Drive.</li>
              <li>Carga constante de la <strong>Matriz de Seguimiento (MdS)</strong>.</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 5,
      titulo: "5. Productos y Entregables Técnicos",
      icono: "/data.png",
      contenido: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-gray-200 p-3 rounded-lg">
            <h4 className="font-bold text-[11px] uppercase mb-1">Reporte ENMO</h4>
            <p className="text-[11px] text-gray-600">Mensaje de WA con caracterización rápida basada en datos secundarios y experiencia local.</p>
          </div>
          <div className="border border-gray-200 p-3 rounded-lg">
            <h4 className="font-bold text-[11px] uppercase mb-1">IAR</h4>
            <p className="text-[11px] text-gray-600">Informe de Análisis del Riesgo. Documento detallado con pronósticos, evaluación y escala de colores.</p>
          </div>
          <div className="border border-gray-200 p-3 rounded-lg">
            <h4 className="font-bold text-[11px] uppercase mb-1">IdS</h4>
            <p className="text-[11px] text-gray-600">Informe de Situación. Sistematización de impactos, vacíos humanitarios y acciones implementadas.</p>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm font-sans">
      
      {/* CABECERA */}
      <div className="border-b border-gray-200 pb-3 mb-4 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">
          Guías y Procesos Operativos
        </h2>
      </div>

      {/* ÁREA DE TRABAJO / INTRO */}
      <div className="bg-gray-50 p-4 rounded-lg border border-dashed border-gray-300 text-sm text-gray-600 mb-8 leading-relaxed">
        Sistematización de la metodología de trabajo del <strong>Equipo Nacional de Monitoreo (ENMO)</strong>. Esta sección centraliza los lineamientos para garantizar la trazabilidad de eventos y la autonomía operativa de los integrantes.
      </div>

      {/* SECCIÓN DESPLEGABLES (ACORDEÓN) */}
      <div className="space-y-3 mb-10">
        {secciones.map((seccion) => (
          <div key={seccion.id} className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <button 
              onClick={() => toggleSection(seccion.id)}
              className={`w-full flex justify-between items-center p-4 transition-colors ${activeSection === seccion.id ? "bg-gray-100" : "bg-white hover:bg-gray-50"}`}
            >
              <div className="flex items-center gap-3">
                <img src={seccion.icono} alt="icono" className="w-6 h-6 object-contain" onError={(e) => e.target.style.display='none'} />
                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                  {seccion.titulo}
                </h3>
              </div>
              <svg className={`w-5 h-5 text-gray-500 transition-transform ${activeSection === seccion.id ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {activeSection === seccion.id && (
              <div className="p-5 border-t border-gray-200 bg-white text-sm text-gray-700">
                {seccion.contenido}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* VISOR DE PDF */}
      <div className="mt-10">
        <div className="flex items-center gap-3 mb-4 border-b border-gray-100 pb-2">
          <img src="/pdf.png" alt="Ícono PDF" className="w-8 h-8 object-contain" onError={(e) => e.target.style.display='none'} />
          <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
            Kit Guardias (PDF)
          </h3>
        </div>
        
        {/* Contenedor del PDF - Ajustar la URL al archivo real */}
        <div className="bg-gray-100 rounded-xl border border-gray-300 overflow-hidden shadow-inner h-[800px] flex items-center justify-center">
           {/* Reemplazar 'URL_DE_TU_ARCHIVO.pdf' con el link real de Drive o servidor */}
           <iframe 
            src="https://drive.google.com/file/d/1tonlLxG5jmmmIWTNVntwxenOA03-j6a_/view?usp=sharing" 
            className="w-full h-full border-0"
            title="Manual kit Guardias"
          >
            <p className="text-sm text-gray-500">Tu navegador no soporta visualización de PDFs. <a href="https://drive.google.com/file/d/1tonlLxG5jmmmIWTNVntwxenOA03-j6a_/view?usp=sharing" className="text-blue-600 underline">Click aquí para descargar</a></p>
          </iframe>
        </div>
        
        <div className="mt-4 flex justify-end">
          <a 
            href="https://drive.google.com/file/d/1tonlLxG5jmmmIWTNVntwxenOA03-j6a_/view?usp=sharing" 
            target="_blank" 
            className="text-[11px] font-bold text-red-600 hover:underline flex items-center gap-1"
          >
            Abrir documentación en pestaña nueva ↗
          </a>
        </div>
      </div>

    </div>
  );
}
