package appsync

import (
	"context"
	"fmt"

	"github.com/yuizho/salon/room/lambda/mutate-user/model"
)

func MutateRoomAPI(ctx context.Context, client *AppSyncClient, room *model.Room, apiUrl string, region string) (int, error) {
	query := fmt.Sprintf(`{
		"query": "mutation ($room_id:String! $status:Status! $user_id:String! $picked_card:String $operated_at:AWSDateTime! $joined_at:AWSDateTime!){updateUser(room_id: $room_id, user_id: $user_id, status: $status, picked_card: $picked_card, operated_at: $operated_at, joined_at: $joined_at){room_id,user_id,status,picked_card,operated_at,joined_at}}",
		"variables": {
			"room_id" :"%s",
			"user_id": "%s",
			"status": "%s",
			"picked_card": "%s",
			"operated_at": "%s",
			"joined_at": "%s"
		}
	}`, room.RoomId, room.UserId, room.Status.String(), room.PickedCard, room.OperatedAt, room.JoinedAt)

	status, err := client.SendRequest(
		ctx,
		Request{
			Url:    apiUrl,
			Region: region,
			Query:  query,
		},
	)
	if err != nil {
		return 0, err
	}
	return status, nil
}
