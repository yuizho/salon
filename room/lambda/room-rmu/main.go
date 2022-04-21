package main

import (
	"context"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/yuizho/salon/room/lambda/room-rmu/repository"
	"github.com/yuizho/salon/room/lambda/room-rmu/service"
)

var client *dynamodb.Client

func HandleRequest(request events.DynamoDBEvent) error {
	for _, event := range request.Records {
		if event.EventName == "REMOVE" {
			continue
		}

		err := service.NewRoomService(
			repository.NewDynamoRoomRepository(client),
		).SaveRoom(context.TODO())
		if err != nil {
			return err
		}
	}

	return nil
}

func main() {
	cfg, err := config.LoadDefaultConfig(context.TODO())
	if err != nil {
		panic(err)
	}
	client = dynamodb.NewFromConfig(cfg)

	lambda.Start(HandleRequest)
}
