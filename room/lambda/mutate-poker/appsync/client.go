package appsync

import (
	"bytes"
	"context"
	"crypto/sha256"
	"encoding/hex"
	"io/ioutil"
	"log"
	"net"
	"net/http"
	"time"

	v4 "github.com/aws/aws-sdk-go-v2/aws/signer/v4"
	"github.com/aws/aws-sdk-go-v2/config"
)

type AppSyncClient struct {
	HttpClient *http.Client
}

type Request struct {
	Url    string
	Region string
	Query  string
}

func NewClient() *AppSyncClient {
	// https://christina04.hatenablog.com/entry/go-keep-alive
	return &AppSyncClient{
		&http.Client{
			Transport: &http.Transport{
				DialContext: (&net.Dialer{
					Timeout:   10 * time.Second,
					KeepAlive: 90 * time.Second,
					DualStack: true,
				}).DialContext,
				ForceAttemptHTTP2:     true,
				MaxIdleConns:          10,
				MaxConnsPerHost:       100,
				IdleConnTimeout:       90 * time.Second,
				TLSHandshakeTimeout:   10 * time.Second,
				ResponseHeaderTimeout: 10 * time.Second,
				ExpectContinueTimeout: 1 * time.Second,
			},
			Timeout: 10 * time.Second,
		},
	}
}

func (client *AppSyncClient) SendRequest(request Request) (int, error) {
	req, err := http.NewRequest(
		"POST",
		request.Url,
		bytes.NewBufferString(
			request.Query,
		),
	)
	if err != nil {
		return 0, err
	}
	req.Header.Set("Content-Type", "application/json")

	payloadHash, err := createPayloadHash(req)
	if err != nil {
		return 0, err
	}

	// get aws credential
	cfg, err := config.LoadDefaultConfig(context.TODO(),
		config.WithRegion(request.Region),
	)
	if err != nil {
		return 0, err
	}
	// TODO: should init at main function?
	credentials, err := cfg.Credentials.Retrieve(context.TODO())
	if err != nil {
		return 0, err
	}

	// sign the request
	// https://pkg.go.dev/github.com/aws/aws-sdk-go-v2@v1.2.1/aws/signer/v4#Signer.SignHTTP
	signer := v4.NewSigner()
	err = signer.SignHTTP(context.TODO(), credentials, req, payloadHash, "appsync", request.Region, time.Now())
	if err != nil {
		return 0, err
	}

	resp, err := client.HttpClient.Do(req)
	if err != nil {
		return 0, err
	}

	log.Printf("status: %v\n", resp.StatusCode)

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		log.Fatal(err)
	}
	log.Printf("body: %s\n", string(body))

	// https://christina04.hatenablog.com/entry/go-keep-alive
	defer resp.Body.Close()

	return resp.StatusCode, nil
}

func createPayloadHash(req *http.Request) (string, error) {
	body, err := req.GetBody()
	if err != nil {
		return "", err
	}
	var buf bytes.Buffer
	buf.ReadFrom(body)
	b := sha256.Sum256(buf.Bytes())
	return hex.EncodeToString(b[:]), nil
}
