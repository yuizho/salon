package appsync

import (
	"bytes"
	"io"
	"io/ioutil"
	"net"
	"net/http"
	"time"
)

type AppSyncClient struct {
	HttpClient *http.Client
}

type Request struct {
	Url    string
	ApiKey string
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
	req.Header.Set("x-api-key", request.ApiKey)

	resp, err := client.HttpClient.Do(req)
	if err != nil {
		return 0, err
	}

	// https://christina04.hatenablog.com/entry/go-keep-alive
	defer resp.Body.Close()
	defer func() {
		io.Copy(ioutil.Discard, resp.Body)
		resp.Body.Close()
	}()

	return resp.StatusCode, nil
}
