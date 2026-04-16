async function getSmnData() {
  let isAlertActive = false;
  let description = "Informacion no disponible en este momento. El equipo se encuentra monitoreando la evolucion de los canales oficiales.";
  let date = "S/D";
  let link = "https://www.smn.gob.ar/alertas";
  let polygons = [];

  try {
    const rssRes = await fetch('https://ssl.smn.gob.ar/feeds/CAP/avisocortoplazo/rss_acpCAP.xml', {
      next: { revalidate: 60 }
    });
    const xmlText = await rssRes.text();

    const pubDateMatch = xmlText.match(/<pubDate>(.*?)<\/pubDate>/);
    if (pubDateMatch) date = pubDateMatch[1];

    const itemMatch = xmlText.match(/<item>([\s\S]*?)<\/item>/);
    if (itemMatch) {
      const descMatch = itemMatch[1].match(/<description>(.*?)<\/description>/);
      if (descMatch) description = descMatch[1].replace("<![CDATA[", "").replace("]]>", "").trim();
      
      const linkMatch = itemMatch[1].match(/<link>(.*?)<\/link>/);
      if (linkMatch) link = linkMatch[1];
    }
    
    isAlertActive = !description.includes('No se han emitido Avisos');
  } catch (e) {
    console.error("Error al procesar el estado general del RSS:", e);
  }

  try {
    const capRes = await fetch('https://ssl.smn.gob.ar/CAP/AR.php', {
      next: { revalidate: 60 }
    });
    const capHtml = await capRes.text();

    const xmlLinks = [];
    const regex = /href=["']?([^"'>]+\.xml)["']?/gi;
    let match;
    while ((match = regex.exec(capHtml)) !== null) {
      xmlLinks.push(match[1]);
    }

    const uniqueLinks = [...new Set(xmlLinks)];

    for (let xmlFile of uniqueLinks) {
      let fileUrl = xmlFile;
      
      // Aquí aplicamos tu descubrimiento de la doble barra
      if (fileUrl.startsWith('//')) {
        fileUrl = 'https:' + fileUrl;
      } else if (!fileUrl.startsWith('http')) {
        fileUrl = fileUrl.replace(/^\.\//, '');
        if (fileUrl.startsWith('/')) {
          fileUrl = 'https://ssl.smn.gob.ar' + fileUrl;
        } else {
          fileUrl = 'https://ssl.smn.gob.ar/CAP/' + fileUrl;
        }
      }

      const fileRes = await fetch(fileUrl);
      const fileText = await fileRes.text();

      const polyMatches = [...fileText.matchAll(/<polygon>(.*?)<\/polygon>/g)];
      for (let p of polyMatches) {
         let rawCoords = p[1].trim().split(/\s+/);
         let leafletCoords = rawCoords.map(coord => {
           let [lat, lon] = coord.split(',');
           return [parseFloat(lat), parseFloat(lon)];
         });
         polygons.push(leafletCoords);
      }
    }
  } catch (e) {
    console.error("Error en el rastreo de poligonos CAP:", e);
  }

  return { isAlertActive, description, date, link, polygons };
}
