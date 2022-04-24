package main

import (
	"io/ioutil"
	"os"

	"github.com/google/logger"
	"github.com/yuizho/salon/room/lambda/mutate-poker/appsync"
	"github.com/yuizho/salon/room/lambda/mutate-poker/service"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
)

var API_URL string = os.Getenv("ROOM_API_URL")
var REGION string = os.Getenv("REGION")

var client *appsync.AppSyncClient

func HandleRequest(request events.DynamoDBEvent) error {
	err := service.HandleRequest(request, client, API_URL, REGION)
	if err != nil {
		return err
	}
	return nil
}

func main() {
	logger.Init("", true, false, ioutil.Discard)
	defer logger.Close()

	client = appsync.NewClient()
	lambda.Start(HandleRequest)
}
