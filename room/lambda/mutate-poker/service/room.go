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
		if event.EventName == "REMOVE" {
			continue
		}

		room, err := model.NewRoom(event.Change.NewImage)
		if err != nil {
			log.Fatalf("failed to parse dynamo db stream event: %v", err)
			return err
		}

		log.Printf("Room: %v", room)

		status, err := appsync.MutateRoomAPI(client, room, apiUrl, apiKey)
		if err != nil {
			log.Fatalf("failed to request to appsync: %v", err)
			return err
		}

		fmt.Printf("status: %v\n", status)
	}

	return nil
}
