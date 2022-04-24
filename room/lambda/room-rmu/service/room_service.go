package service

import (
	"context"
	"log"

	"github.com/aws/aws-lambda-go/events"
	"github.com/yuizho/salon/room/lambda/room-rmu/model"
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
	log.Printf("Operation: %#v", operation)

	switch operation.OpType {
	case model.RefreshTable:
		return service.refreshPokerTable(context, operation)
	default:
		return service.saveUserState(context, operation)
	}
}

func (service *RoomService) saveUserState(context context.Context, operation *model.Operation) error {
	room, err := model.CreateRoom(operation)
	if err != nil {
		return err
	}
	log.Printf("Room: %#v", room)

	return service.repository.Save(context, room)
}

func (service *RoomService) refreshPokerTable(context context.Context, operation *model.Operation) error {
	choosing, err := model.NewStatus("CHOOSING")
	if err != nil {
		return err
	}

	rooms, err := service.repository.FindActiveUsers(context, operation.RoomId)
	if err != nil {
		return err
	}
	log.Printf("Rooms to update users status to CHOOSING: %#v", rooms)

	// BatchWriteItem cannot specify conditions on individual put and delete requests
	// https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_BatchWriteItem.html
	// that's why call Updateitem here to each item to use condition expression.
	for _, room := range rooms {
		err = service.repository.UpdateActiveUserStatus(context, &room, choosing)
		if err != nil {
			log.Printf("failed to UpdateActiveUserStatus: %v", err)
		}
	}

	return nil
}
