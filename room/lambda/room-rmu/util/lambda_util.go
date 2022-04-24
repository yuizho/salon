package util

import (
	"context"
	"fmt"

	"github.com/aws/aws-lambda-go/lambdacontext"
)

func GetAWSRequestId(ctx context.Context) (string, error) {
	lc, ok := lambdacontext.FromContext(ctx)
	if !ok {
		return "", fmt.Errorf("failed to get lambda context")
	}
	return lc.AwsRequestID, nil
}
