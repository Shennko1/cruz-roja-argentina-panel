const mapHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css" />
      <script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js"></script>
      <style>
        body { margin: 0; padding: 0; font-family: sans-serif; background: #f8fafc; }
        #map { width: 100%; height: 100vh; z-index: 1; }
        .loading { 
          position: absolute; top: 20px; left: 50%; transform: translateX(-50%); 
          z-index: 1000; background: rgba(255, 255, 255, 0.95); padding: 10px 20px; 
          border-radius: 30px; font-weight: bold; box-shadow: 0 4px 15px rgba(0,0,0,0.1); 
          font-size: 12px; color: #1e293b; text-transform: uppercase; border: 1px solid #e2e8f0;
        }
      </style>
    </head>
    <body>
      <div id="loading" class="loading">Iniciando sistema...</div>
      <div id="map"></div>
      
      <script>
        document.addEventListener("DOMContentLoaded", function() {
          var map = L.map('map', { center: [-38.4161, -63.6167], zoom: 5 });

          // Capa Base Gris IGN
          new L.tileLayer('https://wms.ign.gob.ar/geoserver/gwc/service/tms/1.0.0/mapabase_gris@EPSG%3A3857@png/{z}/{x}/{-y}.png', {
            minZoom: 1, maxZoom: 20,
            attribution: 'IGN | Cruz Roja Argentina'
          }).addTo(map);

          // Capa de Provincias y Capitales (La que solicitaste)
          new L.tileLayer.wms('https://wms.ign.gob.ar/geoserver/ows?', {
            layers: 'provincia,capa_capitales',
            format: 'image/png',
            transparent: true,
            opacity: 0.6
          }).addTo(map);

          var layerGroup = L.layerGroup().addTo(map);

          // ... (aquí mantienes exactamente la misma función cargarAlertas y el resto de tu lógica anterior)
          
          function formatearFecha(isoString) { /* tu función existente */ }
          async function cargarAlertas() { /* tu función existente que ya tienes en el Código 1 */ }
          
          cargarAlertas();
          setInterval(cargarAlertas, 900000); 
        });
      </script>
    </body>
    </html>
  `;
