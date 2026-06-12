export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const url = searchParams.get("url");

    if (!url) {
      return Response.json(
        { error: "Falta parámetro url" },
        { status: 400 }
      );
    }

    const response = await fetch(url, {
      cache: "no-store"
    });

    const text = await response.text();

    return new Response(text, {
      status: 200,
      headers: {
        "Content-Type": "application/xml",
        "Access-Control-Allow-Origin": "*"
      }
    });

  } catch (err) {
    return Response.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
