package main

import (
	"fmt"
	"net/http"
	router "roskomtube/internal/delivery/http"
)

func main() {
	port := ":8080"
	fmt.Println("Hello world")
	router := router.InitAPI()
	if err := http.ListenAndServe(port, router); err != nil {
		panic(err)
	}
}
