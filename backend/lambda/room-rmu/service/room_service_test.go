package service

import (
	"context"
	"fmt"
	"io/ioutil"
	"os"
	"testing"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambdacontext"
	"github.com/google/logger"
	"github.com/yuizho/salon/room/lambda/room-rmu/model"
)

const ROOM_ID = "123"
const INACTIVE_ROOM_ID = "999"

type UserId string

const (
	ActiveUserId          = UserId("2")
	KickedUserId          = UserId("1")
	UnAuthenticatedUserId = UserId("9")
)

const DUMMY_ITEM_KEY string = "dummy-item-key"
const DUMMY_EXPIRATION_TIMESTAMP int64 = 100

type DummyRepos struct{}

func (repos *DummyRepos) OpenRoom(context context.Context, roomId string, itemKey string, expirationUnixTimestamp int64) error {
	if roomId != ROOM_ID {
		return fmt.Errorf("room_id error")
	}
	if itemKey != DUMMY_ITEM_KEY {
		return fmt.Errorf("item key error")
	}
	if expirationUnixTimestamp != DUMMY_EXPIRATION_TIMESTAMP {
		return fmt.Errorf("expiration timestamp error")
	}
	return nil
}
func (repos *DummyRepos) SaveUser(context context.Context, user *model.User, expirationUnixTimestamp int64) error {
	return nil
}
func (repos *DummyRepos) FindActiveUsers(context context.Context, roomId string) (*[]model.User, error) {
	if roomId != ROOM_ID {
		return nil, fmt.Errorf("room_id error")
	}
	return &[]model.User{
		{
			RoomId:     ROOM_ID,
			UserId:     string(KickedUserId),
			Status:     model.Status("CHOOSING"),
			OperatedAt: "2022-10-10T13:50:40Z",
		},
		{
			RoomId:     ROOM_ID,
			UserId:     string(ActiveUserId),
			Status:     model.Status("CHOOSING"),
			OperatedAt: "2022-10-10T13:50:40Z",
		},
	}, nil
}
func (repos *DummyRepos) UpdateActiveUser(context context.Context, user *model.User) error {
	if user.UserId == string(UnAuthenticatedUserId) {
		return fmt.Errorf("UpdateActiveUser error")
	}
	return nil
}
func (repos *DummyRepos) ExistRoom(context context.Context, roomId string) (bool, error) {
	if roomId != ROOM_ID {
		return false, nil
	}
	return true, nil
}
func (repos *DummyRepos) UpdateActiveUserOperatedAt(context context.Context, roomId string, userId string, operatedAt string) error {
	if roomId != ROOM_ID {
		return fmt.Errorf("room_id error")
	}
	return nil
}
func (repos *DummyRepos) AuthUser(context context.Context, roomId string, userId string, userToken string) error {
	if userId == string(UnAuthenticatedUserId) {
		return fmt.Errorf("auth error")
	}
	return nil
}

type DummyRoomExpiration struct{}

func (roomExpiration DummyRoomExpiration) GetExpirationTimestamp() int64 {
	return DUMMY_EXPIRATION_TIMESTAMP
}

type DummyItemKeyGenerator struct{}

func (itemKeyGenerator DummyItemKeyGenerator) GenerateItemKey() string {
	return DUMMY_ITEM_KEY
}

func TestMain(m *testing.M) {
	logger.Init("RoomTest", true, false, ioutil.Discard)
	defer logger.Close()
	os.Exit(m.Run())
}

func TestOpenRoom(t *testing.T) {
	input := createActiveUser("OPEN_ROOM")

	err := NewRoomService(&DummyRepos{}, DummyItemKeyGenerator{}, DummyRoomExpiration{}).SaveRoom(
		createContext(),
		*input,
	)

	if err != nil {
		t.Fatalf("failed to open_room: %v", err)
	}
}

func TestJoin(t *testing.T) {
	input := createActiveUser("JOIN")

	err := NewRoomService(&DummyRepos{}, DummyItemKeyGenerator{}, DummyRoomExpiration{}).SaveRoom(
		createContext(),
		*input,
	)

	if err != nil {
		t.Fatalf("failed to open_room: %v", err)
	}
}

