# Okinawa Island Guide

インバウンド向け沖縄観光情報サイト。観光記事を継続追加していき、その1コンテンツとして
フェリー欠航予報・欠航時の宿案内（Booking.com アフィリエイト）を持つ送客ハブ。

- **入口**: Instagram [@okinawa_ferry_forecast](https://www.instagram.com/okinawa_ferry_forecast/)（欠航予報）
- **収益**: ① 民泊 01_kucha-homestay 送客 ② Booking.com アフィリエイト ③ コンサル先施設 03 送客
- **言語**: 英語メイン＋日本語（右上トグル切替・初回はブラウザ言語で自動判定）
- **技術**: 事前レンダリング済み静的HTML。ビルド不要・Ruby不要。GitHub Pages にそのまま配信。

## 構成

```
okinawa-island-guide/
├─ index.html                       # トップ（観光ガイド + フェリー予報の紹介）
├─ articles/
│  ├─ ferry-cancelled-naha-hotels.html   # ★収益の核：欠航→那覇の宿リスト
│  └─ getting-to-kerama.html             # 観光記事サンプル
├─ _template_article.html           # 新規記事のひな形（コピーして使う）
├─ assets/css/style.css             # 共通スタイル（ブランド配色）
├─ assets/js/site.js                # ★送客リンク(CONFIG) + 言語切替（共通）
├─ .nojekyll                        # GitHub Pages の Jekyll 処理を無効化（静的配信）
└─ README.md
```

## ★ 送客リンクの設定（最重要）

外部リンクは [`assets/js/site.js`](assets/js/site.js) の **`CONFIG` 1か所**に集約。
ここを書き換えるだけで全ページ・全記事に反映されます。現在は全て `"#"`（プレースホルダ）。

```js
const CONFIG = {
  instagram : "https://www.instagram.com/okinawa_ferry_forecast/",
  booking_naha_search : "#",  // ② Booking.com 那覇エリアの検索結果ディープリンク
  homestay : "#",             // ① 民泊 予約ページ
  consult  : "#",             // ③ コンサル先施設
};
```

- 値を実URLにすると、該当リンクは自動で有効化され「PLACEHOLDER / LINK TBD」バッジが消えます。
- `"#"` のままのリンクはクリックしても遷移しません（誤遷移ガード）。
- **個別ホテルの実リンク**は記事側の `data-href="..."` で上書き可能（無ければ `booking_naha_search` を使用）。

## 記事の追加手順

1. `_template_article.html` をコピーして `articles/<slug>.html` を作成。
2. 本文の `.en`（英語）/`.ja`（日本語）ブロックを書く。`<title>`・`meta description`・`canonical` を更新。
3. `index.html` の記事グリッド（`<div class="grid">`）にカードを1枚追加してリンク。
4. コミット → push。GitHub Pages が即反映（ビルド待ちなし）。

> 運用メモ：記事執筆は Claude に「このネタで記事書いて」と頼めば、上記形式で生成＋index更新＋push まで実行できます。

## 公開（GitHub Pages）

1. GitHub に新規リポジトリ `okinawa-island-guide`（Public）を作成し、本ディレクトリをpush。
2. Settings → Pages → Source = `main` / root で有効化。
3. 公開URL: `https://shtkmr714.github.io/okinawa-island-guide/`
4. Instagram の bio リンクをこのURLに向ける。

### カスタムドメインへの切替（後から）

1. ドメインを取得し、DNS に GitHub Pages 用レコードを設定。
2. リポジトリ直下に `CNAME` ファイル（中身は `example.com` のみ）を追加。
3. 各HTMLの `<link rel="canonical">` と OGP の絶対URLを新ドメインに置換。
   - 静的サイトなので `baseurl` 設定は不要（相対パスで動作）。

## デザイン

予報画像とブランド統一：ディープブルー `#0D47A1` / ゴールド `#FFD54F` /
リスク5段階 緑`#2E7D32`→淡緑→黄`#F9A825`→橙`#E65100`→赤`#B71C1C`。
フォント Manrope（数字）/ Inter（英）/ Noto Sans JP（日）。

## ローカルプレビュー

```powershell
cd C:\Users\shtkm\OneDrive\Claude\02_ferry-forecast\okinawa-island-guide
python -m http.server 4173
# → http://localhost:4173/ をブラウザで開く
```
