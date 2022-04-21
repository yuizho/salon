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

	// TODO: convert operation to room
	room := model.Room{
		RoomId:    "1",
		UserId:    "3",
		Status:    "LEAVED",
		CreatedAt: "2022-10-10T13:50:40Z",
	}
	log.Printf("Room: %#v", room)

	err = service.repository.Save(context, room)
	if err != nil {
		return err
	}

	return nil
}
