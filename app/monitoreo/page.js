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

    isAlertActive = !description.toLowerCase().includes("no se han emitido");
  } catch (e) {
    console.error("SMN error:", e);
  }

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

  } catch (e) {
    console.error("INPRES error:", e);
  }

  return { isEvent, description, date };
}

/* ================= SHN XML ================= */
async function getShnData(url) {
  let description = "Sin avisos vigentes.";
  let date = "S/D";
  let isAlert = false;

  try {
    const res = await fetch(url, {
      next: { revalidate: 120 }
    });
    const xml = await res.text();

    const descMatch = xml.match(/<description>(.*?)<\/description>/);
    if (descMatch) {
      description = descMatch[1].replace(/<!\[CDATA\[/g, "").replace(/]]>/g, "").trim();
    }

    const dateMatch = xml.match(/<pubDate>(.*?)<\/pubDate>/);
    if (dateMatch) date = dateMatch[1];

    isAlert = !description.toLowerCase().includes("sin aviso");

  } catch (e) {
    console.error("SHN error:", e);
  }

  return { description, date, isAlert };
}

export default async function PanelAlertasGenerales() {

  /* ===== PARALELIZACIÓN ===== */
  const [smn, inpres, shnRP, shnCosta] = await Promise.all([
    getSmnAcpData(),
    getInpresData(),
    getShnData('http://www.hidro.gob.ar/RSS/AACrioplarss.asp'),
    getShnData('http://www.hidro.gob.ar/RSS/AACcostarss.asp')
  ]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-4">

      {/* HEADER */}
      <div className="border-b pb-4">
        <h2 className="text-3xl font-bold text-gray-800">Panel de Alertas</h2>
      </div>

      {/* SMN */}
      <div className={`p-4 rounded border-l-4 ${smn.isAlertActive ? 'bg-red-50 border-red-600' : 'bg-green-50 border-green-500'}`}>
        <h3 className="font-bold">SMN - Avisos de Corto Plazo</h3>
        <p className="text-xs">{smn.date}</p>
        <p className="text-sm">{smn.description}</p>
      </div>

      {/* INPRES */}
      <div className={`p-4 rounded border-l-4 ${inpres.isEvent ? 'bg-orange-50 border-orange-500' : 'bg-green-50 border-green-500'}`}>
        <h3 className="font-bold">INPRES - Sismos Sentidos</h3>
        <p className="text-xs">{inpres.date}</p>
        <p className="text-sm">{inpres.description}</p>
      </div>

      {/* SHN RP */}
      <div className={`p-4 rounded border-l-4 ${shnRP.isAlert ? 'bg-red-50 border-red-600' : 'bg-green-50 border-green-500'}`}>
        <h3 className="font-bold">Río de la Plata</h3>
        <p className="text-xs">{shnRP.date}</p>
        <p className="text-sm">{shnRP.description}</p>
      </div>

      {/* SHN COSTA */}
      <div className={`p-4 rounded border-l-4 ${shnCosta.isAlert ? 'bg-red-50 border-red-600' : 'bg-green-50 border-green-500'}`}>
        <h3 className="font-bold">Costa Bonaerense</h3>
        <p className="text-xs">{shnCosta.date}</p>
        <p className="text-sm">{shnCosta.description}</p>
      </div>

    </div>
  );
}
