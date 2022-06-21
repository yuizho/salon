package model

import (
	"testing"

	"github.com/aws/aws-lambda-go/events"
)

func TestNewOperation(t *testing.T) {
	input := make(map[string]events.DynamoDBAttributeValue)
	input["event_id"] = events.NewStringAttribute("9999")
	input["room_id"] = events.NewStringAttribute("1")
	input["user_id"] = events.NewStringAttribute("2")
	input["op_type"] = events.NewStringAttribute("PICK")
	input["picked_card"] = events.NewStringAttribute("5")
	input["operated_at"] = events.NewStringAttribute("2022-10-10T13:50:40Z")
	input["user_token"] = events.NewStringAttribute("xxxx")

	actual, err := NewOperation(input)
	if err != nil {
		t.Fatalf("failed to create operation")
	}

	if actual.EventId != "9999" {
		t.Fatalf("unexpected EventId: %s", actual.RoomId)
	}
	if actual.RoomId != "1" {
		t.Fatalf("unexpected RoomId: %s", actual.RoomId)
	}
	if actual.UserId != "2" {
		t.Fatalf("unexpected UserId: %s", actual.UserId)
	}
	if actual.OpType != "PICK" {
		t.Fatalf("unexpected OpType: %s", actual.OpType)
	}
	if actual.PickedCard != "5" {
		t.Fatalf("unexpected PickedCard: %s", actual.PickedCard)
	}
	if actual.OperatedAt != "2022-10-10T13:50:40Z" {
		t.Fatalf("unexpected OperatedAt: %s", actual.OperatedAt)
	}
	if actual.UserToken != "xxxx" {
		t.Fatalf("unexpected UserToken: %s", actual.UserToken)
	}
}

func TestNewOperationNoPickedCard(t *testing.T) {
	input := make(map[string]events.DynamoDBAttributeValue)
	input["event_id"] = events.NewStringAttribute("9999")
	input["room_id"] = events.NewStringAttribute("1")
	input["user_id"] = events.NewStringAttribute("2")
	input["op_type"] = events.NewStringAttribute("PICK")
	input["picked_card"] = events.NewNullAttribute()
	input["operated_at"] = events.NewStringAttribute("2022-10-10T13:50:40Z")
	input["user_token"] = events.NewStringAttribute("xxxx")

	actual, err := NewOperation(input)
	if err != nil {
		t.Fatalf("failed to create operation")
	}

	if actual.EventId != "9999" {
		t.Fatalf("unexpected EventId: %s", actual.RoomId)
	}
	if actual.RoomId != "1" {
		t.Fatalf("unexpected RoomId: %s", actual.RoomId)
	}
	if actual.UserId != "2" {
		t.Fatalf("unexpected UserId: %s", actual.UserId)
	}
	if actual.OpType != "PICK" {
		t.Fatalf("unexpected OpType: %s", actual.OpType)
	}
	if actual.PickedCard != "" {
		t.Fatalf("unexpected PickedCard: %s", actual.PickedCard)
	}
	if actual.OperatedAt != "2022-10-10T13:50:40Z" {
		t.Fatalf("unexpected OperatedAt: %s", actual.OperatedAt)
	}
	if actual.UserToken != "xxxx" {
		t.Fatalf("unexpected UserToken: %s", actual.UserToken)
	}
}

func TestNewOperationNoEventId(t *testing.T) {
	input := make(map[string]events.DynamoDBAttributeValue)
	input["room_id"] = events.NewStringAttribute("1")
	input["user_id"] = events.NewStringAttribute("2")
	input["op_type"] = events.NewStringAttribute("PICK")
	input["picked_card"] = events.NewStringAttribute("5")
	input["operated_at"] = events.NewStringAttribute("2022-10-10T13:50:40Z")
	input["user_token"] = events.NewStringAttribute("xxxx")

	_, err := NewOperation(input)
	if err == nil {
		t.Fatalf("failed to validate operation")
	}
}

