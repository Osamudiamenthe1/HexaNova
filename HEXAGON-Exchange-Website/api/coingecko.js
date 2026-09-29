export const config = { runtime: 'edge' };

export default async function handler(req) {
  try {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=ngn",
      {
        headers: {
          "Accept": "application/json",
          "User-Agent": "HexagonExchange/1.0 (+https://your-domain.com)",
        },
      }
    );

    const data = await response.text();

    return new Response(data, {
      status: response.status,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=60",
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to fetch rate" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
}
