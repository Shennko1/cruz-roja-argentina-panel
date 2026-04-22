import React from 'react';

export const dynamic = 'force-dynamic';

/* ================= SMN ================= */
async function getSmnAcpData() {
  let isAlertActive = false;
  let description = "Sin avisos de corto plazo.";
  let date = "S/D";

  try {
    const res = await fetch('https://ssl.smn.gob.ar/feeds/CAP/avisocortoplazo/rss_acpCAP.xml', {
      next: { revalidate: 60 }
    });
    const xml = await res.text();

    const descMatch = xml.match(/<description>(.*?)<\/description>/);
    if (descMatch) {
      description = descMatch[1].replace(/<!\[CDATA\[/g, "").replace(/]]>/g, "").trim();
    }

    const dateMatch = xml.match(/<pubDate>(.*?)<\/pubDate>/);
    if (dateMatch) date = dateMatch[1];

    isAlertActive = !description.includes("No se han emitido");
  } catch {}

  return { isAlertActive, description, date };
}

/* ================= INPRES ================= */
async function getInpresData() {
  let description = "Sin sismos sentidos.";
  let date = "S/D";
  let isEvent = false;

  try {
    const res = await fetch('http://contenidos.inpres.gob.ar/formatos/sentidos.xml', {
      next: { revalidate: 120 }
    });
    const xml = await res.text();

    const descMatch = xml.match(/<description>(.*?)<\/description>/);
    if (descMatch) {
      description = descMatch[1].replace(/<!\[CDATA\[/g, "").replace(/]]>/g, "").trim();
      isEvent = true;
    }

    const dateMatch = xml.match(/<pubDate>(.*?)<\/pubDate>/);
    if (dateMatch) date = dateMatch[1];

  } catch {}

  return { isEvent, description, date };
}

/* ================= CAP (scraping HTML) ================= */
async function getCapData(url: string) {
  let description = "Sin datos.";
  let isAlert = false;

  try {
    const res = await fetch(url, {
      next: { revalidate: 300 }
    });
    const html = await res.text();

    // muy básico: sacar texto del body
    const text = html
      .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    description = text.slice(0, 500); // recorte
    isAlert = !text.toLowerCase().includes("sin aviso");

  } catch {}

  return { description, isAlert };
}

export default async function PanelAlertasGenerales() {
  const smn = await getSmnAcpData();
  const inpres = await getInpresData();
  const capRP = await getCapData('http://www.hidro.gob.ar/cap/CapRP.asp');
  const capCosta = await getCapData('http://www.hidro.gob.ar/cap/CapCosta.asp');

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-4">

      {/* HEADER */}
      <div className="border-b pb-4">
        <h2 className="text-3xl font-bold text-gray-800">Panel de Alertas</h2>
      </div>

      {/* SMN */}
      <div className={`p-4 rounded border-l-4 ${smn.isAlertActive ? 'bg-red-50 border-red-600' : 'bg-green-50 border-green-500'}`}>
        <h3 className="font-bold">SMN</h3>
        <p className="text-xs">{smn.date}</p>
        <p className="text-sm">{smn.description}</p>
      </div>

      {/* INPRES */}
      <div className={`p-4 rounded border-l-4 ${inpres.isEvent ? 'bg-orange-50 border-orange-500' : 'bg-gray-50 border-gray-300'}`}>
        <h3 className="font-bold">INPRES</h3>
        <p className="text-xs">{inpres.date}</p>
        <p className="text-sm">{inpres.description}</p>
      </div>

      {/* CAP RP */}
      <div className={`p-4 rounded border-l-4 ${capRP.isAlert ? 'bg-blue-50 border-blue-500' : 'bg-gray-50 border-gray-300'}`}>
        <h3 className="font-bold">Río de la Plata</h3>
        <p className="text-sm">{capRP.description}</p>
      </div>

      {/* CAP COSTA */}
      <div className={`p-4 rounded border-l-4 ${capCosta.isAlert ? 'bg-blue-50 border-blue-500' : 'bg-gray-50 border-gray-300'}`}>
        <h3 className="font-bold">Costa Bonaerense</h3>
        <p className="text-sm">{capCosta.description}</p>
      </div>

    </div>
  );
}
