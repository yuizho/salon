# Design

## アプローチ
Goのバージョンアップに伴うCI設定とプロジェクト設定の更新を行う。

## 変更するコンポーネント

### GitHub Actions Workflow
- `.github/workflows/build_backend.yml`
  - `actions/setup-go` の `go-version` を `1.18` から `1.24` に変更する。
  - これにより、`go.mod` で `1.24.0` や `toolchain` ディレクティブが使用されていても、適切なツールチェーンがセットアップされビルドが可能になる。

### Backend (Go Modules)
- `backend/lambda/room-rmu/go.mod`
- `backend/lambda/mutate-user/go.mod`
  - `go` ディレクティブを `1.24.0` に更新する（ユーザの意図に合わせる）。
  - 必要であれば `toolchain` ディレクティブを追加/確認するが、Go 1.21以降は自動管理される側面もあるため、まずはバージョン指定を更新する。

## 影響範囲
- バックエンドのビルドプロセス全体（Lambda関数のビルドとテスト）。
- フロントエンドには影響しない。
