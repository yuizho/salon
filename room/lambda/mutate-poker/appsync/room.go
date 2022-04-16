package appsync

import (
	"fmt"

	"github.com/yuizho/salon/room/lambda/mutate-poker/model"
)

func MutateRoomAPI(client *AppSyncClient, room *model.Room, apiUrl string, apiKey string) (int, error) {
	query := fmt.Sprintf(`{
		"query": "mutation ($room_id:String! $status:String! $user_id:String! $picked_card:String $created_at:AWSDateTime!){updatePoker(room_id: $room_id, user_id: $user_id, status: $status, picked_card: $picked_card, created_at: $created_at){room_id,user_id,status,picked_card,created_at}}",
		"variables": {
			"room_id" :"%s",
			"user_id": "%s",
			"status": "%s",
			"picked_card": "%s",
			"created_at": "%s"
		}
	}`, room.RoomId, room.UserId, room.Status, room.PickedCard, room.CreatedAt)

	status, err := client.SendRequest(
		Request{
			Url:    apiUrl,
			ApiKey: apiKey,
			Query:  query,
		},
	)
	if err != nil {
		return 0, err
	}
	return status, nil
}
