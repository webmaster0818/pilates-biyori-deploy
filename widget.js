(function() {
  var s = document.currentScript;
  if (!s) return;
  var box = document.createElement('div');
  box.setAttribute('style', 'box-sizing:border-box;max-width:320px;font-family:-apple-system,\"Hiragino Sans\",\"Noto Sans JP\",sans-serif;border:1px solid #d9c8b8;border-radius:12px;padding:14px 16px;background:linear-gradient(135deg,#fdfaf6,#f6efe6);color:#3d342b;line-height:1.5;');
  box.innerHTML = '<div style="font-size:11px;color:#8a7a68;margin-bottom:4px;">ピラティス料金相場の目安（2026年7月・全国スタジオ独自調査）</div>'
    + '<div style="font-size:21px;font-weight:700;color:#8B7355;">月額中央値 11,220円<span style="font-size:12px;font-weight:400;">（月4回目安）</span></div>'
    + '<div style="font-size:13px;margin-top:2px;">平均 13,679円 ・ 体験無料のスタジオ 61%</div>'
    + '<div style="font-size:11px;margin-top:8px;"><a href="https://biyori-pilates.com/articles/pilates-ryokin-hakusho/" target="_blank" rel="noopener" style="color:#8B7355;text-decoration:underline;">Pilates-Biyori｜全国ピラティス料金白書</a>（毎月更新）</div>'
    + '<div style="font-size:10px;color:#9b8d7e;margin-top:4px;">※当サイト独自調査の掲載情報集計。実際の料金はスタジオ・プランにより異なります。</div>';
  s.parentNode.insertBefore(box, s);
})();
