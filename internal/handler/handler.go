package handler

import (
	"net/http"

	"github.com/aosasona/bazooka/ui"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/filesystem"
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

func (h *Handler) ServeAPI() {
	r := h.app.Group("/api/v1")

	r.Get("processes", h.getAllProcesses)
	r.Get("processes/pid/:pid", h.getProcessByPID)
	r.Get("processes/port/:port", h.getProcessByPort)
	r.Get("processes/name/:name", h.getProcessesByName)
	r.Post("processes/kill", h.killProcesses)
}

func (h *Handler) ServeUI() {
	h.app.Use("/", filesystem.New(filesystem.Config{
		Root:       http.FS(ui.UIDir),
		Browse:     true,
		PathPrefix: "dist",
	}))
}
