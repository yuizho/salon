package repository

import (
	"context"

	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
)

type DynamoDBPutAPI interface {
	GetItem(ctx context.Context,
		params *dynamodb.GetItemInput,
		optFns ...func(*dynamodb.Options)) (*dynamodb.GetItemOutput, error)
	PutItem(ctx context.Context,
		params *dynamodb.PutItemInput,
		optFns ...func(*dynamodb.Options)) (*dynamodb.PutItemOutput, error)
	Query(ctx context.Context,
		params *dynamodb.QueryInput,
		optFns ...func(*dynamodb.Options)) (*dynamodb.QueryOutput, error)
	UpdateItem(ctx context.Context,
		params *dynamodb.UpdateItemInput,
		optFns ...func(*dynamodb.Options)) (*dynamodb.UpdateItemOutput, error)
}

func GetItem(c context.Context, api DynamoDBPutAPI, input *dynamodb.GetItemInput) (*dynamodb.GetItemOutput, error) {
	return api.GetItem(c, input)
}

func PutItem(c context.Context, api DynamoDBPutAPI, input *dynamodb.PutItemInput) (*dynamodb.PutItemOutput, error) {
	return api.PutItem(c, input)
}

func Query(c context.Context, api DynamoDBPutAPI, input *dynamodb.QueryInput) (*dynamodb.QueryOutput, error) {
	return api.Query(c, input)
}

func UpdateItem(c context.Context, api DynamoDBPutAPI, input *dynamodb.UpdateItemInput) (*dynamodb.UpdateItemOutput, error) {
	return api.UpdateItem(c, input)
}
