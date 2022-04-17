package main

import (
	"os"

	"github.com/yuizho/salon/room/lambda/mutate-poker/appsync"
	"github.com/yuizho/salon/room/lambda/mutate-poker/service"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
)

var API_URL string = os.Getenv("ROOM_API_URL")
var API_KEY string = os.Getenv("ROOM_API_KEY")
var REGION string = os.Getenv("REGION")

var client *appsync.AppSyncClient

func HandleRequest(request events.DynamoDBEvent) error {
	err := service.HandleRequest(request, client, API_URL, API_KEY, REGION)
	if err != nil {
		return err
	}
	return nil
}

func main() {
	client = appsync.NewClient()
	lambda.Start(HandleRequest)
}
