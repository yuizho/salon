package service

import (
	"context"

	"github.com/yuizho/salon/room/lambda/room-rmu/model"
)

type RoomService struct {
	repository model.RoomRepository
}

func NewRoomService(repository model.RoomRepository) *RoomService {
	return &RoomService{repository: repository}
}

func (service *RoomService) SaveRoom(context context.Context) error {
	err := service.repository.Save(context, model.Room{
		RoomId:    "1",
		UserId:    "3",
		Status:    "LEAVED",
		CreatedAt: "2022-10-10T13:50:40Z",
	})
	if err != nil {
		return nil
	}

	return nil
}
