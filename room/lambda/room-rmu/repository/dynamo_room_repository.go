package repository

import (
	"context"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/feature/dynamodb/attributevalue"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
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

func (repos *DynamoRoomRepository) FindActiveUsers(context context.Context, roomId string) ([]model.Room, error) {
	result, err := Query(context, repos.client, &dynamodb.QueryInput{
		TableName:              aws.String("room"),
		KeyConditionExpression: aws.String("room_id = :room_id"),
		FilterExpression:       aws.String("#status <> :status"),
		ExpressionAttributeNames: map[string]string{
			"#status": "status",
		},
		ExpressionAttributeValues: map[string]types.AttributeValue{
			":room_id": &types.AttributeValueMemberS{Value: roomId},
			":status":  &types.AttributeValueMemberS{Value: "LEAVED"},
		},
	})
	if err != nil {
		return nil, err
	}

	var rooms []model.Room
	for _, item := range result.Items {
		room := model.Room{}
		attributevalue.UnmarshalMap(item, &room)
		rooms = append(rooms, room)
	}

	return rooms, nil
}

func (repos *DynamoRoomRepository) UpdateActiveUsersStatus(context context.Context, rooms *[]model.Room, status model.Status) error {
	var requests []types.TransactWriteItem
	for _, room := range *rooms {
		requests = append(requests, types.TransactWriteItem{
			Update: &types.Update{
				TableName: aws.String("room"),
				Key: map[string]types.AttributeValue{
					"room_id": &types.AttributeValueMemberS{Value: room.RoomId},
					"user_id": &types.AttributeValueMemberS{Value: room.UserId},
				},
				UpdateExpression:    aws.String("SET #status = :status, operated_at = :operated_at REMOVE picked_card"),
				ConditionExpression: aws.String("#status <> :condition_status"),
				ExpressionAttributeNames: map[string]string{
					"#status": "status",
				},
				ExpressionAttributeValues: map[string]types.AttributeValue{
					":status":           &types.AttributeValueMemberS{Value: status.String()},
					":operated_at":      &types.AttributeValueMemberS{Value: room.OperatedAt},
					":condition_status": &types.AttributeValueMemberS{Value: "LEAVED"},
				},
			},
		})
	}

	_, err := TransactWriteItems(context, repos.client, &dynamodb.TransactWriteItemsInput{
		TransactItems: requests,
	})

	if err != nil {
		return err
	}

	return nil
}
