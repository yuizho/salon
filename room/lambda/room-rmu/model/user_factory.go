package model

import "fmt"

func CreateUser(operation *Operation) (*User, error) {
	status, err := createStatus(operation.OpType)
	if err != nil {
		return nil, err
	}

	pickedCard := ""
	if operation.OpType == Pick {
		pickedCard = operation.PickedCard
	}

	return &User{
		RoomId:     operation.RoomId,
		UserId:     operation.UserId,
		Status:     status,
		PickedCard: pickedCard,
		OperatedAt: operation.OperatedAt,
	}, nil
}

func createStatus(opType OpType) (Status, error) {
	switch opType {
	case OpenRoom, Join, RefreshTable:
		return NewStatus("CHOOSING")
	case Leave, Kick:
		return NewStatus("LEAVED")
	case Pick:
		return NewStatus("CHOSEN")
	default:
		return "", fmt.Errorf("unexpected op_type: %v", opType)
	}
}
