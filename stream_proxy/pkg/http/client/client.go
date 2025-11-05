package client

import (
	"net/http"
	"time"
)

type Client struct {
	*http.Client
	URL string
}

func NewClient(keep_alive bool, URL string) *Client {
	return &Client{
		Client: &http.Client{
			Transport: &http.Transport{
				DisableKeepAlives: false,
			},
			Timeout: 30 * time.Second,
		},
		URL: URL,
	}
}

func (c *Client) Get() (*http.Response, error) {
	req, err := http.NewRequest(http.MethodGet, c.URL, nil)
	if err != nil {
		return nil, err
	}
	return c.Do(req)
}
