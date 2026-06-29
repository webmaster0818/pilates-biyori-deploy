// Cloudflare Pages Function: アクセス元の位置情報（CFが無料で付与）を返す。
// 外部APIもキーも不要。現在地に近い都道府県の優先表示に使う。
export function onRequest(context) {
  const cf = (context.request && context.request.cf) || {}
  const body = {
    country: cf.country || null,
    region: cf.region || null,
    regionCode: cf.regionCode || null,
    city: cf.city || null,
    latitude: cf.latitude || null,
    longitude: cf.longitude || null,
  }
  return new Response(JSON.stringify(body), {
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    },
  })
}
