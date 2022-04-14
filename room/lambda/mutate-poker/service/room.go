package service

import (
	"fmt"
	"log"

	"github.com/yuizho/salon/room/lambda/mutate-poker/appsync"
	"github.com/yuizho/salon/room/lambda/mutate-poker/model"

	"github.com/aws/aws-lambda-go/events"
)

func HandleRequest(request events.DynamoDBEvent, client *appsync.AppSyncClient, apiUrl string, apiKey string) error {
	for _, event := range request.Records {
		// TODO: handle event
		room, err := model.NewRoom(event.Change.NewImage)
		if err != nil {
			log.Fatalf("failed to parse dynamo db stream event: %v", err)
			return err
		}

		log.Printf("Room: %v", room)

		status, err := mutateRoomAPI(client, room, apiUrl, apiKey)
		if err != nil {
			log.Fatalf("failed to request to appsync: %v", err)
			return err
		}

		fmt.Printf("status: %v\n", status)
	}

	return nil
}

func mutateRoomAPI(client *appsync.AppSyncClient, room *model.Room, apiUrl string, apiKey string) (int, error) {
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
		appsync.Request{
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
