/* ============================================================
   Okinawa Island Guide — shared site script
   送客先・アフィリエイトURLはこの CONFIG 1か所だけ書き換えれば
   全ページ・全記事に反映されます。現在は全てプレースホルダ。
   ============================================================ */
const CONFIG = {
  instagram : "https://www.instagram.com/okinawa_ferry_forecast/",

  // ② ホテル予約アフィリエイト（国内ASP：バリューコマースのExpedia/Hotels.com、
  //    A8.netのAgoda 等。Booking.comは国内ASP終了のため非対象）。
  //    個別ホテルの実リンクは記事側の data-href 属性で上書きできます。
  hotel_search : "#",   // 那覇エリアの検索結果（日付つきディープリンク等）

  // ① 民泊 01_kucha-homestay
  homestay : "#",

  // ③ コンサル先施設 03_hospitality-expansion
  consult : "#",
};

(function(){
  /* ---- リンク適用：id 指定 ---- */
  const byId = [
    ["ctaInstagram", CONFIG.instagram],
    ["footInstagram", CONFIG.instagram],
    ["ctaHomestay", CONFIG.homestay],
    ["ctaConsult", CONFIG.consult],
  ];
  byId.forEach(([id,url])=>applyLink(document.getElementById(id), url));

  /* ---- リンク適用：data-aff="hotel" を持つ全要素 ---- */
  document.querySelectorAll('[data-aff="hotel"]').forEach(el=>{
    // 記事側で data-href に個別ホテルリンクがあればそれを優先、無ければ共通の那覇検索
    const url = el.getAttribute("data-href") || CONFIG.hotel_search;
    applyLink(el, url);
  });

  function applyLink(el, url){
    if(!el) return;
    if(url && url !== "#"){
      el.href = url;
      el.classList.remove("ph");
      el.querySelectorAll(".ph-badge").forEach(b=>b.remove());
    }else{
      // 未設定リンクは誤遷移しないようガード（プレースホルダ表示のまま）
      el.addEventListener("click", e=>e.preventDefault());
    }
  }

  /* 残ったプレースホルダ（href="#" の .ph）も誤遷移しないようガード */
  document.querySelectorAll('a.ph[href="#"]').forEach(el=>{
    el.addEventListener("click", e=>e.preventDefault());
  });

  /* ---- 言語切替（英語デフォルト・localStorage 保持） ---- */
  const body = document.body;
  const saved = localStorage.getItem("oig_lang");
  const initial = saved || ((navigator.language||"en").startsWith("ja") ? "ja" : "en");
  setLang(initial);
  const tg = document.getElementById("langToggle");
  if(tg) tg.addEventListener("click", e=>{
    const b = e.target.closest("button"); if(b) setLang(b.dataset.set);
  });
  function setLang(l){
    body.setAttribute("data-lang", l);
    document.documentElement.lang = l;
    localStorage.setItem("oig_lang", l);
    document.querySelectorAll("#langToggle button").forEach(x=>x.classList.toggle("active", x.dataset.set===l));
  }
})();
