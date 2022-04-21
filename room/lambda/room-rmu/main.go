package main

import (
	"fmt"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
)

func HandleRequest(request events.DynamoDBEvent) error {
	fmt.Println("hello!!! this is room-rmu")
	return nil
}

func main() {
	lambda.Start(HandleRequest)
}
