export async function GET() {
  try {
    const url = "http://contenidos.inpres.gob.ar/formatos/sentidos.xml";

    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    });

    const text = await res.text();

    return new Response(text, {
      status: 200,
      headers: {
        "Content-Type": "application/xml",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "s-maxage=300"
      }
    });

  } catch (e) {
    return new Response("Error fetching INPRES", { status: 500 });
  }
}
