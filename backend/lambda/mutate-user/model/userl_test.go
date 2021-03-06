package model

import (
	"testing"

	"github.com/aws/aws-lambda-go/events"
)

func TestNewUser(t *testing.T) {
	input := make(map[string]events.DynamoDBAttributeValue)
	input["room_id"] = events.NewStringAttribute("1")
	input["item_key"] = events.NewStringAttribute("2")
	input["status"] = events.NewStringAttribute("CHOOSING")
	input["picked_card"] = events.NewStringAttribute("5")
	input["operated_at"] = events.NewStringAttribute("2022-10-10T13:50:40Z")

	actual, err := NewUser(input)
	if err != nil {
		t.Fatalf("failed to create room")
	}

	if actual.RoomId != "1" {
		t.Fatalf("unexpected RoomId: %s", actual.RoomId)
	}
	if actual.UserId != "2" {
		t.Fatalf("unexpected UserId: %s", actual.UserId)
	}
	if actual.Status != "CHOOSING" {
		t.Fatalf("unexpected Status: %s", actual.Status)
	}
	if actual.PickedCard != "5" {
		t.Fatalf("unexpected PickedCard: %s", actual.PickedCard)
	}
	if actual.OperatedAt != "2022-10-10T13:50:40Z" {
		t.Fatalf("unexpected OperatedAt: %s", actual.OperatedAt)
	}
}

func TestNewUserNoPickedCard(t *testing.T) {
	input := make(map[string]events.DynamoDBAttributeValue)
	input["room_id"] = events.NewStringAttribute("1")
	input["item_key"] = events.NewStringAttribute("2")
	input["status"] = events.NewStringAttribute("CHOOSING")
	input["picked_card"] = events.NewNullAttribute()
	input["operated_at"] = events.NewStringAttribute("2022-10-10T13:50:40Z")

	actual, err := NewUser(input)
	if err != nil {
		t.Fatalf("failed to create room")
	}

	if actual.RoomId != "1" {
		t.Fatalf("unexpected RoomId: %s", actual.RoomId)
	}
	if actual.UserId != "2" {
		t.Fatalf("unexpected UserId: %s", actual.UserId)
	}
	if actual.Status != "CHOOSING" {
		t.Fatalf("unexpected Status: %s", actual.Status)
	}
	if actual.PickedCard != "" {
		t.Fatalf("unexpected PickedCard: %s", actual.PickedCard)
	}
	if actual.OperatedAt != "2022-10-10T13:50:40Z" {
		t.Fatalf("unexpected OperatedAt: %s", actual.OperatedAt)
	}
}

func TestNewUserNoRoomId(t *testing.T) {
	input := make(map[string]events.DynamoDBAttributeValue)
	input["item_key"] = events.NewStringAttribute("2")
	input["status"] = events.NewStringAttribute("CHOOSING")
	input["picked_card"] = events.NewStringAttribute("5")
	input["operated_at"] = events.NewStringAttribute("2022-10-10T13:50:40Z")

	_, err := NewUser(input)
	if err == nil {
		t.Fatalf("failed to validate room")
	}
}

func TestNewUserInvalidRoomId(t *testing.T) {
	input := make(map[string]events.DynamoDBAttributeValue)
	input["room_id"] = events.NewStringAttribute("1_")
	input["item_key"] = events.NewStringAttribute("2")
	input["picked_card"] = events.NewStringAttribute("5")
	input["status"] = events.NewStringAttribute("CHOOSING")
	input["operated_at"] = events.NewStringAttribute("2022-10-10T13:50:40Z")

	_, err := NewUser(input)
	if err == nil {
		t.Fatalf("failed to validate room")
	}
}

func TestNewUserNoUserId(t *testing.T) {
	input := make(map[string]events.DynamoDBAttributeValue)
	input["room_id"] = events.NewStringAttribute("1")
	input["status"] = events.NewStringAttribute("CHOOSING")
	input["picked_card"] = events.NewStringAttribute("5")
	input["operated_at"] = events.NewStringAttribute("2022-10-10T13:50:40Z")

	_, err := NewUser(input)
	if err == nil {
		t.Fatalf("failed to validate room")
	}
}

func TestNewUserInvalidUserId(t *testing.T) {
	input := make(map[string]events.DynamoDBAttributeValue)
	input["room_id"] = events.NewStringAttribute("1")
	input["item_key"] = events.NewStringAttribute("2_")
	input["picked_card"] = events.NewStringAttribute("5")
	input["status"] = events.NewStringAttribute("CHOOSING")
	input["operated_at"] = events.NewStringAttribute("2022-10-10T13:50:40Z")

	_, err := NewUser(input)
	if err == nil {
		t.Fatalf("failed to validate room")
	}
}

func TestNewUserNoStatus(t *testing.T) {
	input := make(map[string]events.DynamoDBAttributeValue)
	input["room_id"] = events.NewStringAttribute("1")
	input["item_key"] = events.NewStringAttribute("2")
	input["picked_card"] = events.NewStringAttribute("5")
	input["operated_at"] = events.NewStringAttribute("2022-10-10T13:50:40Z")

	_, err := NewUser(input)
	if err == nil {
		t.Fatalf("failed to validate room")
	}
}

func TestNewRoomInvalidStatus(t *testing.T) {
	input := make(map[string]events.DynamoDBAttributeValue)
	input["room_id"] = events.NewStringAttribute("1")
	input["item_key"] = events.NewStringAttribute("2")
	input["picked_card"] = events.NewStringAttribute("5")
	input["status"] = events.NewStringAttribute("UNEXPECTED")
	input["operated_at"] = events.NewStringAttribute("2022-10-10T13:50:40Z")

	_, err := NewUser(input)
	if err == nil {
		t.Fatalf("failed to validate room")
	}
}

func TestNewUserInvalidPickedCard(t *testing.T) {
	input := make(map[string]events.DynamoDBAttributeValue)
	input["room_id"] = events.NewStringAttribute("1")
	input["item_key"] = events.NewStringAttribute("2")
	input["picked_card"] = events.NewStringAttribute("_")
	input["status"] = events.NewStringAttribute("CHOOSING")
	input["operated_at"] = events.NewStringAttribute("2022-10-10T13:50:40Z")

	_, err := NewUser(input)
	if err == nil {
		t.Fatalf("failed to validate room")
	}
}

func TestNewUserNoOperatedAt(t *testing.T) {
	input := make(map[string]events.DynamoDBAttributeValue)
	input["room_id"] = events.NewStringAttribute("1")
	input["item_key"] = events.NewStringAttribute("2")
	input["status"] = events.NewStringAttribute("CHOOSING")
	input["picked_card"] = events.NewStringAttribute("5")

	_, err := NewUser(input)
	if err == nil {
		t.Fatalf("failed to validate room")
	}
}

func TestNewUserInvalidOperatedAt(t *testing.T) {
	input := make(map[string]events.DynamoDBAttributeValue)
	input["room_id"] = events.NewStringAttribute("1")
	input["item_key"] = events.NewStringAttribute("2")
	input["picked_card"] = events.NewStringAttribute("5")
	input["status"] = events.NewStringAttribute("CHOOSING")
	input["operated_at"] = events.NewStringAttribute("2022-10-10T13:50:40XX")

	_, err := NewUser(input)
	if err == nil {
		t.Fatalf("failed to validate room")
	}
}
