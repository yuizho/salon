package model

import (
	"testing"

	"github.com/aws/aws-lambda-go/events"
)

func TestNewRoom(t *testing.T) {
	input := make(map[string]events.DynamoDBAttributeValue)
	input["room_id"] = events.NewStringAttribute("1")
	input["user_id"] = events.NewStringAttribute("2")
	input["status"] = events.NewStringAttribute("CHOOSING")
	input["picked_card"] = events.NewStringAttribute("5")
	input["created_at"] = events.NewStringAttribute("2022-10-10T13:50:40Z")

	actual, err := NewRoom(input)
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
	if actual.CreatedAt != "2022-10-10T13:50:40Z" {
		t.Fatalf("unexpected CreatedAt: %s", actual.CreatedAt)
	}
}

func TestNewRoomNoRoomId(t *testing.T) {
	input := make(map[string]events.DynamoDBAttributeValue)
	input["user_id"] = events.NewStringAttribute("2")
	input["status"] = events.NewStringAttribute("CHOOSING")
	input["picked_card"] = events.NewStringAttribute("5")
	input["created_at"] = events.NewStringAttribute("2022-10-10T13:50:40Z")

	_, err := NewRoom(input)
	if err == nil {
		t.Fatalf("failed to validate room")
	}
}

func TestNewRoomInvalidRoomId(t *testing.T) {
	input := make(map[string]events.DynamoDBAttributeValue)
	input["room_id"] = events.NewStringAttribute("1_")
	input["user_id"] = events.NewStringAttribute("2")
	input["picked_card"] = events.NewStringAttribute("5")
	input["status"] = events.NewStringAttribute("CHOOSING")
	input["created_at"] = events.NewStringAttribute("2022-10-10T13:50:40Z")

	_, err := NewRoom(input)
	if err == nil {
		t.Fatalf("failed to validate room")
	}
}

func TestNewRoomNoUserId(t *testing.T) {
	input := make(map[string]events.DynamoDBAttributeValue)
	input["room_id"] = events.NewStringAttribute("1")
	input["status"] = events.NewStringAttribute("CHOOSING")
	input["picked_card"] = events.NewStringAttribute("5")
	input["created_at"] = events.NewStringAttribute("2022-10-10T13:50:40Z")

	_, err := NewRoom(input)
	if err == nil {
		t.Fatalf("failed to validate room")
	}
}

func TestNewRoomInvalidUserId(t *testing.T) {
	input := make(map[string]events.DynamoDBAttributeValue)
	input["room_id"] = events.NewStringAttribute("1")
	input["user_id"] = events.NewStringAttribute("2_")
	input["picked_card"] = events.NewStringAttribute("5")
	input["status"] = events.NewStringAttribute("CHOOSING")
	input["created_at"] = events.NewStringAttribute("2022-10-10T13:50:40Z")

	_, err := NewRoom(input)
	if err == nil {
		t.Fatalf("failed to validate room")
	}
}

func TestNewRoomNoStatus(t *testing.T) {
	input := make(map[string]events.DynamoDBAttributeValue)
	input["room_id"] = events.NewStringAttribute("1")
	input["user_id"] = events.NewStringAttribute("2")
	input["picked_card"] = events.NewStringAttribute("5")
	input["created_at"] = events.NewStringAttribute("2022-10-10T13:50:40Z")

	_, err := NewRoom(input)
	if err == nil {
		t.Fatalf("failed to validate room")
	}
}

func TestNewRoomInvalidStatus(t *testing.T) {
	input := make(map[string]events.DynamoDBAttributeValue)
	input["room_id"] = events.NewStringAttribute("1")
	input["user_id"] = events.NewStringAttribute("2")
	input["picked_card"] = events.NewStringAttribute("5")
	input["status"] = events.NewStringAttribute("UNEXPECTED")
	input["created_at"] = events.NewStringAttribute("2022-10-10T13:50:40Z")

	_, err := NewRoom(input)
	if err == nil {
		t.Fatalf("failed to validate room")
	}
}

func TestNewRoomInvalidPickedCard(t *testing.T) {
	input := make(map[string]events.DynamoDBAttributeValue)
	input["room_id"] = events.NewStringAttribute("1")
	input["user_id"] = events.NewStringAttribute("2")
	input["picked_card"] = events.NewStringAttribute("_")
	input["status"] = events.NewStringAttribute("CHOOSING")
	input["created_at"] = events.NewStringAttribute("2022-10-10T13:50:40Z")

	_, err := NewRoom(input)
	if err == nil {
		t.Fatalf("failed to validate room")
	}
}

func TestNewRoomNoCreatedAt(t *testing.T) {
	input := make(map[string]events.DynamoDBAttributeValue)
	input["room_id"] = events.NewStringAttribute("1")
	input["user_id"] = events.NewStringAttribute("2")
	input["status"] = events.NewStringAttribute("CHOOSING")
	input["picked_card"] = events.NewStringAttribute("5")

	_, err := NewRoom(input)
	if err == nil {
		t.Fatalf("failed to validate room")
	}
}

func TestNewRoomInvalidCreatedAt(t *testing.T) {
	input := make(map[string]events.DynamoDBAttributeValue)
	input["room_id"] = events.NewStringAttribute("1")
	input["user_id"] = events.NewStringAttribute("2")
	input["picked_card"] = events.NewStringAttribute("5")
	input["status"] = events.NewStringAttribute("CHOOSING")
	input["created_at"] = events.NewStringAttribute("2022-10-10T13:50:40XX")

	_, err := NewRoom(input)
	if err == nil {
		t.Fatalf("failed to validate room")
	}
}
