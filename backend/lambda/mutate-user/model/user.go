package model

import (
	"errors"
	"fmt"
	"regexp"

	"github.com/aws/aws-lambda-go/events"
)

type Status string

const (
	Choosing = Status("CHOOSING")
	Chosen   = Status("CHOSEN")
	Leaved   = Status("LEAVED")
)

func NewStatus(s string) (Status, error) {
	status := Status(s)
	switch status {
	case Choosing, Chosen, Leaved:
		return status, nil
	default:
		return "", fmt.Errorf("unexpected status string: %s", s)
	}
}

func (status Status) String() string {
	return string(status)
}

type User struct {
	RoomId     string
	UserId     string
	Status     Status
	PickedCard string
	OperatedAt string
}

func NewUser(attrs map[string]events.DynamoDBAttributeValue) (*User, error) {
	// validation
	if attrs["room_id"].IsNull() {
		return nil, errors.New("no room_id")
	}
	if m, _ := regexp.MatchString(`^[0-9a-zA-Z\-]+$`, attrs["room_id"].String()); !m {
		return nil, errors.New("invalid room_id")
	}

	if attrs["item_key"].IsNull() {
		return nil, errors.New("no item_key")
	}
	if m, _ := regexp.MatchString(`^[0-9a-zA-Z\-]+$`, attrs["item_key"].String()); !m {
		return nil, errors.New("invalid item_key")
	}

	if attrs["operated_at"].IsNull() {
		return nil, errors.New("no operated_at")
	}
	iso8601 := `^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])T(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])(\.[0-9]+)?(Z|[+-](?:2[0-3]|[01][0-9]):[0-5][0-9])?$`
	if m, _ := regexp.MatchString(iso8601, attrs["operated_at"].String()); !m {
		return nil, errors.New("invalid operated_at")
	}

	pickedCard := ""
	if !attrs["picked_card"].IsNull() {
		if m, _ := regexp.MatchString(`^[0-9a-zA-Z]*$`, attrs["picked_card"].String()); !m {
			return nil, errors.New("invalid picked_card")
		}
		pickedCard = attrs["picked_card"].String()
	}

	if attrs["status"].IsNull() {
		return nil, errors.New("no status")
	}
	status, err := NewStatus(attrs["status"].String())
	if err != nil {
		return nil, err
	}

	return &User{
		RoomId:     attrs["room_id"].String(),
		UserId:     attrs["item_key"].String(),
		Status:     status,
		PickedCard: pickedCard,
		OperatedAt: attrs["operated_at"].String(),
	}, nil
}
