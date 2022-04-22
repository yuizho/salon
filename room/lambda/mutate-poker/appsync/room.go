package appsync

import (
	"fmt"

	"github.com/yuizho/salon/room/lambda/mutate-poker/model"
)

func MutateRoomAPI(client *AppSyncClient, room *model.Room, apiUrl string, region string) (int, error) {
	query := fmt.Sprintf(`{
		"query": "mutation ($room_id:String! $status:Status! $user_id:String! $picked_card:String $operated_at:AWSDateTime!){updatePoker(room_id: $room_id, user_id: $user_id, status: $status, picked_card: $picked_card, operated_at: $operated_at){room_id,user_id,status,picked_card,operated_at}}",
		"variables": {
			"room_id" :"%s",
			"user_id": "%s",
			"status": "%s",
			"picked_card": "%s",
			"operated_at": "%s"
		}
	}`, room.RoomId, room.UserId, room.Status.String(), room.PickedCard, room.OperatedAt)

	status, err := client.SendRequest(
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
