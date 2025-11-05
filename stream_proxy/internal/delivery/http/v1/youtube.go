package v1

import (
	"io"
	"log"
	"net/http"
	"net/url"
	"roskomtube/pkg/http/lib"
)

func ProxyStream(w http.ResponseWriter, r *http.Request) {
	parsedURL := r.URL.Query().Get("url")
	if parsedURL == "" {
		http.Error(w, "Missing URL parameter", http.StatusBadRequest)
		return
	}

	url, err := url.Parse(parsedURL)
	if err != nil {
		http.Error(w, "Invalid URL parameter", http.StatusBadRequest)
		return
	}

	client := &http.Client{}
	req, err := http.NewRequest("GET", url.String(), nil)
	if err != nil {
		http.Error(w, "Error creating request: "+err.Error(), http.StatusInternalServerError)
		return

	}

	lib.CopyHeaders(req.Header, r.Header)

	resp, err := client.Do(req)
	if err != nil {
		http.Error(w, "Error fetching URL: "+err.Error(), http.StatusInternalServerError)
		return
	}
	defer resp.Body.Close()

	lib.CopyHeaders(w.Header(), resp.Header)
	w.WriteHeader(resp.StatusCode)

	if err := streamBody(w, resp.Body); err != nil {
		log.Printf("Error streaming: %v", err)
	}
}

func streamBody(dst io.Writer, src io.Reader) error {
	_, err := io.Copy(dst, src)
	return err
}
