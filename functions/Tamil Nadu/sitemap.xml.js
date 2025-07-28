export async function onRequest({ request, params }) {
  const state = params.state;

  const STATE_TO_SUBDOMAIN = {
    "Maharashtra": "b",
    "Tamil Nadu":  "b",
    "West Bengal": "b"
  };

  const sub = STATE_TO_SUBDOMAIN[state];
  if (!sub) {
    return new Response('Not Found', { status: 404 });
  }

  const host = request.headers.get('host') || "";
  if (!host.startsWith(sub + '.modlynx.xyz')) {
    return new Response(`Access denied: ${state} sitemap does not belong to ${sub}.modlynx.xyz`, { status: 403 });
  }

  const res = await fetch(request);
  let xml = await res.text();

  // ✅ FIXED REGEX HERE
  xml = xml.replace(/https:\/\/modlynx\.xyz\//g, `https://${sub}.modlynx.xyz/`);

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600'
    }
  });
}
