package model

import (
	"testing"

	"github.com/aws/aws-lambda-go/events"
)

func TestNewOperation(t *testing.T) {
	input := make(map[string]events.DynamoDBAttributeValue)
	input["room_id"] = events.NewStringAttribute("1")
	input["user_id"] = events.NewStringAttribute("2")
	input["op_type"] = events.NewStringAttribute("PICKED")
	input["picked_card"] = events.NewStringAttribute("5")
	input["operated_at"] = events.NewStringAttribute("2022-10-10T13:50:40Z")

	actual, err := NewOperation(input)
	if err != nil {
		t.Fatalf("failed to create operation")
	}

	if actual.RoomId != "1" {
		t.Fatalf("unexpected RoomId: %s", actual.RoomId)
	}
	if actual.UserId != "2" {
		t.Fatalf("unexpected UserId: %s", actual.UserId)
	}
	if actual.OpType != "PICKED" {
		t.Fatalf("unexpected OpType: %s", actual.OpType)
	}
	if actual.PickedCard != "5" {
		t.Fatalf("unexpected PickedCard: %s", actual.PickedCard)
	}
	if actual.OperatedAt != "2022-10-10T13:50:40Z" {
		t.Fatalf("unexpected OperatedAt: %s", actual.OperatedAt)
	}
}

func TestNewOperationNoPickedCard(t *testing.T) {
	input := make(map[string]events.DynamoDBAttributeValue)
	input["room_id"] = events.NewStringAttribute("1")
	input["user_id"] = events.NewStringAttribute("2")
	input["op_type"] = events.NewStringAttribute("PICKED")
	input["picked_card"] = events.NewNullAttribute()
	input["operated_at"] = events.NewStringAttribute("2022-10-10T13:50:40Z")

	actual, err := NewOperation(input)
	if err != nil {
		t.Fatalf("failed to create operation")
	}

	if actual.RoomId != "1" {
		t.Fatalf("unexpected RoomId: %s", actual.RoomId)
	}
	if actual.UserId != "2" {
		t.Fatalf("unexpected UserId: %s", actual.UserId)
	}
	if actual.OpType != "PICKED" {
		t.Fatalf("unexpected OpType: %s", actual.OpType)
	}
	if actual.PickedCard != "" {
		t.Fatalf("unexpected PickedCard: %s", actual.PickedCard)
	}
	if actual.OperatedAt != "2022-10-10T13:50:40Z" {
		t.Fatalf("unexpected OperatedAt: %s", actual.OperatedAt)
	}
}

func TestNewOperationNoRoomId(t *testing.T) {
	input := make(map[string]events.DynamoDBAttributeValue)
	input["user_id"] = events.NewStringAttribute("2")
	input["opType"] = events.NewStringAttribute("CHOOSING")
	input["picked_card"] = events.NewStringAttribute("5")
	input["operated_at"] = events.NewStringAttribute("2022-10-10T13:50:40Z")

	_, err := NewOperation(input)
	if err == nil {
		t.Fatalf("failed to validate operation")
	}
}

func TestNewOperationInvalidRoomId(t *testing.T) {
	input := make(map[string]events.DynamoDBAttributeValue)
	input["room_id"] = events.NewStringAttribute("1_")
	input["user_id"] = events.NewStringAttribute("2")
	input["picked_card"] = events.NewStringAttribute("5")
	input["opType"] = events.NewStringAttribute("CHOOSING")
	input["operated_at"] = events.NewStringAttribute("2022-10-10T13:50:40Z")

	_, err := NewOperation(input)
	if err == nil {
		t.Fatalf("failed to validate operation")
	}
}

func TestNewOperationNoUserId(t *testing.T) {
	input := make(map[string]events.DynamoDBAttributeValue)
	input["room_id"] = events.NewStringAttribute("1")
	input["opType"] = events.NewStringAttribute("CHOOSING")
	input["picked_card"] = events.NewStringAttribute("5")
	input["operated_at"] = events.NewStringAttribute("2022-10-10T13:50:40Z")

	_, err := NewOperation(input)
	if err == nil {
		t.Fatalf("failed to validate operation")
	}
}

func TestNewOperationInvalidUserId(t *testing.T) {
	input := make(map[string]events.DynamoDBAttributeValue)
	input["room_id"] = events.NewStringAttribute("1")
	input["user_id"] = events.NewStringAttribute("2_")
	input["picked_card"] = events.NewStringAttribute("5")
	input["opType"] = events.NewStringAttribute("CHOOSING")
	input["operated_at"] = events.NewStringAttribute("2022-10-10T13:50:40Z")

	_, err := NewOperation(input)
	if err == nil {
		t.Fatalf("failed to validate operation")
	}
}

func TestNewOperationNoOpType(t *testing.T) {
	input := make(map[string]events.DynamoDBAttributeValue)
	input["room_id"] = events.NewStringAttribute("1")
	input["user_id"] = events.NewStringAttribute("2")
	input["picked_card"] = events.NewStringAttribute("5")
	input["operated_at"] = events.NewStringAttribute("2022-10-10T13:50:40Z")

	_, err := NewOperation(input)
	if err == nil {
		t.Fatalf("failed to validate operation")
	}
}

func TestNewOperationInvalidOpType(t *testing.T) {
	input := make(map[string]events.DynamoDBAttributeValue)
	input["room_id"] = events.NewStringAttribute("1")
	input["user_id"] = events.NewStringAttribute("2")
	input["picked_card"] = events.NewStringAttribute("5")
	input["opType"] = events.NewStringAttribute("UNEXPECTED")
	input["operated_at"] = events.NewStringAttribute("2022-10-10T13:50:40Z")

	_, err := NewOperation(input)
	if err == nil {
		t.Fatalf("failed to validate operation")
	}
}

func TestNewOperationInvalidPickedCard(t *testing.T) {
	input := make(map[string]events.DynamoDBAttributeValue)
	input["room_id"] = events.NewStringAttribute("1")
	input["user_id"] = events.NewStringAttribute("2")
	input["picked_card"] = events.NewStringAttribute("_")
	input["opType"] = events.NewStringAttribute("CHOOSING")
	input["operated_at"] = events.NewStringAttribute("2022-10-10T13:50:40Z")

	_, err := NewOperation(input)
	if err == nil {
		t.Fatalf("failed to validate operation")
	}
}

func TestNewOperationNoOperatedAt(t *testing.T) {
	input := make(map[string]events.DynamoDBAttributeValue)
	input["room_id"] = events.NewStringAttribute("1")
	input["user_id"] = events.NewStringAttribute("2")
	input["opType"] = events.NewStringAttribute("CHOOSING")
	input["picked_card"] = events.NewStringAttribute("5")

	_, err := NewOperation(input)
	if err == nil {
		t.Fatalf("failed to validate operation")
	}
}

func TestNewOperationInvalidOperatedAt(t *testing.T) {
	input := make(map[string]events.DynamoDBAttributeValue)
	input["room_id"] = events.NewStringAttribute("1")
	input["user_id"] = events.NewStringAttribute("2")
	input["picked_card"] = events.NewStringAttribute("5")
	input["opType"] = events.NewStringAttribute("CHOOSING")
	input["operated_at"] = events.NewStringAttribute("2022-10-10T13:50:40XX")

	_, err := NewOperation(input)
	if err == nil {
		t.Fatalf("failed to validate operation")
	}
}
