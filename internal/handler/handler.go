package handler

import (
	"github.com/gofiber/fiber/v2"
)

type Handler struct {
	app *fiber.App
}

func New(app *fiber.App) *Handler {
	return &Handler{
		app: app,
	}
}

func (h *Handler) Serve() {
	r := h.app.Group("/api/v1")

	r.Get("processes", h.getAllProcesses)
	r.Get("processes/:pid", h.getProcess)
	r.Get("processes/port/:port", h.getProcessByPort)
	r.Get("processes/name/:name", h.getProcessesByName)
}
