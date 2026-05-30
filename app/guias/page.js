"use client";
import React, { useState } from "react";

export default function GuiasProcesosPage() {
  const [activeSection, setActiveSection] = useState(null);

  const toggleSection = (id) => {
    setActiveSection(activeSection === id ? null : id);
  };

  const secciones = [
    {
      id: 1,
      titulo: "1. Identidad y Propósito (ENMO)",
      contenido: (
        <div className="space-y-4">
          <p>En el marco del <strong>PECRA 2024-2029</strong>, el ENMO es el mecanismo operativo de Cruz Roja Argentina para monitorear amenazas las 24 horas, los 365 días del año.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <h4 className="font-bold text-xs uppercase text-gray-700 mb-2">Objetivo General</h4>
              <p className="text-xs">Facilitar la toma de decisiones humanitarias con foco en la anticipación basada en información.</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <h4 className="font-bold text-xs uppercase text-gray-700 mb-2">Objetivos Específicos</h4>
              <ul className="list-disc ml-4 text-xs space-y-1">
                <li>Gestionar información sobre riesgos.</li>
                <li>Emitir productos de análisis.</li>
                <li>Apoyar mecanismos locales.</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 2,
      titulo: "2. Estructura Organizativa",
      contenido: (
        <div className="space-y-3">
          <p>Liderado por la <strong>Dirección de Gestión del Riesgo</strong>, el ENMO se organiza en:</p>
          <ul className="space-y-2 text-[13px]">
            <li><strong>• Coordinación NEXO:</strong> Voluntariado y bienestar.</li>
            <li><strong>• Coordinación de Guardias:</strong> Sistema rotativo 24/7.</li>
            <li><strong>• Coordinación de Formación:</strong> Desarrollo de capacidades.</li>
          </ul>
        </div>
      )
    },
    {
      id: 3,
      titulo: "3. Sistema de Guardias",
      contenido: (
        <p className="text-[13px]">La operatividad 24/7 se garantiza mediante guardias pasivas rotativas de <strong>6 horas</strong>. Los turnos son: 00-06h, 06-12h, 12-18h y 18-24h, organizados semanalmente mediante encuestas de disponibilidad.</p>
      )
    },
    {
      id: 4,
      titulo: "4. Flujo de Monitoreo y Seguimiento",
      contenido: (
        <div className="space-y-4 text-[13px]">
          <div>
            <h4 className="font-bold text-gray-800 mb-1">A. Monitoreo Diario</h4>
            <p>Relevamiento continuo de fuentes oficiales y redes. Se prioriza la comunicación clara y priorizada.</p>
          </div>
          <div>
            <h4 className="font-bold text-gray-800 mb-1">B. Activación de Seguimiento</h4>
            <p>Ante eventos con potencial de daño, se activa la creación de la <strong>Carpeta de Seguimiento</strong> (Drive) y la carga de la <strong>Matriz de Seguimiento (MdS)</strong>.</p>
          </div>
        </div>
      )
    },
    {
      id: 5,
      titulo: "5. Productos Técnicos",
      contenido: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[{t:"Reporte ENMO", d:"Mensaje breve de WA con caracterización rápida."}, {t:"IAR", d:"Análisis profundo con pronósticos y niveles de riesgo."}, {t:"IdS", d:"Informe técnico con impacto, vacíos y acciones."}].map((p,i) => (
            <div key={i} className="border border-gray-200 p-3 rounded-lg"><h4 className="font-bold text-[11px] uppercase mb-1">{p.t}</h4><p className="text-[11px] text-gray-600">{p.d}</p></div>
          ))}
        </div>
      )
    }
  ];

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm font-sans">
      <h2 className="text-xl font-bold text-gray-800 border-b border-gray-200 pb-3 mb-6">Guías y Procesos Operativos</h2>

      {/* MANUAL DE USO DE LA PLATAFORMA */}
      <div className="bg-blue-50 p-5 rounded-xl border border-blue-100 mb-8">
        <h3 className="text-sm font-bold text-blue-900 mb-2 uppercase tracking-wide">Manual de Uso de esta Plataforma</h3>
        <p className="text-xs text-blue-800 leading-relaxed mb-3">
          Esta plataforma es tu herramienta central de trabajo. Acá encontrarás acceso directo a mapas en tiempo real, dashboards, seguimiento de eventos y los recursos necesarios para tus guardias. Te recomendamos consultar regularmente los protocolos cargados en la sección de PDF y mantener siempre actualizada la Matriz de Seguimiento ante cualquier evento activo.
          No es necesario publicar alertas o eventos que se hayan registrado en algunas de las secciones de la página (Alertas SMN, INPRES, boletines), sobre todo si no hay afectaciones. Es necesario hacer búsqueda de afectaciones confirmadas o posibles en las localidades ubicadas, y publicar eso. 
        </p>
      </div>

      {/* CRITERIOS DE COMUNICACIÓN (FIJO) */}
      <div className="bg-amber-50 p-5 rounded-xl border border-amber-200 mb-8">
        <h3 className="text-sm font-bold text-amber-900 mb-3 uppercase tracking-wide">Criterios de Comunicación en Chats</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-amber-900">
          <div>
            <p className="font-bold mb-1 underline">¿Cuándo publicar?</p>
            <ul className="list-disc ml-4 space-y-1">
              <li>Alertas oficiales con alta probabilidad de impacto.</li>
              <li>Noticias de impacto confirmadas.</li>
              <li>Actualizaciones críticas de eventos en seguimiento o monitoreo.</li>
            </ul>
          </div>
          <div>
            <p className="font-bold mb-1 underline">¿Cuándo NO publicar?</p>
            <ul className="list-disc ml-4 space-y-1">
              <li>Información no verificada o rumores.</li>
              <li>Debates ajenos al monitoreo técnico.</li>
              <li>Contenido ya compartido por otro integrante o de público conocimiento (Alertas públicas).</li>
            </ul>
          </div>
        </div>
      </div>

      {/* ACORDEONES */}
      <div className="space-y-3 mb-10">
        {secciones.map((seccion) => (
          <div key={seccion.id} className="border border-gray-200 rounded-xl overflow-hidden">
            <button onClick={() => toggleSection(seccion.id)} className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-3">
                <h3 className="text-sm font-bold text-gray-700 uppercase">{seccion.titulo}</h3>
              </div>
              <svg className={`w-5 h-5 text-gray-500 transition-transform ${activeSection === seccion.id ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            {activeSection === seccion.id && <div className="p-5 border-t border-gray-200 bg-white text-sm text-gray-700">{seccion.contenido}</div>}
          </div>
        ))}
      </div>

      {/* PDF */}
      <div className="border-t border-gray-200 pt-8">
        <h3 className="text-sm font-bold text-gray-700 uppercase mb-4">Kit Guardias (PDF)</h3>
        <div className="h-[600px] bg-gray-100 rounded-xl border border-gray-300 overflow-hidden">
          <iframe src="https://drive.google.com/file/d/1tonlLxG5jmmmIWTNVntwxenOA03-j6a_/preview" className="w-full h-full border-0" title="Manual kit Guardias"></iframe>
        </div>
      </div>
    </div>
  );
}
