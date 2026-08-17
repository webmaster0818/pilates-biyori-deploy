// 送客クリック集計の読み出しAPI。?token= が env.STATS_TOKEN と一致した時のみ返す。
const VENDOR_NAMES = {
  Z11337L: "URBAN CLASSIC Pilates",
  U11199J: "ELEMENT",
};
export async function onRequestGet(context) {
  const { env, request } = context;
  const headers = { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" };
  const token = new URL(request.url).searchParams.get("token") || "";
  if (!env.STATS_TOKEN || token !== env.STATS_TOKEN) {
    return new Response(JSON.stringify({ ok: false, error: "forbidden" }), { status: 403, headers });
  }
  if (!env.CLICKS) {
    return new Response(JSON.stringify({ ok: false, error: "CLICKS KV未バインド" }), { status: 200, headers });
  }
  const vendors = {}; const pages = {};
  let cursor;
  do {
    const list = await env.CLICKS.list({ cursor });
    for (const k of list.keys) {
      const val = parseInt((await env.CLICKS.get(k.name)) || "0", 10) || 0;
      if (k.name.startsWith("out:")) {
        const v = k.name.slice(4);
        vendors[VENDOR_NAMES[v] || v] = val;
      } else if (k.name.startsWith("page:")) {
        pages[k.name.slice(5)] = val;
      }
    }
    cursor = list.list_complete ? undefined : list.cursor;
  } while (cursor);
  const topPages = Object.fromEntries(Object.entries(pages).sort((a, b) => b[1] - a[1]).slice(0, 30));
  const total = Object.values(vendors).reduce((s, v) => s + v, 0);
  return new Response(JSON.stringify({ ok: true, total_clicks: total, vendors, top_pages: topPages, generated_at: new Date().toISOString() }, null, 2), { status: 200, headers });
}
