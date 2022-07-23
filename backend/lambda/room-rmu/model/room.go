package model

import (
	"context"
	"math/rand"
	"time"

	"github.com/oklog/ulid/v2"
)

type RoomRepository interface {
	OpenRoom(context context.Context, roomId string, itemKey string, expirationUnixTimestamp int64) error
	SaveUser(context context.Context, room *User, expirationUnixTimestamp int64) error
	FindActiveUsers(context context.Context, roomId string) (*[]User, error)
	UpdateActiveUser(context context.Context, room *User) error
	ExistRoom(context context.Context, roomId string) (bool, error)
	AuthUser(context context.Context, roomId string, userId string, userToken string) error
}

type RoomExpiration interface {
	GetExpirationTimestamp() int64
}

type UnixTimeRoomExpiration struct{}

func (roomExpiration UnixTimeRoomExpiration) GetExpirationTimestamp() int64 {
	now := time.Now()
	// in 30 min is room expiration
	return now.Unix() + (60 * 30)
}

type ItemKeyGenerator interface {
	GenerateItemKey() string
}

type UlIdItemKeyGenerator struct{}

func (ItemKeyGenerator UlIdItemKeyGenerator) GenerateItemKey() string {
	now := time.Now()
	entropy := ulid.Monotonic(rand.New(rand.NewSource(now.UnixNano())), 0)
	ulId := ulid.MustNew(ulid.Timestamp(now), entropy)
	return ulId.String()
}
