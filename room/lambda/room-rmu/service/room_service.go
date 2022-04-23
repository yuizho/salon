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

func (service *RoomService) SaveRoom(attrs map[string]events.DynamoDBAttributeValue, context context.Context) error {
	operation, err := model.NewOperation(attrs)
	if err != nil {
		return err
	}
	log.Printf("Operation: %#v", operation)

	switch operation.OpType {
	case model.RefreshTable:
		// TODO: when opType is refresh_table update all user record of the room
	default:
		return service.saveUserState(operation, context)
	}

	return nil
}

func (service *RoomService) saveUserState(operation *model.Operation, context context.Context) error {
	room, err := model.CreateRoom(operation)
	if err != nil {
		return err
	}
	log.Printf("Room: %#v", room)

	err = service.repository.Save(context, room)
	if err != nil {
		return err
	}

	return nil
}
