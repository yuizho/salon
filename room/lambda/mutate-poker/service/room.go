package service

import (
	"github.com/google/logger"
	"github.com/yuizho/salon/room/lambda/mutate-poker/appsync"
	"github.com/yuizho/salon/room/lambda/mutate-poker/model"

	"github.com/aws/aws-lambda-go/events"
)

func HandleRequest(request events.DynamoDBEvent, client *appsync.AppSyncClient, apiUrl string, region string) error {
	for _, event := range request.Records {
		if event.EventName == "REMOVE" {
			continue
		}

		room, err := model.NewRoom(event.Change.NewImage)
		if err != nil {
			return err
		}

		logger.Infof("updated Room: %#v", room)

		_, err = appsync.MutateRoomAPI(client, room, apiUrl, region)
		if err != nil {
			return err
		}
	}

	return nil
}
