package model

import (
	"context"
	"fmt"
)

type RoomRepository interface {
	Save(context context.Context, room *Room) error
	FindActiveUsers(context context.Context, roomId string) (*[]Room, error)
	UpdateActiveUserStatus(context context.Context, room *Room, status Status) error
}

type Status string

const (
	StatusChoosing = Status("CHOOSING")
	StatusChoosed  = Status("CHOOSED")
	StatusLeaved   = Status("LEAVED")
)

func NewStatus(s string) (Status, error) {
	status := Status(s)
	switch status {
	case StatusChoosing, StatusChoosed, StatusLeaved:
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
}
