package main

import (
	"context"
	"io/ioutil"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/google/logger"
	"github.com/yuizho/salon/room/lambda/room-rmu/repository"
	"github.com/yuizho/salon/room/lambda/room-rmu/service"
	"github.com/yuizho/salon/room/lambda/room-rmu/util"
)

var client *dynamodb.Client

type lambdaHandlerFunc func(ctx context.Context, request events.DynamoDBEvent) error

func handleError(fn lambdaHandlerFunc) lambdaHandlerFunc {
	return func(ctx context.Context, request events.DynamoDBEvent) error {
		reqId, err := util.GetAWSRequestId(ctx)
		if err != nil {
			return err
		}

		if err := fn(ctx, request); err != nil {
			logger.Errorf("%s %v", reqId, err)
			return err
		}
		return nil
	}
}

func HandleRequest(ctx context.Context, request events.DynamoDBEvent) error {
	roomService := service.NewRoomService(
		repository.NewDynamoRoomRepository(client),
	)

	for _, event := range request.Records {
		if event.EventName == "REMOVE" {
			continue
		}

		err := roomService.SaveRoom(
			ctx,
			event.Change.NewImage,
		)
		if err != nil {
			return err
		}
	}

	return nil
}

func main() {
	logger.Init("RoomRMU", true, false, ioutil.Discard)
	defer logger.Close()

	cfg, err := config.LoadDefaultConfig(context.TODO())
	if err != nil {
		panic(err)
	}
	client = dynamodb.NewFromConfig(cfg)

	lambda.Start(handleError(HandleRequest))
}
