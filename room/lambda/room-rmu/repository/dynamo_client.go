package repository

import (
	"context"

	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
)

type DynamoDBPutAPI interface {
	PutItem(ctx context.Context,
		params *dynamodb.PutItemInput,
		optFns ...func(*dynamodb.Options)) (*dynamodb.PutItemOutput, error)
	Query(ctx context.Context,
		params *dynamodb.QueryInput,
		optFns ...func(*dynamodb.Options)) (*dynamodb.QueryOutput, error)
	TransactWriteItems(ctx context.Context,
		params *dynamodb.TransactWriteItemsInput,
		optFns ...func(*dynamodb.Options)) (*dynamodb.TransactWriteItemsOutput, error)
}

func PutItem(c context.Context, api DynamoDBPutAPI, input *dynamodb.PutItemInput) (*dynamodb.PutItemOutput, error) {
	return api.PutItem(c, input)
}

func Query(c context.Context, api DynamoDBPutAPI, input *dynamodb.QueryInput) (*dynamodb.QueryOutput, error) {
	return api.Query(c, input)
}

func TransactWriteItems(c context.Context, api DynamoDBPutAPI, input *dynamodb.TransactWriteItemsInput) (*dynamodb.TransactWriteItemsOutput, error) {
	return api.TransactWriteItems(c, input)
}
