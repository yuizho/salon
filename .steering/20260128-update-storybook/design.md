# Design

## 実装アプローチ

1.  **自動アップグレードツールの使用**:
    - `npx storybook@latest upgrade` コマンドを使用して、依存関係の更新と設定ファイルのマイグレーションを試みる。
    - これにより、v6 -> v8 へのメジャーバージョンアップに伴う破壊的変更の多くを自動解決する。

2.  **フレームワーク設定の更新**:
    - 現在は `@storybook/react` と webpack5 ビルダーを使用しているが、Next.js プロジェクトであるため `@storybook/nextjs` フレームワークへの移行を検討・適用する（自動マイグレーションで提案される可能性が高い）。

3.  **設定ファイルの修正**:
    - `.storybook/main.js` および `.storybook/preview.js` (v7以降は `preview.tsx` / `main.ts` 推奨だが、まずはjsのままでも可) の手動修正。
    - 特に `stories` のパス定義や、アドオンの設定形式が変更されている可能性があるため確認する。

4.  **依存関係の整理**:
    - 不要になった `webpack5` 関連のパッケージや古いアドオン (`@storybook/addon-postcss` 等の互換性確認) を整理する。

## 影響範囲
- `frontend/package.json` (devDependencies)
- `frontend/.storybook/` 配下の設定ファイル
- コンポーネントのストーリーファイル (API変更があれば)

## リスク
- React 19 対応が Storybook 側で完全でない場合の挙動確認が必要（一般的には対応が進んでいるはず）。
- アドオンの非互換性によるエラー。
