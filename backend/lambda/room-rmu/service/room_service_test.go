package service

import (
	"context"
	"fmt"
	"io/ioutil"
	"os"
	"testing"
	"time"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambdacontext"
	"github.com/google/logger"
	"github.com/yuizho/salon/room/lambda/room-rmu/model"
)

type UserId string

const (
	ActiveUserId          = UserId("2")
	KickedUserId          = UserId("1")
	UnAuthenticatedUserId = UserId("9")
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
			UserId:     string(KickedUserId),
			Status:     model.Status("CHOOSING"),
			OperatedAt: "2022-10-10T13:50:40Z",
		},
		{
			RoomId:     "1",
			UserId:     string(ActiveUserId),
			Status:     model.Status("CHOOSING"),
			OperatedAt: "2022-10-10T13:50:40Z",
		},
	}, nil
}
func (repos *TestRepos) UpdateActiveUser(context context.Context, room *model.User) error {
	if room.UserId == string(UnAuthenticatedUserId) {
		fmt.Printf("room: %v", room)
		return fmt.Errorf("UpdateActiveUser error")
	}
	return nil
}
func (repos *TestRepos) ExistRoom(context context.Context, roomId string) (bool, error) {
	return true, nil
}
func (repos *TestRepos) UpdateActiveUserOperatedAt(context context.Context, roomId string, userId string, operatedAt string) error {
	return nil
}
func (repos *TestRepos) AuthUser(context context.Context, roomId string, userId string, userToken string) error {
	if userId == string(UnAuthenticatedUserId) {
		return fmt.Errorf("auth error")
	}
	return nil
}

func TestMain(m *testing.M) {
	logger.Init("RoomTest", true, false, ioutil.Discard)
	defer logger.Close()
	os.Exit(m.Run())
}

func TestRefleshPoker(t *testing.T) {
	input := createActiveUser("REFRESH_TABLE")

	err := NewRoomService(&TestRepos{}, time.Now()).SaveRoom(
		lambdacontext.NewContext(
			context.TODO(),
			&lambdacontext.LambdaContext{
				AwsRequestID:       "1",
				InvokedFunctionArn: "3",
			},
		),
		*input,
	)

	if err != nil {
		t.Fatalf("failed to update user status: %v", err)
	}
}

func TestPick(t *testing.T) {
	input := createActiveUser("PICK")

	err := NewRoomService(&TestRepos{}, time.Now()).SaveRoom(
		lambdacontext.NewContext(
			context.TODO(),
			&lambdacontext.LambdaContext{
				AwsRequestID:       "1",
				InvokedFunctionArn: "3",
			},
		),
		*input,
	)

	if err != nil {
		t.Fatalf("failed to update user status: %v", err)
	}
}

func TestLeave(t *testing.T) {
	input := createActiveUser("LEAVE")

	err := NewRoomService(&TestRepos{}, time.Now()).SaveRoom(
		lambdacontext.NewContext(
			context.TODO(),
			&lambdacontext.LambdaContext{
				AwsRequestID:       "1",
				InvokedFunctionArn: "3",
			},
		),
		*input,
	)

	if err != nil {
		t.Fatalf("failed to update user status: %v", err)
	}
}

func TestKick(t *testing.T) {
	input := createActiveUser("KICK")

	err := NewRoomService(&TestRepos{}, time.Now()).SaveRoom(
		lambdacontext.NewContext(
			context.TODO(),
			&lambdacontext.LambdaContext{
				AwsRequestID:       "1",
				InvokedFunctionArn: "3",
			},
		),
		*input,
	)

	if err != nil {
		t.Fatalf("failed to update user status: %v", err)
	}
}

func TestUnAuthorizedUserPassedToRefleshPoker(t *testing.T) {
	input := createUnAuthenticatedUser("REFRESH_TABLE")

	err := NewRoomService(&TestRepos{}, time.Now()).SaveRoom(
		lambdacontext.NewContext(
			context.TODO(),
			&lambdacontext.LambdaContext{
				AwsRequestID:       "1",
				InvokedFunctionArn: "3",
			},
		),
		*input,
	)

	assertAuthError(t, err)
}

func TestUnAuthorizedUserPassedToLeave(t *testing.T) {
	input := createUnAuthenticatedUser("LEAVE")

	err := NewRoomService(&TestRepos{}, time.Now()).SaveRoom(
		lambdacontext.NewContext(
			context.TODO(),
			&lambdacontext.LambdaContext{
				AwsRequestID:       "1",
				InvokedFunctionArn: "3",
			},
		),
		*input,
	)

	assertAuthError(t, err)
}

func TestUnAuthorizedUserPassedToPick(t *testing.T) {
	input := createUnAuthenticatedUser("PICK")

	err := NewRoomService(&TestRepos{}, time.Now()).SaveRoom(
		lambdacontext.NewContext(
			context.TODO(),
			&lambdacontext.LambdaContext{
				AwsRequestID:       "1",
				InvokedFunctionArn: "3",
			},
		),
		*input,
	)

	assertAuthError(t, err)
}

func TestUnAuthorizedUserPassedToKick(t *testing.T) {
	input := createUnAuthenticatedUser("KICK")

	err := NewRoomService(&TestRepos{}, time.Now()).SaveRoom(
		lambdacontext.NewContext(
			context.TODO(),
			&lambdacontext.LambdaContext{
				AwsRequestID:       "1",
				InvokedFunctionArn: "3",
			},
		),
		*input,
	)

	assertAuthError(t, err)
}

func createActiveUser(opType string) *map[string]events.DynamoDBAttributeValue {
	input := make(map[string]events.DynamoDBAttributeValue)
	input["event_id"] = events.NewStringAttribute("9999")
	input["room_id"] = events.NewStringAttribute("1")
	input["user_id"] = events.NewStringAttribute(string(ActiveUserId))
	input["op_type"] = events.NewStringAttribute(opType)
	input["picked_card"] = events.NewNullAttribute()
	input["operated_at"] = events.NewStringAttribute("2022-10-10T13:50:40Z")
	input["user_token"] = events.NewStringAttribute("xxxx")
	return &input
}

func createUnAuthenticatedUser(opType string) *map[string]events.DynamoDBAttributeValue {
	input := make(map[string]events.DynamoDBAttributeValue)
	input["event_id"] = events.NewStringAttribute("9999")
	input["room_id"] = events.NewStringAttribute("1")
	input["user_id"] = events.NewStringAttribute(string(UnAuthenticatedUserId))
	input["op_type"] = events.NewStringAttribute(opType)
	input["picked_card"] = events.NewNullAttribute()
	input["operated_at"] = events.NewStringAttribute("2022-10-10T13:50:40Z")
	input["user_token"] = events.NewStringAttribute("xxxx")
	return &input
}

func assertAuthError(t *testing.T, err error) {
	if err == nil {
		t.Fatalf("RefleshPoker is success")
	}
	if err.Error() != "auth error" {
		t.Fatalf("unexpected error")
	}
}
