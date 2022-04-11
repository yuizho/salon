package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/aws/aws-lambda-go/lambda"
	graphql "github.com/hasura/go-graphql-client"
)

var SAMPLE_PARAM string = os.Getenv("SAMPLE_PARAM")
var API_URL string = os.Getenv("ROOM_API_URL")
var API_KEY string = os.Getenv("ROOM_API_KEY")

type MyEvent struct {
	Name string `json:"name"`
}

func setAuthHeader(key string) func(req *http.Request) {
	return func(req *http.Request) {
		req.Header.Add("x-api-key", key)
	}
}

func HandleRequest(ctx context.Context, name MyEvent) (string, error) {
	var m struct {
		UpdatePoker struct {
			Room_id graphql.String
			User_id graphql.String
			Status  graphql.String
		} `graphql:"updatePoker(room_id: $room_id, user_id: $user_id, status: $status)" `
	}

	variables := map[string]interface{}{
		"room_id": graphql.String("1"),
		"user_id": graphql.String("1"),
		"status":  graphql.String("updated!!!"),
	}

	client := graphql.NewClient(API_URL, nil).WithRequestModifier(setAuthHeader(API_KEY))

	err := client.Mutate(context.Background(), &m, variables)
	if err != nil {
		log.Fatalf("failed to request to appsync: %v", err)
	}

	return fmt.Sprintf("SampleParam is %s, Hello %s!", SAMPLE_PARAM, name.Name), nil
}

func main() {
	lambda.Start(HandleRequest)
}
