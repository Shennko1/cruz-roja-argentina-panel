async function cargarAlertas() {
  const statusDiv = document.getElementById('loading');
  statusDiv.style.display = 'block';
  statusDiv.innerText = "Conectando al índice...";

  try {
    layerGroup.clearLayers();
    const proxy = 'https://corsproxy.io/?'; 
    const rssUrl = 'https://ssl.smn.gob.ar/CAP/AR.php';
    
    // 1. Obtener índice
    const response = await fetch(proxy + encodeURIComponent(rssUrl));
    const text = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(text, "application/xml");
    const items = xmlDoc.getElementsByTagName("item");

    if (items.length === 0) throw new Error("No hay items en el RSS");

    const links = Array.from(items).map(item => item.getElementsByTagName("link")[0].textContent);
    
    statusDiv.innerText = `Procesando ${links.length} alertas...`;

    const datosParaTabla = [];

    // 2. Procesar cada alerta individual
    for (const link of links) {
      try {
        const res = await fetch(proxy + encodeURIComponent(link));
        const xmlText = await res.text();
        const doc = parser.parseFromString(xmlText, "application/xml");

        // Extraer datos clave
        const event = doc.getElementsByTagName("event")[0]?.textContent || "Alerta";
        const desc = doc.getElementsByTagName("description")[0]?.textContent || "";
        const areaDesc = doc.getElementsByTagName("areaDesc")[0]?.textContent || "";
        const severity = doc.getElementsByTagName("severity")[0]?.textContent || "Moderate";
        const polygon = doc.getElementsByTagName("polygon")[0]?.textContent || "";

        // DEBUG: Mira qué estamos leyendo en consola
        console.log("Leyendo:", event, "AreaDesc:", areaDesc, "Poligono:", polygon.substring(0, 20));

        // Lógica de detección de provincias (si areaDesc está vacío, usamos la descripción)
        const textoBusqueda = (areaDesc + " " + desc).toLowerCase();
        const provsEncontradas = provsDic
            .filter(p => p.c.some(clave => textoBusqueda.includes(clave)))
            .map(p => p.n);

        if (provsEncontradas.length === 0) provsEncontradas.push("Nacional / Otras");

        // 3. Dibujar si hay polígono
        if (polygon) {
            const coords = polygon.trim().split(' ').map(p => p.split(',').reverse().map(Number));
            const color = severity === 'Extreme' ? '#ef4444' : severity === 'Severe' ? '#f97316' : '#eab308';
            
            L.polygon(coords, { color, fillColor: color, fillOpacity: 0.4 }).addTo(layerGroup);
        }

        datosParaTabla.push({ id: link, evento: event, nivel: severity, provincias: provsEncontradas });

      } catch (err) {
        console.error("Error en alerta individual:", link, err);
      }
    }

    window.parent.postMessage({ type: 'CAP_DATA_READY', payload: datosParaTabla }, '*');
    statusDiv.style.display = 'none';

  } catch (error) {
    statusDiv.innerText = "Error: " + error.message;
    console.error(error);
  }
}
