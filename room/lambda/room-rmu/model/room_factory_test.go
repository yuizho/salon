package model

import (
	"testing"
)

func TestCreateRoomOpTypeJoined(t *testing.T) {
	actual, err := CreateRoom(&Operation{
		RoomId:     "1",
		OpType:     Joined,
		UserId:     "2",
		OperatedAt: "2022-10-10T13:50:40Z",
	})
	if err != nil {
		t.Fatalf("failed to create operation")
	}

	if actual.RoomId != "1" {
		t.Fatalf("unexpected RoomId: %s", actual.RoomId)
	}
	if actual.UserId != "2" {
		t.Fatalf("unexpected UserId: %s", actual.UserId)
	}
	if actual.Status.String() != "CHOOSING" {
		t.Fatalf("unexpected Status: %s", actual.Status)
	}
	if actual.PickedCard != "" {
		t.Fatalf("unexpected PickedCard: %s", actual.PickedCard)
	}
	if actual.OperatedAt != "2022-10-10T13:50:40Z" {
		t.Fatalf("unexpected OperatedAt: %s", actual.OperatedAt)
	}
}

func TestCreateRoomOpTypeleaved(t *testing.T) {
	actual, err := CreateRoom(&Operation{
		RoomId:     "1",
		OpType:     Leaved,
		UserId:     "2",
		OperatedAt: "2022-10-10T13:50:40Z",
	})
	if err != nil {
		t.Fatalf("failed to create operation")
	}

	if actual.RoomId != "1" {
		t.Fatalf("unexpected RoomId: %s", actual.RoomId)
	}
	if actual.UserId != "2" {
		t.Fatalf("unexpected UserId: %s", actual.UserId)
	}
	if actual.Status.String() != "LEAVED" {
		t.Fatalf("unexpected Status: %s", actual.Status)
	}
	if actual.PickedCard != "" {
		t.Fatalf("unexpected PickedCard: %s", actual.PickedCard)
	}
	if actual.OperatedAt != "2022-10-10T13:50:40Z" {
		t.Fatalf("unexpected OperatedAt: %s", actual.OperatedAt)
	}
}

func TestCreateRoomOpTypePicked(t *testing.T) {
	actual, err := CreateRoom(&Operation{
		RoomId:     "1",
		OpType:     Picked,
		UserId:     "2",
		OperatedAt: "2022-10-10T13:50:40Z",
		PickedCard: "5",
	})
	if err != nil {
		t.Fatalf("failed to create operation")
	}

	if actual.RoomId != "1" {
		t.Fatalf("unexpected RoomId: %s", actual.RoomId)
	}
	if actual.UserId != "2" {
		t.Fatalf("unexpected UserId: %s", actual.UserId)
	}
	if actual.Status.String() != "CHOOSED" {
		t.Fatalf("unexpected Status: %s", actual.Status)
	}
	if actual.PickedCard != "5" {
		t.Fatalf("unexpected PickedCard: %s", actual.PickedCard)
	}
	if actual.OperatedAt != "2022-10-10T13:50:40Z" {
		t.Fatalf("unexpected OperatedAt: %s", actual.OperatedAt)
	}
}
