package handler

import (
	"net/http"

	"github.com/aosasona/bazooka/internal/middleware"
	"github.com/aosasona/bazooka/ui"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/filesystem"
	"github.com/gofiber/fiber/v2/middleware/monitor"
)

type BasicAuth struct {
	user     string
	password string
}

type handler struct {
	app                 *fiber.App
	useBasicAuth        bool
	basicAuthMiddleware fiber.Handler
}

type GetParams struct {
	Name string `json:"name"`
	Pid  string `json:"pid"`
	Port string `json:"port"`
}

type PostBody struct {
	Pids []int `json:"pids"`
}

func New(app *fiber.App) *handler {
	return &handler{
		app: app,
	}
}

func (h *handler) AddBasicAuthCredential(user, pass string) {
	h.basicAuthMiddleware = middleware.NewBasicAuth(user, pass)
	h.useBasicAuth = true
}

func (h *handler) ServeAPI() {
	r := h.app.Group("/api/v1")

	r.Get("/processes", h.getAllProcesses)
	r.Get("/processes/pid/:pid", h.getProcessByPID)
	r.Get("/processes/port/:port", h.getProcessByPort)
	r.Get("/processes/name/:name", h.getProcessesByName)
	r.Get("/resources", h.getResources)
	r.Post("/processes/kill", h.killProcesses)
}

func (h *handler) ServeUI() {
	client := filesystem.New(filesystem.Config{
		Root:       http.FS(ui.UIDir),
		Browse:     false,
		PathPrefix: "dist",
	})
	h.app.Get("/metrics", monitor.New(monitor.Config{Title: "Metrics"}))
	if h.useBasicAuth {
		h.app.Use("/", h.basicAuthMiddleware, client)
	} else {
		h.app.Use("/", client)
	}
}
