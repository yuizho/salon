# Salon

Salonはログイン不要の無料Webプランニングポーカーサービスです

## Getting Started
本リポジトリは yarn workspaces を使ってmonorepoで管理しています

### プロジェクト全体でinstall実行
```sh
yarn install
```


### backendをAWSへデプロイ
```sh
yarn workspace salon-backend cdk bootstrap
```

```sh
yarn workspace salon-backend cdk deploy
```

### frontendをローカル起動
```sh
yarn workspace salon-frontend dev
```

## Documents
- [開発前・開発初期に設計について検討したこと(ADR) #1](https://github.com/yuizho/salon/issues/1)
- [RDRA(プロダクト要件整理)ドキュメント](doc/product/rdra.md)
- [Backend Archtecture](doc/architecture/backend_architecture.md)
- [Amazon DynamoDBのテーブル設計](doc/database/database_spec.md)

## Thanks
- [Hero Patterns](https://heropatterns.com/)

## License
MIT
