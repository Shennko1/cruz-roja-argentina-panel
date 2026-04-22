import React from 'react';

export const dynamic = 'force-dynamic';

/* =======================
   SMN (igual que antes)
======================= */
async function getSmnAcpData() {
  let isAlertActive = false;
  let description = "Sin avisos de corto plazo.";
  let date = "S/D";

  const headers = {
    'User-Agent': 'Mozilla/5.0'
  };

  try {
    const rssRes = await fetch('https://ssl.smn.gob.ar/feeds/CAP/avisocortoplazo/rss_acpCAP.xml', { 
      headers, 
      next: { revalidate: 60 } 
    });
    const xmlText = await rssRes.text();

    const pubDateMatch = xmlText.match(/<pubDate>(.*?)<\/pubDate>/);
    if (pubDateMatch) date = pubDateMatch[1];

    const itemMatch = xmlText.match(/<item>([\s\S]*?)<\/item>/);
    if (itemMatch) {
      const descMatch = itemMatch[1].match(/<description>(.*?)<\/description>/);
      if (descMatch) {
        description = descMatch[1]
          .replace(/<!\[CDATA\[/g, "")
          .replace(/]]>/g, "")
          .trim();
      }
    }

    isAlertActive = !description.includes('No se han emitido');
  } catch (e) {
    console.error("SMN error:", e);
  }

  return { isAlertActive, description, date };
}

/* =======================
   INPRES (simplificado)
======================= */
async function getInpresData() {
  let isEvent = false;
  let description = "Sin sismos sentidos reportados recientemente.";
  let date = "S/D";

  try {
    const res = await fetch('http://contenidos.inpres.gob.ar/formatos/sentidos.xml', {
      next: { revalidate: 120 }
    });
    const xml = await res.text();

    const itemMatch = xml.match(/<item>([\s\S]*?)<\/item>/);
    if (itemMatch) {
      const descMatch = itemMatch[1].match(/<description>(.*?)<\/description>/);
      if (descMatch) {
        description = descMatch[1].replace(/<!\[CDATA\[/g, "").replace(/]]>/g, "").trim();
        isEvent = true;
      }
    }

    const pubDateMatch = xml.match(/<pubDate>(.*?)<\/pubDate>/);
    if (pubDateMatch) date = pubDateMatch[1];

  } catch (e) {
    console.error("INPRES error:", e);
  }

  return { isEvent, description, date };
}

export default async function PanelAlertasGenerales() {
  const smn = await getSmnAcpData();
  const inpres = await getInpresData();

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-4">

      {/* HEADER */}
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-3xl font-bold text-gray-800">Panel de Alertas</h2>
      </div>

      {/* ================= SMN ================= */}
      <div className={`p-6 rounded-xl border-l-8 ${smn.isAlertActive ? 'bg-red-50 border-red-600' : 'bg-green-50 border-green-500'}`}>
        <h3 className="font-bold mb-2">SMN - Avisos de Corto Plazo</h3>
        <p className="text-xs mb-2">{smn.date}</p>
        <div className="text-sm">{smn.description}</div>
      </div>

      {/* ================= INPRES ================= */}
      <div className={`p-6 rounded-xl border-l-8 ${inpres.isEvent ? 'bg-orange-50 border-orange-500' : 'bg-gray-50 border-gray-300'}`}>
        <h3 className="font-bold mb-2">INPRES - Sismos Sentidos</h3>
        <p className="text-xs mb-2">{inpres.date}</p>
        <div className="text-sm">{inpres.description}</div>
      </div>

      {/* ================= SHN iframe ================= */}
      <div className="space-y-2">
        <h3 className="font-bold">Avisos Mareológicos</h3>
        <iframe
          src="https://www.hidro.gov.ar/oceanografia/AACRIOPLA.asp"
          className="w-full h-[400px] border rounded"
        />
      </div>

      {/* ================= SHN Twitter ================= */}
      <div className="space-y-2">
        <h3 className="font-bold">SHN - Alertas de Mareas</h3>

        <a className="twitter-timeline" href="https://x.com/SHN_ALERTAS?s=20">
          SHN Alertas
        </a>

        <script async src="https://platform.twitter.com/widgets.js"></script>
      </div>

    </div>
  );
}
