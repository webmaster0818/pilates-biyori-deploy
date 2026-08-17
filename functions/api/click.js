// 送客クリック計測の受信API。OutboundClickTracker(sendBeacon)からPOSTを受けKVに集計する。
// KVバインディング env.CLICKS が無ければ何もしない(204)＝サイト動作に影響ゼロ。
export async function onRequestPost(context) {
  const { env, request } = context;
  try {
    if (!env.CLICKS) return new Response(null, { status: 204 });
    const { v, p } = await request.json();
    const vendor = String(v || "unknown").slice(0, 24).replace(/[^A-Za-z0-9_-]/g, "");
    const page = String(p || "/").slice(0, 128);
    if (!vendor) return new Response(null, { status: 204 });
    const bump = async (key, ttl) => {
      const cur = parseInt((await env.CLICKS.get(key)) || "0", 10) || 0;
      await env.CLICKS.put(key, String(cur + 1), ttl ? { expirationTtl: ttl } : undefined);
    };
    await bump(`out:${vendor}`);
    await bump(`page:${vendor}:${page}`, 60 * 60 * 24 * 180);
    const today = new Date().toISOString().slice(0, 10);
    await bump(`day:${vendor}:${today}`, 60 * 60 * 24 * 120);
  } catch (e) { /* noop */ }
  return new Response(null, { status: 204 });
}
