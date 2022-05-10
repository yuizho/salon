package model

import (
	"context"
	"fmt"
)

type RoomRepository interface {
	Save(context context.Context, room *Room) error
	FindActiveUsers(context context.Context, roomId string) (*[]Room, error)
	UpdateActiveUser(context context.Context, room *Room) error
	ExistRoom(context context.Context, roomId string) (bool, error)
}

type Status string

const (
	StatusChoosing = Status("CHOOSING")
	StatusChosen   = Status("CHOSEN")
	StatusLeaved   = Status("LEAVED")
)

func NewStatus(s string) (Status, error) {
	status := Status(s)
	switch status {
	case StatusChoosing, StatusChosen, StatusLeaved:
		return status, nil
	default:
		return "", fmt.Errorf("unexpected status string: %s", s)
	}
}

func (status Status) String() string {
	return string(status)
}

type Room struct {
	RoomId     string `dynamodbav:"room_id" json:"room_id"`
	UserId     string `dynamodbav:"user_id" json:"user_id"`
	Status     Status `dynamodbav:"status" json:"status"`
	PickedCard string `dynamodbav:"picked_card" json:"picked_card"`
	OperatedAt string `dynamodbav:"operated_at" json:"operated_at"`
	JoinedAt   string `dynamodbav:"joined_at" json:"joined_at"`
}

func (room *Room) RefreshPokerTable(operatedAt string) error {
	choosing, err := NewStatus("CHOOSING")
	if err != nil {
		return err
	}

	room.PickedCard = ""
	room.Status = choosing
	room.OperatedAt = operatedAt
	return nil
}
