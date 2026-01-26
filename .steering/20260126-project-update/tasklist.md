# Update Plan Task List

## Preparation
- [x] Create steering document
- [x] Create a `chore/update-dependencies` branch

## Backend: Lambda (Go)
### `mutate-user`
- [x] Update `go.mod` go version to 1.21 (or latest supported by AWS Lambda)
- [x] Run `go get -u ./...` to update AWS SDK and other dependencies
- [x] Run `go mod tidy`
- [x] Verify build: `go build .`

### `room-rmu`
- [x] Update `go.mod` go version to 1.21 (or latest supported by AWS Lambda)
- [x] Run `go get -u ./...` to update AWS SDK and other dependencies
- [x] Run `go mod tidy`
- [x] Verify build: `go build .`

## Backend: CDK (TypeScript)
- [x] Update `typescript` to latest stable (v5.x) in `backend/package.json`
- [x] Update `aws-cdk`, `aws-cdk-lib`, `constructs` to latest versions
- [x] Update alpha packages (`@aws-cdk/aws-appsync-alpha`, `@aws-cdk/aws-lambda-go-alpha`) to match `aws-cdk-lib` version
- [x] Update `jest`, `ts-jest`, `ts-node`
- [x] Fix any TypeScript compilation errors resulting from updates
- [x] Fix any CDK breaking changes (check `cdk synth`)
- [x] Run tests: `npm test`

## Frontend (Next.js & React)
- [ ] Update `react` and `react-dom` to latest
- [ ] Update `next` to latest (Check migration guides for 12 -> 13 -> 14)
- [ ] Update `aws-amplify` and `@aws-amplify/api` (Major version migration v4 -> v6 likely needed)
- [ ] Update `tailwindcss` and `postcss`
- [ ] Update `storybook` packages to latest
- [ ] Update dev dependencies (`typescript`, `eslint`, etc.)
- [ ] Fix breaking changes in code
- [ ] Run linting: `npm run lint`
- [ ] Run tests: `npm test`
- [ ] Verify build: `npm run build`

## Root & Tooling
- [ ] Update root `eslint` related packages
- [ ] Update `husky` and `lint-staged`
- [ ] Verify pre-commit hooks

## Final Verification
- [ ] Run full project build
- [ ] Deploy to a dev/sandbox environment (if available) to verify runtime behavior (Optional/Manual)
