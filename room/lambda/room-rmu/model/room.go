package model

import "context"

type RoomRepository interface {
	Save(context context.Context, room *Room) error
}

type Room struct {
	RoomId     string `dynamodbav:"room_id" json:"room_id"`
	UserId     string `dynamodbav:"user_id" json:"user_id"`
	Status     string `dynamodbav:"status" json:"status"`
	PickedCard string `dynamodbav:"picked_card" json:"picked_card"`
	CreatedAt  string `dynamodbav:"created_at" json:"created_at"`
}
