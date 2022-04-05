package main

import (
	"context"
	"fmt"
	"os"

	"github.com/aws/aws-lambda-go/lambda"
)

var SAMPLE_PARAM string = os.Getenv("SAMPLE_PARAM")

type MyEvent struct {
	Name string `json:"name"`
}

func HandleRequest(ctx context.Context, name MyEvent) (string, error) {
	return fmt.Sprintf("SampleParam is %s, Hello %s!", SAMPLE_PARAM, name.Name), nil
}

func main() {
	lambda.Start(HandleRequest)
}
