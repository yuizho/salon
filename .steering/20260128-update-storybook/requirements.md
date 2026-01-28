# Requirements

## 概要
Storybookのバージョンが古いため（v6.5.5）、最新の安定版（v8系想定）へアップデートを行う。
現在のプロジェクトは React 19 / Next.js 16 を使用しており、これらとの互換性を確保する。

## ユーザーストーリー
- 開発者は最新のStorybook機能を利用してUIコンポーネントの開発・テストができる。
- React 19 / Next.js 16 環境下でStorybookが正常に動作する。

## 受け入れ条件
- `npm run storybook` (または `yarn storybook`) でStorybookが起動すること。
- 既存のストーリーがエラーなく表示されること。
- ビルド (`build-storybook`) が成功すること。

## 制約事項
- `frontend` ディレクトリ内での作業となる。
- 既存の `Recoil` を使用したDecoratorなどは維持する。
