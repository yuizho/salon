package model

import (
	"errors"
	"fmt"
	"regexp"

	"github.com/aws/aws-lambda-go/events"
)

type OpType string

const (
	OpenRoom     = OpType("OPEN_ROOM")
	Join       = OpType("JOIN")
	Leave       = OpType("LEAVE")
	Pick       = OpType("PICK")
	RefreshTable = OpType("REFRESH_TABLE")
)

func NewOpType(s string) (OpType, error) {
	opType := OpType(s)
	switch opType {
	case OpenRoom, Join, Leave, Pick, RefreshTable:
		return opType, nil
	default:
		return "", fmt.Errorf("unexpected op_type string: %s", s)
	}
}

func (opType OpType) String() string {
	return string(opType)
}

type Operation struct {
	EventId    string `dynamodbav:"event_id" json:"event_id"`
	RoomId     string `dynamodbav:"room_id" json:"room_id"`
	OpType     OpType `dynamodbav:"op_type" json:"op_type"`
	UserId     string `dynamodbav:"user_id" json:"user_id"`
	OperatedAt string `dynamodbav:"operated_at" json:"operated_at"`
	PickedCard string `dynamodbav:"picked_card" json:"picked_card"`
}

func NewOperation(attrs map[string]events.DynamoDBAttributeValue) (*Operation, error) {
	// validation
	if attrs["event_id"].IsNull() {
		return nil, errors.New("no event_id")
	}
	if m, _ := regexp.MatchString(`^[0-9a-zA-Z\-]+$`, attrs["event_id"].String()); !m {
		return nil, errors.New("invalid event_id")
	}

	if attrs["room_id"].IsNull() {
		return nil, errors.New("no room_id")
	}
	if m, _ := regexp.MatchString(`^[0-9a-zA-Z\-]+$`, attrs["room_id"].String()); !m {
		return nil, errors.New("invalid room_id")
	}

	if attrs["op_type"].IsNull() {
		return nil, errors.New("no op_type")
	}
	opType, err := NewOpType(attrs["op_type"].String())
	if err != nil {
		return nil, err
	}

	if attrs["user_id"].IsNull() {
		return nil, errors.New("no user_id")
	}
	if m, _ := regexp.MatchString(`^[0-9a-zA-Z\-]+$`, attrs["user_id"].String()); !m {
		return nil, errors.New("invalid user_id")
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

	return &Operation{
		EventId:    attrs["event_id"].String(),
		RoomId:     attrs["room_id"].String(),
		OpType:     opType,
		UserId:     attrs["user_id"].String(),
		OperatedAt: attrs["operated_at"].String(),
		PickedCard: pickedCard,
	}, nil
}
