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

func (repos *DynamoRoomRepository) FindActiveUsers(context context.Context, roomId string) (*[]model.Room, error) {
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

	return &rooms, nil
}

func (repos *DynamoRoomRepository) UpdateActiveUser(context context.Context, room *model.Room) error {
	_, err := UpdateItem(context, repos.client, &dynamodb.UpdateItemInput{
		TableName: aws.String("room"),
		Key: map[string]types.AttributeValue{
			"room_id": &types.AttributeValueMemberS{Value: room.RoomId},
			"user_id": &types.AttributeValueMemberS{Value: room.UserId},
		},
		UpdateExpression:    aws.String("SET #status = :status, operated_at = :operated_at, picked_card = :picked_card"),
		ConditionExpression: aws.String("attribute_exists(#room_id) AND attribute_exists(#user_id) AND #status <> :condition_status"),
		ExpressionAttributeNames: map[string]string{
			"#room_id": "room_id",
			"#user_id": "user_id",
			"#status":  "status",
		},
		ExpressionAttributeValues: map[string]types.AttributeValue{
			":status":           &types.AttributeValueMemberS{Value: room.Status.String()},
			":operated_at":      &types.AttributeValueMemberS{Value: room.OperatedAt},
			":picked_card":      &types.AttributeValueMemberS{Value: room.PickedCard},
			":condition_status": &types.AttributeValueMemberS{Value: "LEAVED"},
		},
	})

	if err != nil {
		return err
	}

	return nil
}

func (repos *DynamoRoomRepository) UpdateActiveUserOperatedAt(context context.Context, roomId string, userId string, operatedAt string) error {
	_, err := UpdateItem(context, repos.client, &dynamodb.UpdateItemInput{
		TableName: aws.String("room"),
		Key: map[string]types.AttributeValue{
			"room_id": &types.AttributeValueMemberS{Value: roomId},
			"user_id": &types.AttributeValueMemberS{Value: userId},
		},
		UpdateExpression:    aws.String("SET operated_at = :operated_at"),
		ConditionExpression: aws.String("attribute_exists(#room_id) AND attribute_exists(#user_id) AND #status <> :condition_status"),
		ExpressionAttributeNames: map[string]string{
			"#room_id": "room_id",
			"#user_id": "user_id",
			"#status":  "status",
		},
		ExpressionAttributeValues: map[string]types.AttributeValue{
			":operated_at":      &types.AttributeValueMemberS{Value: operatedAt},
			":condition_status": &types.AttributeValueMemberS{Value: "LEAVED"},
		},
	})

	if err != nil {
		return err
	}

	return nil
}

func (repos *DynamoRoomRepository) ExistRoom(context context.Context, roomId string) (bool, error) {
	result, err := Query(context, repos.client, &dynamodb.QueryInput{
		TableName:              aws.String("room"),
		KeyConditionExpression: aws.String("room_id = :room_id"),
		ExpressionAttributeValues: map[string]types.AttributeValue{
			":room_id": &types.AttributeValueMemberS{Value: roomId},
		},
	})
	if err != nil {
		return false, err
	}

	return len(result.Items) > 0, nil
}
