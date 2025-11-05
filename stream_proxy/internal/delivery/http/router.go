package http

import (
	v1_handlers "roskomtube/internal/delivery/http/v1"
	v2_handlers "roskomtube/internal/delivery/http/v2"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
)

func InitAPI() *chi.Mux {
	r := chi.NewRouter()
	r.Use(middleware.Recoverer)
	r.Use(middleware.Logger)

	r.Route("/v1", func(v1 chi.Router) {
		v1.Get("/stream", v1_handlers.ProxyStream)
	})
	r.Route("/v2", func(v2 chi.Router) {
		v2.Get("/stream", v2_handlers.StreamHandler)
	})

	return r
}
