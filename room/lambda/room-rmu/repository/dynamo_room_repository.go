package repository

import (
	"context"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/feature/dynamodb/attributevalue"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/yuizho/salon/room/lambda/room-rmu/model"
)

type DynamoRoomRepository struct {
	client DynamoDBPutAPI
}

func NewDynamoRoomRepository(client DynamoDBPutAPI) *DynamoRoomRepository {
	return &DynamoRoomRepository{client: client}
}

func (repos *DynamoRoomRepository) Save(context context.Context, room *model.Room) error {
	roomItem, err := attributevalue.MarshalMap(room)
	if err != nil {
		return err
	}

	_, err = PutItem(context, repos.client, &dynamodb.PutItemInput{
		TableName: aws.String("room"),
		Item:      roomItem,
	})
	if err != nil {
		return err
	}

	return nil
}
