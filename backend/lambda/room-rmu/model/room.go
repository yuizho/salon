package model

import (
	"context"
	"fmt"
)

type RoomRepository interface {
	OpenRoom(context context.Context, roomId string, itemKey string, expirationUnixTimestamp int64) error
	SaveUser(context context.Context, room *User, expirationUnixTimestamp int64) error
	FindActiveUsers(context context.Context, roomId string) (*[]User, error)
	UpdateActiveUser(context context.Context, room *User) error
	ExistRoom(context context.Context, roomId string) (bool, error)
	AuthUser(context context.Context, roomId string, userId string, userToken string) error
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
	UserToken  string `dynamodbav:"user_token" json:"user_token"`
}

func (user User) RefreshPokerTable(operatedAt string) *User {
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
