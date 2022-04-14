package model

import (
	"errors"

	"github.com/aws/aws-lambda-go/events"
)

type Room struct {
	RoomId     string
	UserId     string
	Status     string
	PickedCard string
	CreatedAt  string
}

func NewRoom(attrs map[string]events.DynamoDBAttributeValue) (*Room, error) {
	// validation
	if attrs["room_id"].IsNull() {
		return nil, errors.New("no room_id")
	}
	if attrs["user_id"].IsNull() {
		return nil, errors.New("no user_id")
	}
	if attrs["status"].IsNull() {
		return nil, errors.New("no status")
	}
	if attrs["created_at"].IsNull() {
		return nil, errors.New("no created_at")
	}

	return &Room{
		RoomId:     attrs["room_id"].String(),
		UserId:     attrs["user_id"].String(),
		Status:     attrs["status"].String(),
		PickedCard: attrs["picked_card"].String(),
		CreatedAt:  attrs["created_at"].String(),
	}, nil
}
