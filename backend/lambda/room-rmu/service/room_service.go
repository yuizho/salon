package service

import (
	"context"
	"fmt"
	"math/rand"
	"time"

	"github.com/aws/aws-lambda-go/events"
	"github.com/google/logger"
	"github.com/oklog/ulid/v2"
	"github.com/yuizho/salon/room/lambda/room-rmu/model"
	"github.com/yuizho/salon/room/lambda/room-rmu/util"
)

type RoomService struct {
	repository model.RoomRepository
}

func NewRoomService(repository model.RoomRepository) *RoomService {
	return &RoomService{repository: repository}
}

func (service *RoomService) SaveRoom(context context.Context, attrs map[string]events.DynamoDBAttributeValue) error {
	operation, err := model.NewOperation(attrs)
	if err != nil {
		return err
	}

	reqId, err := util.GetAWSRequestId(context)
	if err != nil {
		return err
	}

	// TODO: organize logs
	logger.Infof("%s sent Operation %#v", reqId, operation)

	switch operation.OpType {
	case model.OpenRoom:
		return service.openRoom(context, operation)
	case model.Join:
		return service.addUserToRoom(context, operation)
	case model.Leave, model.Pick:
		return service.updateUserStateWithAuth(context, operation)
	case model.RefreshTable:
		return service.refreshPokerTableWithAuth(context, operation)
	case model.Kick:
		return service.kickUserWithAuth(context, operation)
	default:
		return fmt.Errorf("unreachable error")
	}
}

func (service *RoomService) openRoom(context context.Context, operation *model.Operation) error {
	user, err := model.CreateUser(operation)
	if err != nil {
		return err
	}

	reqId, err := util.GetAWSRequestId(context)
	if err != nil {
		return err
	}

	logger.Infof("%s Room to save user state %#v", reqId, user)

	now := time.Now()
	// in 30 min is room expiration
	expirationUnixTimestamp := now.Unix() + (60 * 30)

	err = service.repository.SaveUser(context, user, expirationUnixTimestamp)
	if err != nil {
		return err
	}

	entropy := ulid.Monotonic(rand.New(rand.NewSource(now.UnixNano())), 0)
	itemKey := ulid.MustNew(ulid.Timestamp(now), entropy)

	return service.repository.OpenRoom(context, operation.RoomId, itemKey.String(), expirationUnixTimestamp)
}

func (service *RoomService) addUserToRoom(context context.Context, operation *model.Operation) error {
	user, err := model.CreateUser(operation)
	if err != nil {
		return err
	}

	isActiveRoom, err := service.repository.ExistRoom(context, operation.RoomId)
	if err != nil {
		return err
	}
	if !isActiveRoom {
		return fmt.Errorf("passed roomId is not active: %s", operation.RoomId)
	}

	reqId, err := util.GetAWSRequestId(context)
	if err != nil {
		return err
	}

	logger.Infof("%s Room to save user state %#v", reqId, user)

	now := time.Now()
	// in 30 min is room expiration
	expirationUnixTimestamp := now.Unix() + (60 * 30)

	return service.repository.SaveUser(context, user, expirationUnixTimestamp)
}

func (service *RoomService) updateUserStateWithAuth(context context.Context, operation *model.Operation) error {
	err := service.repository.AuthUser(context, operation.RoomId, operation.UserId, operation.UserToken)
	if err != nil {
		return err
	}

	user, err := model.CreateUser(operation)
	if err != nil {
		return err
	}

	return service.updateActiveUserState(context, user)
}

func (service *RoomService) refreshPokerTableWithAuth(context context.Context, operation *model.Operation) error {
	err := service.repository.AuthUser(context, operation.RoomId, operation.UserId, operation.UserToken)
	if err != nil {
		return err
	}

	users, err := service.repository.FindActiveUsers(context, operation.RoomId)
	if err != nil {
		return err
	}

	// BatchWriteItem cannot specify conditions on individual put and delete requests
	// https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_BatchWriteItem.html
	// that's why call Updateitem here to each item to use condition expression.
	for _, user := range *users {
		err := user.RefreshPokerTable(operation.OperatedAt)
		if err != nil {
			return err
		}
		err = service.updateActiveUserState(context, &user)
		if err != nil {
			return err
		}
	}

	return nil
}

func (service *RoomService) kickUserWithAuth(context context.Context, operation *model.Operation) error {
	err := service.repository.AuthUser(context, operation.RoomId, operation.UserId, operation.UserToken)
	if err != nil {
		return err
	}

	reqId, err := util.GetAWSRequestId(context)
	if err != nil {
		return err
	}

	logger.Infof("%s Room to kick %s by %s", reqId, operation.KickedUserId, operation.UserId)

	// user_token doesn't need to set, because the field in db will not be updated
	return service.updateActiveUserState(context, &model.User{
		RoomId:     operation.RoomId,
		UserId:     operation.KickedUserId,
		Status:     model.StatusLeaved,
		PickedCard: "",
		OperatedAt: operation.OperatedAt,
	})
}

func (service *RoomService) updateActiveUserState(context context.Context, user *model.User) error {
	reqId, err := util.GetAWSRequestId(context)
	if err != nil {
		return err
	}

	logger.Infof("%s Room to update user state %#v", reqId, user)

	return service.repository.UpdateActiveUser(context, user)
}
