# Okinawa Island Guide

インバウンド向け沖縄観光情報サイト。**島別**に観光記事を提供し、その1コンテンツとして
フェリー欠航予報・欠航時の宿案内（ホテルアフィリエイト）を持つ送客ハブ。

- **入口**: Instagram [@okinawa_ferry_forecast](https://www.instagram.com/okinawa_ferry_forecast/)（欠航予報）
- **収益**: ① 民泊 01_kucha-homestay 送客 ② ホテルアフィリエイト（国内ASP）③ コンサル先施設 03 送客
- **言語**: 英語メイン＋日本語（右上トグル・初回はブラウザ言語で自動判定）
- **技術**: 事前レンダリング済み静的HTML＋軽量JS。ビルド不要・Ruby不要。GitHub Pages にそのまま配信。
- **公開URL**: https://shtkmr714.github.io/okinawa-island-guide/

## サイト構成（島別・拡張前提）

```
/                         トップ（注目の島・最新ガイド・フェリー予報）
/islands/index.html       島一覧（島カードのグリッド）
/islands/zamami.html      島ハブ（島紹介＋key facts＋その島の記事＋宿＋フェリー予報）
   ↑ 今後 aka / tokashiki / ishigaki ... を追加 = ハブを1枚足すだけ
/articles/<slug>.html     個別記事（各記事に島・カテゴリを付与）
/data/posts.json          ★記事マニフェスト（一覧表示の元データ）
/assets/css/style.css     共通スタイル（ブランド配色・明るいトロピカル）
/assets/js/site.js        送客リンク(CONFIG)＋言語切替
/assets/js/articles.js    posts.json から記事カードを自動描画
/assets/img/              写真
/_template_article.html   新規記事のひな形
```

### 記事一覧の自動描画（重要）

記事カードは [`data/posts.json`](data/posts.json) を元に [`assets/js/articles.js`](assets/js/articles.js) が描画する。
HTML側はコンテナを置くだけ：

```html
<div class="grid" data-cards data-limit="6"></div>      <!-- 最新6件（トップ） -->
<div class="grid" data-cards data-island="zamami"></div> <!-- 座間味の記事だけ（島ハブ） -->
```

→ **記事を1本足すと、トップの「最新」と該当する島ハブの両方に自動で出る。**

## 記事の編集・追加方法

### A. 既存記事を編集／情報追加
記事HTMLの `<span class="en">…</span>`（英語）と `<span class="ja">…</span>`（日本語）の
間の文章を書き換えて push。一覧カードの文言は `data/posts.json` の該当エントリを編集。

### B. 新規記事を追加（3ステップ）
1. `_template_article.html` をコピーして `articles/<slug>.html` を作成し、本文を書く。
2. `data/posts.json` にエントリを1つ追加（下記スキーマ）。
3. push。トップ・島ハブに自動反映。

```jsonc
{
  "slug": "zamami-diving",            // = articles/zamami-diving.html
  "islands": ["zamami"],              // 複数可。全島共通は ["all"]
  "category_en": "Zamami · Diving",
  "category_ja": "座間味・ダイビング",
  "title_en": "...", "title_ja": "...",
  "excerpt_en": "...", "excerpt_ja": "...",
  "thumb": "assets/img/xxx.jpg",      // 省略可（省略時は emoji）
  "thumb_class": "t-beach",           // t-ferry / t-beach / t-access（色アクセント）
  "date": "2026-07-01"                // 新しい順に並ぶ
}
```

### C. 新しい島を追加
1. `islands/<island>.html` を作成（`islands/zamami.html` をコピーして中身を差し替え）。
2. その島の記事を `posts.json` に `"islands": ["<island>"]` で追加。
3. `islands/index.html` とトップ `#islands` の島カードを「COMING SOON」から実リンクに。

> 普段は **Claude に「○○の記事を作って／△△を追記して」と頼めば、上記を全部やって push まで完結**します。

## 送客リンクの設定

[`assets/js/site.js`](assets/js/site.js) の `CONFIG` 1か所に集約（現在は `"#"` プレースホルダ）。

```js
const CONFIG = {
  instagram    : "https://www.instagram.com/okinawa_ferry_forecast/",
  hotel_search : "#",  // ② ホテルアフィリエイト（バリューコマースのExpedia/Hotels.com、A8のAgoda 等）
  homestay     : "#",  // ① 民泊 kucha-homestay 予約ページ
  consult      : "#",  // ③ コンサル先施設
};
```

個別ホテルは記事側で `data-aff="hotel" data-href="<実URL>"` で上書き可。
値が `"#"` のリンクはクリックしても遷移しない（誤遷移ガード）。

## デザイン

ブランド配色（明るいトロピカル）：lagoon `#00B4D8` / aqua `#48CAE4` / kerama blue `#0077B6` /
island green `#3FB477` / sand `#FFF7E8` / sun `#FFD54F` / coral `#FF7B54`。
リスク5段階は予報画像と統一（緑→赤）。フォント Manrope（数字）/ Inter（英）/ Noto Sans JP（日）。

## ローカルプレビュー

```powershell
cd C:\Users\shtkm\OneDrive\Claude\02_ferry-forecast\okinawa-island-guide
python -m http.server 4173
# → http://localhost:4173/
```

## カスタムドメインへの切替（後から）

ドメイン取得 → DNS設定 → リポジトリ直下に `CNAME`（中身は `example.com`）追加 →
各HTMLの `<link rel="canonical">` を新ドメインに置換。静的サイトなので baseurl 設定は不要。
