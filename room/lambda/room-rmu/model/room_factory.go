package model

import "fmt"

func CreateRoom(operation *Operation) (*Room, error) {
	status, err := createStatus(operation.OpType)
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

func createStatus(opType OpType) (Status, error) {
	switch opType {
	case OpenRoom, Joined, RefreshTable:
		return NewStatus("CHOOSING")
	case Leaved:
		return NewStatus("LEAVED")
	case Picked:
		return NewStatus("CHOOSED")
	default:
		return "", fmt.Errorf("unexpected op_type: %v", opType)
	}
}
