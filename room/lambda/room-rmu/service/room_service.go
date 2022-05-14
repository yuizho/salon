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

	logger.Infof("%s sent Operation %#v", reqId, operation)

	switch operation.OpType {
	case model.OpenRoom:
		return service.openRoom(context, operation)
	case model.Join:
		return service.addUserToRoom(context, operation)
	case model.Leave, model.Pick:
		return service.updateUserState(context, operation)
	case model.RefreshTable:
		return service.refreshPokerTable(context, operation)
	case model.Heartbeat:
		return service.updateOperatedAt(context, operation)
	case model.Kick:
		return service.kickUser(context, operation)
	default:
		return fmt.Errorf("unreachable error")
	}
}

func (service *RoomService) openRoom(context context.Context, operation *model.Operation) error {
	room, err := model.CreateRoom(operation)
	if err != nil {
		return err
	}

	reqId, err := util.GetAWSRequestId(context)
	if err != nil {
		return err
	}

	logger.Infof("%s Room to save user state %#v", reqId, room)

	return service.repository.Save(context, room)
}

func (service *RoomService) addUserToRoom(context context.Context, operation *model.Operation) error {
	room, err := model.CreateRoom(operation)
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

	logger.Infof("%s Room to save user state %#v", reqId, room)

	return service.repository.Save(context, room)
}

func (service *RoomService) updateUserState(context context.Context, operation *model.Operation) error {
	room, err := model.CreateRoom(operation)
	if err != nil {
		return err
	}

	reqId, err := util.GetAWSRequestId(context)
	if err != nil {
		return err
	}

	logger.Infof("%s Room to update user state %#v", reqId, room)

	return service.repository.UpdateActiveUser(context, room)
}

func (service *RoomService) refreshPokerTable(context context.Context, operation *model.Operation) error {
	rooms, err := service.repository.FindActiveUsers(context, operation.RoomId)
	if err != nil {
		return err
	}

	if !isProperUser(rooms, operation.UserId) {
		return fmt.Errorf("passed user id is not active: %s", operation.UserId)
	}

	reqId, err := util.GetAWSRequestId(context)
	if err != nil {
		return err
	}

	logger.Infof("%s Rooms to update users status to CHOOSING %#v", reqId, rooms)

	// BatchWriteItem cannot specify conditions on individual put and delete requests
	// https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_BatchWriteItem.html
	// that's why call Updateitem here to each item to use condition expression.
	for _, room := range *rooms {
		err := room.RefreshPokerTable(operation.OperatedAt)
		if err != nil {
			return err
		}
		err = service.repository.UpdateActiveUser(context, &room)
		if err != nil {
			logger.Warningf("%s failed to UpdateActiveUserStatus %v", reqId, err)
		}
	}

	return nil
}

func (service *RoomService) updateOperatedAt(context context.Context, operation *model.Operation) error {
	reqId, err := util.GetAWSRequestId(context)
	if err != nil {
		return err
	}

	logger.Infof("%s Room to update operatedAt", reqId)

	return service.repository.UpdateActiveUserOperatedAt(context, operation.RoomId, operation.UserId, operation.OperatedAt)
}

func (service *RoomService) kickUser(context context.Context, operation *model.Operation) error {
	rooms, err := service.repository.FindActiveUsers(context, operation.RoomId)
	if err != nil {
		return err
	}

	if !isProperUser(rooms, operation.UserId) {
		return fmt.Errorf("passed user id is not active: %s", operation.UserId)
	}

	reqId, err := util.GetAWSRequestId(context)
	if err != nil {
		return err
	}

	logger.Infof("%s Room to kick %s by %s", reqId, operation.KickedUserId, operation.UserId)

	return service.updateUserState(context, &model.Operation{
		EventId:    operation.EventId,
		RoomId:     operation.RoomId,
		OpType:     model.OpType("LEAVE"),
		UserId:     operation.KickedUserId,
		OperatedAt: operation.OperatedAt,
	})
}

func isProperUser(rooms *[]model.Room, userId string) bool {
	for _, room := range *rooms {
		if room.UserId == userId {
			return true
		}
	}
	return false
}