func TestNewOperationInvalidEventId(t *testing.T) {
	input := make(map[string]events.DynamoDBAttributeValue)
	input["event_id"] = events.NewStringAttribute("9_")
	input["room_id"] = events.NewStringAttribute("1")
	input["user_id"] = events.NewStringAttribute("2")
	input["picked_card"] = events.NewStringAttribute("5")
	input["op_type"] = events.NewStringAttribute("PICK")
	input["operated_at"] = events.NewStringAttribute("2022-10-10T13:50:40Z")
	input["user_token"] = events.NewStringAttribute("xxxx")

	_, err := NewOperation(input)
	if err == nil {
		t.Fatalf("failed to validate operation")
	}
}

func TestNewOperationNoRoomId(t *testing.T) {
	input := make(map[string]events.DynamoDBAttributeValue)
	input["event_id"] = events.NewStringAttribute("9999")
	input["user_id"] = events.NewStringAttribute("2")
	input["op_type"] = events.NewStringAttribute("PICK")
	input["picked_card"] = events.NewStringAttribute("5")
	input["operated_at"] = events.NewStringAttribute("2022-10-10T13:50:40Z")
	input["user_token"] = events.NewStringAttribute("xxxx")

	_, err := NewOperation(input)
	if err == nil {
		t.Fatalf("failed to validate operation")
	}
}

func TestNewOperationInvalidRoomId(t *testing.T) {
	input := make(map[string]events.DynamoDBAttributeValue)
	input["event_id"] = events.NewStringAttribute("9999")
	input["room_id"] = events.NewStringAttribute("1_")
	input["user_id"] = events.NewStringAttribute("2")
	input["picked_card"] = events.NewStringAttribute("5")
	input["op_type"] = events.NewStringAttribute("PICK")
	input["operated_at"] = events.NewStringAttribute("2022-10-10T13:50:40Z")
	input["user_token"] = events.NewStringAttribute("xxxx")

	_, err := NewOperation(input)
	if err == nil {
		t.Fatalf("failed to validate operation")
	}
}

func TestNewOperationNoUserId(t *testing.T) {
	input := make(map[string]events.DynamoDBAttributeValue)
	input["event_id"] = events.NewStringAttribute("9999")
	input["room_id"] = events.NewStringAttribute("1")
	input["op_type"] = events.NewStringAttribute("PICK")
	input["picked_card"] = events.NewStringAttribute("5")
	input["operated_at"] = events.NewStringAttribute("2022-10-10T13:50:40Z")
	input["user_token"] = events.NewStringAttribute("xxxx")

	_, err := NewOperation(input)
	if err == nil {
		t.Fatalf("failed to validate operation")
	}
}

func TestNewOperationInvalidUserId(t *testing.T) {
	input := make(map[string]events.DynamoDBAttributeValue)
	input["event_id"] = events.NewStringAttribute("9999")
	input["room_id"] = events.NewStringAttribute("1")
	input["user_id"] = events.NewStringAttribute("2_")
	input["picked_card"] = events.NewStringAttribute("5")
	input["op_type"] = events.NewStringAttribute("PICK")
	input["operated_at"] = events.NewStringAttribute("2022-10-10T13:50:40Z")
	input["user_token"] = events.NewStringAttribute("xxxx")

	_, err := NewOperation(input)
	if err == nil {
		t.Fatalf("failed to validate operation")
	}
}

func TestNewOperationNoOpType(t *testing.T) {
	input := make(map[string]events.DynamoDBAttributeValue)
	input["event_id"] = events.NewStringAttribute("9999")
	input["room_id"] = events.NewStringAttribute("1")
	input["user_id"] = events.NewStringAttribute("2")
	input["picked_card"] = events.NewStringAttribute("5")
	input["operated_at"] = events.NewStringAttribute("2022-10-10T13:50:40Z")
	input["user_token"] = events.NewStringAttribute("xxxx")

	_, err := NewOperation(input)
	if err == nil {
		t.Fatalf("failed to validate operation")
	}
}

