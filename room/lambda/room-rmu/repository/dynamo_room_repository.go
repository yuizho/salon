package repository

import (
	"context"
	"strconv"

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

func (repos *DynamoRoomRepository) OpenRoom(context context.Context, roomId string, itemKey string, expirationUnixTimestamp int64) error {
	_, err := PutItem(context, repos.client, &dynamodb.PutItemInput{
		TableName: aws.String("room"),
		Item: map[string]types.AttributeValue{
			"room_id":                   &types.AttributeValueMemberS{Value: roomId},
			"item_key":                  &types.AttributeValueMemberS{Value: itemKey},
			"item_type":                 &types.AttributeValueMemberS{Value: "ROOM"},
			"expiration_unix_timestamp": &types.AttributeValueMemberN{Value: strconv.FormatInt(expirationUnixTimestamp, 10)},
		},
	})
	return err
}

func (repos *DynamoRoomRepository) SaveUser(context context.Context, user *model.User, expirationUnixTimestamp int64) error {
	roomItem, err := attributevalue.MarshalMap(user)
	if err != nil {
		return err
	}
	roomItem["item_type"] = &types.AttributeValueMemberS{Value: "USER"}
	roomItem["expiration_unix_timestamp"] = &types.AttributeValueMemberN{Value: strconv.FormatInt(expirationUnixTimestamp, 10)}

	_, err = PutItem(context, repos.client, &dynamodb.PutItemInput{
		TableName: aws.String("room"),
		Item:      roomItem,
	})
	if err != nil {
		return err
	}

	return nil
}

func (repos *DynamoRoomRepository) FindActiveUsers(context context.Context, roomId string) (*[]model.User, error) {
	result, err := Query(context, repos.client, &dynamodb.QueryInput{
		TableName:              aws.String("room"),
		KeyConditionExpression: aws.String("room_id = :room_id"),
		FilterExpression:       aws.String("#status <> :status AND item_type = :item_type"),
		ExpressionAttributeNames: map[string]string{
			"#status": "status",
		},
		ExpressionAttributeValues: map[string]types.AttributeValue{
			":room_id":   &types.AttributeValueMemberS{Value: roomId},
			":status":    &types.AttributeValueMemberS{Value: "LEAVED"},
			":item_type": &types.AttributeValueMemberS{Value: "USER"},
		},
	})
	if err != nil {
		return nil, err
	}

	var rooms []model.User
	for _, item := range result.Items {
		room := model.User{}
		attributevalue.UnmarshalMap(item, &room)
		rooms = append(rooms, room)
	}

	return &rooms, nil
}

func (repos *DynamoRoomRepository) UpdateActiveUser(context context.Context, user *model.User) error {
	_, err := UpdateItem(context, repos.client, &dynamodb.UpdateItemInput{
		TableName: aws.String("room"),
		Key: map[string]types.AttributeValue{
			"room_id":  &types.AttributeValueMemberS{Value: user.RoomId},
			"item_key": &types.AttributeValueMemberS{Value: user.UserId},
		},
		UpdateExpression:    aws.String("SET #status = :status, operated_at = :operated_at, picked_card = :picked_card"),
		ConditionExpression: aws.String("attribute_exists(#room_id) AND attribute_exists(#item_key) AND #status <> :condition_status AND item_type = :item_type"),
		ExpressionAttributeNames: map[string]string{
			"#room_id":  "room_id",
			"#item_key": "item_key",
			"#status":   "status",
		},
		ExpressionAttributeValues: map[string]types.AttributeValue{
			":status":           &types.AttributeValueMemberS{Value: user.Status.String()},
			":operated_at":      &types.AttributeValueMemberS{Value: user.OperatedAt},
			":picked_card":      &types.AttributeValueMemberS{Value: user.PickedCard},
			":condition_status": &types.AttributeValueMemberS{Value: "LEAVED"},
			":item_type":        &types.AttributeValueMemberS{Value: "USER"},
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
		FilterExpression:       aws.String("item_type = :item_type"),
		ExpressionAttributeValues: map[string]types.AttributeValue{
			":room_id":   &types.AttributeValueMemberS{Value: roomId},
			":item_type": &types.AttributeValueMemberS{Value: "ROOM"},
		},
	})
	if err != nil {
		return false, err
	}

	return len(result.Items) > 0, nil
}
