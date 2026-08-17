// Pilates-Biyori 問い合わせフォーム受信エンドポイント (Cloudflare Pages Functions)
// 必要な環境変数: DISCORD_WEBHOOK_URL (CF Pages ダッシュボード > Settings > Variables and Secrets)
// 公開リポジトリのため、Webhook URLは絶対にコードに書かないこと。

const MENTION_MEDIAXAI = "<@1477147915003760690>";
const MENTION_TOMOMI = "<@1490725600401428551>";

export async function onRequestPost(context) {
  const { request, env } = context;

  let data;
  try {
    data = await request.json();
  } catch {
    return json({ error: "invalid json" }, 400);
  }

  const name = str(data.name, 60);
  const email = str(data.email, 254);
  const company = str(data.company, 100);
  const type = str(data.type, 60);
  const message = str(data.message, 4000);
  const honeypot = str(data.website, 200);

  // honeypotに入力がある=bot。成功を装って捨てる
  if (honeypot) return json({ ok: true }, 200);

  if (!name || !email || !type || !message || message.length < 10) {
    return json({ error: "missing fields" }, 400);
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ error: "invalid email" }, 400);
  }

  if (!env.DISCORD_WEBHOOK_URL) {
    return json({ error: "notification not configured" }, 503);
  }

  const ip = request.headers.get("cf-connecting-ip") || "unknown";
  const country = request.headers.get("cf-ipcountry") || "?";

  const content = [
    `📨 **Pilates-Biyori 問い合わせ** ${MENTION_MEDIAXAI} ${MENTION_TOMOMI}`,
    `**種別:** ${type}`,
    `**お名前:** ${name}${company ? `（${company}）` : ""}`,
    `**メール:** ${email}`,
    `**本文:**`,
    "```",
    message.slice(0, 1500),
    "```",
    `IP: ${ip} (${country})`,
  ].join("\n");

  const res = await fetch(env.DISCORD_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content, allowed_mentions: { users: ["1477147915003760690", "1490725600401428551"] } }),
  });

  if (!res.ok) return json({ error: "notify failed" }, 502);
  return json({ ok: true }, 200);
}

function str(v, max) {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

function json(obj, status) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
