import React from 'react';

export const dynamic = 'force-dynamic';

/* ================= UTIL ================= */
function clean(str) {
  return str
    .replace(/<!\[CDATA\[/g, "")
    .replace(/]]>/g, "")
    .replace(/<[^>]+>/g, "")
    .trim();
}

function parseItems(xml) {
  const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)];

  return items.map(item => {
    const content = item[1];

    const title = clean((content.match(/<title>(.*?)<\/title>/) || [])[1] || "");
    const desc = clean((content.match(/<description>(.*?)<\/description>/) || [])[1] || "");
    const date = clean((content.match(/<pubDate>(.*?)<\/pubDate>/) || [])[1] || "");

    return { title, desc, date };
  });
}

/* ================= SMN ================= */
async function getSmnData() {
  try {
    const res = await fetch('https://ssl.smn.gob.ar/feeds/CAP/avisocortoplazo/rss_acpCAP.xml', {
      next: { revalidate: 60 }
    });
    const xml = await res.text();

    const items = parseItems(xml);

    const isAlert = items.length > 0 && !items[0].desc.toLowerCase().includes("no se han emitido");

    return { items, isAlert };
  } catch {
    return { items: [], isAlert: false };
  }
}

/* ================= INPRES ================= */
async function getInpresData() {
  try {
    const res = await fetch('http://contenidos.inpres.gob.ar/formatos/sentidos.xml', {
      next: { revalidate: 120 }
    });
    const xml = await res.text();

    const items = parseItems(xml);

    return { items, isAlert: items.length > 0 };
  } catch {
    return { items: [], isAlert: false };
  }
}

/* ================= SHN ================= */
async function getShnData(url) {
  try {
    const res = await fetch(url, {
      next: { revalidate: 120 }
    });
    const xml = await res.text();

    const items = parseItems(xml);

    const isAlert = items.length > 0 && !items[0].desc.toLowerCase().includes("sin aviso");

    return { items, isAlert };
  } catch {
    return { items: [], isAlert: false };
  }
}

/* ================= COMPONENTE ================= */
function Panel({ title, data }) {
  const alert = data.isAlert;

  return (
    <div className={`p-6 rounded-xl border-l-8 ${alert ? 'bg-red-50 border-red-600' : 'bg-green-50 border-green-500'}`}>
      <h3 className="font-bold mb-4">{title}</h3>

      {data.items.length === 0 && (
        <p className="text-sm text-gray-600">Sin información disponible.</p>
      )}

      <div className="space-y-3">
        {data.items.slice(0, 3).map((item, i) => (
          <div key={i} className="bg-white p-3 rounded border text-sm">
            <p className="font-semibold">{item.title}</p>
            <p className="text-xs text-gray-500">{item.date}</p>
            <p className="mt-1">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ================= PAGE ================= */
export default async function Page() {

  const [smn, inpres, shnRP, shnCosta] = await Promise.all([
    getSmnData(),
    getInpresData(),
    getShnData('http://www.hidro.gob.ar/RSS/AACrioplarss.asp'),
    getShnData('http://www.hidro.gob.ar/RSS/AACcostarss.asp')
  ]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-4">

      <div className="border-b pb-4">
        <h2 className="text-3xl font-bold text-gray-800">Panel de Alertas</h2>
      </div>

      <Panel title="SMN - Avisos de Corto Plazo" data={smn} />

      <Panel title="INPRES - Sismos Sentidos" data={inpres} />

      <Panel title="Río de la Plata - SHN" data={shnRP} />

      <Panel title="Costa Bonaerense - SHN" data={shnCosta} />

    </div>
  );
}
