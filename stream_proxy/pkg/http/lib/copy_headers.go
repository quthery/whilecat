package lib

import "net/http"

func CopyHeaders(dst, headers http.Header) {
	for key, values := range headers {
		dst[key] = values
	}
}
