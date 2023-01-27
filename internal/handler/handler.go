package handler

import (
	"github.com/gofiber/fiber/v2"
)

type Handler struct {
	app *fiber.App
}

type GetParams struct {
	Name string `json:"name"`
	Pid  string `json:"pid"`
	Port string `json:"port"`
}

type PostBody struct {
	Pids []int `json:"pids"`
}

func New(app *fiber.App) *Handler {
	return &Handler{
		app: app,
	}
}

func (h *Handler) Serve() {
	r := h.app.Group("/api/v1")

	r.Get("processes", h.getAllProcesses)
	r.Get("processes/pid/:pid", h.getProcessByPID)
	r.Get("processes/port/:port", h.getProcessByPort)
	r.Get("processes/name/:name", h.getProcessesByName)
	r.Post("processes/kill", h.killProcesses)
}