func TestNewOperationInvalidOpType(t *testing.T) {
	input := make(map[string]events.DynamoDBAttributeValue)
	input["event_id"] = events.NewStringAttribute("9999")
	input["room_id"] = events.NewStringAttribute("1")
	input["user_id"] = events.NewStringAttribute("2")
	input["picked_card"] = events.NewStringAttribute("5")
	input["op_type"] = events.NewStringAttribute("UNEXPECTED")
	input["operated_at"] = events.NewStringAttribute("2022-10-10T13:50:40Z")
	input["user_token"] = events.NewStringAttribute("xxxx")

	_, err := NewOperation(input)
	if err == nil {
		t.Fatalf("failed to validate operation")
	}
}

func TestNewOperationInvalidPickedCard(t *testing.T) {
	input := make(map[string]events.DynamoDBAttributeValue)
	input["event_id"] = events.NewStringAttribute("9999")
	input["room_id"] = events.NewStringAttribute("1")
	input["user_id"] = events.NewStringAttribute("2")
	input["picked_card"] = events.NewStringAttribute("_")
	input["op_type"] = events.NewStringAttribute("PICK")
	input["operated_at"] = events.NewStringAttribute("2022-10-10T13:50:40Z")
	input["user_token"] = events.NewStringAttribute("xxxx")

	_, err := NewOperation(input)
	if err == nil {
		t.Fatalf("failed to validate operation")
	}
}

func TestNewOperationNoOperatedAt(t *testing.T) {
	input := make(map[string]events.DynamoDBAttributeValue)
	input["event_id"] = events.NewStringAttribute("9999")
	input["room_id"] = events.NewStringAttribute("1")
	input["user_id"] = events.NewStringAttribute("2")
	input["op_type"] = events.NewStringAttribute("PICK")
	input["picked_card"] = events.NewStringAttribute("5")
	input["user_token"] = events.NewStringAttribute("xxxx")

	_, err := NewOperation(input)
	if err == nil {
		t.Fatalf("failed to validate operation")
	}
}

func TestNewOperationInvalidOperatedAt(t *testing.T) {
	input := make(map[string]events.DynamoDBAttributeValue)
	input["event_id"] = events.NewStringAttribute("9999")
	input["room_id"] = events.NewStringAttribute("1")
	input["user_id"] = events.NewStringAttribute("2")
	input["picked_card"] = events.NewStringAttribute("5")
	input["op_type"] = events.NewStringAttribute("PICK")
	input["operated_at"] = events.NewStringAttribute("2022-10-10T13:50:40XX")
	input["user_token"] = events.NewStringAttribute("xxxx")

	_, err := NewOperation(input)
	if err == nil {
		t.Fatalf("failed to validate operation")
	}
}

func TestNewOperationNoUserToken(t *testing.T) {
	input := make(map[string]events.DynamoDBAttributeValue)
	input["event_id"] = events.NewStringAttribute("9999")
	input["room_id"] = events.NewStringAttribute("1")
	input["user_id"] = events.NewStringAttribute("2")
	input["op_type"] = events.NewStringAttribute("PICK")
	input["picked_card"] = events.NewStringAttribute("5")
	input["operated_at"] = events.NewStringAttribute("2022-10-10T13:50:40Z")

	_, err := NewOperation(input)
	if err == nil {
		t.Fatalf("failed to validate operation")
	}
}

func TestNewOperationInvalidUserToken(t *testing.T) {
	input := make(map[string]events.DynamoDBAttributeValue)
	input["event_id"] = events.NewStringAttribute("9999")
	input["room_id"] = events.NewStringAttribute("1")
	input["user_id"] = events.NewStringAttribute("2")
	input["picked_card"] = events.NewStringAttribute("5")
	input["op_type"] = events.NewStringAttribute("PICK")
	input["operated_at"] = events.NewStringAttribute("2022-10-10T13:50:40Z")
	input["user_token"] = events.NewStringAttribute("xxxx&yyyy&aaa")

	_, err := NewOperation(input)
	if err == nil {
		t.Fatalf("failed to validate operation")
	}
}
