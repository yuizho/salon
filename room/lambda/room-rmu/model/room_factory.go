package model

import "fmt"

func CreateRoom(operation *Operation) (*Room, error) {
	status, err := createStatus(operation.OpType)
	if err != nil {
		return nil, err
	}

	pickedCard := ""
	if operation.OpType == Pick {
		pickedCard = operation.PickedCard
	}

	return &Room{
		RoomId:     operation.RoomId,
		UserId:     operation.UserId,
		Status:     status,
		PickedCard: pickedCard,
		OperatedAt: operation.OperatedAt,
		JoinedAt:   operation.OperatedAt,
	}, nil
}

func createStatus(opType OpType) (Status, error) {
	switch opType {
	case OpenRoom, Join, RefreshTable:
		return NewStatus("CHOOSING")
	case Leave:
		return NewStatus("LEAVED")
	case Pick:
		return NewStatus("CHOSEN")
	default:
		return "", fmt.Errorf("unexpected op_type: %v", opType)
	}
}
