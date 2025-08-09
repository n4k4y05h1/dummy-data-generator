# Dummy Data Generator

様々な形式のダミーデータを生成するWebアプリケーションです。テスト用データや開発用のサンプルデータを簡単に作成できます。

##  Demo

Visit the live application: https://dummy-data-generator.pages.dev/

## 機能

### データ型

- **基本型**: 文字列、数値、真偽値、日付
- **個人情報**: 氏名、メール、電話番号、住所
- **ビジネス**: 会社名、部署、売上、商品コード、通貨
- **技術**: IPアドレス（IPv4/IPv6）、URL、色
- **地理**: 緯度経度
- **その他**: クレジットカード番号、パーセンテージ

### 出力形式

- JSON
- YAML
- CSV

### 言語

- 日本語
- 英語

### その他

- ドラッグ＆ドロップでフィールド順序変更
- データプレビュー
- クリップボードコピー
- ファイルダウンロード
- レスポンシブデザイン

## 技術スタック

- **フレームワーク**: Next.js 15.4.6
- **言語**: TypeScript
- **UI**: React 19.1.0, Tailwind CSS, shadcn/ui
- **データ生成**: Faker.js
- **アイコン**: Lucide React, Heroicons
- **データ解析**: Papa Parse, js-yaml

## セットアップ

### 必要な環境
- Node.js (推奨: 18.x以上)
- npm / yarn / pnpm / bun

### インストール

```bash
# リポジトリのクローン
git clone https://github.com/n4k4y05h1/dummy-data-generator
cd dummy-generator

# 依存関係のインストール
npm install
# または
yarn install
# または
pnpm install
# または
bun install
```

### 開発サーバーの起動

```bash
npm run dev
# または
yarn dev
# または
pnpm dev
# または
bun dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてアプリケーションを確認してください。

## 使い方

1. **データ定義**: 左側のパネルでフィールドを定義
   - フィールド名を入力
   - データ型を選択
   - 必要に応じてオプションを設定

2. **生成オプション**: 
   - データ件数を指定（デフォルト: 5件）
   - 出力形式を選択（JSON/YAML/CSV）
   - 言語を選択（日本語/英語）

3. **データ生成**: 設定に基づいて自動的にダミーデータが生成されます

4. **データの利用**: 
   - プレビューで内容を確認
   - クリップボードにコピー
   - ファイルとしてダウンロード

## プロダクションビルド

```bash
# ビルド
npm run build
# または
yarn build
# または
pnpm build
# または
bun build

# 本番サーバー起動
npm run start
# または
yarn start
# または
pnpm start
# または
bun start
```

## プロジェクト構造

```text
src/
├── app/                   # Next.js App Router
│   ├── globals.css        # グローバルスタイル
│   ├── layout.tsx         # レイアウトコンポーネント
│   └── page.tsx           # メインページ
├── components/            # UIコンポーネント
│   ├── forms/             # フォーム関連コンポーネント
│   ├── layout/            # レイアウト関連コンポーネント
│   ├── preview/           # プレビュー関連コンポーネント
│   └── ui/                # 基本UIコンポーネント
├── context/               # React Context
├── lib/                   # ユーティリティとロジック
│   ├── formatters/        # データフォーマッター
│   ├── generators/        # データ生成ロジック
│   └── i18n/              # 多言語化
└── types/                 # TypeScript型定義
```

## 開発について

### フィールドタイプの追加

新しいデータ型を追加する場合：

1. `src/types/schema.ts`の`DataType`に新しい型を追加
2. `src/lib/generators/data-generator.ts`の`generateFieldValue`関数にロジックを実装
3. 必要に応じてフォーム部分のUIを更新

### 新しい出力形式の追加

1. `src/types/schema.ts`の`OutputFormat`に形式を追加
2. `src/lib/formatters/data-formatter.ts`に新しいフォーマッター関数を実装
