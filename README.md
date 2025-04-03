# 109 Cinemas with Star

109シネマズの映画一覧ページに、映画.comから取得した評価を表示するブラウザ拡張です。

## 利用方法

1. [Actions](https://github.com/yuto-moriizumi/109cinemas-with-star/actions/workflows/validate.yml?query=branch%3Amain)のページを開く
1. ✅緑のチェックマークがついている一番上の実行結果をクリック
1. ページ下部のArtifactsからzipファイルをダウンロードして解凍する
1. Chromeなどで拡張機能の管理ページを開く
1. Load unpackedをクリックし、展開したフォルダを選択する

## 質問や提案

Issuesにおねがいします。https://github.com/yuto-moriizumi/109cinemas-with-star/issues/new

## 開発者向け

### プロジェクト構成

- `packages/api`: バックエンドAPI (Node.js, TypeScript)
- `packages/front`: ブラウザ拡張本体 (React, TypeScript)

### 機能概要

109シネマズの作品一覧ページを開くと、各映画のHTML要素を検出してReactコンポーネントをレンダリングします。タイトルの横に映画.comの評価（星評価）を自動的に表示します。評価情報はバックエンドAPI経由で取得されます。

### 技術スタック

**API (`packages/api`)**

- Node.js
- TypeScript
- Express
- Cheerio (スクレイピング用)
- Serverless Framework (AWS Lambda デプロイ用)
- Vitest (テスト用)

**ブラウザ拡張 (`packages/front`)**

- React
- TypeScript
- Vite
- Chrome Extension Manifest V3
- Vitest (テスト用)

### 前提条件

- Node.js (v18以上推奨)
- pnpm (v10.7.1 またはそれ以降)

### セットアップ

1.  リポジトリをクローンします。
2.  ルートディレクトリで `pnpm install` を実行して依存関係をインストールします。
3.  各パッケージ (`packages/api`, `packages/front`) で必要な設定を行います（例: 環境変数）。
4.  開発サーバーを起動します:
    - API: `cd packages/api && pnpm dev`
    - ブラウザ拡張: `cd packages/front && pnpm dev`
5.  Chromeの拡張機能の管理から、Load unpackedをクリックしてpackages/front/distフォルダを選択

なお、ブラウザはdistが更新されても自動で拡張機能を更新しませんので、ソースを更新したら更新ボタンをクリックしてください。

### Contributions

歓迎します。Issueを作成するか、Pull Requestを送信してください。

### ライセンス

このプロジェクトは MIT ライセンスの下で公開されています。詳細は `LICENSE` ファイルをご覧ください。