func TestJoinToInactiveRoom(t *testing.T) {
	input := make(map[string]events.DynamoDBAttributeValue)
	input["event_id"] = events.NewStringAttribute("9999")
	input["room_id"] = events.NewStringAttribute(INACTIVE_ROOM_ID)
	input["user_id"] = events.NewStringAttribute(string(ActiveUserId))
	input["op_type"] = events.NewStringAttribute("JOIN")
	input["picked_card"] = events.NewNullAttribute()
	input["operated_at"] = events.NewStringAttribute("2022-10-10T13:50:40Z")
	input["user_token"] = events.NewStringAttribute("xxxx")

	err := NewRoomService(&DummyRepos{}, DummyItemKeyGenerator{}, DummyRoomExpiration{}).SaveRoom(
		createContext(),
		input,
	)

	if err == nil {
		t.Fatalf("the room is inactive: %v", err)
	}
}

func TestRefleshPoker(t *testing.T) {
	input := createActiveUser("REFRESH_TABLE")

	err := NewRoomService(&DummyRepos{}, DummyItemKeyGenerator{}, DummyRoomExpiration{}).SaveRoom(
		createContext(),
		*input,
	)

	if err != nil {
		t.Fatalf("failed to update user status: %v", err)
	}
}

func TestPick(t *testing.T) {
	input := createActiveUser("PICK")

	err := NewRoomService(&DummyRepos{}, DummyItemKeyGenerator{}, DummyRoomExpiration{}).SaveRoom(
		createContext(),
		*input,
	)

	if err != nil {
		t.Fatalf("failed to update user status: %v", err)
	}
}

func TestLeave(t *testing.T) {
	input := createActiveUser("LEAVE")

	err := NewRoomService(&DummyRepos{}, DummyItemKeyGenerator{}, DummyRoomExpiration{}).SaveRoom(
		createContext(),
		*input,
	)

	if err != nil {
		t.Fatalf("failed to update user status: %v", err)
	}
}

func TestKick(t *testing.T) {
	input := createActiveUser("KICK")

	err := NewRoomService(&DummyRepos{}, DummyItemKeyGenerator{}, DummyRoomExpiration{}).SaveRoom(
		createContext(),
		*input,
	)

	if err != nil {
		t.Fatalf("failed to update user status: %v", err)
	}
}

func TestUnAuthorizedUserPassedToRefleshPoker(t *testing.T) {
	input := createUnAuthenticatedUser("REFRESH_TABLE")

	err := NewRoomService(&DummyRepos{}, DummyItemKeyGenerator{}, DummyRoomExpiration{}).SaveRoom(
		createContext(),
		*input,
	)

	assertAuthError(t, err)
}

func TestUnAuthorizedUserPassedToLeave(t *testing.T) {
	input := createUnAuthenticatedUser("LEAVE")

	err := NewRoomService(&DummyRepos{}, DummyItemKeyGenerator{}, DummyRoomExpiration{}).SaveRoom(
		createContext(),
		*input,
	)

	assertAuthError(t, err)
}

func TestUnAuthorizedUserPassedToPick(t *testing.T) {
	input := createUnAuthenticatedUser("PICK")

	err := NewRoomService(&DummyRepos{}, DummyItemKeyGenerator{}, DummyRoomExpiration{}).SaveRoom(
		createContext(),
		*input,
	)

	assertAuthError(t, err)
}

func TestUnAuthorizedUserPassedToKick(t *testing.T) {
	input := createUnAuthenticatedUser("KICK")

	err := NewRoomService(&DummyRepos{}, DummyItemKeyGenerator{}, DummyRoomExpiration{}).SaveRoom(
		createContext(),
		*input,
	)

	assertAuthError(t, err)
}

func createContext() context.Context {
	return lambdacontext.NewContext(
		context.TODO(),
		&lambdacontext.LambdaContext{
			AwsRequestID:       "1",
			InvokedFunctionArn: "3",
		},
	)
}

func createActiveUser(opType string) *map[string]events.DynamoDBAttributeValue {
	input := make(map[string]events.DynamoDBAttributeValue)
	input["event_id"] = events.NewStringAttribute("9999")
	input["room_id"] = events.NewStringAttribute(ROOM_ID)
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
	input["room_id"] = events.NewStringAttribute(ROOM_ID)
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
