package model

import "fmt"

func CreateRoom(operation *Operation) (*Room, error) {
	status, err := createStatusStr(operation.OpType)
	if err != nil {
		return nil, err
	}

	pickedCard := ""
	if operation.OpType == Picked {
		pickedCard = operation.PickedCard
	}

	return &Room{
		RoomId:     operation.RoomId,
		UserId:     operation.UserId,
		Status:     status,
		PickedCard: pickedCard,
		OperatedAt: operation.OperatedAt,
	}, nil
}

func createStatusStr(opType OpType) (string, error) {
	switch opType {
	case OpenRoom, Joined, RefreshTable:
		return "CHOOSING", nil
	case Leaved:
		return "LEAVED", nil
	case Picked:
		return "CHOOSED", nil
	default:
		return "", fmt.Errorf("unexpected op_type: %v", opType)
	}
}
