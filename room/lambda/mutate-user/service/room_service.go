package service

import (
	"context"

	"github.com/google/logger"
	"github.com/yuizho/salon/room/lambda/mutate-user/appsync"
	"github.com/yuizho/salon/room/lambda/mutate-user/model"
	"github.com/yuizho/salon/room/lambda/mutate-user/util"

	"github.com/aws/aws-lambda-go/events"
)

func HandleRequest(ctx context.Context, request events.DynamoDBEvent, client *appsync.AppSyncClient, apiUrl string, region string) error {
	for _, event := range request.Records {
		if event.EventName == "REMOVE" {
			continue
		}

		if event.Change.NewImage["item_type"].String() != "USER" {
			continue
		}

		user, err := model.NewUser(event.Change.NewImage)
		if err != nil {
			return err
		}

		reqId, err := util.GetAWSRequestId(ctx)
		if err != nil {
			return err
		}

		logger.Infof("%s updated Room %#v", reqId, user)

		_, err = appsync.MutateRoomAPI(ctx, client, user, apiUrl, region)
		if err != nil {
			return err
		}
	}

	return nil
}
