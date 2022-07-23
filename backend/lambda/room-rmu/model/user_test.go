package model

import (
	"testing"
)

func TestRefleshPokerTable(t *testing.T) {
	actual := User{
		RoomId:     "1",
		UserId:     "11",
		Status:     StatusChosen,
		PickedCard: "5",
		OperatedAt: "2020-01-01 00:00:00",
	}.RefreshPokerTable("2022-07-23 00:00:00")

	assertUser(
		t,
		&User{
			RoomId:     "1",
			UserId:     "11",
			Status:     StatusChoosing,
			PickedCard: "",
			OperatedAt: "2022-07-23 00:00:00",
		},
		actual,
	)
}

func assertUser(t *testing.T, expected *User, actual *User) {
	if expected.RoomId != actual.RoomId {
		t.Fatalf("unexpected RoomId: %s", actual.RoomId)
	}
	if expected.UserId != actual.UserId {
		t.Fatalf("unexpected UserId: %s", actual.RoomId)
	}
	if expected.Status != actual.Status {
		t.Fatalf("unexpected Status: %s", actual.Status)
	}
	if expected.PickedCard != actual.PickedCard {
		t.Fatalf("unexpected PickedCard: %s", actual.PickedCard)
	}
	if expected.OperatedAt != actual.OperatedAt {
		t.Fatalf("unexpected OperatedAt: %s", actual.OperatedAt)
	}
}
