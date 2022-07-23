package model

import (
	"fmt"
)

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
	UserToken  string `dynamodbav:"user_token" json:"user_token"`
}

func (user User) Refresh(operatedAt string) *User {
	return &User{
		RoomId:     user.RoomId,
		UserId:     user.UserId,
		Status:     StatusChoosing,
		PickedCard: "",
		OperatedAt: operatedAt,
	}
}

func (user *User) IsActive() bool {
	return user.Status != StatusLeaved
}
