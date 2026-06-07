# AGENTS.md

## 概要
開発を進めるうえで遵守すべきルールを定義します。

## プロジェクト構造

```
.
├── backend
│   ├── appsync
│   │   └── room-api
│   │       └── resolvers: AppSyncのマッピングテンプレート
│   ├── lambda: backendのlambdaコード
│   └── lib: aws cdkのコード
├── doc
│   ├── architecture: architectureに関するドキュメント
│   ├── database: database設計に関するドキュメント
│   └── product: RDRAドキュメント
├── frontend
│   ├── components: Reactのコンポーネント
│   ├── graphql: graphqlクライアント
│   ├── hooks: ReactのHooks
│   ├── pages: Next.jsのページ
│   ├── public: 静的ファイル
│   ├── states: 状態管理
│   └── styles: CSS
└── graphql: graphqlのスキーマ
```

## ドキュメント

### 作業単位のドキュメント（`.steering/[YYYYMMDD]-[開発タイトル]/`）

特定の開発作業における「**今回何をするか**」を定義する一時的なステアリングファイル。
作業完了後は参照用として保持されますが、新しい作業では新しいディレクトリを作成します。
ステアリングファイルはあくまで作業のためのメモなのでcommitしないでください。

- **requirements.md** - 今回の作業の要求内容
　- 変更・追加する機能の説明
　- ユーザーストーリー
　- 受け入れ条件
　- 制約事項

- **design.md** - 変更内容の設計
　- 実装アプローチ
　- 変更するコンポーネント
　- データ構造の変更
　- 影響範囲の分析

- **tasklist.md** - タスクリスト
　- 具体的な実装タスク
　- タスクの進捗状況
　- 完了条件

### ステアリングディレクトリの命名規則

```
.steering/[YYYYMMDD]-[開発タイトル]/
```

**例：**
- `.steering/20250103-initial-implementation/`
- `.steering/20250115-add-tag-feature/`
- `.steering/20250120-fix-filter-bug/`
- `.steering/20250201-improve-performance/`


## 開発プロセス

### 計画
- 作業開始前にかならず作業の計画を立ててsteeringドキュメントに残してください。
- 計画の内容は事前にユーザとすり合わせてユーザからの承認を得てから作業してください。
- 計画の内容は細かい作業ごとのTODOリストに落としてください

### 作業
- git worktreeでworktreeを作ってから作業をしてください。
- TODOのリストの作業を一つ終えるごとに完了した旨をユーザに確認してください。
- TODOのリストの作業を一つ終えるごとにコミットを行ってください。

### 検証
- 検証はローカル内でできる範囲で実施してください
- AWSサーバへのデプロイは禁止します

### 初回セットアップ時の手順
#### 1. フォルダ作成
```bash
mkdir -p .steering
```
