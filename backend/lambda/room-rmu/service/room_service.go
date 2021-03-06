package service

import (
	"context"
	"fmt"

	"github.com/aws/aws-lambda-go/events"
	"github.com/google/logger"
	"github.com/yuizho/salon/room/lambda/room-rmu/model"
	"github.com/yuizho/salon/room/lambda/room-rmu/util"
)

type RoomService struct {
	repository       model.RoomRepository
	itemKeyGenerator model.ItemKeyGenerator
	roomExpiration   model.RoomExpiration
}

func NewRoomService(
	repository model.RoomRepository,
	itemKeyGenerator model.ItemKeyGenerator,
	roomExpiration model.RoomExpiration,
) *RoomService {
	return &RoomService{
		repository:       repository,
		itemKeyGenerator: itemKeyGenerator,
		roomExpiration:   roomExpiration,
	}
}

func (service RoomService) SaveRoom(context context.Context, attrs map[string]events.DynamoDBAttributeValue) error {
	operation, err := model.NewOperation(attrs)
	if err != nil {
		return err
	}

	reqId, err := util.GetAWSRequestId(context)
	if err != nil {
		return err
	}

	logger.Infof("%s received operation (eventId: %s)", reqId, operation.EventId)

	err = service.authenticateIfNeeded(context, operation)
	if err != nil {
		return err
	}

	switch operation.OpType {
	case model.OpenRoom:
		return service.openRoom(context, operation)
	case model.Join:
		return service.addUserToRoom(context, operation)
	case model.Leave, model.Pick:
		return service.updateUserState(context, operation)
	case model.RefreshTable:
		return service.refreshPoker(context, operation)
	case model.Kick:
		return service.kickUser(context, operation)
	default:
		return fmt.Errorf("unreachable error")
	}
}

func (service RoomService) authenticateIfNeeded(context context.Context, operation *model.Operation) error {
	if operation.NotNeedsAuthentication() {
		return nil
	}
	return service.repository.AuthUser(context, operation.RoomId, operation.UserId, operation.UserToken)
}

func (service RoomService) openRoom(context context.Context, operation *model.Operation) error {
	user, err := model.CreateUser(operation)
	if err != nil {
		return err
	}

	reqId, err := util.GetAWSRequestId(context)
	if err != nil {
		return err
	}

	logger.Infof("%s open room (room_id: %s, user_id: %s)", reqId, user.RoomId, user.UserId)

	expirationUnixTimestamp := service.roomExpiration.GetExpirationTimestamp()

	err = service.repository.SaveUser(
		context,
		user,
		expirationUnixTimestamp,
	)
	if err != nil {
		return err
	}

	return service.repository.OpenRoom(
		context,
		operation.RoomId,
		service.itemKeyGenerator.GenerateItemKey(),
		expirationUnixTimestamp,
	)
}

func (service RoomService) addUserToRoom(context context.Context, operation *model.Operation) error {
	user, err := model.CreateUser(operation)
	if err != nil {
		return err
	}

	isActiveRoom, err := service.repository.ExistRoom(context, operation.RoomId)
	if err != nil {
		return err
	}
	if !isActiveRoom {
		return fmt.Errorf("passed roomId is not active (room_id: %s)", operation.RoomId)
	}

	reqId, err := util.GetAWSRequestId(context)
	if err != nil {
		return err
	}

	logger.Infof("%s add user to room (room_id: %s, user_id: %s)", reqId, user.RoomId, user.UserId)

	return service.repository.SaveUser(
		context,
		user,
		service.roomExpiration.GetExpirationTimestamp(),
	)
}

func (service RoomService) updateUserState(context context.Context, operation *model.Operation) error {
	user, err := model.CreateUser(operation)
	if err != nil {
		return err
	}

	return service.updateActiveUserState(context, user)
}

func (service RoomService) refreshPoker(context context.Context, operation *model.Operation) error {
	users, err := service.repository.FindActiveUsers(context, operation.RoomId)
	if err != nil {
		return err
	}

	reqId, err := util.GetAWSRequestId(context)
	if err != nil {
		return err
	}

	logger.Infof("%s refresh poker (room_id: %s)", reqId, operation.RoomId)

	// BatchWriteItem cannot specify conditions on individual put and delete requests
	// https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_BatchWriteItem.html
	// that's why call Updateitem here to each item to use condition expression.
	for _, user := range *users {
		err = service.updateActiveUserState(
			context,
			user.Refresh(operation.OperatedAt),
		)
		if err != nil {
			return err
		}
	}

	return nil
}

func (service RoomService) kickUser(context context.Context, operation *model.Operation) error {
	reqId, err := util.GetAWSRequestId(context)
	if err != nil {
		return err
	}

	logger.Infof("%s kick user (kicked_user_id: %s, user_id: %s)", reqId, operation.KickedUserId, operation.UserId)

	// user_token doesn't need to set, because the field in db will not be updated
	return service.updateActiveUserState(context, &model.User{
		RoomId:     operation.RoomId,
		UserId:     operation.KickedUserId,
		Status:     model.StatusLeaved,
		PickedCard: "",
		OperatedAt: operation.OperatedAt,
	})
}

func (service RoomService) updateActiveUserState(context context.Context, user *model.User) error {
	reqId, err := util.GetAWSRequestId(context)
	if err != nil {
		return err
	}

	logger.Infof("%s update user state (room_id: %s, user_id: %s)", reqId, user.RoomId, user.UserId)

	return service.repository.UpdateActiveUser(context, user)
}
