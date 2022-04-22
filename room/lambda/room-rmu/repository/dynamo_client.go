package repository

import (
	"context"

	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
)

type DynamoDBPutAPI interface {
	PutItem(ctx context.Context,
		params *dynamodb.PutItemInput,
		optFns ...func(*dynamodb.Options)) (*dynamodb.PutItemOutput, error)
}

func PutItem(c context.Context, api DynamoDBPutAPI, input *dynamodb.PutItemInput) (*dynamodb.PutItemOutput, error) {
	return api.PutItem(c, input)
}
