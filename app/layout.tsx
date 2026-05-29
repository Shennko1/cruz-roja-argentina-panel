{/* 1. HEADER OPTIMIZADO: Altura reducida a 85px y medidas del logo 100% estáticas */}
          <header className="h-[85px] mb-6 pb-2 border-b-4 border-[#ee3224] flex items-center gap-4">
            
            {/* Contenedor estricto que bloquea a Flexbox */}
            <div className="relative w-[100px] h-[70px] flex-none">
              <Image 
                src="/enmo.jpg" 
                alt="Logo" 
                fill
                sizes="100px"
                className="object-contain" 
                priority 
              />
            </div>
            
            <div>
              <h1 className="text-3xl font-bold text-[#ee3224] leading-none">Equipo Nacional de Monitoreo</h1>
              <p className="text-gray-500 text-sm mt-1 uppercase tracking-wider">Panel de Alerta y Monitoreo de Emergencias</p>
            </div>
          </header>
