'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import {
  Activity, ExternalLink, MapPin, Search, ChevronDown, 
  Info, Loader2, Target, X, Orbit, List, Mountain, Volcano
} from 'lucide-react';

// --- INTERFACES PARA MAPAMONITOR ---
interface SismoINPRES {
  id: string;
  fecha: string;
  magnitud: string;
  profundidad: string;
  epicentro: string;
  lat: number;
  lon: number;
}

interface BusquedaNoticia {
  titulo: string;
  terminos: string;
}

// Carga dinámica del mapa global de tu proyecto
const MapaMonitorDinamico = dynamic(() => import('../../MapaMonitor'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center bg-[#e5e3df] dark:bg-slate-900 transition-colors">
      <Loader2 className="animate-spin text-slate-400 dark:text-slate-500" size={32} />
    </div>
  )
});

export default function GeofisicaPage() {
  // Estados de carga y datos para el mapa nativo
  const [sismos, setSismos] = useState<SismoINPRES[]>([]);
  const [loadingSismos, setLoadingSismos] = useState<boolean>(true);

  // Estados de colapso/desplegables
  const [isMapOpen, setIsMapOpen] = useState<boolean>(true);
  const [isSegemarOpen, setIsSegemarOpen] = useState<boolean>(false);
  const [isNoticiasOpen, setIsNoticiasOpen] = useState<boolean>(false);

  // Estados para el buscador de noticias
  const [inputValue, setInputValue] = useState("");
  const [localidades, setLocalidades] = useState<string[]>([]);

  // Búsquedas dinámicas de noticias de impacto
  const busquedas: BusquedaNoticia[] = [
    { titulo: "Sismos y Terremotos", terminos: '(sismo OR terremoto OR temblor)' },
    { titulo: "Deslizamientos y Derrumbes", terminos: '(deslizamiento OR alud OR derrumbe OR aluvión)' },
    { titulo: "Actividad Volcánica", terminos: '(volcán OR erupción OR ceniza OR "pluma de humo")' }
  ];

  // Fetch de sismos para el MapaMonitorDinamico
  useEffect(() => {
    const cargarSismos = async () => {
      try {
        setLoadingSismos(true);
        const proxyUrl = '/api/smn?url='; // Reutilizamos tu proxy
        const resSismos = await fetch(proxyUrl + encodeURIComponent('http://contenidos.inpres.gob.ar/formatos/sentidos.xml'));
        const textSismos = await resSismos.text();
        const parser = new DOMParser();
        const xmlSismos = parser.parseFromString(textSismos, "application/xml");
        const items = xmlSismos.getElementsByTagName("item");
        
        const sismosProcesados: SismoINPRES[] = Array.from(items).map(item => ({
          id: item.getElementsByTagName("idSismo")[0]?.textContent || crypto.randomUUID(),
          fecha: item.getElementsByTagName("pubDate")[0]?.textContent || '',
          magnitud: item.getElementsByTagName("magnitude")[0]?.textContent || '0',
          profundidad: item.getElementsByTagName("depth")[0]?.textContent || '',
          epicentro: item.getElementsByTagName("epiczone")[0]?.textContent || '',
          lat: parseFloat(item.getElementsByTagName("latitude")[0]?.textContent || '0'),
          lon: parseFloat(item.getElementsByTagName("longitude")[0]?.textContent || '0')
        }));
        setSismos(sismosProcesados);
      } catch (e) {
        console.error("Error cargando sismos del INPRES", e);
      } finally {
        setLoadingSismos(false);
      }
    };

    cargarSismos();
    const interval = setInterval(cargarSismos, 300000); // Refresco cada 5 mins
    return () => clearInterval(interval);
  }, []);

  // Controladores del Buscador de Noticias
  const handleAddLocalidad = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim() !== '') {
      e.preventDefault();
      if (!localidades.includes(inputValue.trim())) {
        setLocalidades([...localidades, inputValue.trim()]);
      }
      setInputValue('');
    }
  };

  const removeLocalidad = (locToRemove: string) => {
    setLocalidades(localidades.filter(loc => loc !== locToRemove));
  };

  const generarUrlGoogleNews = (terminos: string) => {
    const locsQuery = localidades.length > 0 
      ? ` AND (${localidades.map(l => `"${l}"`).join(' OR ')})` 
      : '';
    const query = `${terminos}${locsQuery}`;
    return `https://www.google.com/search?q=${encodeURIComponent(query)}&tbm=nws&tbs=qdr:d,sbd:1`;
  };

  return (
    <main className="max-w-[1920px] mx-auto p-4 md:p-6 bg-[#f5f6f8] dark:bg-slate-950 min-h-screen transition-colors duration-300">
      
      {/* ENCABEZADO DE LA CONSOLA */}
      <div className="mb-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight flex items-center gap-2">
            <Orbit className="text-purple-600 dark:text-purple-500" size={28} />
            Geofísica y Sismos
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Consola táctica de monitoreo telúrico, alertas del INPRES y actividad volcánica regional.</p>
        </div>
        
        {/* Lanzador INPRES */}
        <div className="flex shrink-0">
          <a 
            href="https://www.inpres.gob.ar/desktop/" 
            target="_blank" 
            rel="noreferrer"
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold uppercase tracking-wider bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-900/50 rounded-md hover:bg-purple-100 dark:hover:bg-purple-900/60 transition-colors"
          >
            <Target size={14} className="text-purple-600 dark:text-purple-400" /> Registro Oficial INPRES ↗
          </a>
        </div>
      </div>

      {/* PROCEDIMIENTO OPERATIVO ESTÁNDAR (SOP) */}
      <section className="mb-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm p-4 md:p-5 transition-colors">
        <h2 className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-widest mb-3 border-b border-slate-100 dark:border-slate-800 pb-2 flex items-center gap-1.5">
          <Info size={14} className="text-purple-600 dark:text-purple-500" /> Procedimiento Operativo Estándar (SOP)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded border border-slate-100 dark:border-slate-800">
            <span className="font-bold text-slate-800 dark:text-slate-200 block mb-1">1. Detección Local (INPRES)</span>
            Monitorear el Visor SIG Nativo y la tabla operativa para identificar sismos sentidos recientes. Atender especialmente eventos con magnitud superior a 4.5 ML.
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded border border-slate-100 dark:border-slate-800">
            <span className="font-bold text-slate-800 dark:text-slate-200 block mb-1">2. Detección Geológica (SEGEMAR)</span>
            Consultar la plataforma SIGAM y el OAVV para cruzar actividad sísmica con riesgo geológico y alertas de emisión de ceniza volcánica (impacto aerocomercial).
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded border border-slate-100 dark:border-slate-800">
            <span className="font-bold text-slate-800 dark:text-slate-200 block mb-1">3. Verificación Comunitaria</span>
            Ante un evento de magnitud moderada/fuerte, utilizar el Buscador de Noticias para detectar daños colaterales (derrumbes, interrupción de servicios).
          </div>
        </div>
      </section>

      {/* BUSCADOR DE NOTICIAS PRIORITARIO */}
      <section className="mb-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm overflow-hidden transition-colors">
        <div className="bg-slate-50 dark:bg-slate-800/50 px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2 transition-colors">
          <Search size={18} className="text-emerald-600 dark:text-emerald-500" />
          <h2 className="text-sm font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">Buscador de Noticias (Últimas 24h)</h2>
        </div>
        <div className="p-4 md:p-5 flex flex-col lg:flex-row gap-6 items-start lg:items-center">
          
          <div className="w-full lg:w-1/3 flex flex-col gap-2">
            <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Añadir Localidades (Presione Enter)
            </label>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleAddLocalidad}
              placeholder="Ej: Mendoza, San Juan, Neuquén..."
              className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 rounded focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-500 transition-colors"
            />
            <div className="flex flex-wrap gap-2 mt-1">
              {localidades.length === 0 && (
                <span className="text-[10px] text-slate-400 dark:text-slate-500 italic">Búsqueda general. Ingrese localidad para filtrar.</span>
              )}
              {localidades.map((loc, idx) => (
                <span key={idx} className="inline-flex items-center gap-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50 px-2 py-1 rounded text-xs font-semibold transition-colors">
                  {loc}
                  <button onClick={() => removeLocalidad(loc)} className="hover:text-emerald-900 dark:hover:text-emerald-200 focus:outline-none">
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="w-full lg:w-2/3 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {busquedas.map((item, index) => (
              <a 
                key={index}
                href={generarUrlGoogleNews(item.terminos)} 
                target="_blank" 
                rel="noreferrer"
                className="flex justify-between items-center w-full p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-emerald-300 dark:hover:border-emerald-600 hover:bg-emerald-50 dark:hover:bg-slate-700/80 hover:shadow-sm transition-all group"
              >
                <div className="flex flex-col overflow-hidden w-full pr-2">
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-200 group-hover:text-emerald-800 dark:group-hover:text-emerald-400 transition-colors">{item.titulo}</span>
                  <span className="text-[9px] text-slate-400 dark:text-slate-500 truncate mt-0.5" title={item.terminos}>
                    Filtros: {item.terminos}
                  </span>
                </div>
                <ExternalLink size={16} className="text-slate-400 dark:text-slate-500 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 shrink-0 transition-colors" />
              </a>
            ))}
          </div>

        </div>
      </section>

      {/* MAPAS OPERATIVOS SÍSMICOS (COLAPSABLE) */}
      <section className="mb-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm overflow-hidden transition-colors">
        <button 
          onClick={() => setIsMapOpen(!isMapOpen)} 
          className="w-full flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-800/30 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Target size={20} className="text-purple-600 dark:text-purple-500" />
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
              Monitor de Sismos Oficial (INPRES)
            </h3>
          </div>
          <ChevronDown size={18} className={`text-slate-500 transition-transform duration-300 ${isMapOpen ? 'rotate-180' : ''}`} />
        </button>

        {isMapOpen && (
          <div className="p-4 md:p-6 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-6">
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* LADO IZQUIERDO: Mapa Nativo */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col transition-colors h-[650px]">
                <div className="bg-slate-50 dark:bg-slate-800/50 px-4 h-11 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between transition-colors">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
                    <Activity size={14} className="text-purple-500" /> Visor SIG (Capa Geofísica Activa)
                  </span>
                  {loadingSismos && (
                    <span className="text-[10px] text-slate-500 flex items-center gap-1"><Loader2 size={10} className="animate-spin" /> Sincronizando INPRES...</span>
                  )}
                </div>
                <div className="w-full flex-1 bg-[#e5e3df] dark:bg-slate-800 relative z-0 isolate transition-colors">
                  <MapaMonitorDinamico 
                    alertasSMN={[]} 
                    eventos={[]} 
                    sismos={sismos} 
                    capasIniciales={['sismos']}
                  />
                </div>
              </div>

              {/* LADO DERECHO: Iframe Listado INPRES */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col transition-colors h-[650px]">
                <div className="bg-slate-50 dark:bg-slate-800/50 px-4 h-11 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between transition-colors">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
                    <List size={14} className="text-purple-500" /> Listado Oficial (INPRES.gob.ar)
                  </span>
                  <a href="https://www.inpres.gob.ar/desktop/" target="_blank" rel="noreferrer" className="text-[10px] text-purple-600 dark:text-purple-400 hover:underline font-bold flex items-center gap-1 transition-colors">
                    Abrir Externo <ExternalLink size={10} />
                  </a>
                </div>
                <div className="w-full flex-1 bg-white dark:bg-slate-200 relative z-0 transition-colors">
                  <iframe 
                    width="100%" 
                    height="100%" 
                    src="https://www.inpres.gob.ar/desktop/" 
                    frameBorder="0" 
                    title="Listado INPRES" 
                    allowFullScreen 
                  />
                </div>
              </div>

            </div>

          </div>
        )}
      </section>

      {/* MONITOREO GEOLÓGICO Y VOLCÁNICO (SEGEMAR) (COLAPSABLE) */}
      <section className="mb-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm overflow-hidden transition-colors">
        <button 
          onClick={() => setIsSegemarOpen(!isSegemarOpen)}
          className="w-full flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-800/30 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Mountain size={20} className="text-amber-600 dark:text-amber-500" />
            <h2 className="text-sm font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
              Monitoreo Geológico y Volcánico (SEGEMAR)
            </h2>
          </div>
          <ChevronDown size={18} className={`text-slate-500 transition-transform duration-300 ${isSegemarOpen ? 'rotate-180' : ''}`} />
        </button>
        
        {isSegemarOpen && (
          <div className="flex flex-col border-t border-slate-200 dark:border-slate-800 p-4 md:p-6 gap-6">
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* LADO IZQUIERDO: Mapa SIGAM */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col transition-colors h-[650px]">
                <div className="bg-slate-50 dark:bg-slate-800/50 px-4 h-11 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between transition-colors">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
                    <MapPin size={14} className="text-amber-500" /> Sistema de Información Geológica (SIGAM)
                  </span>
                  <a href="https://sigam.segemar.gov.ar/mapstore/#/viewer/480" target="_blank" rel="noreferrer" className="text-[10px] text-amber-600 dark:text-amber-400 hover:underline font-bold flex items-center gap-1 transition-colors">
                    Abrir Externo <ExternalLink size={10} />
                  </a>
                </div>
                <div className="w-full flex-1 bg-white dark:bg-slate-950 relative z-0 transition-colors">
                  <iframe 
                    src="https://sigam.segemar.gov.ar/mapstore/#/viewer/480" 
                    width="100%" 
                    height="100%" 
                    frameBorder="0" 
                    title="Visor SIGAM"
                    className="dark:opacity-90 transition-opacity" 
                  />
                </div>
              </div>

              {/* LADO DERECHO: Observatorio Volcánico (OAVV) */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col transition-colors h-[650px]">
                <div className="bg-slate-50 dark:bg-slate-800/50 px-4 h-11 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between transition-colors">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
                    <Volcano size={14} className="text-amber-500" /> Vigilancia Volcánica (OAVV)
                  </span>
                  <a href="https://oavv.segemar.gob.ar/monitoreo-volcanico/" target="_blank" rel="noreferrer" className="text-[10px] text-amber-600 dark:text-amber-400 hover:underline font-bold flex items-center gap-1 transition-colors">
                    Abrir Externo <ExternalLink size={10} />
                  </a>
                </div>
                <div className="w-full flex-1 bg-white dark:bg-slate-200 relative z-0 transition-colors">
                  <iframe 
                    src="https://oavv.segemar.gob.ar/monitoreo-volcanico/" 
                    width="100%" 
                    height="100%" 
                    frameBorder="0" 
                    title="Observatorio Volcánico"
                    className="transition-opacity" 
                  />
                </div>
              </div>

            </div>

          </div>
        )}
      </section>

    </main>
  );
}
