package main

import (
	"log"

	"github.com/yuizho/salon/room/lambda/mutate-poker/model"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
)

func HandleRequest(request events.DynamoDBEvent) error {
	for _, event := range request.Records {
		room, err := model.NewRoom(event.Change.NewImage)
		if err != nil {
			log.Fatalf("failed to request to appsync: %v", err)
			return err
		} else {
			log.Printf("Room: %v", room)
		}
	}

	return nil
}

func main() {
	lambda.Start(HandleRequest)
}
