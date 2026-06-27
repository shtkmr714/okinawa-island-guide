/* ============================================================
   Okinawa Island Guide — article list renderer
   data/posts.json を元に、記事カードを自動描画する。
   使い方（HTML側）:
     <div class="grid" data-cards data-limit="6"></div>      … 最新N件
     <div class="grid" data-cards data-island="zamami"></div> … 島で絞り込み
   記事を追加するときは posts.json にエントリを1つ足すだけ。
   ============================================================ */
(function(){
  const containers = document.querySelectorAll('[data-cards]');
  if(!containers.length) return;

  // サイトルートからの相対プレフィックス（/islands/ や /articles/ 配下なら ../）
  const BASE = /\/(islands|articles)\//.test(location.pathname) ? '../' : './';

  fetch(BASE + 'data/posts.json')
    .then(r => r.json())
    .then(posts => {
      posts.sort((a,b) => (a.date < b.date ? 1 : -1)); // 新しい順
      containers.forEach(c => {
        const island = c.getAttribute('data-island');     // "zamami" など。無指定=全件
        const limit  = parseInt(c.getAttribute('data-limit') || '0', 10);
        let list = island
          ? posts.filter(p => p.islands.includes(island) || p.islands.includes('all'))
          : posts;
        if(limit) list = list.slice(0, limit);
        c.innerHTML = list.length
          ? list.map(card).join('')
          : '<p style="color:var(--muted);grid-column:1/-1"><span class="en">More guides coming soon.</span><span class="ja">記事を準備中です。</span></p>';
      });
    })
    .catch(() => {/* オフライン等は静かに無視 */});

  function esc(s){ return String(s).replace(/[&<>"]/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m])); }

  function card(p){
    const cls = p.thumb_class ? ' ' + p.thumb_class : '';
    const thumb = p.thumb
      ? `<div class="thumb"><img src="${BASE + p.thumb}" alt="" loading="lazy"></div>`
      : `<div class="thumb">${p.emoji || '🏝️'}</div>`;
    return `<a class="acard${cls}" href="${BASE}articles/${esc(p.slug)}.html">
      ${thumb}
      <div class="b">
        <span class="ctag"><span class="en">${esc(p.category_en)}</span><span class="ja">${esc(p.category_ja)}</span></span>
        <h3><span class="en">${esc(p.title_en)}</span><span class="ja">${esc(p.title_ja)}</span></h3>
        <p><span class="en">${esc(p.excerpt_en)}</span><span class="ja">${esc(p.excerpt_ja)}</span></p>
        <div class="meta">${esc(p.date)}</div>
      </div></a>`;
  }
})();
