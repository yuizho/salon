# Update Plan Task List

## Preparation
- [x] Create steering document
- [ ] Create a `chore/update-dependencies` branch

## Backend: Lambda (Go)
### `mutate-user`
- [ ] Update `go.mod` go version to 1.21 (or latest supported by AWS Lambda)
- [ ] Run `go get -u ./...` to update AWS SDK and other dependencies
- [ ] Run `go mod tidy`
- [ ] Verify build: `go build .`

### `room-rmu`
- [ ] Update `go.mod` go version to 1.21 (or latest supported by AWS Lambda)
- [ ] Run `go get -u ./...` to update AWS SDK and other dependencies
- [ ] Run `go mod tidy`
- [ ] Verify build: `go build .`

## Backend: CDK (TypeScript)
- [ ] Update `typescript` to latest stable (v5.x) in `backend/package.json`
- [ ] Update `aws-cdk`, `aws-cdk-lib`, `constructs` to latest versions
- [ ] Update alpha packages (`@aws-cdk/aws-appsync-alpha`, `@aws-cdk/aws-lambda-go-alpha`) to match `aws-cdk-lib` version
- [ ] Update `jest`, `ts-jest`, `ts-node`
- [ ] Fix any TypeScript compilation errors resulting from updates
- [ ] Fix any CDK breaking changes (check `cdk synth`)
- [ ] Run tests: `npm test`

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
