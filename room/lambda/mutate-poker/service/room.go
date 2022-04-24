package service

import (
	"context"

	"github.com/google/logger"
	"github.com/yuizho/salon/room/lambda/mutate-poker/appsync"
	"github.com/yuizho/salon/room/lambda/mutate-poker/model"
	"github.com/yuizho/salon/room/lambda/mutate-poker/util"

	"github.com/aws/aws-lambda-go/events"
)

func HandleRequest(ctx context.Context, request events.DynamoDBEvent, client *appsync.AppSyncClient, apiUrl string, region string) error {
	for _, event := range request.Records {
		if event.EventName == "REMOVE" {
			continue
		}

		room, err := model.NewRoom(event.Change.NewImage)
		if err != nil {
			return err
		}

		reqId, err := util.GetAWSRequestId(ctx)
		if err != nil {
			return err
		}

		logger.Infof("%s updated Room %#v", reqId, room)

		_, err = appsync.MutateRoomAPI(ctx, client, room, apiUrl, region)
		if err != nil {
			return err
		}
	}

	return nil
}
