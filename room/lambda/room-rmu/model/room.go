package model

import (
	"context"
	"fmt"
)

type RoomRepository interface {
	SaveUser(context context.Context, room *User) error
	FindActiveUsers(context context.Context, roomId string) (*[]User, error)
	UpdateActiveUser(context context.Context, room *User) error
	UpdateActiveUserOperatedAt(context context.Context, roomId string, userId string, operatedAt string) error
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

type User struct {
	RoomId     string `dynamodbav:"room_id" json:"room_id"`
	UserId     string `dynamodbav:"item_key" json:"item_key"`
	Status     Status `dynamodbav:"status" json:"status"`
	PickedCard string `dynamodbav:"picked_card" json:"picked_card"`
	OperatedAt string `dynamodbav:"operated_at" json:"operated_at"`
}

func (user *User) RefreshPokerTable(operatedAt string) error {
	choosing, err := NewStatus("CHOOSING")
	if err != nil {
		return err
	}

	user.PickedCard = ""
	user.Status = choosing
	user.OperatedAt = operatedAt
	return nil
}
