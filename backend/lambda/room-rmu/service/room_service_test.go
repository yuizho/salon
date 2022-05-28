package service

import (
	"context"
	"fmt"
	"testing"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambdacontext"
	"github.com/yuizho/salon/room/lambda/room-rmu/model"
)

type TestRepos struct {
}

func (repos *TestRepos) OpenRoom(context context.Context, roomId string, itemKey string, expirationUnixTimestamp int64) error {
	return nil
}

func (repos *TestRepos) SaveUser(context context.Context, room *model.User, expirationUnixTimestamp int64) error {
	return nil
}
func (repos *TestRepos) FindActiveUsers(context context.Context, roomId string) (*[]model.User, error) {
	return &[]model.User{
		{
			RoomId:     "1",
			UserId:     "1",
			Status:     model.Status("CHOOSING"),
			OperatedAt: "2022-10-10T13:50:40Z",
		},
		{
			RoomId:     "1",
			UserId:     "2",
			Status:     model.Status("CHOOSING"),
			OperatedAt: "2022-10-10T13:50:40Z",
		},
	}, nil
}
func (repos *TestRepos) UpdateActiveUser(context context.Context, room *model.User) error {
	// part of update is failed
	if room.UserId == "2" {
		return fmt.Errorf("some error")
	}
	return nil
}
func (repos *TestRepos) ExistRoom(context context.Context, roomId string) (bool, error) {
	return true, nil
}
func (repos *TestRepos) UpdateActiveUserOperatedAt(context context.Context, roomId string, userId string, operatedAt string) error {
	return nil
}

func TestRefleshPoker(t *testing.T) {
	input := make(map[string]events.DynamoDBAttributeValue)
	input["event_id"] = events.NewStringAttribute("9999")
	input["room_id"] = events.NewStringAttribute("1")
	input["user_id"] = events.NewStringAttribute("2")
	input["op_type"] = events.NewStringAttribute("REFRESH_TABLE")
	input["picked_card"] = events.NewNullAttribute()
	input["operated_at"] = events.NewStringAttribute("2022-10-10T13:50:40Z")

	err := NewRoomService(&TestRepos{}).SaveRoom(
		lambdacontext.NewContext(
			context.TODO(),
			&lambdacontext.LambdaContext{
				AwsRequestID:       "1",
				InvokedFunctionArn: "3",
			},
		),
		input,
	)

	if err != nil {
		t.Fatalf("failed to update user status: %v", err)
	}
}

func TestUnexpectedUserIdPassedToRefleshPoker(t *testing.T) {
	input := make(map[string]events.DynamoDBAttributeValue)
	input["event_id"] = events.NewStringAttribute("9999")
	input["room_id"] = events.NewStringAttribute("1")
	input["user_id"] = events.NewStringAttribute("3")
	input["op_type"] = events.NewStringAttribute("REFRESH_TABLE")
	input["picked_card"] = events.NewNullAttribute()
	input["operated_at"] = events.NewStringAttribute("2022-10-10T13:50:40Z")

	err := NewRoomService(&TestRepos{}).SaveRoom(
		lambdacontext.NewContext(
			context.TODO(),
			&lambdacontext.LambdaContext{
				AwsRequestID:       "1",
				InvokedFunctionArn: "3",
			},
		),
		input,
	)

	if err == nil {
		t.Fatalf("RefleshPoker is success")
	}
}