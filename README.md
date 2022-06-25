# Salon

Salon はログイン不要の無料 Web プランニングポーカーサービスです

## Getting Started

本リポジトリは yarn workspaces を使って monorepo で管理しています

### プロジェクト全体で install 実行

```sh
yarn install
```

### backend を AWS へデプロイ

```sh
yarn workspace salon-backend cdk bootstrap
```

```sh
yarn workspace salon-backend cdk deploy
```

### frontend をローカル起動

```sh
yarn workspace salon-frontend dev
```

## Documents

- ADR
  - [開発前・開発初期に設計について検討したこと](https://github.com/yuizho/salon/issues/1)
  - [Ph2 の開発時に設計について検討したこと ](https://github.com/yuizho/salon/issues/14)
- [RDRA(プロダクト要件整理)](doc/product/rdra.md)
- [Archtecture](doc/architecture/architecture.md)
- [DynamoDB のテーブル設計](doc/database/database_spec.md)

## Thanks

- [Hero Patterns](https://heropatterns.com/)

## License

MIT
