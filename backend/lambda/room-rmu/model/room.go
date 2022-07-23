package model

import (
	"context"
)

type RoomRepository interface {
	OpenRoom(context context.Context, roomId string, itemKey string, expirationUnixTimestamp int64) error
	SaveUser(context context.Context, room *User, expirationUnixTimestamp int64) error
	FindActiveUsers(context context.Context, roomId string) (*[]User, error)
	UpdateActiveUser(context context.Context, room *User) error
	ExistRoom(context context.Context, roomId string) (bool, error)
	AuthUser(context context.Context, roomId string, userId string, userToken string) error
}
