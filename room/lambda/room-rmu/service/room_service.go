package service

import (
	"context"
	"fmt"
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

	// since this process needs to update multipe records, some times data (user status) conflict is happend
	// that's why this process attempts multiple times update the records when update by transaction is failed.
	const MAX_RETRY_COUNT = 3
	retry_count := 0
	for retry_count < MAX_RETRY_COUNT {
		rooms, err := service.repository.FindActiveUsers(context, operation.RoomId)
		if err != nil {
			return err
		}
		log.Printf("Rooms to update users status to CHOOSING: %#v", rooms)

		err = service.repository.UpdateActiveUsersStatus(context, &rooms, choosing)
		if err != nil {
			log.Printf("failed to UpdateActiveUsersStatus by transactional write: %v", err)
			retry_count += 1
		} else {
			break
		}
	}

	if retry_count == MAX_RETRY_COUNT {
		return fmt.Errorf("UpdateActiveUsersStatus was attempted %d times. but all of them were failed", MAX_RETRY_COUNT)
	}

	return nil
}
