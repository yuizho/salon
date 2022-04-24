package main

import (
	"context"
	"io/ioutil"
	"os"

	"github.com/google/logger"
	"github.com/yuizho/salon/room/lambda/mutate-poker/appsync"
	"github.com/yuizho/salon/room/lambda/mutate-poker/service"
	"github.com/yuizho/salon/room/lambda/mutate-poker/util"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
)

var API_URL string = os.Getenv("ROOM_API_URL")
var REGION string = os.Getenv("REGION")

var client *appsync.AppSyncClient

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
	err := service.HandleRequest(ctx, request, client, API_URL, REGION)
	if err != nil {
		return err
	}
	return nil
}

func main() {
	logger.Init("", true, false, ioutil.Discard)
	defer logger.Close()

	client = appsync.NewClient()
	lambda.Start(handleError(HandleRequest))
}
